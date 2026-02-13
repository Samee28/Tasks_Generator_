'use client';

import { useEffect, useState } from 'react';
import { getRecentSpecs, deleteSpec } from '@/app/lib/storage';

export default function RecentSpecs({ onSelectSpec }) {
  const [specs, setSpecs] = useState([]);

  useEffect(() => {
    const recentSpecs = getRecentSpecs();
    setSpecs(recentSpecs);
  }, []);

  const handleDelete = (specId, e) => {
    e.stopPropagation();
    const updated = deleteSpec(specId);
    setSpecs(updated);
  };

  if (specs.length === 0) {
    return <div className="text-gray-500 text-center py-8">No recent specs yet. Create one above!</div>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Last 5 Generated Specs</h3>
      {specs.map(spec => (
        <div
          key={spec.id}
          onClick={() => onSelectSpec(spec)}
          className="border rounded-lg p-4 hover:shadow-md hover:bg-blue-50 cursor-pointer transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{spec.goal}</h4>
              <p className="text-sm text-gray-600 mt-1">
                {spec.data?.userStories?.length || 0} user stories • {spec.data?.engineeringTasks?.length || 0} tasks
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(spec.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={(e) => handleDelete(spec.id, e)}
              className="text-red-600 hover:text-red-800 font-semibold px-2"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
