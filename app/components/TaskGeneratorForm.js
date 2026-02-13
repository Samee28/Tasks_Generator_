'use client';

import { useState } from 'react';

const TEMPLATES = [
  { value: '', label: 'None (Custom)' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'web_app', label: 'Web App' },
  { value: 'internal_tool', label: 'Internal Tool' },
  { value: 'api', label: 'API / Backend' },
];

export default function TaskGeneratorForm({ onTasksGenerated, isLoading }) {
  const [formData, setFormData] = useState({
    goal: '',
    users: '',
    constraints: '',
    template: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.goal.trim()) {
      setError('Please enter a feature goal');
      return;
    }
    if (!formData.users.trim()) {
      setError('Please describe the target users');
      return;
    }
    if (!formData.constraints.trim()) {
      setError('Please mention any constraints');
      return;
    }

    try {
      const response = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate tasks. Check your LLM API key.');
      }

      const result = await response.json();
      onTasksGenerated(formData, result.data);
    } catch (err) {
      setError(err.message || 'An error occurred. Please check your API key.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feature Goal *
        </label>
        <textarea
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          placeholder="What do you want to build? E.g., 'Add real-time notifications'"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows="3"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target Users *
        </label>
        <textarea
          name="users"
          value={formData.users}
          onChange={handleChange}
          placeholder="Who will use this? E.g., 'Mobile users in developing countries'"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows="2"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Constraints *
        </label>
        <textarea
          name="constraints"
          value={formData.constraints}
          onChange={handleChange}
          placeholder="Any limitations? E.g., 'Must work offline, 2 week deadline'"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows="2"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Type (Optional)
        </label>
        <select
          name="template"
          value={formData.template}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          disabled={isLoading}
        >
          {TEMPLATES.map(template => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 transition"
      >
        {isLoading ? 'Generating Tasks...' : 'Generate Tasks & Stories'}
      </button>
    </form>
  );
}
