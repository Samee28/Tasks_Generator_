'use client';

import { useState } from 'react';
import { exportAsMarkdown, exportAsText, downloadFile } from '@/app/lib/storage';

export default function TasksDisplay({ spec, onClose }) {
  const [items, setItems] = useState(spec.data?.userStories || []);
  const [tasks, setTasks] = useState(spec.data?.engineeringTasks || []);
  const [risks, setRisks] = useState(spec.data?.risks || []);
  const [activeTab, setActiveTab] = useState('stories');
  const [editingId, setEditingId] = useState(null);
  const [groupFilter, setGroupFilter] = useState('all');

  const allItems = [...items, ...tasks];
  const groups = [...new Set(allItems.map(item => item.group).filter(Boolean))];

  const handleEdit = (id, field, value) => {
    if (activeTab === 'stories') {
      setItems(items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      ));
    } else if (activeTab === 'tasks') {
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, [field]: value } : task
      ));
    }
  };

  const handleDelete = (id) => {
    if (activeTab === 'stories') {
      setItems(items.filter(item => item.id !== id));
    } else if (activeTab === 'tasks') {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const handleReorder = (index, direction) => {
    const list = activeTab === 'stories' ? items : tasks;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < list.length) {
      const newList = [...list];
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
      activeTab === 'stories' ? setItems(newList) : setTasks(newList);
    }
  };

  const filteredItems = activeTab === 'stories' 
    ? (groupFilter === 'all' ? items : items.filter(item => item.group === groupFilter))
    : (groupFilter === 'all' ? tasks : tasks.filter(task => task.group === groupFilter));

  const handleExport = (format) => {
    const updatedSpec = {
      ...spec,
      data: {
        userStories: items,
        engineeringTasks: tasks,
        risks: risks,
      },
    };

    let content, filename;
    if (format === 'markdown') {
      content = exportAsMarkdown(updatedSpec);
      filename = `task-spec-${Date.now()}.md`;
    } else {
      content = exportAsText(updatedSpec);
      filename = `task-spec-${Date.now()}.txt`;
    }

    downloadFile(content, filename, format === 'markdown' ? 'text/markdown' : 'text/plain');
  };

  const handleCopyToClipboard = () => {
    const content = exportAsMarkdown({
      ...spec,
      data: {
        userStories: items,
        engineeringTasks: tasks,
        risks: risks,
      },
    });
    navigator.clipboard.writeText(content);
  };

  const renderItem = (item, index, list) => (
    <div key={item.id} className="border-l-4 border-blue-500 bg-blue-50 p-4 mb-3 rounded">
      {editingId === item.id ? (
        <div className="space-y-2">
          <input
            type="text"
            value={item.title}
            onChange={(e) => handleEdit(item.id, 'title', e.target.value)}
            className="w-full px-2 py-1 border rounded"
          />
          <textarea
            value={item.description}
            onChange={(e) => handleEdit(item.id, 'description', e.target.value)}
            className="w-full px-2 py-1 border rounded"
            rows="2"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setEditingId(null)}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              Done
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-800">{item.id}: {item.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              {item.priority}
            </span>
          </div>
          {item.group && (
            <p className="text-xs text-gray-500 mb-2">Group: {item.group}</p>
          )}
          {activeTab === 'tasks' && item.estimatedHours && (
            <p className="text-xs text-gray-500 mb-2">Estimated: {item.estimatedHours}h</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setEditingId(item.id)}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleReorder(index, 'up')}
              disabled={index === 0}
              className="px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400 disabled:opacity-50"
            >
              ↑
            </button>
            <button
              onClick={() => handleReorder(index, 'down')}
              disabled={index === list.length - 1}
              className="px-2 py-1 bg-gray-300 rounded text-xs hover:bg-gray-400 disabled:opacity-50"
            >
              ↓
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 max-h-screen overflow-y-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl my-8">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Task Specification</h2>
              <p className="text-gray-600 mt-1">{spec.goal}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Export Options */}
          <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b">
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              📋 Copy Markdown
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              📥 Download Markdown
            </button>
            <button
              onClick={() => handleExport('text')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              📥 Download Text
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b">
            <button
              onClick={() => setActiveTab('stories')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'stories'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              User Stories ({items.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'tasks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Engineering Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'risks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Risks & Unknowns ({risks.length})
            </button>
          </div>

          {/* Group Filter */}
          {groups.length > 0 && (activeTab === 'stories' || activeTab === 'tasks') && (
            <div className="mb-4">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">All Groups</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
          )}

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'stories' && (
              <div>
                {filteredItems.length === 0 ? (
                  <p className="text-gray-500">No user stories</p>
                ) : (
                  filteredItems.map((item, idx) => renderItem(item, idx, filteredItems))
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div>
                {filteredItems.length === 0 ? (
                  <p className="text-gray-500">No engineering tasks</p>
                ) : (
                  filteredItems.map((task, idx) => renderItem(task, idx, filteredItems))
                )}
              </div>
            )}

            {activeTab === 'risks' && (
              <div>
                {risks.length === 0 ? (
                  <p className="text-gray-500">No risks identified</p>
                ) : (
                  risks.map((risk, idx) => (
                    <div key={risk.id} className="border-l-4 border-orange-500 bg-orange-50 p-4 mb-3 rounded">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">{risk.id}: {risk.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{risk.description}</p>
                        </div>
                        <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-800 rounded">
                          {risk.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700"><strong>Mitigation:</strong> {risk.mitigation}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
