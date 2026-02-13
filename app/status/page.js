'use client';

import { useEffect, useState } from 'react';

export default function StatusPage() {
  const [status, setStatus] = useState({
    backend: 'checking',
    database: 'checking',
    llm: 'checking',
    timestamp: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) throw new Error('Failed to fetch status');
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
      case 'not_configured':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'checking':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
      case 'connected':
        return '✅';
      case 'error':
        return '❌';
      case 'not_configured':
        return '⚠️';
      case 'checking':
      default:
        return '⏳';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <a
              href="/"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 font-medium"
            >
              Home
            </a>
            <a
              href="/status"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Status
            </a>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏥 System Status</h1>
          <p className="text-lg text-gray-600">Health check for backend, database, and LLM connection</p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Backend */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Backend</h3>
              <span className="text-3xl">{getStatusIcon(status.backend)}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border font-semibold inline-block ${getStatusColor(status.backend)}`}>
              {status.backend === 'checking' ? 'Checking...' : status.backend === 'healthy' ? 'Healthy' : 'Error'}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              The Next.js backend API server is {status.backend === 'healthy' ? 'running' : 'not responding'}
            </p>
          </div>

          {/* Database */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Database</h3>
              <span className="text-3xl">{getStatusIcon(status.database)}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border font-semibold inline-block ${getStatusColor(status.database)}`}>
              {status.database === 'checking' ? 'Checking...' : status.database === 'connected' ? 'Connected' : 'Error'}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Data is stored in browser's localStorage (no external DB required for this version)
            </p>
          </div>

          {/* LLM */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">LLM API</h3>
              <span className="text-3xl">{getStatusIcon(status.llm)}</span>
            </div>
            <div className={`px-4 py-2 rounded-lg border font-semibold inline-block ${getStatusColor(status.llm)}`}>
              {status.llm === 'checking' ? 'Checking...' : status.llm === 'healthy' ? 'Connected' : status.llm === 'not_configured' ? 'Not Configured' : 'Error'}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {status.llm === 'not_configured' ? 'Please set OPENAI_API_KEY in .env.local' : `OpenAI API is ${status.llm === 'healthy' ? 'responding' : 'unreachable'}`}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        {status.timestamp && (
          <div className="bg-white rounded-lg shadow p-4 mb-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> {new Date(status.timestamp).toLocaleString()}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">ℹ️ About This Page</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Backend:</strong> Your Next.js API is always running on the same domain</li>
            <li><strong>Database:</strong> Using browser localStorage for specs - no server-side persistence needed</li>
            <li><strong>LLM:</strong> Requires OpenAI API key. Set it in .env.local file</li>
            <li>This page refreshes every 30 seconds automatically</li>
          </ul>
        </div>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
