'use client';

import { useState } from 'react';

const TEMPLATES = [
  { value: '', label: 'None (Custom)' },
  { value: 'mobile_app', label: '📱 Mobile App' },
  { value: 'web_app', label: '🌐 Web App' },
  { value: 'internal_tool', label: '🛠️ Internal Tool' },
  { value: 'api', label: '⚙️ API / Backend' },
];

const SAMPLE_DATA = {
  mobile_app: {
    goal: 'Build a student messaging app for colleges',
    users: 'College students aged 18-25 who need to communicate with classmates',
    constraints: 'Must work offline, built with React Native, 3 month timeline',
    template: 'mobile_app',
  },
  web_app: {
    goal: 'Create a project management dashboard',
    users: 'Project managers and team leads in small to medium companies',
    constraints: 'Must support 100+ concurrent users, GDPR compliant',
    template: 'web_app',
  },
  internal_tool: {
    goal: 'Build an internal employee feedback system',
    users: 'HR department and employees',
    constraints: 'Must be secure, lightweight, integrate with Slack',
    template: 'internal_tool',
  },
  api: {
    goal: 'Create a real-time analytics API',
    users: 'Developers building analytics dashboards',
    constraints: 'Must handle 10k requests/sec, 99.9% uptime',
    template: 'api',
  },
};

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

  const loadSampleData = (templateType) => {
    if (SAMPLE_DATA[templateType]) {
      setFormData(SAMPLE_DATA[templateType]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.goal.trim()) {
      setError('❌ Please enter a feature goal');
      return;
    }
    if (!formData.users.trim()) {
      setError('❌ Please describe the target users');
      return;
    }
    if (!formData.constraints.trim()) {
      setError('❌ Please mention any constraints');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Quick Load Sample Data */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
        <p className="text-sm font-bold text-blue-900 mb-3">
          💡 Quick Start: Load Sample Data
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.slice(1).map(template => (
            <button
              key={template.value}
              type="button"
              onClick={() => loadSampleData(template.value)}
              className="px-3 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 text-sm transition shadow"
            >
              {template.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Goal */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">
          🎯 Feature Goal *
        </label>
        <textarea
          name="goal"
          value={formData.goal}
          onChange={handleChange}
          placeholder="Example: Build a student messaging app for colleges..."
          className="w-full px-5 py-4 text-base border-3 border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder:text-gray-500"
          rows="3"
          disabled={isLoading}
        />
      </div>

      {/* Target Users */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">
          👥 Target Users *
        </label>
        <textarea
          name="users"
          value={formData.users}
          onChange={handleChange}
          placeholder="Example: College students aged 18-25 who need to communicate with classmates..."
          className="w-full px-5 py-4 text-base border-3 border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder:text-gray-500"
          rows="2"
          disabled={isLoading}
        />
      </div>

      {/* Constraints */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">
          ⚡ Constraints & Requirements *
        </label>
        <textarea
          name="constraints"
          value={formData.constraints}
          onChange={handleChange}
          placeholder="Example: Must work offline, built with React Native, 3 month timeline..."
          className="w-full px-5 py-4 text-base border-3 border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 placeholder:text-gray-500"
          rows="3"
          disabled={isLoading}
        />
      </div>

      {/* Project Type */}
      <div>
        <label className="block text-lg font-bold text-gray-900 mb-2">
          📱 Project Type (Optional)
        </label>
        <select
          name="template"
          value={formData.template}
          onChange={handleChange}
          className="w-full px-5 py-4 text-base border-3 border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-3 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800 font-bold"
          disabled={isLoading}
        >
          {TEMPLATES.map(template => (
            <option key={template.value} value={template.value}>
              {template.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-600 mt-2">
          💡 Selecting a type helps AI generate more specific tasks
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-5 bg-red-600 text-white border-l-4 border-red-800 rounded-lg shadow-xl text-center font-bold text-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition shadow-lg"
      >
        {isLoading ? '⏳ Generating Tasks... (30-45 seconds)' : '✨ Generate Tasks & Stories'}
      </button>
    </form>
  );
}
