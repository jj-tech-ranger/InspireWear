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

    // Sample notifications data for Kenyan clothing store operations
    const notificationsData = {
        overview: {
            totalNotifications: 47,
            unreadNotifications: 12,
            sentToday: 6,
            responseRate: 89
        },
        inbox: [
            {
                id: 1,
                from: 'inventory',
                to: 'operations',
                type: 'alert',
                priority: 'urgent',
                subject: 'Low Stock Alert - Cotton T-Shirts',
                message: 'Critical stock levels detected for cotton t-shirts in Nairobi Central store. Current stock: 15 units. Reorder threshold: 20 units. Immediate restocking required to avoid stockouts.',
                timestamp: '2025-01-21T14:30:00Z',
                status: 'unread',
                tags: ['stock-alert', 'nairobi-central', 'cotton'],
                read: false
            },
            {
                id: 2,
                from: 'finance',
                to: 'operations',
                type: 'update',
                priority: 'high',
                subject: 'Monthly Revenue Report - December 2024',
                message: 'December revenue report is now available. Total revenue: KSh 2,450,000. Notable increase in online sales (35% growth). Detailed breakdown attached for review.',
                timestamp: '2025-01-21T13:15:00Z',
                status: 'unread',
                tags: ['revenue', 'monthly-report', 'december'],
                read: false
            },
            {
                id: 3,
                from: 'online-shop',
                to: 'operations',
                type: 'request',
                priority: 'medium',
                subject: 'Product Photography Request',
                message: 'Need high-quality photos for 25 new arrivals in the spring collection. Please coordinate with the photography team for a session this week.',
                timestamp: '2025-01-21T12:45:00Z',
                status: 'unread',
                tags: ['photography', 'spring-collection', 'new-arrivals'],
                read: false
            },
            {
                id: 4,
                from: 'inventory',
                to: 'operations',
                type: 'update',
                priority: 'medium',
                subject: 'Supplier Delivery Confirmation',
                message: 'Textile supplier from Nairobi has confirmed delivery of cotton fabrics for Wednesday, January 22nd. Expected delivery time: 10:00 AM. Please ensure receiving team is available.',
                timestamp: '2025-01-21T11:20:00Z',
                status: 'read',
                tags: ['supplier', 'delivery', 'cotton-fabric'],
                read: true
            },
            {
                id: 5,
                from: 'finance',
                to: 'operations',
                type: 'reminder',
                priority: 'medium',
                subject: 'Quarterly Tax Filing Due',
                message: 'Reminder: Q4 2024 tax filing is due on January 31st. Please provide all necessary operational expense documentation by January 25th.',
                timestamp: '2025-01-21T10:00:00Z',
                status: 'read',
                tags: ['tax-filing', 'quarterly', 'documentation'],
                read: true
            },
            {
                id: 6,
                from: 'online-shop',
                to: 'operations',
                type: 'alert',
                priority: 'high',
                subject: 'Website Performance Issues',
                message: 'Experiencing slow loading times on the product catalog page. Customer complaints increasing. Technical team needs operational input on peak traffic patterns.',
                timestamp: '2025-01-21T09:30:00Z',
                status: 'unread',
                tags: ['website', 'performance', 'customer-complaints'],
                read: false
            },
            {
                id: 7,
                from: 'inventory',
                to: 'operations',
                type: 'update',
                priority: 'low',
                subject: 'Weekly Inventory Audit Complete',
                message: 'Weekly inventory audit for all stores completed. Overall accuracy: 98.5%. Minor discrepancies found in Mombasa store (3 items). Detailed report available in the system.',
                timestamp: '2025-01-21T08:15:00Z',
                status: 'read',
                tags: ['audit', 'weekly', 'accuracy'],
                read: true
            },
            {
                id: 8,
                from: 'finance',
                to: 'operations',
                type: 'request',
                priority: 'medium',
                subject: 'Budget Approval - Marketing Campaign',
                message: 'Requesting approval for Valentine\'s Day marketing campaign budget: KSh 150,000. Campaign includes social media ads, in-store displays, and promotional materials.',
                timestamp: '2025-01-20T16:45:00Z',
                status: 'unread',
                tags: ['budget', 'marketing', 'valentines'],
                read: false
            },
            {
                id: 9,
                from: 'online-shop',
                to: 'operations',
                type: 'update',
                priority: 'low',
                subject: 'Customer Review Summary',
                message: 'Weekly customer review summary: Average rating 4.6/5. Positive feedback on product quality and delivery speed. Some concerns about sizing accuracy for dresses.',
                timestamp: '2025-01-20T15:30:00Z',
                status: 'read',
                tags: ['reviews', 'customer-feedback', 'quality'],
                read: true
            },
            {
                id: 10,
                from: 'inventory',
                to: 'operations',
                type: 'alert',
                priority: 'urgent',
                subject: 'Damaged Goods Report - Kisumu Store',
                message: 'Significant damage reported in recent shipment to Kisumu store. 12 dresses and 8 shirts affected by water damage during transport. Insurance claim process initiated.',
                timestamp: '2025-01-20T14:20:00Z',
                status: 'unread',
                tags: ['damage', 'kisumu', 'insurance'],
                read: false
            }
        ],
        sent: [
            {
                id: 101,
                from: 'operations',
                to: 'inventory',
                type: 'request',
                priority: 'high',
                subject: 'Urgent Restock Request - Nairobi Westlands',
                message: 'Please prioritize restocking of popular items at Nairobi Westlands store. High demand for cotton t-shirts, denim jeans, and summer dresses. Customer complaints about empty shelves increasing.',
                timestamp: '2025-01-21T15:00:00Z',
                status: 'sent',
                tags: ['restock', 'nairobi-westlands', 'urgent'],
                read: true
            },
            {
                id: 102,
                from: 'operations',
                to: 'finance',
                type: 'update',
                priority: 'medium',
                subject: 'Staff Overtime Report - January',
                message: 'January overtime report submitted. Total overtime hours: 145. Breakdown by store attached. Recommend hiring additional part-time staff for peak periods.',
                timestamp: '2025-01-21T13:30:00Z',
                status: 'sent',
                tags: ['overtime', 'staffing', 'january'],
                read: true
            },
            {
                id: 103,
                from: 'operations',
                to: 'online-shop',
                type: 'alert',
                priority: 'medium',
                subject: 'Store Closure Notification - Eldoret',
                message: 'Eldoret store will be closed for maintenance on January 25th from 9 AM to 2 PM. Please update website to reflect temporary closure and redirect customers to nearby Nakuru store.',
                timestamp: '2025-01-21T11:45:00Z',
                status: 'sent',
                tags: ['closure', 'maintenance', 'eldoret'],
                read: true
            },
            {
                id: 104,
                from: 'operations',
                to: 'inventory',
                type: 'update',
                priority: 'low',
                subject: 'Quality Control Feedback',
                message: 'Recent quality control checks show improvement in fabric quality from new supplier. Customer satisfaction scores increased by 8%. Recommend continuing partnership.',
                timestamp: '2025-01-20T17:15:00Z',
                status: 'sent',
                tags: ['quality-control', 'supplier', 'feedback'],
                read: true
            },
            {
                id: 105,
                from: 'operations',
                to: 'finance',
                type: 'request',
                priority: 'high',
                subject: 'Emergency Repair Budget - Mombasa Store',
                message: 'Requesting emergency budget approval for air conditioning repair at Mombasa store. Estimated cost: KSh 45,000. High temperatures affecting customer comfort and staff productivity.',
                timestamp: '2025-01-20T14:30:00Z',
                status: 'sent',
                tags: ['emergency', 'repair', 'mombasa'],
                read: true
            },
            {
                id: 106,
                from: 'operations',
                to: 'online-shop',
                type: 'update',
                priority: 'medium',
                subject: 'New Product Launch Coordination',
                message: 'Coordinating launch of spring collection on February 1st. All stores will receive inventory by January 28th. Please prepare website updates and promotional materials.',
                timestamp: '2025-01-19T16:00:00Z',
                status: 'sent',
                tags: ['product-launch', 'spring-collection', 'coordination'],
                read: true
            }
        ]
    };

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
    function initPage() {
        // Set overview numbers
        document.getElementById('totalNotifications').textContent = notificationsData.overview.totalNotifications;
        document.getElementById('unreadNotifications').textContent = notificationsData.overview.unreadNotifications;
        document.getElementById('sentToday').textContent = notificationsData.overview.sentToday;
        document.getElementById('responseRate').textContent = notificationsData.overview.responseRate;

        // Load notifications
        loadNotifications();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
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
    function filterNotifications(notifications) {
        return notifications.filter(notification => {
            if (currentFilters.module && notification.from !== currentFilters.module && notification.to !== currentFilters.module) return false;
            if (currentFilters.type && notification.type !== currentFilters.type) return false;
            if (currentFilters.status && notification.status !== currentFilters.status) return false;
            return true;
        });
    }

    // Load notifications
    function loadNotifications() {
        if (currentView === 'inbox') {
            loadInboxNotifications();
        } else {
            loadSentNotifications();
        }
    }

    // Load inbox notifications
    function loadInboxNotifications() {
        const filteredNotifications = filterNotifications(notificationsData.inbox);
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
    function loadSentNotifications() {
        const filteredNotifications = filterNotifications(notificationsData.sent);
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
    window.viewNotificationDetails = function(id) {
        let notification = notificationsData.inbox.find(n => n.id === id);
        if (!notification) {
            notification = notificationsData.sent.find(n => n.id === id);
        }

        if (notification) {
            currentDetailsId = id;
            detailsModalTitle.textContent = `${notification.subject}`;

            const isInbox = notificationsData.inbox.find(n => n.id === id);
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
    function updateOverviewStats() {
        const unreadCount = notificationsData.inbox.filter(n => !n.read).length;
        document.getElementById('unreadNotifications').textContent = unreadCount;

        // Update module unread counts
        const inventoryUnread = notificationsData.inbox.filter(n => n.from === 'inventory' && !n.read).length;
        const financeUnread = notificationsData.inbox.filter(n => n.from === 'finance' && !n.read).length;
        const onlineShopUnread = notificationsData.inbox.filter(n => n.from === 'online-shop' && !n.read).length;

        document.querySelector('.module-card.inventory .unread-count').textContent = inventoryUnread;
        document.querySelector('.module-card.finance .unread-count').textContent = financeUnread;
        document.querySelector('.module-card.online-shop .unread-count').textContent = onlineShopUnread;
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

    markAllReadBtn.addEventListener('click', function() {
        notificationsData.inbox.forEach(notification => {
            notification.read = true;
            notification.status = 'read';
        });
        loadNotifications();
        updateOverviewStats();
        showNotification('All notifications marked as read', 'success');
    });

    refreshBtn.addEventListener('click', function() {
        loadNotifications();
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
    composeForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            id: Date.now(),
            from: 'operations',
            to: recipientModule.value,
            type: notificationType.value,
            priority: priority.value,
            subject: subject.value,
            message: message.value,
            timestamp: new Date().toISOString(),
            status: 'sent',
            tags: tags.value ? tags.value.split(',').map(tag => tag.trim()) : [],
            read: true
        };

        notificationsData.sent.unshift(formData);

        composeModal.classList.remove('active');

        if (currentView === 'sent') {
            loadNotifications();
        }

        showNotification('Notification sent successfully!', 'success');

        // Update sent today count
        const currentSentToday = parseInt(document.getElementById('sentToday').textContent);
        document.getElementById('sentToday').textContent = currentSentToday + 1;
    });

    replyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const originalNotification = notificationsData.inbox.find(n => n.id === currentReplyId);
        if (originalNotification) {
            const replyData = {
                id: Date.now(),
                from: 'operations',
                to: originalNotification.from,
                type: 'update',
                priority: 'medium',
                subject: 'Re: ' + originalNotification.subject,
                message: replyMessage.value,
                timestamp: new Date().toISOString(),
                status: 'sent',
                tags: ['reply', ...originalNotification.tags],
                read: true
            };

            notificationsData.sent.unshift(replyData);
        }

        replyModal.classList.remove('active');

        if (currentView === 'sent') {
            loadNotifications();
        }

        showNotification('Reply sent successfully!', 'success');
    });

    // Quick actions in details modal
    markReadBtn.addEventListener('click', function() {
        if (currentDetailsId) {
            const notification = notificationsData.inbox.find(n => n.id === currentDetailsId);
            if (notification) {
                notification.read = true;
                notification.status = 'read';

                detailsModal.classList.remove('active');
                loadNotifications();
                updateOverviewStats();
                showNotification('Notification marked as read', 'success');
            }
        }
    });

    replyBtn.addEventListener('click', function() {
        if (currentDetailsId) {
            const notification = notificationsData.inbox.find(n => n.id === currentDetailsId);
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

    deleteNotificationBtn.addEventListener('click', function() {
        if (currentDetailsId && confirm('Are you sure you want to delete this notification? This action cannot be undone.')) {
            let index = notificationsData.inbox.findIndex(n => n.id === currentDetailsId);
            if (index !== -1) {
                notificationsData.inbox.splice(index, 1);
            } else {
                index = notificationsData.sent.findIndex(n => n.id === currentDetailsId);
                if (index !== -1) {
                    notificationsData.sent.splice(index, 1);
                }
            }

            detailsModal.classList.remove('active');
            loadNotifications();
            updateOverviewStats();
            showNotification('Notification deleted successfully', 'success');
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
