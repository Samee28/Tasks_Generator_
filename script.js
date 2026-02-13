// State Management
let currentSpec = null;
const MAX_HISTORY = 5;

// DOM Elements
const featureForm = document.getElementById('featureForm');
const tasksSection = document.getElementById('tasksSection');
const historySection = document.getElementById('historySection');
const userStoriesList = document.getElementById('userStories');
const engineeringTasksList = document.getElementById('engineeringTasks');
const historyList = document.getElementById('historyList');

// Buttons
const clearBtn = document.getElementById('clearBtn');
const historyBtn = document.getElementById('historyBtn');
const exportBtn = document.getElementById('exportBtn');
const downloadBtn = document.getElementById('downloadBtn');
const newSpecBtn = document.getElementById('newSpecBtn');
const closeHistoryBtn = document.getElementById('closeHistoryBtn');
const addStoryBtn = document.getElementById('addStoryBtn');
const addTaskBtn = document.getElementById('addTaskBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    featureForm.addEventListener('submit', handleFormSubmit);
    clearBtn.addEventListener('click', clearForm);
    historyBtn.addEventListener('click', showHistory);
    closeHistoryBtn.addEventListener('click', hideHistory);
    exportBtn.addEventListener('click', copyToClipboard);
    downloadBtn.addEventListener('click', downloadAsMarkdown);
    newSpecBtn.addEventListener('click', startNewSpec);
    addStoryBtn.addEventListener('click', () => addNewItem('story'));
    addTaskBtn.addEventListener('click', () => addNewItem('task'));
}

// Form Handling
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        goal: document.getElementById('goal').value.trim(),
        users: document.getElementById('users').value.trim(),
        constraints: document.getElementById('constraints').value.trim(),
        timestamp: new Date().toISOString()
    };
    
    currentSpec = formData;
    generateTasks(formData);
    saveToHistory(formData);
    showTasksSection();
}

function clearForm() {
    featureForm.reset();
}

function startNewSpec() {
    tasksSection.style.display = 'none';
    document.querySelector('.form-section').style.display = 'block';
    currentSpec = null;
    clearForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Task Generation
function generateTasks(spec) {
    const userStories = generateUserStories(spec);
    const engineeringTasks = generateEngineeringTasks(spec);
    
    renderTasks(userStories, engineeringTasks);
}

function generateUserStories(spec) {
    const stories = [
        `As a ${spec.users}, I want to ${extractFirstSentence(spec.goal)} so that I can achieve my objectives`,
        `As a ${spec.users}, I need a clear interface to interact with this feature`,
        `As a ${spec.users}, I want to see immediate feedback when using this feature`
    ];
    
    return stories;
}

function generateEngineeringTasks(spec) {
    const tasks = [
        'Set up project structure and dependencies',
        'Design and implement the user interface',
        'Create backend API endpoints',
        'Implement core business logic',
        'Add input validation and error handling',
        'Write unit tests for critical components',
        'Perform integration testing',
        'Add documentation and code comments',
        'Optimize performance and accessibility',
        'Deploy to production environment'
    ];
    
    if (spec.constraints) {
        tasks.push(`Address constraint: ${extractFirstSentence(spec.constraints)}`);
    }
    
    return tasks;
}

function extractFirstSentence(text) {
    const match = text.match(/^[^.!?]+[.!?]/);
    return match ? match[0] : text.substring(0, 50);
}

// Rendering
function renderTasks(userStories, engineeringTasks) {
    userStoriesList.innerHTML = '';
    engineeringTasksList.innerHTML = '';
    
    userStories.forEach((story, index) => {
        addTaskItem(userStoriesList, story, index, 'story');
    });
    
    engineeringTasks.forEach((task, index) => {
        addTaskItem(engineeringTasksList, task, index, 'task');
    });
    
    setupDragAndDrop();
}

function addTaskItem(list, text, index, type) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.draggable = true;
    li.dataset.index = index;
    li.dataset.type = type;
    
    li.innerHTML = `
        <span class="drag-handle">⋮⋮</span>
        <div class="task-content">
            <span class="task-text" contenteditable="false">${text}</span>
        </div>
        <div class="task-actions">
            <button class="icon-btn edit-btn" title="Edit">✏️</button>
            <button class="icon-btn delete-btn" title="Delete">🗑️</button>
        </div>
    `;
    
    // Edit button
    li.querySelector('.edit-btn').addEventListener('click', (e) => {
        const taskText = li.querySelector('.task-text');
        const isEditing = taskText.contentEditable === 'true';
        
        if (isEditing) {
            taskText.contentEditable = 'false';
            taskText.classList.remove('editing');
            e.target.textContent = '✏️';
        } else {
            taskText.contentEditable = 'true';
            taskText.classList.add('editing');
            taskText.focus();
            e.target.textContent = '💾';
        }
    });
    
    // Delete button
    li.querySelector('.delete-btn').addEventListener('click', () => {
        li.remove();
        showToast('Task deleted', 'error');
    });
    
    list.appendChild(li);
}

