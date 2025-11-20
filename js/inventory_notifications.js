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

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredNotifications = [];
    let currentTab = 'all';
    let currentNotificationForModal = null;

    // Initialize the page
    async function initPage() {
        try {
            await updateSummaryNumbers();
            // Update badge counts
            await updateBadgeCounts();

            // Load notifications
            await loadNotifications();

            // Set minimum date for schedule
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('startSchedule').min = tomorrow.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Update badge counts in tabs
    async function updateBadgeCounts() {
        const counts = await fetch('/api/notifications/counts/').then(res => res.json());
        document.querySelector('[data-tab="unread"] .badge').textContent = counts.unread;
        document.querySelector('[data-tab="urgent"] .badge').textContent = counts.urgent;
    }

    // Load notifications based on current tab and filters
    async function loadNotifications() {
        const params = new URLSearchParams({
            tab: currentTab,
            module: moduleFilter.value,
            type: typeFilter.value,
            date: dateFilter.value,
        });

        try {
            const notifications = await fetch(`/api/notifications/?${params.toString()}`).then(res => res.json());
            filteredNotifications = notifications;
            currentPage = 1;

            if (currentTab === 'all') {
                renderNotificationsList(notificationsList);
            } else if (currentTab === 'unread') {
                renderNotificationsList(unreadNotificationsList);
            } else if (currentTab === 'urgent') {
                renderNotificationsList(urgentNotificationsList);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
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
            const unreadClass = !notification.is_read ? 'unread' : '';
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
                            <button class="notification-action-btn mark-read-btn" data-id="${notification.id}" title="${notification.is_read ? 'Mark as Unread' : 'Mark as Read'}">
                                <i class="fas ${notification.is_read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
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
    async function viewNotificationDetails(notificationId) {
        const notification = await fetch(`/api/notifications/${notificationId}/`).then(res => res.json());
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
                            <span>${notification.is_read ? 'Read' : 'Unread'}</span>
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
                
                ${notification.related_data ? `
                <div class="details-section">
                    <h4>Related Data</h4>
                    <div class="details-grid">
                        ${Object.entries(notification.related_data).map(([key, value]) => `
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
        markAsReadBtn.textContent = notification.is_read ? 'Mark as Unread' : 'Mark as Read';
        markAsReadBtn.innerHTML = `<i class="fas ${notification.is_read ? 'fa-envelope' : 'fa-envelope-open'}"></i> ${notification.is_read ? 'Mark as Unread' : 'Mark as Read'}`;

        notificationModal.classList.add('active');

        // Mark as read when viewing (if not already read)
        if (!notification.is_read) {
            await toggleReadStatus(notificationId);
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
    async function toggleReadStatus(notificationId) {
        try {
            const response = await fetch(`/api/notifications/${notificationId}/toggle-read/`, { method: 'POST' });
            if (response.ok) {
                await updateBadgeCounts();
                await loadNotifications();
            }
        } catch (error) {
            console.error('Error toggling read status:', error);
        }
    }

    // Delete notification
    async function deleteNotification(notificationId) {
        if (confirm('Are you sure you want to delete this notification?')) {
            try {
                const response = await fetch(`/api/notifications/${notificationId}/`, { method: 'DELETE' });
                if (response.ok) {
                    await updateSummaryNumbers();
                    await updateBadgeCounts();
                    await loadNotifications();
                }
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    }

    // Update summary numbers
    async function updateSummaryNumbers() {
        const summary = await fetch('/api/notifications/summary/').then(res => res.json());
        document.getElementById('totalNotifications').textContent = formatNumber(summary.total_notifications);
        document.getElementById('unreadNotifications').textContent = formatNumber(summary.unread_notifications);
        document.getElementById('urgentNotifications').textContent = formatNumber(summary.urgent_notifications);
        document.getElementById('systemAlerts').textContent = formatNumber(summary.system_alerts);
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
    markAllReadBtn.addEventListener('click', async function() {
        if (confirm('Mark all notifications as read?')) {
            try {
                const response = await fetch('/api/notifications/mark-all-read/', { method: 'POST' });
                if (response.ok) {
                    await updateBadgeCounts();
                    await loadNotifications();
                }
            } catch (error) {
                console.error('Error marking all as read:', error);
            }
        }
    });

    // Delete selected notifications
    deleteSelectedBtn.addEventListener('click', async function() {
        const selectedCheckboxes = document.querySelectorAll('.notification-checkbox:checked');
        if (selectedCheckboxes.length === 0) {
            alert('Please select notifications to delete.');
            return;
        }

        if (confirm(`Delete ${selectedCheckboxes.length} selected notification(s)?`)) {
            const ids = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);
            try {
                const response = await fetch('/api/notifications/delete-selected/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids }),
                });
                if (response.ok) {
                    await updateSummaryNumbers();
                    await updateBadgeCounts();
                    await loadNotifications();
                }
            } catch (error) {
                console.error('Error deleting selected:', error);
            }
        }
    });

    // Refresh notifications
    refreshBtn.addEventListener('click', async function() {
        // Simulate refresh with loading state
        refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
        refreshBtn.disabled = true;
        
        await loadNotifications();
        
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh';
        refreshBtn.disabled = false;
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

    markAsReadBtn.addEventListener('click', async function() {
        if (currentNotificationForModal) {
            await toggleReadStatus(currentNotificationForModal.id);
            notificationModal.classList.remove('active');
        }
    });

    // Compose form submission
    composeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(composeForm);
        const newNotification = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/notifications/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNotification),
            });
            if (response.ok) {
                await updateSummaryNumbers();
                await updateBadgeCounts();
                
                // Switch to all notifications tab and reload
                tabBtns.forEach(b => b.classList.remove('active'));
                document.querySelector('[data-tab="all"]').classList.add('active');
                tabContents.forEach(content => content.classList.remove('active'));
                document.getElementById('allTab').classList.add('active');
                currentTab = 'all';
                
                await loadNotifications();
                this.reset();
                alert('Notification sent successfully!');
            } else {
                alert('Failed to send notification.');
            }
        } catch (error) {
            console.error('Error sending notification:', error);
        }
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