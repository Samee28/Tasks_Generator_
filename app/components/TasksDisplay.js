'use client';

import { useState, useEffect } from 'react';
import { exportAsMarkdown, exportAsText, downloadFile, getRecentSpecs, saveSpec } from '@/app/lib/storage';

export default function TasksDisplay({ spec, onClose }) {
  const [items, setItems] = useState(spec.data?.userStories || []);
  const [tasks, setTasks] = useState(spec.data?.engineeringTasks || []);
  const [risks, setRisks] = useState(spec.data?.risks || []);
  const [activeTab, setActiveTab] = useState('stories');
  const [editingId, setEditingId] = useState(null);
  const [groupFilter, setGroupFilter] = useState('all');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', description: '', priority: 'medium', group: '' });

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

  const handleAddNew = () => {
    if (!newItem.title.trim() || !newItem.description.trim()) return;
    
    const item = {
      id: activeTab === 'stories' ? `S${items.length + 1}` : `T${tasks.length + 1}`,
      ...newItem,
    };
    
    if (activeTab === 'stories') {
      setItems([...items, item]);
    } else {
      setTasks([...tasks, item]);
    }
    
    setNewItem({ title: '', description: '', priority: 'medium', group: '' });
    setIsAddingNew(false);
  };

  const handleSaveEdits = () => {
    const updatedSpec = {
      ...spec,
      data: {
        userStories: items,
        engineeringTasks: tasks,
        risks: risks,
      },
      updatedAt: new Date().toISOString(),
    };
    saveSpec(updatedSpec);
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
        <div className="space-y-4 bg-white p-4 rounded border-2 border-blue-300">
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">📌 Title</label>
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleEdit(item.id, 'title', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded font-semibold text-lg text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-900 mb-2">📝 Description</label>
            <textarea
              value={item.description}
              onChange={(e) => handleEdit(item.id, 'description', e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-500 rounded font-semibold text-lg text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
              rows="4"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setEditingId(null)}
              className="px-5 py-2 bg-green-600 text-white rounded text-base font-bold hover:bg-green-700 transition"
            >
              ✓ Done
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-5 py-2 bg-red-600 text-white rounded text-base font-bold hover:bg-red-700 transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-bold text-lg text-gray-800">{item.id}: {item.title}</h4>
              <p className="text-base text-gray-700 mt-2">{item.description}</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
              {item.priority}
            </span>
          </div>
          {item.group && (
            <p className="text-sm text-gray-600 mb-2">Group: {item.group}</p>
          )}
          {activeTab === 'tasks' && item.estimatedHours && (
            <p className="text-sm text-gray-600 mb-2">Estimated: {item.estimatedHours}h</p>
          )}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setEditingId(item.id)}
              className="px-3 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => handleReorder(index, 'up')}
              disabled={index === 0}
              className="px-3 py-2 bg-gray-300 rounded text-sm font-bold hover:bg-gray-400 disabled:opacity-50"
            >
              ↑
            </button>
            <button
              onClick={() => handleReorder(index, 'down')}
              disabled={index === list.length - 1}
              className="px-3 py-2 bg-gray-300 rounded text-sm font-bold hover:bg-gray-400 disabled:opacity-50"
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
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-bold transition"
            >
              ➕ Add {activeTab === 'stories' ? 'Story' : 'Task'}
            </button>
            <button
              onClick={handleCopyToClipboard}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-bold"
            >
              📋 Copy Markdown
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-bold"
            >
              📥 Download Markdown
            </button>
            <button
              onClick={() => handleExport('text')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-bold"
            >
              📥 Download Text
            </button>
          </div>

          {/* Add New Item Form */}
          {isAddingNew && (activeTab === 'stories' || activeTab === 'tasks') && (
            <div className="bg-purple-50 border-2 border-purple-300 p-4 mb-4 rounded">
              <h3 className="text-lg font-bold text-gray-900 mb-3">➕ Add New {activeTab === 'stories' ? 'User Story' : 'Engineering Task'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">📌 Title</label>
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="Enter title..."
                    className="w-full px-4 py-3 border-2 border-gray-500 rounded font-semibold text-lg text-gray-900 focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-2">📝 Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    placeholder="Enter description..."
                    className="w-full px-4 py-3 border-2 border-gray-500 rounded font-semibold text-lg text-gray-900 focus:outline-none focus:border-purple-600"
                    rows="3"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddNew}
                    className="px-5 py-2 bg-purple-600 text-white rounded text-base font-bold hover:bg-purple-700 transition"
                  >
                    ✓ Add Item
                  </button>
                  <button
                    onClick={() => setIsAddingNew(false)}
                    className="px-5 py-2 bg-gray-400 text-white rounded text-base font-bold hover:bg-gray-500 transition"
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b">
            <button
              onClick={() => { setActiveTab('stories'); setIsAddingNew(false); }}
              className={`px-4 py-2 font-medium ${
                activeTab === 'stories'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              User Stories ({items.length})
            </button>
            <button
              onClick={() => { setActiveTab('tasks'); setIsAddingNew(false); }}
              className={`px-4 py-2 font-medium ${
                activeTab === 'tasks'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Engineering Tasks ({tasks.length})
            </button>
            <button
              onClick={() => { setActiveTab('risks'); setIsAddingNew(false); }}
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

        <div className="bg-gray-100 px-6 py-4 rounded-b-lg flex justify-between gap-2">
          <button
            onClick={handleSaveEdits}
            className="px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 transition text-sm"
          >
            💾 Save All Edits
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded font-bold hover:bg-gray-700 transition text-sm"
          >
            ✕ Close
          </button>
        </div>
      </div>
    </div>
  );
}