function addNewItem(type) {
    const list = type === 'story' ? userStoriesList : engineeringTasksList;
    const placeholder = type === 'story' 
        ? 'As a user, I want to...' 
        : 'New engineering task...';
    
    addTaskItem(list, placeholder, list.children.length, type);
    
    // Auto-focus the new item for editing
    const newItem = list.lastElementChild;
    const taskText = newItem.querySelector('.task-text');
    const editBtn = newItem.querySelector('.edit-btn');
    
    taskText.contentEditable = 'true';
    taskText.classList.add('editing');
    taskText.focus();
    editBtn.textContent = '💾';
    
    // Select all text for easy replacement
    const range = document.createRange();
    range.selectNodeContents(taskText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

function showTasksSection() {
    document.querySelector('.form-section').style.display = 'none';
    tasksSection.style.display = 'block';
    historySection.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Drag and Drop
function setupDragAndDrop() {
    const items = document.querySelectorAll('.task-item');
    
    items.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
    });
}

let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd() {
    this.classList.remove('dragging');
    draggedItem = null;
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedItem !== this && draggedItem.parentElement === this.parentElement) {
        const allItems = Array.from(this.parentElement.children);
        const draggedIndex = allItems.indexOf(draggedItem);
        const targetIndex = allItems.indexOf(this);
        
        if (draggedIndex < targetIndex) {
            this.parentElement.insertBefore(draggedItem, this.nextSibling);
        } else {
            this.parentElement.insertBefore(draggedItem, this);
        }
    }
    
    return false;
}

// Export Functions
function getTasksAsText() {
    if (!currentSpec) return '';
    
    let output = '# Feature Specification\n\n';
    output += `**Goal:** ${currentSpec.goal}\n\n`;
    output += `**Target Users:** ${currentSpec.users}\n\n`;
    
    if (currentSpec.constraints) {
        output += `**Constraints:** ${currentSpec.constraints}\n\n`;
    }
    
    output += '## User Stories\n\n';
    const stories = userStoriesList.querySelectorAll('.task-item');
    stories.forEach((item, index) => {
        const text = item.querySelector('.task-text').textContent.trim();
        output += `${index + 1}. ${text}\n`;
    });
    
    output += '\n## Engineering Tasks\n\n';
    const tasks = engineeringTasksList.querySelectorAll('.task-item');
    tasks.forEach((item, index) => {
        const text = item.querySelector('.task-text').textContent.trim();
        output += `${index + 1}. ${text}\n`;
    });
    
    output += `\n---\n*Generated on ${new Date(currentSpec.timestamp).toLocaleString()}*\n`;
    
    return output;
}

function copyToClipboard() {
    const text = getTasksAsText();
    
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!');
    }).catch(err => {
        showToast('Failed to copy', 'error');
        console.error('Copy failed:', err);
    });
}

function downloadAsMarkdown() {
    const text = getTasksAsText();
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    const filename = `tasks_${new Date().toISOString().split('T')[0]}.md`;
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('Downloaded successfully!');
}

// History Management
function saveToHistory(spec) {
    let history = getHistory();
    
    // Add tasks to the spec
    const stories = Array.from(userStoriesList.querySelectorAll('.task-text'))
        .map(el => el.textContent.trim());
    const tasks = Array.from(engineeringTasksList.querySelectorAll('.task-text'))
        .map(el => el.textContent.trim());
    
    spec.userStories = stories;
    spec.engineeringTasks = tasks;
    
    // Add to beginning of array
    history.unshift(spec);
    
    // Keep only last 5
    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }
    
    localStorage.setItem('tasksHistory', JSON.stringify(history));
}

function getHistory() {
    const history = localStorage.getItem('tasksHistory');
    return history ? JSON.parse(history) : [];
}

function loadHistory() {
    const history = getHistory();
    renderHistory(history);
}

function renderHistory(history) {
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p style="color: #666; text-align: center;">No specifications yet. Create your first one!</p>';
        return;
    }
    
    history.forEach((spec, index) => {
        const div = document.createElement('div');
        div.className = 'history-item';
        
        const date = new Date(spec.timestamp).toLocaleString();
        const goalPreview = spec.goal.substring(0, 100) + (spec.goal.length > 100 ? '...' : '');
        
        div.innerHTML = `
            <div class="history-header">
                <div class="history-date">${date}</div>
                <button class="delete-history-btn" data-index="${index}">Delete</button>
            </div>
            <div class="history-content">
                <strong>Goal:</strong> ${goalPreview}
                <strong>Users:</strong> ${spec.users}
                ${spec.userStories ? `<strong>Stories:</strong> ${spec.userStories.length} | <strong>Tasks:</strong> ${spec.engineeringTasks.length}` : ''}
            </div>
        `;
        
        // Load spec on click
        div.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-history-btn')) {
                loadSpec(spec);
            }
        });
        
        // Delete button
        div.querySelector('.delete-history-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteFromHistory(index);
        });
        
        historyList.appendChild(div);
    });
}

function loadSpec(spec) {
    currentSpec = spec;
    
    // Populate form
    document.getElementById('goal').value = spec.goal;
    document.getElementById('users').value = spec.users;
    document.getElementById('constraints').value = spec.constraints || '';
    
    // Render tasks
    if (spec.userStories && spec.engineeringTasks) {
        renderTasks(spec.userStories, spec.engineeringTasks);
        showTasksSection();
    }
    
    hideHistory();
    showToast('Specification loaded');
}

function deleteFromHistory(index) {
    let history = getHistory();
    history.splice(index, 1);
    localStorage.setItem('tasksHistory', JSON.stringify(history));
    renderHistory(history);
    showToast('Deleted from history', 'error');
}

function showHistory() {
    loadHistory();
    document.querySelector('.form-section').style.display = 'none';
    tasksSection.style.display = 'none';
    historySection.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideHistory() {
    historySection.style.display = 'none';
    
    if (currentSpec && currentSpec.userStories) {
        showTasksSection();
    } else {
        document.querySelector('.form-section').style.display = 'block';
    }
}

// Toast Notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
