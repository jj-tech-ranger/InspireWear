document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const moduleFilter = document.getElementById('moduleFilter');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const markAllReadBtn = document.getElementById('markAllReadBtn');
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const notificationsList = document.getElementById('notificationsList');
    const unreadNotificationsList = document.getElementById('unreadNotificationsList');
    const urgentNotificationsList = document.getElementById('urgentNotificationsList');
    const composeForm = document.getElementById('composeForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const notificationModal = document.getElementById('notificationModal');
    const modalClose = document.getElementById('modalClose');
    const closeNotificationModal = document.getElementById('closeNotificationModal');
    const markAsReadBtn = document.getElementById('markAsReadBtn');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');

    // Sample notifications data with cross-module context
    const notificationsData = {
        totalNotifications: 47,
        unreadNotifications: 8,
        urgentNotifications: 3,
        systemAlerts: 5,
        notifications: [
            {
                id: 1,
                title: 'Low Stock Alert: Kitenge Print Dress',
                message: 'Stock level for Kitenge Print Dress has fallen below minimum threshold (5 units). Current stock: 3 units. Please reorder immediately.',
                module: 'inventory',
                type: 'alert',
                priority: 'urgent',
                isRead: false,
                timestamp: '2025-01-21 14:30:00',
                sender: 'Inventory System',
                recipient: 'Inventory Manager',
                relatedData: {
                    productId: 'KPD-001',
                    currentStock: 3,
                    minimumThreshold: 5
                }
            },
            {
                id: 2,
                title: 'Payment Overdue: Supplier Invoice #INV-2025-045',
                message: 'Payment for Nairobi Textile Mills invoice #INV-2025-045 (KSh 207,640) is overdue by 5 days. Please process payment to maintain good supplier relationship.',
                module: 'finance',
                type: 'warning',
                priority: 'high',
                isRead: false,
                timestamp: '2025-01-21 13:15:00',
                sender: 'Finance System',
                recipient: 'Finance Manager',
                relatedData: {
                    invoiceId: 'INV-2025-045',
                    amount: 207640,
                    daysOverdue: 5,
                    supplier: 'Nairobi Textile Mills'
                }
            },
            {
                id: 3,
                title: 'New Customer Registration',
                message: 'A new customer "Amara Boutique" from Westlands, Nairobi has registered on the online shop. Customer ID: CUST-2025-156. Please review and approve.',
                module: 'crm',
                type: 'info',
                priority: 'medium',
                isRead: false,
                timestamp: '2025-01-21 12:45:00',
                sender: 'CRM System',
                recipient: 'Customer Service',
                relatedData: {
                    customerId: 'CUST-2025-156',
                    customerName: 'Amara Boutique',
                    location: 'Westlands, Nairobi'
                }
            },
            {
                id: 4,
                title: 'Production Schedule Update',
                message: 'Production schedule for Week 4 has been updated. New delivery date for Order #ORD-2025-001 moved to January 28th due to fabric delay.',
                module: 'operations',
                type: 'update',
                priority: 'medium',
                isRead: true,
                timestamp: '2025-01-21 11:20:00',
                sender: 'Operations Manager',
                recipient: 'All Departments',
                relatedData: {
                    orderId: 'ORD-2025-001',
                    newDeliveryDate: '2025-01-28',
                    reason: 'Fabric delay'
                }
            },
            {
                id: 5,
                title: 'System Maintenance Scheduled',
                message: 'Scheduled system maintenance on January 25th from 2:00 AM to 4:00 AM EAT. All modules will be temporarily unavailable during this period.',
                module: 'system',
                type: 'info',
                priority: 'medium',
                isRead: true,
                timestamp: '2025-01-21 10:00:00',
                sender: 'System Administrator',
                recipient: 'All Users',
                relatedData: {
                    maintenanceDate: '2025-01-25',
                    startTime: '02:00',
                    endTime: '04:00',
                    timezone: 'EAT'
                }
            },
            {
                id: 6,
                title: 'High Order Volume Alert',
                message: 'Online shop experiencing 300% increase in orders today. Current orders: 45. Consider increasing production capacity and inventory levels.',
                module: 'shop',
                type: 'alert',
                priority: 'urgent',
                isRead: false,
                timestamp: '2025-01-21 09:30:00',
                sender: 'Shop Analytics',
                recipient: 'Operations Team',
                relatedData: {
                    todayOrders: 45,
                    percentageIncrease: 300,
                    averageDailyOrders: 15
                }
            },
            {
                id: 7,
                title: 'Quality Control Issue',
                message: 'Quality control has flagged 12 units of Safari Cargo Pants from Batch #SCB-2025-003 due to stitching defects. Please review and take corrective action.',
                module: 'operations',
                type: 'warning',
                priority: 'high',
                isRead: false,
                timestamp: '2025-01-21 08:45:00',
                sender: 'Quality Control',
                recipient: 'Production Manager',
                relatedData: {
                    productName: 'Safari Cargo Pants',
                    batchId: 'SCB-2025-003',
                    defectiveUnits: 12,
                    issueType: 'Stitching defects'
                }
            },
            {
                id: 8,
                title: 'Monthly Sales Report Ready',
                message: 'December 2024 sales report has been generated and is ready for review. Total sales: KSh 2,845,600. Download from Finance module.',
                module: 'finance',
                type: 'info',
                priority: 'low',
                isRead: true,
                timestamp: '2025-01-21 08:00:00',
                sender: 'Finance System',
                recipient: 'Management Team',
                relatedData: {
                    reportPeriod: 'December 2024',
                    totalSales: 2845600,
                    reportType: 'Monthly Sales'
                }
            },
            {
                id: 9,
                title: 'Supplier Delivery Confirmation',
                message: 'Mombasa Leather Works has confirmed delivery of Order #ORD-2025-002 scheduled for January 23rd. 25 units of Leather Sandals.',
                module: 'inventory',
                type: 'update',
                priority: 'low',
                isRead: true,
                timestamp: '2025-01-21 07:15:00',
                sender: 'Supplier Portal',
                recipient: 'Inventory Team',
                relatedData: {
                    orderId: 'ORD-2025-002',
                    supplier: 'Mombasa Leather Works',
                    deliveryDate: '2025-01-23',
                    quantity: 25,
                    product: 'Leather Sandals'
                }
            },
            {
                id: 10,
                title: 'Customer Feedback Alert',
                message: 'Customer "Jane Wanjiku" left a 5-star review for Maasai Beaded Necklace: "Beautiful craftsmanship and authentic design. Highly recommended!"',
                module: 'crm',
                type: 'info',
                priority: 'low',
                isRead: true,
                timestamp: '2025-01-20 18:30:00',
                sender: 'Review System',
                recipient: 'Customer Service',
                relatedData: {
                    customerName: 'Jane Wanjiku',
                    productName: 'Maasai Beaded Necklace',
                    rating: 5,
                    reviewText: 'Beautiful craftsmanship and authentic design. Highly recommended!'
                }
            },
            {
                id: 11,
                title: 'Inventory Reorder Reminder',
                message: 'Reminder: 5 products are approaching reorder point. Review inventory levels and place orders with suppliers to avoid stockouts.',
                module: 'inventory',
                type: 'reminder',
                priority: 'medium',
                isRead: false,
                timestamp: '2025-01-20 16:00:00',
                sender: 'Inventory System',
                recipient: 'Inventory Manager',
                relatedData: {
                    productsCount: 5,
                    action: 'Review and reorder'
                }
            },
            {
                id: 12,
                title: 'Database Backup Completed',
                message: 'Daily database backup completed successfully at 3:00 AM EAT. Backup size: 2.4 GB. All data is secure and recoverable.',
                module: 'system',
                type: 'info',
                priority: 'low',
                isRead: true,
                timestamp: '2025-01-20 03:00:00',
                sender: 'Backup System',
                recipient: 'System Administrator',
                relatedData: {
                    backupTime: '03:00 EAT',
                    backupSize: '2.4 GB',
                    status: 'Successful'
                }
            }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredNotifications = [...notificationsData.notifications];
    let currentTab = 'all';
    let currentNotificationForModal = null;

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalNotifications').textContent = formatNumber(notificationsData.totalNotifications);
        document.getElementById('unreadNotifications').textContent = formatNumber(notificationsData.unreadNotifications);
        document.getElementById('urgentNotifications').textContent = formatNumber(notificationsData.urgentNotifications);
        document.getElementById('systemAlerts').textContent = formatNumber(notificationsData.systemAlerts);

        // Update badge counts
        updateBadgeCounts();

        // Load notifications
        loadNotifications();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Update badge counts in tabs
    function updateBadgeCounts() {
        const unreadCount = notificationsData.notifications.filter(n => !n.isRead).length;
        const urgentCount = notificationsData.notifications.filter(n => n.priority === 'urgent' && !n.isRead).length;

        document.querySelector('[data-tab="unread"] .badge').textContent = unreadCount;
        document.querySelector('[data-tab="urgent"] .badge').textContent = urgentCount;

        // Update overview cards
        notificationsData.unreadNotifications = unreadCount;
        notificationsData.urgentNotifications = urgentCount;
        document.getElementById('unreadNotifications').textContent = formatNumber(unreadCount);
        document.getElementById('urgentNotifications').textContent = formatNumber(urgentCount);
    }

    // Load notifications based on current tab and filters
    function loadNotifications() {
        let notifications = [...notificationsData.notifications];

        // Apply tab filter
        if (currentTab === 'unread') {
            notifications = notifications.filter(n => !n.isRead);
        } else if (currentTab === 'urgent') {
            notifications = notifications.filter(n => n.priority === 'urgent');
        }

        // Apply additional filters
        const moduleValue = moduleFilter.value;
        const typeValue = typeFilter.value;
        const dateValue = dateFilter.value;

        if (moduleValue) {
            notifications = notifications.filter(n => n.module === moduleValue);
        }

        if (typeValue) {
            notifications = notifications.filter(n => n.type === typeValue);
        }

        if (dateValue) {
            notifications = notifications.filter(n => n.timestamp.startsWith(dateValue));
        }

        filteredNotifications = notifications;
        currentPage = 1;

        if (currentTab === 'all') {
            renderNotificationsList(notificationsList);
        } else if (currentTab === 'unread') {
            renderNotificationsList(unreadNotificationsList);
        } else if (currentTab === 'urgent') {
            renderNotificationsList(urgentNotificationsList);
        }
    }

    // Render notifications list
    function renderNotificationsList(container) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageNotifications = filteredNotifications.slice(startIndex, endIndex);

        if (pageNotifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h3>No notifications found</h3>
                    <p>There are no notifications matching your current filters.</p>
                </div>
            `;
            return;
        }

        let html = '';

        pageNotifications.forEach(notification => {
            const timeAgo = getTimeAgo(notification.timestamp);
            const unreadClass = !notification.isRead ? 'unread' : '';
            const urgentClass = notification.priority === 'urgent' ? 'urgent' : '';
            
            html += `
                <div class="notification-item ${unreadClass} ${urgentClass}" data-id="${notification.id}">
                    <div class="notification-header">
                        <div class="notification-info">
                            <h4 class="notification-title">${notification.title}</h4>
                            <div class="notification-meta">
                                <span class="notification-module ${notification.module}">${notification.module}</span>
                                <span class="notification-type ${notification.type}">${notification.type}</span>
                                <span class="notification-time">${timeAgo}</span>
                            </div>
                        </div>
                        <div class="notification-actions">
                            <input type="checkbox" class="notification-checkbox" data-id="${notification.id}">
                            <button class="notification-action-btn mark-read-btn" data-id="${notification.id}" title="${notification.isRead ? 'Mark as Unread' : 'Mark as Read'}">
                                <i class="fas ${notification.isRead ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                            </button>
                            <button class="notification-action-btn delete delete-btn" data-id="${notification.id}" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="notification-priority ${notification.priority}">${notification.priority}</div>
                    <p class="notification-message">${notification.message}</p>
                </div>
            `;
        });

        container.innerHTML = html;
        
        if (currentTab === 'all') {
            updatePagination();
        }
        
        attachNotificationEventListeners();
    }

    // Get time ago string
    function getTimeAgo(timestamp) {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h ago`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return notificationTime.toLocaleDateString('en-GB');
    }

    // Attach event listeners to notification items
    function attachNotificationEventListeners() {
        // Notification item click to view details
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (e.target.closest('.notification-actions')) return;
                
                const notificationId = parseInt(this.dataset.id);
                viewNotificationDetails(notificationId);
            });
        });

        // Mark as read/unread buttons
        document.querySelectorAll('.mark-read-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationId = parseInt(this.dataset.id);
                toggleReadStatus(notificationId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationId = parseInt(this.dataset.id);
                deleteNotification(notificationId);
            });
        });
    }

    // View notification details in modal
    function viewNotificationDetails(notificationId) {
        const notification = notificationsData.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        currentNotificationForModal = notification;

        document.getElementById('notificationModalTitle').textContent = notification.title;
        
        const modalContent = document.getElementById('notificationModalContent');
        modalContent.innerHTML = `
            <div class="notification-details-content">
                <div class="details-section">
                    <h4>Notification Information</h4>
                    <div class="details-grid">
                        <div class="details-item">
                            <label>Module:</label>
                            <span class="notification-module ${notification.module}">${notification.module}</span>
                        </div>
                        <div class="details-item">
                            <label>Type:</label>
                            <span class="notification-type ${notification.type}">${notification.type}</span>
                        </div>
                        <div class="details-item">
                            <label>Priority:</label>
                            <span class="notification-priority ${notification.priority}">${notification.priority}</span>
                        </div>
                        <div class="details-item">
                            <label>Status:</label>
                            <span>${notification.isRead ? 'Read' : 'Unread'}</span>
                        </div>
                        <div class="details-item">
                            <label>Sender:</label>
                            <span>${notification.sender}</span>
                        </div>
                        <div class="details-item">
                            <label>Recipient:</label>
                            <span>${notification.recipient}</span>
                        </div>
                        <div class="details-item">
                            <label>Timestamp:</label>
                            <span>${formatTimestamp(notification.timestamp)}</span>
                        </div>
                        <div class="details-item full-width">
                            <label>Message:</label>
                            <span>${notification.message}</span>
                        </div>
                    </div>
                </div>
                
                ${notification.relatedData ? `
                <div class="details-section">
                    <h4>Related Data</h4>
                    <div class="details-grid">
                        ${Object.entries(notification.relatedData).map(([key, value]) => `
                            <div class="details-item">
                                <label>${formatKey(key)}:</label>
                                <span>${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        // Update mark as read button
        markAsReadBtn.textContent = notification.isRead ? 'Mark as Unread' : 'Mark as Read';
        markAsReadBtn.innerHTML = `<i class="fas ${notification.isRead ? 'fa-envelope' : 'fa-envelope-open'}"></i> ${notification.isRead ? 'Mark as Unread' : 'Mark as Read'}`;

        notificationModal.classList.add('active');

        // Mark as read when viewing (if not already read)
        if (!notification.isRead) {
            toggleReadStatus(notificationId);
        }
    }

    // Format timestamp
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Format object key for display
    function formatKey(key) {
        return key.replace(/([A-Z])/g, ' $1')
                 .replace(/^./, str => str.toUpperCase())
                 .replace(/Id$/, ' ID');
    }

    // Toggle read status
    function toggleReadStatus(notificationId) {
        const notification = notificationsData.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        notification.isRead = !notification.isRead;
        updateBadgeCounts();
        loadNotifications();
    }

    // Delete notification
    function deleteNotification(notificationId) {
        if (confirm('Are you sure you want to delete this notification?')) {
            const index = notificationsData.notifications.findIndex(n => n.id === notificationId);
            if (index !== -1) {
                notificationsData.notifications.splice(index, 1);
                notificationsData.totalNotifications--;
                
                document.getElementById('totalNotifications').textContent = formatNumber(notificationsData.totalNotifications);
                updateBadgeCounts();
                loadNotifications();
            }
        }
    }

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredNotifications.length);

        // Update pagination info
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredNotifications.length} notifications`;

        // Update pagination buttons
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;

        // Generate page numbers
        generatePageNumbers(totalPages);
    }

    // Generate page numbers
    function generatePageNumbers(totalPages) {
        let html = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        pageNumbers.innerHTML = html;

        // Attach page number event listeners
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.dataset.page);
                loadNotifications();
            });
        });
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('inventoryTheme', newTheme);

        // Update icon
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

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        profileBtn.setAttribute('aria-expanded', 'false');
        profileDropdown.classList.remove('show');
    });

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(tabId + 'Tab').classList.add('active');
            
            currentTab = tabId;
            
            if (tabId !== 'compose') {
                loadNotifications();
            }
        });
    });

    // Filter event listeners
    moduleFilter.addEventListener('change', loadNotifications);
    typeFilter.addEventListener('change', loadNotifications);
    dateFilter.addEventListener('change', loadNotifications);

    // Mark all as read
    markAllReadBtn.addEventListener('click', function() {
        if (confirm('Mark all notifications as read?')) {
            notificationsData.notifications.forEach(n => n.isRead = true);
            updateBadgeCounts();
            loadNotifications();
        }
    });

    // Delete selected notifications
    deleteSelectedBtn.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.notification-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select notifications to delete.');
            return;
        }

        if (confirm(`Delete ${selectedCheckboxes.length} selected notification(s)?`)) {
            selectedCheckboxes.forEach(checkbox => {
                const notificationId = parseInt(checkbox.dataset.id);
                const index = notificationsData.notifications.findIndex(n => n.id === notificationId);
                if (index !== -1) {
                    notificationsData.notifications.splice(index, 1);
                    notificationsData.totalNotifications--;
                }
            });
            
            document.getElementById('totalNotifications').textContent = formatNumber(notificationsData.totalNotifications);
            updateBadgeCounts();
            loadNotifications();
        }
    });

    // Refresh notifications
    refreshBtn.addEventListener('click', function() {
        // Simulate refresh with loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        setTimeout(() => {
            loadNotifications();
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
            refreshBtn.disabled = false;
        }, 1000);
    });

    // Pagination event listeners
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadNotifications();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadNotifications();
        }
    });

    // Modal event listeners
    modalClose.addEventListener('click', function() {
        notificationModal.classList.remove('active');
    });

    closeNotificationModal.addEventListener('click', function() {
        notificationModal.classList.remove('active');
    });

    markAsReadBtn.addEventListener('click', function() {
        if (currentNotificationForModal) {
            toggleReadStatus(currentNotificationForModal.id);
            notificationModal.classList.remove('active');
        }
    });

    // Compose form submission
    composeForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newNotification = {
            id: Date.now(),
            title: document.getElementById('notificationTitle').value,
            message: document.getElementById('notificationMessage').value,
            module: document.getElementById('recipientModule').value,
            type: document.getElementById('notificationType').value,
            priority: document.getElementById('priority').value,
            isRead: false,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            sender: 'Current User',
            recipient: document.getElementById('recipientModule').value === 'all' ? 'All Modules' : document.getElementById('recipientModule').value,
            relatedData: null
        };

        const scheduleDate = document.getElementById('scheduleDate').value;
        if (scheduleDate) {
            newNotification.timestamp = scheduleDate.replace('T', ' ');
        }

        notificationsData.notifications.unshift(newNotification);
        notificationsData.totalNotifications++;
        
        if (!newNotification.isRead) {
            notificationsData.unreadNotifications++;
        }
        
        if (newNotification.priority === 'urgent') {
            notificationsData.urgentNotifications++;
        }
        
        // Update overview numbers
        document.getElementById('totalNotifications').textContent = formatNumber(notificationsData.totalNotifications);
        updateBadgeCounts();
        
        // Switch to all notifications tab and reload
        tabBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-tab="all"]').classList.add('active');
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById('allTab').classList.add('active');
        currentTab = 'all';
        
        loadNotifications();
        this.reset();
        alert('Notification sent successfully!');
    });

    // Save draft functionality
    saveDraftBtn.addEventListener('click', function() {
        const draftData = {
            title: document.getElementById('notificationTitle').value,
            message: document.getElementById('notificationMessage').value,
            module: document.getElementById('recipientModule').value,
            type: document.getElementById('notificationType').value,
            priority: document.getElementById('priority').value,
            scheduleDate: document.getElementById('scheduleDate').value
        };
        
        localStorage.setItem('notificationDraft', JSON.stringify(draftData));
        alert('Draft saved successfully!');
    });

    // Load draft on page load
    function loadDraft() {
        const savedDraft = localStorage.getItem('notificationDraft');
        if (savedDraft) {
            const draftData = JSON.parse(savedDraft);
            document.getElementById('notificationTitle').value = draftData.title || '';
            document.getElementById('notificationMessage').value = draftData.message || '';
            document.getElementById('recipientModule').value = draftData.module || '';
            document.getElementById('notificationType').value = draftData.type || '';
            document.getElementById('priority').value = draftData.priority || '';
            document.getElementById('scheduleDate').value = draftData.scheduleDate || '';
        }
    }

    // Close modal when clicking outside
    notificationModal.addEventListener('click', function(e) {
        if (e.target === this) {
            notificationModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('inventoryTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);

        // Update icon
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
    loadDraft();
});

