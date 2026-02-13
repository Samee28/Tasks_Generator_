'use client';

import { useState } from 'react';
import TaskGeneratorForm from './components/TaskGeneratorForm';
import TasksDisplay from './components/TasksDisplay';
import RecentSpecs from './components/RecentSpecs';
import { saveSpec } from './lib/storage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTasksGenerated = async (formData, generatedData) => {
    setIsLoading(true);
    try {
      const spec = {
        goal: formData.goal,
        users: formData.users,
        constraints: formData.constraints,
        template: formData.template,
        data: generatedData,
      };
      saveSpec(spec);
      setSelectedSpec(spec);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error saving spec:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSpec = (spec) => {
    setSelectedSpec(spec);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📋 Tasks Generator</h1>
          <p className="text-lg text-gray-600">Transform feature ideas into user stories, engineering tasks & risks</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-6">
          <a
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Home
          </a>
          <a
            href="/status"
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 font-medium"
          >
            Status
          </a>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Spec</h2>
              <TaskGeneratorForm 
                onTasksGenerated={handleTasksGenerated}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Right Column - Recent Specs */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <RecentSpecs 
              onSelectSpec={handleSelectSpec}
              key={`recent-${refreshTrigger}`}
            />
          </div>
        </div>

        {/* Steps Guide */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">1️⃣</div>
            <h3 className="font-bold text-gray-800 mb-2">Fill the Form</h3>
            <p className="text-gray-600 text-sm">Describe your feature goal, target users, and constraints</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">2️⃣</div>
            <h3 className="font-bold text-gray-800 mb-2">AI Generates Tasks</h3>
            <p className="text-gray-600 text-sm">AI creates user stories, engineering tasks, and identifies risks</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">3️⃣</div>
            <h3 className="font-bold text-gray-800 mb-2">Edit & Export</h3>
            <p className="text-gray-600 text-sm">Edit, reorder, and export your spec as markdown or text</p>
          </div>
        </div>
      </div>

      {/* Task Display Modal */}
      {selectedSpec && (
        <TasksDisplay 
          spec={selectedSpec}
          onClose={() => setSelectedSpec(null)}
        />
      )}
    </div>
  );
}
