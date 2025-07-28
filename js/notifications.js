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

    // Sample notifications data for Kenyan clothing store
    const notificationsData = {
        summary: {
            totalUnread: 12,
            todayNotifications: 8,
            urgentNotifications: 3,
            totalNotifications: 156
        },
        notifications: [
            {
                id: 1,
                title: 'Invoice Payment Overdue',
                message: 'Invoice #INV-2025-001 from Rivatex East Africa for KSh 125,000 is 5 days overdue. Please follow up with the supplier.',
                module: 'finance',
                type: 'alert',
                priority: 'urgent',
                status: 'unread',
                timestamp: '2025-01-21T14:30:00Z',
                sender: 'Finance System',
                recipients: ['finance.manager@inspirewear.co.ke'],
                tags: ['payment', 'overdue', 'supplier']
            },
            {
                id: 2,
                title: 'Low Stock Alert - Cotton Fabric',
                message: 'Cotton fabric inventory has dropped below minimum threshold. Current stock: 50 meters. Reorder point: 100 meters.',
                module: 'inventory',
                type: 'warning',
                priority: 'high',
                status: 'unread',
                timestamp: '2025-01-21T13:15:00Z',
                sender: 'Inventory System',
                recipients: ['operations.manager@inspirewear.co.ke'],
                tags: ['inventory', 'low-stock', 'fabric']
            },
            {
                id: 3,
                title: 'New Customer Registration',
                message: 'A new customer "Westgate Boutique" has registered on the online shop. Customer ID: CUST-2025-045.',
                module: 'crm',
                type: 'info',
                priority: 'normal',
                status: 'unread',
                timestamp: '2025-01-21T12:45:00Z',
                sender: 'CRM System',
                recipients: ['sales.manager@inspirewear.co.ke'],
                tags: ['customer', 'registration', 'new']
            },
            {
                id: 4,
                title: 'Production Target Achieved',
                message: 'Daily production target of 200 units has been achieved. Total produced: 215 units. Great work team!',
                module: 'operations',
                type: 'update',
                priority: 'normal',
                status: 'read',
                timestamp: '2025-01-21T11:30:00Z',
                sender: 'Operations System',
                recipients: ['all@inspirewear.co.ke'],
                tags: ['production', 'target', 'achievement']
            },
            {
                id: 5,
                title: 'Expense Approval Required',
                message: 'Expense claim EXP-2025-012 from Mary Wanjiku for KSh 45,000 (Marketing Campaign) requires your approval.',
                module: 'finance',
                type: 'approval',
                priority: 'high',
                status: 'unread',
                timestamp: '2025-01-21T10:15:00Z',
                sender: 'Finance System',
                recipients: ['finance.manager@inspirewear.co.ke'],
                tags: ['expense', 'approval', 'marketing']
            },
            {
                id: 6,
                title: 'System Maintenance Scheduled',
                message: 'Scheduled system maintenance on January 25, 2025 from 2:00 AM to 4:00 AM EAT. All modules will be temporarily unavailable.',
                module: 'system',
                type: 'info',
                priority: 'normal',
                status: 'read',
                timestamp: '2025-01-21T09:00:00Z',
                sender: 'System Administrator',
                recipients: ['all@inspirewear.co.ke'],
                tags: ['maintenance', 'scheduled', 'downtime']
            },
            {
                id: 7,
                title: 'Large Order Received',
                message: 'New order #ORD-2025-089 for 500 units from Nakumatt Supermarkets. Total value: KSh 750,000. Delivery required by February 15.',
                module: 'shop',
                type: 'info',
                priority: 'high',
                status: 'unread',
                timestamp: '2025-01-21T08:30:00Z',
                sender: 'Online Shop',
                recipients: ['sales.manager@inspirewear.co.ke', 'operations.manager@inspirewear.co.ke'],
                tags: ['order', 'large', 'nakumatt']
            },
            {
                id: 8,
                title: 'Payroll Processing Reminder',
                message: 'Monthly payroll processing is due in 3 days. Please ensure all timesheets and expense claims are submitted.',
                module: 'finance',
                type: 'reminder',
                priority: 'normal',
                status: 'read',
                timestamp: '2025-01-21T07:45:00Z',
                sender: 'HR System',
                recipients: ['hr@inspirewear.co.ke', 'finance.manager@inspirewear.co.ke'],
                tags: ['payroll', 'reminder', 'deadline']
            },
            {
                id: 9,
                title: 'Quality Control Issue',
                message: 'Quality control has identified defects in batch #BATCH-2025-015. 25 units affected. Investigation required.',
                module: 'operations',
                type: 'alert',
                priority: 'urgent',
                status: 'unread',
                timestamp: '2025-01-20T16:20:00Z',
                sender: 'QC System',
                recipients: ['operations.manager@inspirewear.co.ke', 'qc.supervisor@inspirewear.co.ke'],
                tags: ['quality', 'defects', 'investigation']
            },
            {
                id: 10,
                title: 'Customer Feedback Received',
                message: 'Positive feedback received from customer "Sarit Centre Boutique" rating our service 5/5 stars.',
                module: 'crm',
                type: 'info',
                priority: 'low',
                status: 'read',
                timestamp: '2025-01-20T15:10:00Z',
                sender: 'CRM System',
                recipients: ['customer.service@inspirewear.co.ke'],
                tags: ['feedback', 'positive', 'rating']
            },
            {
                id: 11,
                title: 'Bank Reconciliation Complete',
                message: 'Bank reconciliation for KCB account ending in 7890 has been completed. All transactions matched successfully.',
                module: 'finance',
                type: 'update',
                priority: 'normal',
                status: 'read',
                timestamp: '2025-01-20T14:30:00Z',
                sender: 'Finance System',
                recipients: ['finance.manager@inspirewear.co.ke'],
                tags: ['reconciliation', 'bank', 'complete']
            },
            {
                id: 12,
                title: 'Equipment Maintenance Due',
                message: 'Sewing machine #SM-005 is due for scheduled maintenance. Please schedule with Industrial Machines Ltd.',
                module: 'operations',
                type: 'reminder',
                priority: 'normal',
                status: 'unread',
                timestamp: '2025-01-20T13:15:00Z',
                sender: 'Maintenance System',
                recipients: ['operations.manager@inspirewear.co.ke'],
                tags: ['maintenance', 'equipment', 'scheduled']
            }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredNotifications = [...notificationsData.notifications];
    let currentView = 'list';

    // Initialize the page
    function initPage() {
        // Set summary numbers
        document.getElementById('unreadCount').textContent = notificationsData.summary.totalUnread;
        document.getElementById('totalUnread').textContent = notificationsData.summary.totalUnread;
        document.getElementById('todayNotifications').textContent = notificationsData.summary.todayNotifications;
        document.getElementById('urgentNotifications').textContent = notificationsData.summary.urgentNotifications;
        document.getElementById('totalNotifications').textContent = notificationsData.summary.totalNotifications;

        // Set default schedule date and time
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('scheduleDate').value = tomorrow.toISOString().split('T')[0];
        document.getElementById('scheduleTime').value = '09:00';

        // Load notifications
        applyFilters();

        // Hide loading overlay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
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
    function applyFilters() {
        const searchTerm = searchNotifications.value.toLowerCase();
        const moduleFilter = filterModule.value;
        const typeFilter = filterType.value;
        const statusFilter = filterStatus.value;
        const priorityFilter = filterPriority.value;

        filteredNotifications = notificationsData.notifications.filter(notification => {
            const matchesSearch = notification.title.toLowerCase().includes(searchTerm) ||
                                notification.message.toLowerCase().includes(searchTerm) ||
                                notification.sender.toLowerCase().includes(searchTerm);
            
            const matchesModule = !moduleFilter || notification.module === moduleFilter;
            const matchesType = !typeFilter || notification.type === typeFilter;
            const matchesStatus = !statusFilter || notification.status === statusFilter;
            const matchesPriority = !priorityFilter || notification.priority === priorityFilter;

            return matchesSearch && matchesModule && matchesType && matchesStatus && matchesPriority;
        });

        // Sort by timestamp (newest first)
        filteredNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        currentPage = 1;
        renderNotifications();
        renderPagination();
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

    window.viewNotificationDetails = function(id) {
        const notification = notificationsData.notifications.find(notif => notif.id === id);
        if (notification) {
            showNotificationDetails(notification);
            
            // Mark as read if unread
            if (notification.status === 'unread') {
                markAsRead(id);
            }
        }
    };

    window.markAsRead = function(id) {
        const notification = notificationsData.notifications.find(notif => notif.id === id);
        if (notification && notification.status === 'unread') {
            notification.status = 'read';
            updateSummaryNumbers();
            applyFilters();
        }
    };

    window.archiveNotification = function(id) {
        const notification = notificationsData.notifications.find(notif => notif.id === id);
        if (notification) {
            notification.status = 'archived';
            applyFilters();
            alert('Notification archived successfully!');
        }
    };

    window.deleteNotification = function(id) {
        if (confirm('Are you sure you want to delete this notification?')) {
            const index = notificationsData.notifications.findIndex(notif => notif.id === id);
            if (index !== -1) {
                notificationsData.notifications.splice(index, 1);
                updateSummaryNumbers();
                applyFilters();
                alert('Notification deleted successfully!');
            }
        }
    };

    // Update summary numbers
    function updateSummaryNumbers() {
        const unreadCount = notificationsData.notifications.filter(n => n.status === 'unread').length;
        const todayCount = notificationsData.notifications.filter(n => {
            const today = new Date().toDateString();
            const notifDate = new Date(n.timestamp).toDateString();
            return notifDate === today;
        }).length;
        const urgentCount = notificationsData.notifications.filter(n => n.priority === 'urgent' && n.status !== 'archived').length;

        notificationsData.summary.totalUnread = unreadCount;
        notificationsData.summary.todayNotifications = todayCount;
        notificationsData.summary.urgentNotifications = urgentCount;
        notificationsData.summary.totalNotifications = notificationsData.notifications.length;

        document.getElementById('unreadCount').textContent = unreadCount;
        document.getElementById('totalUnread').textContent = unreadCount;
        document.getElementById('todayNotifications').textContent = todayCount;
        document.getElementById('urgentNotifications').textContent = urgentCount;
        document.getElementById('totalNotifications').textContent = notificationsData.notifications.length;
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
    markAllRead.addEventListener('click', function() {
        const unreadNotifications = notificationsData.notifications.filter(n => n.status === 'unread');
        if (unreadNotifications.length === 0) {
            alert('No unread notifications to mark as read.');
            return;
        }

        if (confirm(`Mark ${unreadNotifications.length} notification(s) as read?`)) {
            unreadNotifications.forEach(notification => {
                notification.status = 'read';
            });
            updateSummaryNumbers();
            applyFilters();
            alert('All notifications marked as read!');
        }
    });

    // Archive selected functionality
    archiveSelected.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.notification-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        if (selectedIds.length === 0) {
            alert('Please select notifications to archive.');
            return;
        }

        if (confirm(`Archive ${selectedIds.length} notification(s)?`)) {
            selectedIds.forEach(id => {
                const notification = notificationsData.notifications.find(notif => notif.id === id);
                if (notification) {
                    notification.status = 'archived';
                }
            });
            applyFilters();
            alert('Selected notifications archived successfully!');
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

    sendNotificationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newNotification = {
            id: Math.max(...notificationsData.notifications.map(notif => notif.id)) + 1,
            title: document.getElementById('notificationTitle').value,
            message: document.getElementById('notificationMessage').value,
            module: document.getElementById('notificationModule').value,
            type: document.getElementById('notificationType').value,
            priority: document.getElementById('notificationPriority').value,
            status: 'unread',
            timestamp: new Date().toISOString(),
            sender: 'Finance Manager',
            recipients: ['selected.recipients@inspirewear.co.ke'],
            tags: ['manual', 'sent']
        };

        notificationsData.notifications.unshift(newNotification);
        updateSummaryNumbers();
        applyFilters();
        sendNotificationModal.classList.remove('active');
        alert('Notification sent successfully!');
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

