class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'date-asc';
        this.currentSearch = '';
        this.draggedItem = null;
        
        this.init();
    }

    init() {
        this.createStyles();
        this.createStructure();
        this.renderTasks();
        this.setupEventListeners();
    }

    loadTasks() {
        const stored = localStorage.getItem('todoTasks');
        return stored ? JSON.parse(stored) : [];
    }

    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    createStyles() {
        const styles = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #f5f5f5;
                min-height: 100vh;
                padding: 20px;
            }

            .todo-app {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }

            .header {
                background-color: #4a90e2;
                color: white;
                padding: 25px;
                text-align: center;
            }

            .header h1 {
                font-size: 2.2rem;
                margin-bottom: 8px;
            }

            .controls {
                padding: 20px;
                background: #f8f9fa;
                border-bottom: 1px solid #e0e0e0;
            }

            .input-group {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .input-group input {
                flex: 1;
                min-width: 200px;
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
            }

            .input-group input:focus {
                outline: none;
                border-color: #4a90e2;
            }

            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                font-weight: 600;
            }

            .btn-primary {
                background: #4a90e2;
                color: white;
            }

            .btn-primary:hover {
                background: #3a7bc8;
            }

            .filter-group {
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                align-items: center;
            }

            .filter-group select,
            .filter-group input {
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
            }

            .tasks-container {
                padding: 20px;
                min-height: 400px;
            }

            .task-list {
                list-style: none;
            }

            .task-item {
                background: white;
                margin-bottom: 10px;
                padding: 15px;
                border: 1px solid #e0e0e0;
                border-radius: 6px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.2s;
                cursor: move;
            }

            .task-item:hover {
                border-color: #4a90e2;
            }

            .task-item.dragging {
                opacity: 0.5;
                background: #f8f9fa;
            }

            .task-item.completed {
                background: #f8f9fa;
                opacity: 0.7;
            }

            .task-checkbox {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .task-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .task-text {
                font-size: 16px;
                color: #333;
            }

            .task-text.completed {
                text-decoration: line-through;
                color: #666;
            }

            .task-date {
                font-size: 12px;
                color: #666;
            }

            .task-actions {
                display: flex;
                gap: 10px;
                opacity: 0;
                transition: opacity 0.2s;
            }

            .task-item:hover .task-actions {
                opacity: 1;
            }

            .btn-icon {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
            }

            .btn-edit:hover {
                background: #ffeaa7;
            }

            .btn-delete:hover {
                background: #ff7675;
            }

            .empty-state {
                text-align: center;
                padding: 40px;
                color: #666;
            }

            .edit-input {
                padding: 8px;
                border: 1px solid #4a90e2;
                border-radius: 4px;
                font-size: 14px;
                width: 100%;
            }

            @media (max-width: 768px) {
                .todo-app {
                    margin: 10px;
                    border-radius: 6px;
                }

                .header {
                    padding: 20px;
                }

                .header h1 {
                    font-size: 1.8rem;
                }

                .input-group {
                    flex-direction: column;
                }

                .input-group input {
                    min-width: auto;
                }

                .filter-group {
                    flex-direction: column;
                    align-items: stretch;
                }

                .task-item {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 10px;
                }

                .task-actions {
                    align-self: flex-end;
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                body {
                    padding: 10px;
                }

                .header h1 {
                    font-size: 1.5rem;
                }

                .btn {
                    padding: 10px 20px;
                    font-size: 14px;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    createStructure() {
        const app = document.getElementById('app');
        
        const todoApp = document.createElement('div');
        todoApp.className = 'todo-app';
        
        const header = document.createElement('header');
        header.className = 'header';
        
        const title = document.createElement('h1');
        title.textContent = 'To-Do List';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = 'Организуйте свои задачи эффективно';
        
        header.appendChild(title);
        header.appendChild(subtitle);
        
        const controls = document.createElement('div');
        controls.className = 'controls';
        
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.placeholder = 'Введите новую задачу...';
        taskInput.id = 'taskInput';
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.id = 'dateInput';
        
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-primary';
        addButton.textContent = 'Добавить задачу';
        
        inputGroup.appendChild(taskInput);
        inputGroup.appendChild(dateInput);
        inputGroup.appendChild(addButton);
        
        const filterGroup = document.createElement('div');
        filterGroup.className = 'filter-group';
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Поиск задач...';
        searchInput.id = 'searchInput';
        
        const filterSelect = document.createElement('select');
        filterSelect.id = 'filterSelect';
        
        const filterOptions = [
            { value: 'all', text: 'Все задачи' },
            { value: 'active', text: 'Активные' },
            { value: 'completed', text: 'Выполненные' }
        ];
        
        filterOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            filterSelect.appendChild(optionElement);
        });
        
        const sortSelect = document.createElement('select');
        sortSelect.id = 'sortSelect';
        
        const sortOptions = [
            { value: 'date-asc', text: 'Дата (по возрастанию)' },
            { value: 'date-desc', text: 'Дата (по убыванию)' }
        ];
        
        sortOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            sortSelect.appendChild(optionElement);
        });
        
        filterGroup.appendChild(searchInput);
        filterGroup.appendChild(filterSelect);
        filterGroup.appendChild(sortSelect);
        
        controls.appendChild(inputGroup);
        controls.appendChild(filterGroup);
        
        const tasksContainer = document.createElement('div');
        tasksContainer.className = 'tasks-container';
        
        const taskList = document.createElement('ul');
        taskList.className = 'task-list';
        taskList.id = 'taskList';
        
        tasksContainer.appendChild(taskList);
        
        todoApp.appendChild(header);
        todoApp.appendChild(controls);
        todoApp.appendChild(tasksContainer);
        app.appendChild(todoApp);
    }

    setupEventListeners() {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        const addButton = document.querySelector('.btn-primary');
        const searchInput = document.getElementById('searchInput');
        const filterSelect = document.getElementById('filterSelect');
        const sortSelect = document.getElementById('sortSelect');

        addButton.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        searchInput.addEventListener('input', (e) => {
            this.currentSearch = e.target.value.toLowerCase();
            this.renderTasks();
        });

        filterSelect.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderTasks();
        });

        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const dateInput = document.getElementById('dateInput');
        
        const text = taskInput.value.trim();
        const date = dateInput.value;
        
        if (!text) {
            alert('Пожалуйста, введите текст задачи');
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: text,
            date: date,
            completed: false,
            order: this.tasks.length
        };
        
        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        
        taskInput.value = '';
        taskInput.focus();
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(id, newText, newDate) {
        const task = this.tasks.find(task => task.id === id);
        if (task && newText.trim()) {
            task.text = newText.trim();
            task.date = newDate;
            this.saveTasks();
            this.renderTasks();
        }
    }

    getFilteredTasks() {
        let filtered = this.tasks;
        
        if (this.currentFilter === 'active') {
            filtered = filtered.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        }
        
        if (this.currentSearch) {
            filtered = filtered.filter(task => 
                task.text.toLowerCase().includes(this.currentSearch)
            );
        }
        
        filtered.sort((a, b) => {
            if (this.currentSort === 'date-asc') {
                return new Date(a.date) - new Date(b.date);
            } else {
                return new Date(b.date) - new Date(a.date);
            }
        });
        
        return filtered;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const filteredTasks = this.getFilteredTasks();
        
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = this.currentSearch || this.currentFilter !== 'all' 
                ? 'Задачи не найдены' 
                : 'Добавьте первую задачу';
            taskList.appendChild(emptyState);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskItem = this.createTaskElement(task);
            taskList.appendChild(taskItem);
        });
    }

    createTaskElement(task) {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskItem.draggable = true;
        taskItem.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.text;
        
        const taskDate = document.createElement('span');
        taskDate.className = 'task-date';
        taskDate.textContent = this.formatDate(task.date);
        
        taskContent.appendChild(taskText);
        taskContent.appendChild(taskDate);
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        const editButton = document.createElement('button');
        editButton.className = 'btn-icon btn-edit';
        editButton.innerHTML = '✏️';
        editButton.title = 'Редактировать';
        editButton.addEventListener('click', () => this.enableEditMode(taskItem, task));
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn-icon btn-delete';
        deleteButton.innerHTML = '🗑️';
        deleteButton.title = 'Удалить';
        deleteButton.addEventListener('click', () => this.deleteTask(task.id));
        
        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);
        
        this.setupDragAndDrop(taskItem);
        
        return taskItem;
    }

    enableEditMode(taskItem, task) {
        const taskContent = taskItem.querySelector('.task-content');
        const taskText = taskItem.querySelector('.task-text');
        const taskDate = taskItem.querySelector('.task-date');
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'edit-input';
        textInput.value = task.text;
        
        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.className = 'edit-input';
        dateInput.value = task.date;
        
        taskContent.innerHTML = '';
        taskContent.appendChild(textInput);
        taskContent.appendChild(dateInput);
        
        textInput.focus();
        
        const saveEdit = () => {
            this.editTask(task.id, textInput.value, dateInput.value);
        };
        
        textInput.addEventListener('blur', saveEdit);
        dateInput.addEventListener('blur', saveEdit);
        
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit();
            }
        });
    }

    setupDragAndDrop(taskItem) {
        taskItem.addEventListener('dragstart', (e) => {
            this.draggedItem = taskItem;
            taskItem.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });
        
        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('dragging');
            this.draggedItem = null;
        });
        
        taskItem.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        taskItem.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedItem && this.draggedItem !== taskItem) {
                this.handleReorder(this.draggedItem, taskItem);
            }
        });
    }

    handleReorder(draggedItem, targetItem) {
        const draggedId = parseInt(draggedItem.dataset.id);
        const targetId = parseInt(targetItem.dataset.id);
        
        const draggedIndex = this.tasks.findIndex(task => task.id === draggedId);
        const targetIndex = this.tasks.findIndex(task => task.id === targetId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const [movedTask] = this.tasks.splice(draggedIndex, 1);
            this.tasks.splice(targetIndex, 0, movedTask);
            
            this.tasks.forEach((task, index) => {
                task.order = index;
            });
            
            this.saveTasks();
            this.renderTasks();
        }
    }

    formatDate(dateString) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'short'
        };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
