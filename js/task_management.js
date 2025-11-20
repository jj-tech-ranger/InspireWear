document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    // View elements
    const boardViewBtn = document.getElementById('boardViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const boardView = document.getElementById('boardView');
    const listView = document.getElementById('listView');
    
    // Filter elements
    const priorityFilter = document.getElementById('priorityFilter');
    const assigneeFilter = document.getElementById('assigneeFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    // Action buttons
    const addTaskBtn = document.getElementById('addTaskBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Modal elements
    const taskModal = document.getElementById('taskModal');
    const taskModalClose = document.getElementById('taskModalClose');
    const cancelTask = document.getElementById('cancelTask');
    const taskForm = document.getElementById('taskForm');
    const taskModalTitle = document.getElementById('taskModalTitle');
    
    const detailsModal = document.getElementById('detailsModal');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsContent = document.getElementById('detailsContent');
    const markCompleteBtn = document.getElementById('markCompleteBtn');
    const editTaskBtn = document.getElementById('editTaskBtn');
    const deleteTaskBtn = document.getElementById('deleteTaskBtn');
    
    // Form elements
    const taskTitle = document.getElementById('taskTitle');
    const taskDescription = document.getElementById('taskDescription');
    const taskAssignee = document.getElementById('taskAssignee');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskStatus = document.getElementById('taskStatus');
    const taskProgress = document.getElementById('taskProgress');
    const taskTags = document.getElementById('taskTags');
    
    // Board columns
    const todoColumn = document.getElementById('todoColumn');
    const inProgressColumn = document.getElementById('inProgressColumn');
    const reviewColumn = document.getElementById('reviewColumn');
    const completedColumn = document.getElementById('completedColumn');
    
    // Table body
    const tasksTableBody = document.getElementById('tasksTableBody');
    const teamStats = document.getElementById('teamStats');

    // Current filters
    let currentFilters = {
        priority: '',
        assignee: ''
    };

    // Current view mode
    let currentView = 'board';

    // Current edit ID
    let currentEditId = null;
    let currentDetailsId = null;

    // Initialize the page
    async function initPage() {
        try {
            const overview = await fetch('/api/tasks/overview/').then(res => res.json());
            // Set overview numbers
            document.getElementById('totalTasks').textContent = overview.total_tasks;
            document.getElementById('pendingTasks').textContent = overview.pending_tasks;
            document.getElementById('completedToday').textContent = overview.completed_today;
            document.getElementById('productivity').textContent = overview.productivity;

            // Load tasks
            await loadTasks();

            // Load team statistics
            await loadTeamStats();
            await initDistributionChart();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Get initials from name
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Check if date is overdue
    function isOverdue(dateString) {
        const today = new Date();
        const dueDate = new Date(dateString);
        return dueDate < today;
    }

    // Check if date is due soon (within 3 days)
    function isDueSoon(dateString) {
        const today = new Date();
        const dueDate = new Date(dateString);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 3 && diffDays > 0;
    }

    // Filter tasks data
    async function filterTasks() {
        const params = new URLSearchParams(currentFilters);
        return await fetch(`/api/tasks/?${params.toString()}`).then(res => res.json());
    }

    // Load tasks based on current view
    async function loadTasks() {
        if (currentView === 'board') {
            await loadBoardView();
        } else {
            await loadListView();
        }
        updateTaskCounts();
    }

    // Load board view
    async function loadBoardView() {
        const filteredTasks = await filterTasks();
        
        // Clear columns
        todoColumn.innerHTML = '';
        inProgressColumn.innerHTML = '';
        reviewColumn.innerHTML = '';
        completedColumn.innerHTML = '';

        // Group tasks by status
        const tasksByStatus = {
            'todo': [],
            'in-progress': [],
            'review': [],
            'completed': []
        };

        filteredTasks.forEach(task => {
            tasksByStatus[task.status].push(task);
        });

        // Render tasks in each column
        Object.keys(tasksByStatus).forEach(status => {
            const column = document.getElementById(status === 'in-progress' ? 'inProgressColumn' : status + 'Column');
            tasksByStatus[status].forEach(task => {
                const taskCard = createTaskCard(task);
                column.appendChild(taskCard);
            });
        });
    }

    // Create task card for board view
    function createTaskCard(task) {
        const card = document.createElement('div');
        card.className = `task-card ${task.priority}-priority`;
        card.onclick = () => viewTaskDetails(task.id);

        const dueDateClass = isOverdue(task.due_date) ? 'overdue' : isDueSoon(task.due_date) ? 'due-soon' : '';

        card.innerHTML = `
            <div class="task-header">
                <h4 class="task-title">${task.title}</h4>
                <span class="priority-badge ${task.priority}">${task.priority}</span>
            </div>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <div class="task-assignee">
                    <div class="assignee-avatar">${getInitials(task.assignee)}</div>
                    <span>${task.assignee.split(' ')[0]}</span>
                </div>
                <div class="task-due-date ${dueDateClass}">${formatDate(task.due_date)}</div>
            </div>
            <div class="task-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
            </div>
            ${task.tags.length > 0 ? `
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        `;

        return card;
    }

    // Load list view
    async function loadListView() {
        const filteredTasks = await filterTasks();
        let html = '';

        if (filteredTasks.length === 0) {
            html = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No tasks found matching the current filters.
                    </td>
                </tr>
            `;
        } else {
            filteredTasks.forEach(task => {
                const dueDateClass = isOverdue(task.due_date) ? 'overdue' : isDueSoon(task.due_date) ? 'due-soon' : '';
                
                html += `
                    <tr>
                        <td>
                            <div class="task-info">
                                <div class="task-name">${task.title}</div>
                                <div class="task-desc">${task.description}</div>
                            </div>
                        </td>
                        <td>
                            <div class="assignee-info">
                                <div class="assignee-avatar">${getInitials(task.assignee)}</div>
                                <span class="assignee-name">${task.assignee}</span>
                            </div>
                        </td>
                        <td><span class="priority-badge ${task.priority}">${task.priority}</span></td>
                        <td><span class="task-due-date ${dueDateClass}">${formatDate(task.due_date)}</span></td>
                        <td><span class="status-badge ${task.status}">${task.status.replace('-', ' ')}</span></td>
                        <td>
                            <div class="progress-cell">
                                <span class="progress-text">${task.progress}%</span>
                                <div class="progress-bar-small">
                                    <div class="progress-fill-small" style="width: ${task.progress}%"></div>
                                </div>
                            </div>
                        </td>
                        <td>
                            <button class="action-btn view" onclick="viewTaskDetails(${task.id})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="editTask(${task.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteTask(${task.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        }

        tasksTableBody.innerHTML = html;
    }

    // Update task counts in board view
    async function updateTaskCounts() {
        const counts = await fetch('/api/tasks/counts/').then(res => res.json());
        document.getElementById('todoCount').textContent = counts.todo;
        document.getElementById('inProgressCount').textContent = counts.in_progress;
        document.getElementById('reviewCount').textContent = counts.review;
        document.getElementById('completedCount').textContent = counts.completed;
    }

    // Load team statistics
    async function loadTeamStats() {
        const teamMembers = await fetch('/api/team/stats/').then(res => res.json());
        let html = '';
        teamMembers.forEach(member => {
            html += `
                <div class="team-member">
                    <div class="member-info">
                        <div class="member-avatar">${getInitials(member.name)}</div>
                        <span class="member-name">${member.name}</span>
                    </div>
                    <div class="member-stats">
                        <div class="stat-item">
                            <span class="stat-value">${member.tasks_assigned}</span>
                            <span>Assigned</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${member.tasks_completed}</span>
                            <span>Completed</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${member.efficiency}%</span>
                            <span>Efficiency</span>
                        </div>
                    </div>
                </div>
            `;
        });
        teamStats.innerHTML = html;
    }

    // Initialize distribution chart
    async function initDistributionChart() {
        const statusCounts = await fetch('/api/tasks/distribution/').then(res => res.json());
        const ctx = document.getElementById('distributionCanvas').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: [
                        '#6b7280',
                        '#3182ce',
                        '#d69e2e',
                        '#38a169'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }

    // Global functions for onclick handlers
    window.viewTaskDetails = async function(id) {
        const task = await fetch(`/api/tasks/${id}/`).then(res => res.json());
        if (task) {
            currentDetailsId = id;
            detailsModalTitle.textContent = `Task Details - ${task.title}`;
            
            const dueDateClass = isOverdue(task.due_date) ? 'overdue' : isDueSoon(task.due_date) ? 'due-soon' : '';
            
            detailsContent.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Title:</span>
                    <span class="detail-value">${task.title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${task.description}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Assignee:</span>
                    <span class="detail-value">${task.assignee}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Priority:</span>
                    <span class="detail-value"><span class="priority-badge ${task.priority}">${task.priority}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Due Date:</span>
                    <span class="detail-value"><span class="task-due-date ${dueDateClass}">${formatDate(task.due_date)}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status-badge ${task.status}">${task.status.replace('-', ' ')}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Progress:</span>
                    <span class="detail-value">${task.progress}%</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Created:</span>
                    <span class="detail-value">${formatDate(task.created_date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tags:</span>
                    <span class="detail-value">${task.tags.join(', ') || 'No tags'}</span>
                </div>
            `;
            
            detailsModal.classList.add('active');
        }
    };

    window.editTask = async function(id) {
        const task = await fetch(`/api/tasks/${id}/`).then(res => res.json());
        if (task) {
            currentEditId = id;
            taskModalTitle.textContent = 'Edit Task';
            
            // Populate form
            taskTitle.value = task.title;
            taskDescription.value = task.description;
            taskAssignee.value = task.assignee;
            taskPriority.value = task.priority;
            taskDueDate.value = task.due_date;
            taskStatus.value = task.status;
            taskProgress.value = task.progress;
            taskTags.value = task.tags.join(', ');
            
            taskModal.classList.add('active');
        }
    };

    window.deleteTask = async function(id) {
        if (confirm(`Are you sure you want to delete this task? This action cannot be undone.`)) {
            try {
                const response = await fetch(`/api/tasks/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await loadTasks();
                    showNotification('Task deleted successfully!', 'success');
                    await updateOverviewStats();
                } else {
                    showNotification('Failed to delete task.', 'error');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
                showNotification('An error occurred while deleting the task.', 'error');
            }
        }
    };

    // Update overview statistics
    async function updateOverviewStats() {
        const overview = await fetch('/api/tasks/overview/').then(res => res.json());
        document.getElementById('totalTasks').textContent = overview.total_tasks;
        document.getElementById('pendingTasks').textContent = overview.pending_tasks;
        document.getElementById('completedToday').textContent = overview.completed_today;
    }

    // Show notification
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // View toggle event listeners
    boardViewBtn.addEventListener('click', function() {
        currentView = 'board';
        boardViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        boardView.style.display = 'block';
        listView.style.display = 'none';
        loadTasks();
    });

    listViewBtn.addEventListener('click', function() {
        currentView = 'list';
        listViewBtn.classList.add('active');
        boardViewBtn.classList.remove('active');
        listView.style.display = 'block';
        boardView.style.display = 'none';
        loadTasks();
    });

    // Filter event listeners
    priorityFilter.addEventListener('change', function() {
        currentFilters.priority = this.value;
        loadTasks();
    });

    assigneeFilter.addEventListener('change', function() {
        currentFilters.assignee = this.value;
        loadTasks();
    });

    clearFilters.addEventListener('click', function() {
        currentFilters = { priority: '', assignee: '' };
        priorityFilter.value = '';
        assigneeFilter.value = '';
        loadTasks();
        showNotification('Filters cleared', 'info');
    });

    // Action button event listeners
    addTaskBtn.addEventListener('click', function() {
        currentEditId = null;
        taskModalTitle.textContent = 'Add New Task';
        taskForm.reset();
        taskStatus.value = 'todo';
        taskProgress.value = 0;
        taskModal.classList.add('active');
    });

    exportBtn.addEventListener('click', async function() {
        const filteredTasks = await filterTasks();
        const csvContent = generateCSV(filteredTasks);
        downloadCSV(csvContent, 'tasks.csv');
        showNotification('Tasks exported successfully!', 'success');
    });

    // Generate CSV content
    function generateCSV(tasks) {
        let csv = 'Title,Description,Assignee,Priority,Due Date,Status,Progress,Tags,Created Date\n';
        
        tasks.forEach(task => {
            csv += `"${task.title}","${task.description}","${task.assignee}","${task.priority}","${task.due_date}","${task.status}","${task.progress}%","${task.tags.join(', ')}","${task.created_date}"\n`;
        });
        
        return csv;
    }

    // Download CSV file
    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('taskManagementTheme', newTheme);

        const icon = this.querySelector('.theme-icon');
        if (newTheme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    });

    // Profile Dropdown
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        profileDropdown.classList.toggle('show', !isExpanded);
    });

    document.addEventListener('click', function() {
        profileBtn.setAttribute('aria-expanded', 'false');
        profileDropdown.classList.remove('show');
    });

    // Modal event listeners
    taskModalClose.addEventListener('click', function() {
        taskModal.classList.remove('active');
    });

    cancelTask.addEventListener('click', function() {
        taskModal.classList.remove('active');
    });

    detailsModalClose.addEventListener('click', function() {
        detailsModal.classList.remove('active');
    });

    // Form submission
    taskForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            title: taskTitle.value,
            description: taskDescription.value,
            assignee: taskAssignee.value,
            priority: taskPriority.value,
            due_date: taskDueDate.value,
            status: taskStatus.value,
            progress: parseInt(taskProgress.value),
            tags: taskTags.value ? taskTags.value.split(',').map(tag => tag.trim()) : [],
        };

        try {
            let response;
            if (currentEditId) {
                // Edit existing task
                response = await fetch(`/api/tasks/${currentEditId}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                // Add new task
                response = await fetch('/api/tasks/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            if (response.ok) {
                showNotification(currentEditId ? 'Task updated successfully!' : 'Task added successfully!', 'success');
                taskModal.classList.remove('active');
                await loadTasks();
                await updateOverviewStats();
                await loadTeamStats();
            } else {
                showNotification('Failed to save task.', 'error');
            }
        } catch (error) {
            console.error('Error saving task:', error);
            showNotification('An error occurred while saving the task.', 'error');
        }
    });

    // Quick actions in details modal
    markCompleteBtn.addEventListener('click', async function() {
        if (currentDetailsId) {
            try {
                const response = await fetch(`/api/tasks/${currentDetailsId}/complete/`, { method: 'POST' });
                if (response.ok) {
                    detailsModal.classList.remove('active');
                    await loadTasks();
                    await updateOverviewStats();
                    showNotification('Task marked as completed!', 'success');
                } else {
                    showNotification('Failed to mark task as complete.', 'error');
                }
            } catch (error) {
                console.error('Error completing task:', error);
                showNotification('An error occurred while completing the task.', 'error');
            }
        }
    });

    editTaskBtn.addEventListener('click', function() {
        if (currentDetailsId) {
            detailsModal.classList.remove('active');
            editTask(currentDetailsId);
        }
    });

    deleteTaskBtn.addEventListener('click', function() {
        if (currentDetailsId) {
            detailsModal.classList.remove('active');
            deleteTask(currentDetailsId);
        }
    });

    // Close modals when clicking outside
    taskModal.addEventListener('click', function(e) {
        if (e.target === this) {
            taskModal.classList.remove('active');
        }
    });

    detailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            detailsModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('taskManagementTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        const icon = themeToggle.querySelector('.theme-icon');
        if (savedTheme === 'light') {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Show loading overlay initially
    morphOverlay.classList.add('active');

    // Initialize the page
    initPage();
});