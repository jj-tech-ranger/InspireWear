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

    // Sample task data for Kenyan clothing store operations
    const tasksData = {
        overview: {
            totalTasks: 24,
            pendingTasks: 8,
            completedToday: 5,
            productivity: 87
        },
        tasks: [
            {
                id: 1,
                title: 'Update inventory for new cotton collection',
                description: 'Add new cotton t-shirts, dresses, and pants to the inventory system with proper SKUs and pricing.',
                assignee: 'Grace Wanjiku',
                priority: 'high',
                dueDate: '2025-01-25',
                status: 'todo',
                progress: 0,
                tags: ['inventory', 'urgent', 'cotton'],
                createdDate: '2025-01-20'
            },
            {
                id: 2,
                title: 'Process customer returns from Nairobi Central',
                description: 'Handle 5 pending returns from our Nairobi Central store, including quality checks and refund processing.',
                assignee: 'John Mwangi',
                priority: 'medium',
                dueDate: '2025-01-23',
                status: 'in-progress',
                progress: 60,
                tags: ['returns', 'customer-service', 'nairobi'],
                createdDate: '2025-01-18'
            },
            {
                id: 3,
                title: 'Prepare monthly sales report for Mombasa store',
                description: 'Compile sales data, analyze trends, and prepare comprehensive report for Mombasa branch performance.',
                assignee: 'Susan Akinyi',
                priority: 'medium',
                dueDate: '2025-01-24',
                status: 'review',
                progress: 85,
                tags: ['reports', 'sales', 'mombasa'],
                createdDate: '2025-01-15'
            },
            {
                id: 4,
                title: 'Staff training on new POS system',
                description: 'Conduct training sessions for all staff members on the new point-of-sale system across all locations.',
                assignee: 'David Omondi',
                priority: 'high',
                dueDate: '2025-01-22',
                status: 'completed',
                progress: 100,
                tags: ['training', 'pos', 'staff'],
                createdDate: '2025-01-10'
            },
            {
                id: 5,
                title: 'Quality check for Kisumu store deliveries',
                description: 'Inspect incoming merchandise at Kisumu store and ensure all items meet quality standards.',
                assignee: 'Mary Njeri',
                priority: 'medium',
                dueDate: '2025-01-26',
                status: 'todo',
                progress: 0,
                tags: ['quality', 'delivery', 'kisumu'],
                createdDate: '2025-01-19'
            },
            {
                id: 6,
                title: 'Update website product catalog',
                description: 'Add new product photos and descriptions to the online store, focusing on the latest fashion trends.',
                assignee: 'Peter Kamau',
                priority: 'low',
                dueDate: '2025-01-28',
                status: 'in-progress',
                progress: 30,
                tags: ['website', 'catalog', 'photos'],
                createdDate: '2025-01-17'
            },
            {
                id: 7,
                title: 'Coordinate with suppliers for fabric delivery',
                description: 'Follow up with textile suppliers in Nairobi for timely delivery of cotton and silk fabrics.',
                assignee: 'Catherine Wanjiku',
                priority: 'high',
                dueDate: '2025-01-21',
                status: 'in-progress',
                progress: 75,
                tags: ['suppliers', 'fabric', 'coordination'],
                createdDate: '2025-01-16'
            },
            {
                id: 8,
                title: 'Plan promotional campaign for Valentine\'s Day',
                description: 'Design and execute marketing campaign for Valentine\'s Day collection across all stores.',
                assignee: 'Grace Wanjiku',
                priority: 'medium',
                dueDate: '2025-02-01',
                status: 'todo',
                progress: 0,
                tags: ['marketing', 'promotion', 'valentines'],
                createdDate: '2025-01-20'
            },
            {
                id: 9,
                title: 'Audit Eldoret store cash registers',
                description: 'Perform monthly audit of all cash registers and payment systems at the Eldoret branch.',
                assignee: 'John Mwangi',
                priority: 'medium',
                dueDate: '2025-01-27',
                status: 'review',
                progress: 90,
                tags: ['audit', 'cash', 'eldoret'],
                createdDate: '2025-01-14'
            },
            {
                id: 10,
                title: 'Customer feedback analysis',
                description: 'Analyze customer feedback from all stores and prepare improvement recommendations.',
                assignee: 'Susan Akinyi',
                priority: 'low',
                dueDate: '2025-01-30',
                status: 'todo',
                progress: 0,
                tags: ['feedback', 'analysis', 'improvement'],
                createdDate: '2025-01-18'
            }
        ],
        teamMembers: [
            { name: 'Grace Wanjiku', tasksAssigned: 6, tasksCompleted: 4, efficiency: 92 },
            { name: 'John Mwangi', tasksAssigned: 5, tasksCompleted: 3, efficiency: 88 },
            { name: 'Susan Akinyi', tasksAssigned: 4, tasksCompleted: 3, efficiency: 95 },
            { name: 'David Omondi', tasksAssigned: 3, tasksCompleted: 2, efficiency: 85 },
            { name: 'Mary Njeri', tasksAssigned: 3, tasksCompleted: 2, efficiency: 90 },
            { name: 'Peter Kamau', tasksAssigned: 2, tasksCompleted: 1, efficiency: 80 },
            { name: 'Catherine Wanjiku', tasksAssigned: 1, tasksCompleted: 1, efficiency: 100 }
        ]
    };

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
    function initPage() {
        // Set overview numbers
        document.getElementById('totalTasks').textContent = tasksData.overview.totalTasks;
        document.getElementById('pendingTasks').textContent = tasksData.overview.pendingTasks;
        document.getElementById('completedToday').textContent = tasksData.overview.completedToday;
        document.getElementById('productivity').textContent = tasksData.overview.productivity;

        // Load tasks
        loadTasks();

        // Load team statistics
        loadTeamStats();
        initDistributionChart();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
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
    function filterTasks() {
        return tasksData.tasks.filter(task => {
            if (currentFilters.priority && task.priority !== currentFilters.priority) return false;
            if (currentFilters.assignee && task.assignee !== currentFilters.assignee) return false;
            return true;
        });
    }

    // Load tasks based on current view
    function loadTasks() {
        if (currentView === 'board') {
            loadBoardView();
        } else {
            loadListView();
        }
        updateTaskCounts();
    }

    // Load board view
    function loadBoardView() {
        const filteredTasks = filterTasks();
        
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

        const dueDateClass = isOverdue(task.dueDate) ? 'overdue' : isDueSoon(task.dueDate) ? 'due-soon' : '';

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
                <div class="task-due-date ${dueDateClass}">${formatDate(task.dueDate)}</div>
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
    function loadListView() {
        const filteredTasks = filterTasks();
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
                const dueDateClass = isOverdue(task.dueDate) ? 'overdue' : isDueSoon(task.dueDate) ? 'due-soon' : '';
                
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
                        <td><span class="task-due-date ${dueDateClass}">${formatDate(task.dueDate)}</span></td>
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
    function updateTaskCounts() {
        const filteredTasks = filterTasks();
        const counts = {
            todo: 0,
            'in-progress': 0,
            review: 0,
            completed: 0
        };

        filteredTasks.forEach(task => {
            counts[task.status]++;
        });

        document.getElementById('todoCount').textContent = counts.todo;
        document.getElementById('inProgressCount').textContent = counts['in-progress'];
        document.getElementById('reviewCount').textContent = counts.review;
        document.getElementById('completedCount').textContent = counts.completed;
    }

    // Load team statistics
    function loadTeamStats() {
        let html = '';
        tasksData.teamMembers.forEach(member => {
            html += `
                <div class="team-member">
                    <div class="member-info">
                        <div class="member-avatar">${getInitials(member.name)}</div>
                        <span class="member-name">${member.name}</span>
                    </div>
                    <div class="member-stats">
                        <div class="stat-item">
                            <span class="stat-value">${member.tasksAssigned}</span>
                            <span>Assigned</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${member.tasksCompleted}</span>
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
    function initDistributionChart() {
        const ctx = document.getElementById('distributionCanvas').getContext('2d');
        
        const statusCounts = {
            'To Do': tasksData.tasks.filter(t => t.status === 'todo').length,
            'In Progress': tasksData.tasks.filter(t => t.status === 'in-progress').length,
            'Review': tasksData.tasks.filter(t => t.status === 'review').length,
            'Completed': tasksData.tasks.filter(t => t.status === 'completed').length
        };

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
    window.viewTaskDetails = function(id) {
        const task = tasksData.tasks.find(t => t.id === id);
        if (task) {
            currentDetailsId = id;
            detailsModalTitle.textContent = `Task Details - ${task.title}`;
            
            const dueDateClass = isOverdue(task.dueDate) ? 'overdue' : isDueSoon(task.dueDate) ? 'due-soon' : '';
            
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
                    <span class="detail-value"><span class="task-due-date ${dueDateClass}">${formatDate(task.dueDate)}</span></span>
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
                    <span class="detail-value">${formatDate(task.createdDate)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tags:</span>
                    <span class="detail-value">${task.tags.join(', ') || 'No tags'}</span>
                </div>
            `;
            
            detailsModal.classList.add('active');
        }
    };

    window.editTask = function(id) {
        const task = tasksData.tasks.find(t => t.id === id);
        if (task) {
            currentEditId = id;
            taskModalTitle.textContent = 'Edit Task';
            
            // Populate form
            taskTitle.value = task.title;
            taskDescription.value = task.description;
            taskAssignee.value = task.assignee;
            taskPriority.value = task.priority;
            taskDueDate.value = task.dueDate;
            taskStatus.value = task.status;
            taskProgress.value = task.progress;
            taskTags.value = task.tags.join(', ');
            
            taskModal.classList.add('active');
        }
    };

    window.deleteTask = function(id) {
        const task = tasksData.tasks.find(t => t.id === id);
        if (task && confirm(`Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`)) {
            const index = tasksData.tasks.findIndex(t => t.id === id);
            if (index !== -1) {
                tasksData.tasks.splice(index, 1);
                loadTasks();
                showNotification('Task deleted successfully!', 'success');
                updateOverviewStats();
            }
        }
    };

    // Update overview statistics
    function updateOverviewStats() {
        const totalTasks = tasksData.tasks.length;
        const pendingTasks = tasksData.tasks.filter(t => t.status !== 'completed').length;
        const completedToday = tasksData.tasks.filter(t => {
            const today = new Date().toISOString().split('T')[0];
            return t.status === 'completed' && t.dueDate === today;
        }).length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('completedToday').textContent = completedToday;
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

    exportBtn.addEventListener('click', function() {
        const csvContent = generateCSV();
        downloadCSV(csvContent, 'tasks.csv');
        showNotification('Tasks exported successfully!', 'success');
    });

    // Generate CSV content
    function generateCSV() {
        let csv = 'Title,Description,Assignee,Priority,Due Date,Status,Progress,Tags,Created Date\n';
        
        const filteredTasks = filterTasks();
        filteredTasks.forEach(task => {
            csv += `"${task.title}","${task.description}","${task.assignee}","${task.priority}","${task.dueDate}","${task.status}","${task.progress}%","${task.tags.join(', ')}","${task.createdDate}"\n`;
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
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            title: taskTitle.value,
            description: taskDescription.value,
            assignee: taskAssignee.value,
            priority: taskPriority.value,
            dueDate: taskDueDate.value,
            status: taskStatus.value,
            progress: parseInt(taskProgress.value),
            tags: taskTags.value ? taskTags.value.split(',').map(tag => tag.trim()) : [],
            createdDate: new Date().toISOString().split('T')[0]
        };

        if (currentEditId) {
            // Edit existing task
            const index = tasksData.tasks.findIndex(t => t.id === currentEditId);
            if (index !== -1) {
                tasksData.tasks[index] = { ...tasksData.tasks[index], ...formData };
                showNotification('Task updated successfully!', 'success');
            }
        } else {
            // Add new task
            const newTask = {
                id: Date.now(),
                ...formData
            };
            tasksData.tasks.unshift(newTask);
            showNotification('Task added successfully!', 'success');
        }

        taskModal.classList.remove('active');
        loadTasks();
        updateOverviewStats();
        loadTeamStats();
    });

    // Quick actions in details modal
    markCompleteBtn.addEventListener('click', function() {
        if (currentDetailsId) {
            const index = tasksData.tasks.findIndex(t => t.id === currentDetailsId);
            if (index !== -1) {
                tasksData.tasks[index].status = 'completed';
                tasksData.tasks[index].progress = 100;
                
                detailsModal.classList.remove('active');
                loadTasks();
                updateOverviewStats();
                showNotification('Task marked as completed!', 'success');
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

