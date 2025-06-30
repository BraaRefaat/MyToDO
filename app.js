// Selectors
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

let tasks = [];

// Load tasks from localStorage
function loadTasks() {
    const stored = localStorage.getItem('tasks');
    tasks = stored ? JSON.parse(stored) : [];
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, idx) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');

        if (task.editing) {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = task.text;
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    updateTask(idx, input.value);
                } else if (e.key === 'Escape') {
                    cancelEdit(idx);
                }
            });
            li.appendChild(input);
            input.focus();
        } else {
            const span = document.createElement('span');
            span.textContent = task.text;
            span.style.flex = '1';
            li.appendChild(span);
        }

        // Actions
        const actions = document.createElement('div');
        actions.className = 'task-actions';

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.innerHTML = task.completed ? '✅' : '☑️';
        completeBtn.title = 'Mark as complete';
        completeBtn.onclick = () => toggleComplete(idx);
        actions.appendChild(completeBtn);

        // Edit button
        if (!task.completed && !task.editing) {
            const editBtn = document.createElement('button');
            editBtn.innerHTML = '✏️';
            editBtn.title = 'Edit task';
            editBtn.onclick = () => editTask(idx);
            actions.appendChild(editBtn);
        }

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '🗑️';
        deleteBtn.title = 'Delete task';
        deleteBtn.onclick = () => deleteTask(idx);
        actions.appendChild(deleteBtn);

        li.appendChild(actions);
        taskList.appendChild(li);
    });
}

// Add task
function addTask(text) {
    tasks.push({ text, completed: false, editing: false });
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(idx) {
    tasks.splice(idx, 1);
    saveTasks();
    renderTasks();
}

// Toggle complete
function toggleComplete(idx) {
    tasks[idx].completed = !tasks[idx].completed;
    saveTasks();
    renderTasks();
}

// Edit task
function editTask(idx) {
    tasks[idx].editing = true;
    renderTasks();
}

// Update task
function updateTask(idx, newText) {
    if (newText.trim() !== '') {
        tasks[idx].text = newText;
    }
    tasks[idx].editing = false;
    saveTasks();
    renderTasks();
}

// Cancel edit
function cancelEdit(idx) {
    tasks[idx].editing = false;
    renderTasks();
}

// Form submit
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        addTask(text);
        taskInput.value = '';
    }
});

// Initial load
loadTasks();
renderTasks(); 