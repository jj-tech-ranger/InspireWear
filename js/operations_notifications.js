document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    // Filter elements
    const moduleFilter = document.getElementById('moduleFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearFilters = document.getElementById('clearFilters');

    // Action buttons
    const composeBtn = document.getElementById('composeBtn');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const refreshBtn = document.getElementById('refreshBtn');

    // View toggle
    const inboxBtn = document.getElementById('inboxBtn');
    const sentBtn = document.getElementById('sentBtn');
    const inboxView = document.getElementById('inboxView');
    const sentView = document.getElementById('sentView');

    // Modal elements
    const composeModal = document.getElementById('composeModal');
    const composeModalClose = document.getElementById('composeModalClose');
    const cancelCompose = document.getElementById('cancelCompose');
    const composeForm = document.getElementById('composeForm');

    const detailsModal = document.getElementById('detailsModal');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsContent = document.getElementById('detailsContent');
    const markReadBtn = document.getElementById('markReadBtn');
    const replyBtn = document.getElementById('replyBtn');
    const deleteNotificationBtn = document.getElementById('deleteNotificationBtn');

    const replyModal = document.getElementById('replyModal');
    const replyModalClose = document.getElementById('replyModalClose');
    const replyModalTitle = document.getElementById('replyModalTitle');
    const originalMessage = document.getElementById('originalMessage');
    const cancelReply = document.getElementById('cancelReply');
    const replyForm = document.getElementById('replyForm');

    // Form elements
    const recipientModule = document.getElementById('recipientModule');
    const notificationType = document.getElementById('notificationType');
    const priority = document.getElementById('priority');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const tags = document.getElementById('tags');
    const replyMessage = document.getElementById('replyMessage');

    // Current filters
    let currentFilters = {
        module: '',
        type: '',
        status: ''
    };

    // Current view
    let currentView = 'inbox';
    let currentDetailsId = null;
    let currentReplyId = null;

    // Initialize the page
    async function initPage() {
        try {
            await updateOverviewStats();
            // Load notifications
            await loadNotifications();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Get module icon
    function getModuleIcon(module) {
        const icons = {
            'inventory': 'fas fa-boxes',
            'finance': 'fas fa-chart-line',
            'online-shop': 'fas fa-shopping-cart',
            'operations': 'fas fa-cogs'
        };
        return icons[module] || 'fas fa-bell';
    }

    // Get module initials
    function getModuleInitials(module) {
        const initials = {
            'inventory': 'IN',
            'finance': 'FN',
            'online-shop': 'OS',
            'operations': 'OP'
        };
        return initials[module] || 'SY';
    }

    // Format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Today ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 2) {
            return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays <= 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
    }

    // Filter notifications
    async function filterNotifications(view) {
        const params = new URLSearchParams({
            view,
            ...currentFilters
        });
        return await fetch(`/api/notifications/operations/?${params.toString()}`).then(res => res.json());
    }

    // Load notifications
    async function loadNotifications() {
        if (currentView === 'inbox') {
            await loadInboxNotifications();
        } else {
            await loadSentNotifications();
        }
    }

    // Load inbox notifications
    async function loadInboxNotifications() {
        const filteredNotifications = await filterNotifications('inbox');
        let html = '';

        if (filteredNotifications.length === 0) {
            html = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h4>No notifications found</h4>
                    <p>No notifications match your current filters.</p>
                </div>
            `;
        } else {
            filteredNotifications.forEach(notification => {
                html += `
                    <div class="notification-item ${notification.read ? 'read' : 'unread'}" onclick="viewNotificationDetails(${notification.id})">
                        <div class="notification-avatar ${notification.from}">
                            ${getModuleInitials(notification.from)}
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <h4 class="notification-title">${notification.subject}</h4>
                                <div class="notification-meta">
                                    <span class="notification-time">${formatTimestamp(notification.timestamp)}</span>
                                    <span class="priority-badge ${notification.priority}">${notification.priority}</span>
                                    <span class="type-badge">${notification.type}</span>
                                </div>
                            </div>
                            <p class="notification-message">${notification.message}</p>
                            <div class="notification-footer">
                                <span class="notification-module">From: ${notification.from.charAt(0).toUpperCase() + notification.from.slice(1).replace('-', ' ')}</span>
                                <div class="notification-tags">
                                    ${notification.tags.map(tag => `<span class="notification-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        inboxView.innerHTML = html;
    }

    // Load sent notifications
    async function loadSentNotifications() {
        const filteredNotifications = await filterNotifications('sent');
        let html = '';

        if (filteredNotifications.length === 0) {
            html = `
                <div class="empty-state">
                    <i class="fas fa-paper-plane"></i>
                    <h4>No sent notifications</h4>
                    <p>You haven't sent any notifications yet.</p>
                </div>
            `;
        } else {
            filteredNotifications.forEach(notification => {
                html += `
                    <div class="notification-item read" onclick="viewNotificationDetails(${notification.id})">
                        <div class="notification-avatar ${notification.to}">
                            ${getModuleInitials(notification.to)}
                        </div>
                        <div class="notification-content">
                            <div class="notification-header">
                                <h4 class="notification-title">${notification.subject}</h4>
                                <div class="notification-meta">
                                    <span class="notification-time">${formatTimestamp(notification.timestamp)}</span>
                                    <span class="priority-badge ${notification.priority}">${notification.priority}</span>
                                    <span class="type-badge">${notification.type}</span>
                                </div>
                            </div>
                            <p class="notification-message">${notification.message}</p>
                            <div class="notification-footer">
                                <span class="notification-module">To: ${notification.to.charAt(0).toUpperCase() + notification.to.slice(1).replace('-', ' ')}</span>
                                <div class="notification-tags">
                                    ${notification.tags.map(tag => `<span class="notification-tag">${tag}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        sentView.innerHTML = html;
    }

    // Global function for viewing notification details
    window.viewNotificationDetails = async function(id) {
        const notification = await fetch(`/api/notifications/operations/${id}/`).then(res => res.json());
        if (notification) {
            currentDetailsId = id;
            detailsModalTitle.textContent = `${notification.subject}`;

            const isInbox = notification.to === 'operations';
            const direction = isInbox ? 'From' : 'To';
            const module = isInbox ? notification.from : notification.to;

            detailsContent.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">${direction}:</span>
                    <span class="detail-value">${module.charAt(0).toUpperCase() + module.slice(1).replace('-', ' ')}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value"><span class="type-badge">${notification.type}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Priority:</span>
                    <span class="detail-value"><span class="priority-badge ${notification.priority}">${notification.priority}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Time:</span>
                    <span class="detail-value">${formatTimestamp(notification.timestamp)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${notification.read ? 'Read' : 'Unread'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Message:</span>
                    <span class="detail-value">${notification.message}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Tags:</span>
                    <span class="detail-value">${notification.tags.join(', ')}</span>
                </div>
            `;

            // Show/hide action buttons based on notification type
            if (isInbox) {
                markReadBtn.style.display = notification.read ? 'none' : 'flex';
                replyBtn.style.display = 'flex';
            } else {
                markReadBtn.style.display = 'none';
                replyBtn.style.display = 'none';
            }

            detailsModal.classList.add('active');
        }
    };

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

    // Update overview stats
    async function updateOverviewStats() {
        const overview = await fetch('/api/notifications/operations/overview/').then(res => res.json());
        document.getElementById('totalNotifications').textContent = overview.total_notifications;
        document.getElementById('unreadNotifications').textContent = overview.unread_notifications;
        document.getElementById('sentToday').textContent = overview.sent_today;
        document.getElementById('responseRate').textContent = overview.response_rate;

        // Update module unread counts
        document.querySelector('.module-card.inventory .unread-count').textContent = overview.inventory_unread;
        document.querySelector('.module-card.finance .unread-count').textContent = overview.finance_unread;
        document.querySelector('.module-card.online-shop .unread-count').textContent = overview.online_shop_unread;
    }

    // View toggle event listeners
    inboxBtn.addEventListener('click', function() {
        currentView = 'inbox';
        inboxBtn.classList.add('active');
        sentBtn.classList.remove('active');
        inboxView.style.display = 'block';
        sentView.style.display = 'none';
        loadNotifications();
    });

    sentBtn.addEventListener('click', function() {
        currentView = 'sent';
        sentBtn.classList.add('active');
        inboxBtn.classList.remove('active');
        sentView.style.display = 'block';
        inboxView.style.display = 'none';
        loadNotifications();
    });

    // Filter event listeners
    moduleFilter.addEventListener('change', function() {
        currentFilters.module = this.value;
        loadNotifications();
    });

    typeFilter.addEventListener('change', function() {
        currentFilters.type = this.value;
        loadNotifications();
    });

    statusFilter.addEventListener('change', function() {
        currentFilters.status = this.value;
        loadNotifications();
    });

    clearFilters.addEventListener('click', function() {
        currentFilters = { module: '', type: '', status: '' };
        moduleFilter.value = '';
        typeFilter.value = '';
        statusFilter.value = '';
        loadNotifications();
        showNotification('Filters cleared', 'info');
    });

    // Action button event listeners
    composeBtn.addEventListener('click', function() {
        composeForm.reset();
        composeModal.classList.add('active');
    });

    markAllReadBtn.addEventListener('click', async function() {
        try {
            const response = await fetch('/api/notifications/operations/mark-all-read/', { method: 'POST' });
            if (response.ok) {
                await loadNotifications();
                await updateOverviewStats();
                showNotification('All notifications marked as read', 'success');
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    });

    refreshBtn.addEventListener('click', async function() {
        await loadNotifications();
        showNotification('Notifications refreshed', 'info');
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('notificationsTheme', newTheme);

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
    composeModalClose.addEventListener('click', function() {
        composeModal.classList.remove('active');
    });

    cancelCompose.addEventListener('click', function() {
        composeModal.classList.remove('active');
    });

    detailsModalClose.addEventListener('click', function() {
        detailsModal.classList.remove('active');
    });

    replyModalClose.addEventListener('click', function() {
        replyModal.classList.remove('active');
    });

    cancelReply.addEventListener('click', function() {
        replyModal.classList.remove('active');
    });

    // Form submissions
    composeForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            to: recipientModule.value,
            type: notificationType.value,
            priority: priority.value,
            subject: subject.value,
            message: message.value,
            tags: tags.value ? tags.value.split(',').map(tag => tag.trim()) : [],
        };

        try {
            const response = await fetch('/api/notifications/operations/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                composeModal.classList.remove('active');
                if (currentView === 'sent') {
                    await loadNotifications();
                }
                showNotification('Notification sent successfully!', 'success');
                await updateOverviewStats();
            } else {
                showNotification('Failed to send notification.', 'error');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            showNotification('An error occurred while sending the notification.', 'error');
        }
    });

    replyForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const replyData = {
            message: replyMessage.value,
        };

        try {
            const response = await fetch(`/api/notifications/operations/${currentReplyId}/reply/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(replyData),
            });
            if (response.ok) {
                replyModal.classList.remove('active');
                if (currentView === 'sent') {
                    await loadNotifications();
                }
                showNotification('Reply sent successfully!', 'success');
            } else {
                showNotification('Failed to send reply.', 'error');
            }
        } catch (error) {
            console.error('Error sending reply:', error);
            showNotification('An error occurred while sending the reply.', 'error');
        }
    });

    // Quick actions in details modal
    markReadBtn.addEventListener('click', async function() {
        if (currentDetailsId) {
            try {
                const response = await fetch(`/api/notifications/operations/${currentDetailsId}/read/`, { method: 'POST' });
                if (response.ok) {
                    detailsModal.classList.remove('active');
                    await loadNotifications();
                    await updateOverviewStats();
                    showNotification('Notification marked as read', 'success');
                }
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
    });

    replyBtn.addEventListener('click', async function() {
        if (currentDetailsId) {
            const notification = await fetch(`/api/notifications/operations/${currentDetailsId}/`).then(res => res.json());
            if (notification) {
                currentReplyId = currentDetailsId;
                replyModalTitle.textContent = `Reply to: ${notification.subject}`;

                originalMessage.innerHTML = `
                    <h5>Original Message from ${notification.from.charAt(0).toUpperCase() + notification.from.slice(1).replace('-', ' ')}:</h5>
                    <p>${notification.message}</p>
                `;

                replyMessage.value = '';
                detailsModal.classList.remove('active');
                replyModal.classList.add('active');
            }
        }
    });

    deleteNotificationBtn.addEventListener('click', async function() {
        if (currentDetailsId && confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
            try {
                const response = await fetch(`/api/notifications/operations/${currentDetailsId}/`, { method: 'DELETE' });
                if (response.ok) {
                    detailsModal.classList.remove('active');
                    await loadNotifications();
                    await updateOverviewStats();
                    showNotification('Notification deleted successfully', 'success');
                }
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    });

    // Close modals when clicking outside
    composeModal.addEventListener('click', function(e) {
        if (e.target === this) {
            composeModal.classList.remove('active');
        }
    });

    detailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            detailsModal.classList.remove('active');
        }
    });

    replyModal.addEventListener('click', function(e) {
        if (e.target === this) {
            replyModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('notificationsTheme');
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