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

    // Sample returns and exchanges data for Kenyan clothing store
    const returnsData = {
        overview: {
            pendingReturns: 12,
            pendingExchanges: 8,
            refundAmount: 145600, // KSh
            processingTime: 2.5 // days
        },
        returns: [
            {
                id: 1,
                orderId: 'ORD-2025-001',
                customer: {
                    name: 'Grace Wanjiku',
                    email: 'grace.wanjiku@gmail.com',
                    phone: '+254 712 345 678'
                },
                product: {
                    name: 'Cotton Dress',
                    sku: 'DRS-001-L',
                    image: 'dress-001.jpg'
                },
                type: 'return',
                reason: 'wrong-size',
                amount: 3500,
                date: '2025-01-20',
                status: 'pending',
                notes: 'Customer ordered Large but needs Medium size'
            },
            {
                id: 2,
                orderId: 'ORD-2025-002',
                customer: {
                    name: 'John Mwangi',
                    email: 'john.mwangi@yahoo.com',
                    phone: '+254 723 456 789'
                },
                product: {
                    name: 'Polo Shirt',
                    sku: 'PLO-002-M',
                    image: 'polo-002.jpg'
                },
                type: 'exchange',
                reason: 'wrong-color',
                amount: 2800,
                date: '2025-01-19',
                status: 'approved',
                notes: 'Customer wants to exchange blue for red'
            },
            {
                id: 3,
                orderId: 'ORD-2025-003',
                customer: {
                    name: 'Susan Akinyi',
                    email: 'susan.akinyi@hotmail.com',
                    phone: '+254 734 567 890'
                },
                product: {
                    name: 'Jeans',
                    sku: 'JNS-003-32',
                    image: 'jeans-003.jpg'
                },
                type: 'return',
                reason: 'defective',
                amount: 4200,
                date: '2025-01-18',
                status: 'processing',
                notes: 'Zipper is broken'
            },
            {
                id: 4,
                orderId: 'ORD-2025-004',
                customer: {
                    name: 'David Omondi',
                    email: 'david.omondi@gmail.com',
                    phone: '+254 745 678 901'
                },
                product: {
                    name: 'Blazer',
                    sku: 'BLZ-004-L',
                    image: 'blazer-004.jpg'
                },
                type: 'return',
                reason: 'not-as-described',
                amount: 8500,
                date: '2025-01-17',
                status: 'completed',
                notes: 'Material quality not as expected'
            },
            {
                id: 5,
                orderId: 'ORD-2025-005',
                customer: {
                    name: 'Mary Njeri',
                    email: 'mary.njeri@gmail.com',
                    phone: '+254 756 789 012'
                },
                product: {
                    name: 'Skirt',
                    sku: 'SKT-005-M',
                    image: 'skirt-005.jpg'
                },
                type: 'exchange',
                reason: 'wrong-size',
                amount: 2200,
                date: '2025-01-16',
                status: 'rejected',
                notes: 'Item was worn and cannot be exchanged'
            },
            {
                id: 6,
                orderId: 'ORD-2025-006',
                customer: {
                    name: 'Peter Kamau',
                    email: 'peter.kamau@outlook.com',
                    phone: '+254 767 890 123'
                },
                product: {
                    name: 'T-Shirt',
                    sku: 'TSH-006-XL',
                    image: 'tshirt-006.jpg'
                },
                type: 'return',
                reason: 'damaged-shipping',
                amount: 1800,
                date: '2025-01-15',
                status: 'approved',
                notes: 'Package was damaged during delivery'
            },
            {
                id: 7,
                orderId: 'ORD-2025-007',
                customer: {
                    name: 'Catherine Wanjiku',
                    email: 'catherine.w@gmail.com',
                    phone: '+254 778 901 234'
                },
                product: {
                    name: 'Cardigan',
                    sku: 'CDG-007-S',
                    image: 'cardigan-007.jpg'
                },
                type: 'return',
                reason: 'changed-mind',
                amount: 3200,
                date: '2025-01-14',
                status: 'pending',
                notes: 'Customer no longer needs the item'
            }
        ],
        reasonStats: [
            { reason: 'Wrong Size', count: 15, percentage: 35 },
            { reason: 'Defective Product', count: 10, percentage: 23 },
            { reason: 'Wrong Color', count: 8, percentage: 19 },
            { reason: 'Not as Described', count: 6, percentage: 14 },
            { reason: 'Damaged in Shipping', count: 3, percentage: 7 },
            { reason: 'Changed Mind', count: 1, percentage: 2 }
        ],
        monthlyTrends: [
            { month: 'Jul', returns: 45, exchanges: 32 },
            { month: 'Aug', returns: 52, exchanges: 28 },
            { month: 'Sep', returns: 38, exchanges: 35 },
            { month: 'Oct', returns: 41, exchanges: 30 },
            { month: 'Nov', returns: 48, exchanges: 33 },
            { month: 'Dec', returns: 55, exchanges: 40 },
            { month: 'Jan', returns: 43, exchanges: 25 }
        ]
    };

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
    function initPage() {
        // Set overview numbers
        document.getElementById('pendingReturns').textContent = returnsData.overview.pendingReturns;
        document.getElementById('pendingExchanges').textContent = returnsData.overview.pendingExchanges;
        document.getElementById('refundAmount').textContent = formatCurrency(returnsData.overview.refundAmount);
        document.getElementById('processingTime').textContent = returnsData.overview.processingTime;

        // Load returns table
        loadReturnsTable();

        // Load statistics
        loadReasonStats();
        initTrendsChart();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
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
    function filterReturns() {
        return returnsData.returns.filter(item => {
            if (currentFilters.status && item.status !== currentFilters.status) return false;
            if (currentFilters.type && item.type !== currentFilters.type) return false;
            if (currentFilters.date && item.date !== currentFilters.date) return false;
            return true;
        });
    }

    // Load returns table
    function loadReturnsTable() {
        const filteredReturns = filterReturns();
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
                        <td><strong>${item.orderId}</strong></td>
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
    function loadReasonStats() {
        let html = '';
        returnsData.reasonStats.forEach(stat => {
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
    function initTrendsChart() {
        const ctx = document.getElementById('trendsCanvas').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: returnsData.monthlyTrends.map(item => item.month),
                datasets: [
                    {
                        label: 'Returns',
                        data: returnsData.monthlyTrends.map(item => item.returns),
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: false
                    },
                    {
                        label: 'Exchanges',
                        data: returnsData.monthlyTrends.map(item => item.exchanges),
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
    window.viewDetails = function(id) {
        const item = returnsData.returns.find(r => r.id === id);
        if (item) {
            currentDetailsId = id;
            detailsModalTitle.textContent = `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Details - ${item.orderId}`;
            
            detailsContent.innerHTML = `
                <div class="detail-row">
                    <span class="detail-label">Order ID:</span>
                    <span class="detail-value">${item.orderId}</span>
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

    window.editReturn = function(id) {
        const item = returnsData.returns.find(r => r.id === id);
        if (item) {
            currentEditId = id;
            returnModalTitle.textContent = `Edit ${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`;
            
            // Populate form
            orderId.value = item.orderId;
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

    window.deleteReturn = function(id) {
        const item = returnsData.returns.find(r => r.id === id);
        if (item && confirm(`Are you sure you want to delete this ${item.type}? This action cannot be undone.`)) {
            const index = returnsData.returns.findIndex(r => r.id === id);
            if (index !== -1) {
                returnsData.returns.splice(index, 1);
                loadReturnsTable();
                showNotification(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} deleted successfully!`, 'success');
                updateOverviewStats();
            }
        }
    };

    // Update overview statistics
    function updateOverviewStats() {
        const pendingReturns = returnsData.returns.filter(r => r.type === 'return' && r.status === 'pending').length;
        const pendingExchanges = returnsData.returns.filter(r => r.type === 'exchange' && r.status === 'pending').length;
        const totalRefund = returnsData.returns
            .filter(r => r.type === 'return' && (r.status === 'approved' || r.status === 'completed'))
            .reduce((sum, r) => sum + r.amount, 0);

        document.getElementById('pendingReturns').textContent = pendingReturns;
        document.getElementById('pendingExchanges').textContent = pendingExchanges;
        document.getElementById('refundAmount').textContent = formatCurrency(totalRefund);
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

    exportBtn.addEventListener('click', function() {
        const csvContent = generateCSV();
        downloadCSV(csvContent, 'returns_exchanges.csv');
        showNotification('Data exported successfully!', 'success');
    });

    // Generate CSV content
    function generateCSV() {
        let csv = 'Order ID,Customer Name,Customer Email,Customer Phone,Product Name,Product SKU,Type,Reason,Amount (KSh),Date,Status,Notes\n';
        
        const filteredReturns = filterReturns();
        filteredReturns.forEach(item => {
            csv += `"${item.orderId}","${item.customer.name}","${item.customer.email}","${item.customer.phone}","${item.product.name}","${item.product.sku}","${item.type}","${getReasonDisplayName(item.reason)}","${item.amount}","${item.date}","${item.status}","${item.notes || ''}"\n`;
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
    returnForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            orderId: orderId.value,
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
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            notes: returnNotes.value
        };

        if (currentEditId) {
            // Edit existing return/exchange
            const index = returnsData.returns.findIndex(r => r.id === currentEditId);
            if (index !== -1) {
                returnsData.returns[index] = { ...returnsData.returns[index], ...formData };
                showNotification(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} updated successfully!`, 'success');
            }
        } else {
            // Add new return/exchange
            const newItem = {
                id: Date.now(),
                ...formData
            };
            returnsData.returns.unshift(newItem);
            showNotification(`${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} added successfully!`, 'success');
        }

        returnModal.classList.remove('active');
        loadReturnsTable();
        updateOverviewStats();
    });

    // Update status
    updateStatusBtn.addEventListener('click', function() {
        if (currentDetailsId) {
            const index = returnsData.returns.findIndex(r => r.id === currentDetailsId);
            if (index !== -1) {
                const oldStatus = returnsData.returns[index].status;
                returnsData.returns[index].status = newStatus.value;
                
                detailsModal.classList.remove('active');
                loadReturnsTable();
                updateOverviewStats();
                showNotification(`Status updated from ${oldStatus} to ${newStatus.value}`, 'success');
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

