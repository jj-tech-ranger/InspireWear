document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const sendNotificationBtn = document.getElementById('sendNotificationBtn');
    const sendNotificationModal = document.getElementById('sendNotificationModal');
    const modalClose = document.getElementById('modalClose');
    const cancelSendNotification = document.getElementById('cancelSendNotification');
    const sendNotificationForm = document.getElementById('sendNotificationForm');
    const notificationsList = document.getElementById('notificationsList');
    const searchNotifications = document.getElementById('searchNotifications');
    const filterModule = document.getElementById('filterModule');
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
    const clearFilters = document.getElementById('clearFilters');
    const markAllRead = document.getElementById('markAllRead');
    const archiveSelected = document.getElementById('archiveSelected');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const recipientType = document.getElementById('recipientType');
    const departmentGroup = document.getElementById('departmentGroup');
    const roleGroup = document.getElementById('roleGroup');
    const usersGroup = document.getElementById('usersGroup');
    const scheduleGroup = document.getElementById('scheduleGroup');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredNotifications = [];
    let currentView = 'list';

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/notifications/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('unreadCount').textContent = summary.total_unread;
            document.getElementById('totalUnread').textContent = summary.total_unread;
            document.getElementById('todayNotifications').textContent = summary.today_notifications;
            document.getElementById('urgentNotifications').textContent = summary.urgent_notifications;
            document.getElementById('totalNotifications').textContent = summary.total_notifications;

            // Set default schedule date and time
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('scheduleDate').value = tomorrow.toISOString().split('T')[0];
            document.getElementById('scheduleTime').value = '09:00';

            // Load notifications
            await applyFilters();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Format timestamp to relative time
    function formatRelativeTime(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) {
            return 'Just now';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else {
            return time.toLocaleDateString('en-GB');
        }
    }

    // Get module display name
    function getModuleName(module) {
        const modules = {
            'finance': 'Finance',
            'inventory': 'Inventory',
            'operations': 'Operations',
            'crm': 'Customer CRM',
            'shop': 'Online Shop',
            'system': 'System'
        };
        return modules[module] || module;
    }

    // Get type display name
    function getTypeName(type) {
        const types = {
            'alert': 'Alert',
            'reminder': 'Reminder',
            'approval': 'Approval',
            'update': 'Update',
            'warning': 'Warning',
            'info': 'Information'
        };
        return types[type] || type;
    }

    // Get notification icon
    function getNotificationIcon(module, type) {
        const moduleIcons = {
            'finance': 'fa-dollar-sign',
            'inventory': 'fa-boxes',
            'operations': 'fa-cogs',
            'crm': 'fa-users',
            'shop': 'fa-shopping-cart',
            'system': 'fa-server'
        };

        const typeIcons = {
            'alert': 'fa-exclamation-triangle',
            'reminder': 'fa-clock',
            'approval': 'fa-check-circle',
            'update': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'info': 'fa-info-circle'
        };

        return typeIcons[type] || moduleIcons[module] || 'fa-bell';
    }

    // Apply filters and search
    async function applyFilters() {
        const searchTerm = searchNotifications.value.toLowerCase();
        const moduleFilter = filterModule.value;
        const typeFilter = filterType.value;
        const statusFilter = filterStatus.value;
        const priorityFilter = filterPriority.value;

        const params = new URLSearchParams({
            search: searchTerm,
            module: moduleFilter,
            type: typeFilter,
            status: statusFilter,
            priority: priorityFilter,
        });

        try {
            const notifications = await fetch(`/api/notifications/?${params.toString()}`).then(res => res.json());
            filteredNotifications = notifications;
            currentPage = 1;
            renderNotifications();
            renderPagination();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    // Render notifications
    function renderNotifications() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageNotifications = filteredNotifications.slice(startIndex, endIndex);

        // Update view class
        notificationsList.className = `notifications-list ${currentView === 'grid' ? 'grid-view' : ''}`;

        let html = '';
        pageNotifications.forEach(notification => {
            const icon = getNotificationIcon(notification.module, notification.type);
            const relativeTime = formatRelativeTime(notification.timestamp);
            
            html += `
                <div class="notification-item ${notification.status}" onclick="viewNotificationDetails(${notification.id})">
                    <input type="checkbox" class="notification-checkbox" data-id="${notification.id}" onclick="event.stopPropagation()">
                    <div class="notification-icon ${notification.module}">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div class="notification-content">
                        <div class="notification-header">
                            <h4 class="notification-title">${notification.title}</h4>
                            <div class="notification-meta">
                                <span class="notification-time">${relativeTime}</span>
                                <span class="notification-priority ${notification.priority}">${notification.priority}</span>
                            </div>
                        </div>
                        <p class="notification-message">${notification.message}</p>
                        <div class="notification-footer">
                            <div class="notification-tags">
                                <span class="notification-tag module">${getModuleName(notification.module)}</span>
                                <span class="notification-tag type">${getTypeName(notification.type)}</span>
                                ${notification.tags.map(tag => `<span class="notification-tag">${tag}</span>`).join('')}
                            </div>
                            <div class="notification-actions-inline">
                                ${notification.status === 'unread' ? `
                                    <button class="notification-action-btn" onclick="markAsRead(${notification.id}); event.stopPropagation();" title="Mark as Read">
                                        <i class="fas fa-check"></i>
                                    </button>
                                ` : ''}
                                <button class="notification-action-btn archive" onclick="archiveNotification(${notification.id}); event.stopPropagation();" title="Archive">
                                    <i class="fas fa-archive"></i>
                                </button>
                                <button class="notification-action-btn delete" onclick="deleteNotification(${notification.id}); event.stopPropagation();" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        notificationsList.innerHTML = html;

        // Update pagination info
        const totalNotifications = filteredNotifications.length;
        const showingStart = totalNotifications > 0 ? startIndex + 1 : 0;
        const showingEnd = Math.min(endIndex, totalNotifications);
        
        document.getElementById('showingStart').textContent = showingStart;
        document.getElementById('showingEnd').textContent = showingEnd;
        document.getElementById('totalNotificationsCount').textContent = totalNotifications;
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
        
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages || totalPages === 0;

        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        pageNumbers.innerHTML = paginationHTML;
    }

    // Global functions
    window.goToPage = function(page) {
        currentPage = page;
        renderNotifications();
        renderPagination();
    };

    window.viewNotificationDetails = async function(id) {
        const notification = await fetch(`/api/notifications/${id}/`).then(res => res.json());
        if (notification) {
            showNotificationDetails(notification);
            
            // Mark as read if unread
            if (notification.status === 'unread') {
                markAsRead(id);
            }
        }
    };

    window.markAsRead = async function(id) {
        try {
            const response = await fetch(`/api/notifications/${id}/read/`, { method: 'POST' });
            if (response.ok) {
                await updateSummaryNumbers();
                await applyFilters();
            }
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    window.archiveNotification = async function(id) {
        try {
            const response = await fetch(`/api/notifications/${id}/archive/`, { method: 'POST' });
            if (response.ok) {
                await applyFilters();
                alert('Notification archived successfully!');
            }
        } catch (error) {
            console.error('Error archiving notification:', error);
        }
    };

    window.deleteNotification = async function(id) {
        if (confirm('Are you sure you want to delete this notification?')) {
            try {
                const response = await fetch(`/api/notifications/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await updateSummaryNumbers();
                    await applyFilters();
                    alert('Notification deleted successfully!');
                }
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    };

    // Update summary numbers
    async function updateSummaryNumbers() {
        try {
            const summary = await fetch('/api/notifications/summary/').then(res => res.json());
            document.getElementById('unreadCount').textContent = summary.total_unread;
            document.getElementById('totalUnread').textContent = summary.total_unread;
            document.getElementById('todayNotifications').textContent = summary.today_notifications;
            document.getElementById('urgentNotifications').textContent = summary.urgent_notifications;
            document.getElementById('totalNotifications').textContent = summary.total_notifications;
        } catch (error) {
            console.error('Error updating summary numbers:', error);
        }
    }

    // Show notification details
    function showNotificationDetails(notification) {
        const detailsHtml = `
            <div class="detail-section">
                <h4>Notification Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Title:</span>
                    <span class="detail-value">${notification.title}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Module:</span>
                    <span class="detail-value">${getModuleName(notification.module)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${getTypeName(notification.type)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority:</span>
                    <span class="detail-value notification-priority ${notification.priority}">${notification.priority}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${notification.status}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Sender:</span>
                    <span class="detail-value">${notification.sender}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Timestamp:</span>
                    <span class="detail-value">${new Date(notification.timestamp).toLocaleString('en-GB')}</span>
                </div>
            </div>
            <div class="notification-message-full">
                ${notification.message}
            </div>
            <div class="detail-section">
                <h4>Recipients</h4>
                ${notification.recipients.map(recipient => `<p>${recipient}</p>`).join('')}
            </div>
            <div class="detail-section">
                <h4>Tags</h4>
                <div class="notification-tags">
                    ${notification.tags.map(tag => `<span class="notification-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        let actionsHtml = '';
        if (notification.status === 'unread') {
            actionsHtml += `
                <button class="action-btn mark-read" onclick="markAsRead(${notification.id})">
                    <i class="fas fa-check"></i> Mark as Read
                </button>
            `;
        }
        if (notification.status !== 'archived') {
            actionsHtml += `
                <button class="action-btn archive" onclick="archiveNotification(${notification.id})">
                    <i class="fas fa-archive"></i> Archive
                </button>
            `;
        }
        actionsHtml += `
            <button class="action-btn delete" onclick="deleteNotification(${notification.id})">
                <i class="fas fa-trash"></i> Delete
            </button>
        `;

        document.getElementById('notificationDetailsContent').innerHTML = detailsHtml;
        document.getElementById('notificationActions').innerHTML = actionsHtml;
        document.getElementById('notificationDetailsModal').classList.add('active');
    }

    // Event Listeners
    searchNotifications.addEventListener('input', applyFilters);
    filterModule.addEventListener('change', applyFilters);
    filterType.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterPriority.addEventListener('change', applyFilters);

    clearFilters.addEventListener('click', function() {
        searchNotifications.value = '';
        filterModule.value = '';
        filterType.value = '';
        filterStatus.value = '';
        filterPriority.value = '';
        applyFilters();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentView = this.dataset.view;
            renderNotifications();
        });
    });

    // Pagination navigation
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderNotifications();
            renderPagination();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderNotifications();
            renderPagination();
        }
    });

    // Mark all read functionality
    markAllRead.addEventListener('click', async function() {
        if (confirm(`Mark all unread notifications as read?`)) {
            try {
                const response = await fetch('/api/notifications/read-all/', { method: 'POST' });
                if (response.ok) {
                    await updateSummaryNumbers();
                    await applyFilters();
                    alert('All notifications marked as read!');
                }
            } catch (error) {
                console.error('Error marking all as read:', error);
            }
        }
    });

    // Archive selected functionality
    archiveSelected.addEventListener('click', async function() {
        const selectedCheckboxes = document.querySelectorAll('.notification-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        if (selectedIds.length === 0) {
            alert('Please select notifications to archive.');
            return;
        }

        if (confirm(`Archive ${selectedIds.length} notification(s)?`)) {
            try {
                const response = await fetch('/api/notifications/archive-selected/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedIds }),
                });
                if (response.ok) {
                    await applyFilters();
                    alert('Selected notifications archived successfully!');
                }
            } catch (error) {
                console.error('Error archiving selected:', error);
            }
        }
    });

    // Select all functionality
    selectAll.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.notification-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Recipient type change handler
    recipientType.addEventListener('change', function() {
        const value = this.value;
        
        // Hide all groups first
        departmentGroup.style.display = 'none';
        roleGroup.style.display = 'none';
        usersGroup.style.display = 'none';
        
        // Show relevant group
        if (value === 'department') {
            departmentGroup.style.display = 'block';
        } else if (value === 'role') {
            roleGroup.style.display = 'block';
        } else if (value === 'individual') {
            usersGroup.style.display = 'block';
        }
    });

    // Scheduling radio buttons
    document.querySelectorAll('input[name="scheduling"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'schedule') {
                scheduleGroup.style.display = 'flex';
            } else {
                scheduleGroup.style.display = 'none';
            }
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('financeTheme', newTheme);

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

    // Modal Functions
    sendNotificationBtn.addEventListener('click', function() {
        sendNotificationForm.reset();
        
        // Reset form groups visibility
        departmentGroup.style.display = 'none';
        roleGroup.style.display = 'none';
        usersGroup.style.display = 'none';
        scheduleGroup.style.display = 'none';
        
        sendNotificationModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        sendNotificationModal.classList.remove('active');
    });

    cancelSendNotification.addEventListener('click', function() {
        sendNotificationModal.classList.remove('active');
    });

    sendNotificationForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(sendNotificationForm);
        const newNotification = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/notifications/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNotification),
            });
            if (response.ok) {
                await updateSummaryNumbers();
                await applyFilters();
                sendNotificationModal.classList.remove('active');
                alert('Notification sent successfully!');
            } else {
                alert('Failed to send notification.');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    });

    // Close modals when clicking outside
    sendNotificationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            sendNotificationModal.classList.remove('active');
        }
    });

    document.getElementById('notificationDetailsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Modal close buttons
    document.getElementById('detailsModalClose').addEventListener('click', function() {
        document.getElementById('notificationDetailsModal').classList.remove('active');
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('financeTheme');
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