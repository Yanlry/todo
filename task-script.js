document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDescription = document.getElementById('task-description');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const completedTasksContainer = document.getElementById('completed-tasks-container');
    const toggleCompletedTasksButton = document.getElementById('toggle-completed-tasks');
    const clearCompletedTasksButton = document.getElementById('clear-completed-tasks');

    function formatText(text) {
        return text.replace(/\n/g, '<br>');
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

        taskList.innerHTML = '';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <div class="task-content">
                    <span class="task-title">${task.text}</span>
                    ${task.description ? `<p class="task-description">${formatText(task.description)}</p>` : ''}
                </div>
                <button class="delete-task-button">Supprimer</button>
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            `;
            taskList.appendChild(taskItem);

            taskItem.querySelector('.delete-task-button').addEventListener('click', () => {
                deleteTask(task.text);
            });
        });

        completedTaskList.innerHTML = '';
        completedTasks.forEach(task => {
            const completedTaskItem = document.createElement('li');
            completedTaskItem.innerHTML = `
                <div class="task-content">
                    <span class="task-title">${task.text}</span>
                    ${task.description ? `<p class="task-description">${formatText(task.description)}</p>` : ''}
                </div>
                <button class="delete-task-button">Supprimer</button>
                <input type="checkbox" class="completed-task-checkbox" checked>
            `;
            completedTaskList.appendChild(completedTaskItem);

            completedTaskItem.querySelector('.delete-task-button').addEventListener('click', () => {
                deleteCompletedTask(task.text);
            });
        });

        if (completedTaskList.children.length === 0) {
            clearCompletedTasksButton.classList.add('hidden');
        } else {
            clearCompletedTasksButton.classList.remove('hidden');
        }

        if (completedTaskList.children.length < 2) {
            completedTasksContainer.classList.remove('hidden');
            toggleCompletedTasksButton.setAttribute('aria-expanded', 'true');
        } else {
            completedTasksContainer.classList.add('hidden');
            toggleCompletedTasksButton.setAttribute('aria-expanded', 'false');
        }
    }

    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskValue = taskInput.value.trim();
        const taskDesc = taskDescription.value.trim();
        if (taskValue) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ text: taskValue, description: taskDesc, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));

            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <div class="task-content">
                    <span class="task-title">${taskValue}</span>
                    ${taskDesc ? `<p class="task-description">${formatText(taskDesc)}</p>` : ''}
                </div>
                <button class="delete-task-button">Supprimer</button>
                <input type="checkbox" class="task-checkbox">
            `;
            taskList.appendChild(taskItem);

            taskItem.querySelector('.delete-task-button').addEventListener('click', () => {
                deleteTask(taskValue);
            });

            taskInput.value = '';
            taskDescription.value = '';
        }
    });

    taskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('task-checkbox')) {
            const taskItem = e.target.parentElement;
            const taskText = taskItem.querySelector('.task-title').textContent;
            const taskDesc = taskItem.querySelector('.task-description') ? taskItem.querySelector('.task-description').innerHTML : '';
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

            if (e.target.checked) {
                completedTasks.push({ text: taskText, description: taskDesc });
                localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

                const remainingTasks = tasks.filter(task => task.text !== taskText);
                localStorage.setItem('tasks', JSON.stringify(remainingTasks));

                const completedTaskItem = document.createElement('li');
                completedTaskItem.innerHTML = `
                    <div class="task-content">
                        <span class="task-title">${taskText}</span>
                        ${taskDesc ? `<p class="task-description">${taskDesc}</p>` : ''}
                    </div>
                    <button class="delete-task-button">Supprimer</button>
                    <input type="checkbox" class="completed-task-checkbox" checked>
                `;
                completedTaskList.appendChild(completedTaskItem);

                completedTaskItem.querySelector('.delete-task-button').addEventListener('click', () => {
                    deleteCompletedTask(taskText);
                });

                taskItem.remove();

                if (completedTaskList.children.length > 0) {
                    clearCompletedTasksButton.classList.remove('hidden');
                }

                if (completedTaskList.children.length < 2) {
                    completedTasksContainer.classList.remove('hidden');
                    toggleCompletedTasksButton.setAttribute('aria-expanded', 'true');
                }
            }
        }
    });

    completedTaskList.addEventListener('change', (e) => {
        if (e.target.classList.contains('completed-task-checkbox')) {
            const completedTaskItem = e.target.parentElement;
            const taskText = completedTaskItem.querySelector('.task-title').textContent.trim();
            const taskDesc = completedTaskItem.querySelector('.task-description') ? completedTaskItem.querySelector('.task-description').innerHTML : '';
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];

            if (!e.target.checked) {
                tasks.push({ text: taskText, description: taskDesc, completed: false });
                localStorage.setItem('tasks', JSON.stringify(tasks));

                const remainingCompletedTasks = completedTasks.filter(task => task.text !== taskText);
                localStorage.setItem('completedTasks', JSON.stringify(remainingCompletedTasks));

                const taskItem = document.createElement('li');
                taskItem.innerHTML = `
                    <div class="task-content">
                        <span class="task-title">${taskText}</span>
                        ${taskDesc ? `<p class="task-description">${taskDesc}</p>` : ''}
                    </div>
                    <button class="delete-task-button">Supprimer</button>
                    <input type="checkbox" class="task-checkbox">
                `;
                taskList.appendChild(taskItem);

                taskItem.querySelector('.delete-task-button').addEventListener('click', () => {
                    deleteTask(taskText);
                });

                completedTaskItem.remove();

                if (completedTaskList.children.length === 0) {
                    clearCompletedTasksButton.classList.add('hidden');
                }

                if (completedTaskList.children.length < 2) {
                    completedTasksContainer.classList.remove('hidden');
                    toggleCompletedTasksButton.setAttribute('aria-expanded', 'true');
                }
            }
        }
    });

    toggleCompletedTasksButton.addEventListener('click', () => {
        const isExpanded = toggleCompletedTasksButton.getAttribute('aria-expanded') === 'true';
        completedTasksContainer.classList.toggle('hidden', isExpanded);
        toggleCompletedTasksButton.setAttribute('aria-expanded', !isExpanded);
    });

    clearCompletedTasksButton.addEventListener('click', () => {
        if (confirm('Êtes-vous sûr de vouloir vider la liste des tâches accomplies ?')) {
            localStorage.removeItem('completedTasks');
            completedTaskList.innerHTML = '';
            clearCompletedTasksButton.classList.add('hidden');
            completedTasksContainer.classList.remove('hidden');
            toggleCompletedTasksButton.setAttribute('aria-expanded', 'true');
        }
    });

    function deleteTask(taskText) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const updatedTasks = tasks.filter(task => task.text !== taskText);
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
        loadTasks();
    }

    function deleteCompletedTask(taskText) {
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
        const updatedCompletedTasks = completedTasks.filter(task => task.text !== taskText);
        localStorage.setItem('completedTasks', JSON.stringify(updatedCompletedTasks));
        loadTasks();
    }
});
