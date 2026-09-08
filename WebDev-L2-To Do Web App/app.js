// State management
let tasks = [];

// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const pendingList = document.getElementById('pending-list');
const completedList = document.getElementById('completed-list');
const pendingCount = document.getElementById('pending-count');
const completedCount = document.getElementById('completed-count');
const pendingEmpty = document.getElementById('pending-empty');
const completedEmpty = document.getElementById('completed-empty');

// Initialize app
function init() {
    loadTasks();
    render();
    setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
    addTaskBtn.addEventListener('click', handleAddTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddTask();
    });
}

// Load tasks from localStorage
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
        } catch (e) {
            console.error('Error parsing tasks from local storage', e);
            tasks = [];
        }
    }
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a new task
function handleAddTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(newTask);
    taskInput.value = '';
    
    saveTasks();
    render();
}

// Toggle task completion
function toggleTask(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        tasks[taskIndex].completedAt = tasks[taskIndex].completed ? new Date().toISOString() : null;
        
        // Move task to appropriate list (completed to bottom, uncompleted to top)
        const task = tasks.splice(taskIndex, 1)[0];
        if (task.completed) {
            tasks.push(task); // Add to end if completed
        } else {
            tasks.unshift(task); // Add to beginning if pending
        }
        
        saveTasks();
        render();
    }
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    render();
}

// Enable edit mode
function enableEdit(id, textEl, editBtn, saveBtn) {
    textEl.contentEditable = true;
    textEl.focus();
    
    // Move cursor to end
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(textEl);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
    
    editBtn.style.display = 'none';
    saveBtn.style.display = 'flex';
    
    // Handle Enter key for saving
    textEl.onkeydown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            saveEdit(id, textEl, editBtn, saveBtn);
        }
    };
}

// Save edited task
function saveEdit(id, textEl, editBtn, saveBtn) {
    const newText = textEl.textContent.trim();
    if (!newText) {
        deleteTask(id); // If empty, delete it
        return;
    }
    
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].text = newText;
        saveTasks();
    }
    
    textEl.contentEditable = false;
    editBtn.style.display = 'flex';
    saveBtn.style.display = 'none';
    textEl.onkeydown = null;
}

// Format date for display
function formatDate(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Create a task DOM element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    checkbox.innerHTML = "<i class='bx bx-check'></i>";
    checkbox.onclick = () => toggleTask(task.id);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'task-content';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;

    const metaDiv = document.createElement('div');
    metaDiv.className = 'task-meta';
    
    let metaText = `Added: ${formatDate(task.createdAt)}`;
    if (task.completed && task.completedAt) {
        metaText += ` • Completed: ${formatDate(task.completedAt)}`;
    }
    metaDiv.textContent = metaText;

    contentDiv.appendChild(textSpan);
    contentDiv.appendChild(metaDiv);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon edit';
    editBtn.innerHTML = "<i class='bx bx-pencil'></i>";
    editBtn.title = "Edit Task";
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn-icon save';
    saveBtn.innerHTML = "<i class='bx bx-check'></i>";
    saveBtn.title = "Save Changes";

    editBtn.onclick = () => enableEdit(task.id, textSpan, editBtn, saveBtn);
    saveBtn.onclick = () => saveEdit(task.id, textSpan, editBtn, saveBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon delete';
    deleteBtn.innerHTML = "<i class='bx bx-trash'></i>";
    deleteBtn.title = "Delete Task";
    deleteBtn.onclick = () => deleteTask(task.id);

    // Don't show edit button for completed tasks
    if (!task.completed) {
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(saveBtn);
    }
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    return li;
}

// Render the application state
function render() {
    pendingList.innerHTML = '';
    completedList.innerHTML = '';
    
    let pendingC = 0;
    let completedC = 0;

    tasks.forEach(task => {
        const el = createTaskElement(task);
        if (task.completed) {
            completedList.appendChild(el);
            completedC++;
        } else {
            pendingList.appendChild(el);
            pendingC++;
        }
    });

    // Update counts
    pendingCount.textContent = `${pendingC} pending`;
    completedCount.textContent = `${completedC} completed`;

    // Handle empty states
    pendingEmpty.style.display = pendingC === 0 ? 'block' : 'none';
    pendingList.style.display = pendingC === 0 ? 'none' : 'flex';
    
    completedEmpty.style.display = completedC === 0 ? 'block' : 'none';
    completedList.style.display = completedC === 0 ? 'none' : 'flex';
}

// Run app
document.addEventListener('DOMContentLoaded', init);
