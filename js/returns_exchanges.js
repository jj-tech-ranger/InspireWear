document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const returnsTableBody = document.getElementById('returnsTableBody');
    const reasonStats = document.getElementById('reasonStats');
    
    // Filter elements
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    const dateFilter = document.getElementById('dateFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    // Action buttons
    const addReturnBtn = document.getElementById('addReturnBtn');
    const addExchangeBtn = document.getElementById('addExchangeBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    // Modal elements
    const returnModal = document.getElementById('returnModal');
    const returnModalClose = document.getElementById('returnModalClose');
    const cancelReturn = document.getElementById('cancelReturn');
    const returnForm = document.getElementById('returnForm');
    const returnModalTitle = document.getElementById('returnModalTitle');
    
    const detailsModal = document.getElementById('detailsModal');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const detailsModalTitle = document.getElementById('detailsModalTitle');
    const detailsContent = document.getElementById('detailsContent');
    const updateStatusBtn = document.getElementById('updateStatusBtn');
    const newStatus = document.getElementById('newStatus');
    
    // Form elements
    const orderId = document.getElementById('orderId');
    const customerName = document.getElementById('customerName');
    const customerEmail = document.getElementById('customerEmail');
    const customerPhone = document.getElementById('customerPhone');
    const productName = document.getElementById('productName');
    const productSku = document.getElementById('productSku');
    const returnType = document.getElementById('returnType');
    const returnAmount = document.getElementById('returnAmount');
    const returnReason = document.getElementById('returnReason');
    const returnNotes = document.getElementById('returnNotes');

    // Current filters
    let currentFilters = {
        status: '',
        type: '',
        date: ''
    };

    // Current edit ID
    let currentEditId = null;
    let currentDetailsId = null;

    // Initialize the page
    async function initPage() {
        try {
            const overview = await fetch('/api/returns/overview/').then(res => res.json());
            // Set overview numbers
            document.getElementById('pendingReturns').textContent = overview.pending_returns;
            document.getElementById('pendingExchanges').textContent = overview.pending_exchanges;
            document.getElementById('refundAmount').textContent = formatCurrency(overview.refund_amount);
            document.getElementById('processingTime').textContent = overview.processing_time;

            // Load returns table
            await loadReturnsTable();

            // Load statistics
            await loadReasonStats();
            await initTrendsChart();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Format currency in Kenyan Shillings
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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

    // Get reason display name
    function getReasonDisplayName(reason) {
        const reasonMap = {
            'defective': 'Defective Product',
            'wrong-size': 'Wrong Size',
            'wrong-color': 'Wrong Color',
            'not-as-described': 'Not as Described',
            'damaged-shipping': 'Damaged in Shipping',
            'changed-mind': 'Changed Mind',
            'other': 'Other'
        };
        return reasonMap[reason] || reason;
    }

    // Filter returns data
    async function filterReturns() {
        const params = new URLSearchParams(currentFilters);
        return await fetch(`/api/returns/?${params.toString()}`).then(res => res.json());
    }

    // Load returns table
    async function loadReturnsTable() {
        const filteredReturns = await filterReturns();
        let html = '';

        if (filteredReturns.length === 0) {
            html = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        No returns or exchanges found matching the current filters.
                    </td>
                </tr>
            `;
        } else {
            filteredReturns.forEach(item => {
                html += `
                    <tr>
                        <td><strong>${item.order_id}</strong></td>
                        <td>
                            <div class="customer-info">
                                <div class="customer-name">${item.customer.name}</div>
                                <div class="customer-contact">${item.customer.email}</div>
                                <div class="customer-contact">${item.customer.phone}</div>
                            </div>
                        </td>
                        <td>
                            <div class="product-info">
                                <div class="product-name">${item.product.name}</div>
                                <div class="product-sku">${item.product.sku}</div>
                            </div>
                        </td>
                        <td><span class="type-badge ${item.type}">${item.type}</span></td>
                        <td>${getReasonDisplayName(item.reason)}</td>
                        <td><span class="amount-display">KSh ${formatCurrency(item.amount)}</span></td>
                        <td>${formatDate(item.date)}</td>
                        <td><span class="status ${item.status}">${item.status}</span></td>
                        <td>
                            <button class="action-btn view" onclick="viewDetails(${item.id})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn edit" onclick="editReturn(${item.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteReturn(${item.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        }

        returnsTableBody.innerHTML = html;
    }

    // Load reason statistics
    async function loadReasonStats() {
        const stats = await fetch('/api/returns/reason-stats/').then(res => res.json());
        let html = '';
        stats.forEach(stat => {
            html += `
                <div class="reason-stat">
                    <span class="reason-label">${stat.reason}</span>
                    <span class="reason-count">${stat.count} (${stat.percentage}%)</span>
                </div>
            `;
        });
        reasonStats.innerHTML = html;
    }

    // Initialize trends chart
    async function initTrendsChart() {
        const trends = await fetch('/api/returns/monthly-trends/').then(res => res.json());
        const ctx = document.getElementById('trendsCanvas').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: trends.map(item => item.month),
                datasets: [
                    {
                        label: 'Returns',
                        data: trends.map(item => item.returns),
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Exchanges',
                        data: trends.map(item => item.exchanges),
                        backgroundColor: 'rgba(214, 158, 46, 0.2)',
                        borderColor: 'rgba(214, 158, 46, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Global functions for onclick handlers
    window.viewDetails = async function(id) {
        const item = await fetch(`/api/returns/${id}/`).then(res => res.json());
        if (item) {
            currentDetailsId = id;
            detailsModalTitle.textContent = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Details - ${item.order_id}`;
            
            detailsContent.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">${item.order_id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Customer:</span>
                    <span class="detail-value">${item.customer.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${item.customer.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${item.customer.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Product:</span>
                    <span class="detail-value">${item.product.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">SKU:</span>
                    <span class="detail-value">${item.product.sku}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Type:</span>
                    <span class="detail-value">${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value">${getReasonDisplayName(item.reason)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value">KSh ${formatCurrency(item.amount)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formatDate(item.date)}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value"><span class="status ${item.status}">${item.status}</span></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Notes:</span>
                    <span class="detail-value">${item.notes || 'No additional notes'}</span>
                </div>
            `;
            
            newStatus.value = item.status;
            detailsModal.classList.add('active');
        }
    };

    window.editReturn = async function(id) {
        const item = await fetch(`/api/returns/${id}/`).then(res => res.json());
        if (item) {
            currentEditId = id;
            returnModalTitle.textContent = `Edit ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`;
            
            // Populate form
            orderId.value = item.order_id;
            customerName.value = item.customer.name;
            customerEmail.value = item.customer.email;
            customerPhone.value = item.customer.phone;
            productName.value = item.product.name;
            productSku.value = item.product.sku;
            returnType.value = item.type;
            returnAmount.value = item.amount;
            returnReason.value = item.reason;
            returnNotes.value = item.notes;
            
            returnModal.classList.add('active');
        }
    };

    window.deleteReturn = async function(id) {
        if (confirm(`Are you sure you want to delete this item? This action cannot be undone.`)) {
            try {
                const response = await fetch(`/api/returns/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await loadReturnsTable();
                    showNotification(`Item deleted successfully!`, 'success');
                    await updateOverviewStats();
                } else {
                    showNotification('Failed to delete item.', 'error');
                }
            } catch (error) {
                console.error('Error deleting item:', error);
                showNotification('An error occurred while deleting the item.', 'error');
            }
        }
    };

    // Update overview statistics
    async function updateOverviewStats() {
        const overview = await fetch('/api/returns/overview/').then(res => res.json());
        document.getElementById('pendingReturns').textContent = overview.pending_returns;
        document.getElementById('pendingExchanges').textContent = overview.pending_exchanges;
        document.getElementById('refundAmount').textContent = formatCurrency(overview.refund_amount);
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

    // Filter event listeners
    statusFilter.addEventListener('change', function() {
        currentFilters.status = this.value;
        loadReturnsTable();
    });

    typeFilter.addEventListener('change', function() {
        currentFilters.type = this.value;
        loadReturnsTable();
    });

    dateFilter.addEventListener('change', function() {
        currentFilters.date = this.value;
        loadReturnsTable();
    });

    clearFilters.addEventListener('click', function() {
        currentFilters = { status: '', type: '', date: '' };
        statusFilter.value = '';
        typeFilter.value = '';
        dateFilter.value = '';
        loadReturnsTable();
        showNotification('Filters cleared', 'info');
    });

    // Action button event listeners
    addReturnBtn.addEventListener('click', function() {
        currentEditId = null;
        returnModalTitle.textContent = 'Add New Return';
        returnForm.reset();
        returnType.value = 'return';
        returnModal.classList.add('active');
    });

    addExchangeBtn.addEventListener('click', function() {
        currentEditId = null;
        returnModalTitle.textContent = 'Add New Exchange';
        returnForm.reset();
        returnType.value = 'exchange';
        returnModal.classList.add('active');
    });

    exportBtn.addEventListener('click', async function() {
        const filteredReturns = await filterReturns();
        const csvContent = generateCSV(filteredReturns);
        downloadCSV(csvContent, 'returns_exchanges.csv');
        showNotification('Data exported successfully!', 'success');
    });

    // Generate CSV content
    function generateCSV(data) {
        let csv = 'Order ID,Customer Name,Customer Email,Customer Phone,Product Name,Product SKU,Type,Reason,Amount (KSh),Date,Status,Notes\n';
        
        data.forEach(item => {
            csv += `"${item.order_id}","${item.customer.name}","${item.customer.email}","${item.customer.phone}","${item.product.name}","${item.product.sku}","${item.type}","${getReasonDisplayName(item.reason)}","${item.amount}","${item.date}","${item.status}","${item.notes || ''}"\n`;
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
        localStorage.setItem('returnsExchangesTheme', newTheme);

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
    returnModalClose.addEventListener('click', function() {
        returnModal.classList.remove('active');
    });

    cancelReturn.addEventListener('click', function() {
        returnModal.classList.remove('active');
    });

    detailsModalClose.addEventListener('click', function() {
        detailsModal.classList.remove('active');
    });

    // Form submission
    returnForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            order_id: orderId.value,
            customer: {
                name: customerName.value,
                email: customerEmail.value,
                phone: customerPhone.value
            },
            product: {
                name: productName.value,
                sku: productSku.value
            },
            type: returnType.value,
            reason: returnReason.value,
            amount: parseFloat(returnAmount.value),
            notes: returnNotes.value
        };

        try {
            let response;
            if (currentEditId) {
                // Edit existing return/exchange
                response = await fetch(`/api/returns/${currentEditId}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                // Add new return/exchange
                response = await fetch('/api/returns/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            if (response.ok) {
                showNotification(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} ${currentEditId ? 'updated' : 'added'} successfully!`, 'success');
                returnModal.classList.remove('active');
                await loadReturnsTable();
                await updateOverviewStats();
            } else {
                showNotification('Failed to save item.', 'error');
            }
        } catch (error) {
            console.error('Error saving item:', error);
            showNotification('An error occurred while saving the item.', 'error');
        }
    });

    // Update status
    updateStatusBtn.addEventListener('click', async function() {
        if (currentDetailsId) {
            try {
                const response = await fetch(`/api/returns/${currentDetailsId}/status/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus.value }),
                });
                if (response.ok) {
                    detailsModal.classList.remove('active');
                    await loadReturnsTable();
                    await updateOverviewStats();
                    showNotification(`Status updated to ${newStatus.value}`, 'success');
                } else {
                    showNotification('Failed to update status.', 'error');
                }
            } catch (error) {
                console.error('Error updating status:', error);
                showNotification('An error occurred while updating the status.', 'error');
            }
        }
    });

    // Close modals when clicking outside
    returnModal.addEventListener('click', function(e) {
        if (e.target === this) {
            returnModal.classList.remove('active');
        }
    });

    detailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            detailsModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('returnsExchangesTheme');
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