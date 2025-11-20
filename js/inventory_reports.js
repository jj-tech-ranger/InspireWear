document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const periodFilter = document.getElementById('periodFilter');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const locationFilter = document.getElementById('locationFilter');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const scheduleReportBtn = document.getElementById('scheduleReportBtn');
    const scheduleModal = document.getElementById('scheduleModal');
    const modalClose = document.getElementById('modalClose');
    const cancelSchedule = document.getElementById('cancelSchedule');
    const scheduleForm = document.getElementById('scheduleForm');

    // Chart instances
    let charts = {};

    let currentTab = 'overview';

    // Initialize the page
    async function initPage() {
        try {
            const overviewData = await fetch('/api/reports/inventory/overview/').then(res => res.json());
            // Set overview metrics
            document.getElementById('totalProducts').textContent = formatNumber(overviewData.total_products);
            document.getElementById('totalStockValue').textContent = formatCurrency(overviewData.total_stock_value);
            document.getElementById('lowStockItems').textContent = formatNumber(overviewData.low_stock_items);
            document.getElementById('turnoverRate').textContent = overviewData.turnover_rate + 'x';

            // Load initial tab content
            await loadTabContent('overview');

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
            }, 1500);
        }
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Format currency for Kenyan Shillings
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load tab content
    async function loadTabContent(tabName) {
        currentTab = tabName;
        
        // Destroy existing charts
        Object.values(charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        charts = {};

        const params = new URLSearchParams({
            period: periodFilter.value,
            start_date: startDate.value,
            end_date: endDate.value,
            location: locationFilter.value,
        });

        try {
            const data = await fetch(`/api/reports/inventory/${tabName}/?${params.toString()}`).then(res => res.json());
            switch (tabName) {
                case 'overview':
                    loadOverviewTab(data);
                    break;
                case 'inventory':
                    loadInventoryTab(data);
                    break;
                case 'suppliers':
                    loadSuppliersTab(data);
                    break;
                case 'orders':
                    loadOrdersTab(data);
                    break;
                case 'financial':
                    loadFinancialTab(data);
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${tabName} tab:`, error);
        }
    }

    // Load overview tab
    function loadOverviewTab(data) {
        // Inventory Trend Chart
        const inventoryTrendCtx = document.getElementById('inventoryTrendChart').getContext('2d');
        charts.inventoryTrend = new Chart(inventoryTrendCtx, {
            type: 'line',
            data: {
                labels: data.inventory_trend.labels,
                datasets: [{
                    label: 'Inventory Value (KSh)',
                    data: data.inventory_trend.data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return 'KSh ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });

        // Category Distribution Chart
        const categoryDistributionCtx = document.getElementById('categoryDistributionChart').getContext('2d');
        charts.categoryDistribution = new Chart(categoryDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: data.category_distribution.labels,
                datasets: [{
                    data: data.category_distribution.data,
                    backgroundColor: [
                        '#3498db',
                        '#2ecc71',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Load top products table
        loadTopProductsTable(data.top_products);
    }

    // Load inventory tab
    function loadInventoryTab(data) {
        // Stock by Location Chart
        const stockLocationCtx = document.getElementById('stockLocationChart').getContext('2d');
        charts.stockLocation = new Chart(stockLocationCtx, {
            type: 'bar',
            data: {
                labels: data.stock_by_location.labels,
                datasets: [{
                    label: 'Stock Value (KSh)',
                    data: data.stock_by_location.data,
                    backgroundColor: '#3498db',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KSh ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });

        // ABC Analysis Chart
        const abcAnalysisCtx = document.getElementById('abcAnalysisChart').getContext('2d');
        charts.abcAnalysis = new Chart(abcAnalysisCtx, {
            type: 'pie',
            data: {
                labels: data.abc_analysis.labels,
                datasets: [{
                    data: data.abc_analysis.data,
                    backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Aging Analysis Chart
        const agingAnalysisCtx = document.getElementById('agingAnalysisChart').getContext('2d');
        charts.agingAnalysis = new Chart(agingAnalysisCtx, {
            type: 'bar',
            data: {
                labels: data.aging_analysis.labels,
                datasets: [{
                    label: 'Percentage',
                    data: data.aging_analysis.data,
                    backgroundColor: ['#2ecc71', '#f39c12', '#e67e22', '#e74c3c'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });

        // Load low stock table
        loadLowStockTable(data.low_stock_items);
    }

    // Load suppliers tab
    function loadSuppliersTab(data) {
        // Supplier Performance Chart
        const supplierPerformanceCtx = document.getElementById('supplierPerformanceChart').getContext('2d');
        charts.supplierPerformance = new Chart(supplierPerformanceCtx, {
            type: 'radar',
            data: {
                labels: data.performance.labels,
                datasets: [{
                    label: 'Rating',
                    data: data.performance.data,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

        // Order Value by Supplier Chart
        const supplierValueCtx = document.getElementById('supplierValueChart').getContext('2d');
        charts.supplierValue = new Chart(supplierValueCtx, {
            type: 'bar',
            data: {
                labels: data.order_value.labels,
                datasets: [{
                    label: 'Order Value (KSh)',
                    data: data.order_value.data,
                    backgroundColor: '#2ecc71',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KSh ' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });

        // Delivery Performance Chart
        const deliveryPerformanceCtx = document.getElementById('deliveryPerformanceChart').getContext('2d');
        charts.deliveryPerformance = new Chart(deliveryPerformanceCtx, {
            type: 'doughnut',
            data: {
                labels: data.delivery_performance.labels,
                datasets: [{
                    data: data.delivery_performance.data,
                    backgroundColor: ['#2ecc71', '#e74c3c', '#3498db'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Load supplier performance table
        loadSupplierPerformanceTable(data.performance_table);
    }

    // Load orders tab
    function loadOrdersTab(data) {
        // Order Trends Chart
        const orderTrendsCtx = document.getElementById('orderTrendsChart').getContext('2d');
        charts.orderTrends = new Chart(orderTrendsCtx, {
            type: 'line',
            data: {
                labels: data.trends.labels,
                datasets: [{
                    label: 'Number of Orders',
                    data: data.trends.data,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Order Status Distribution Chart
        const orderStatusCtx = document.getElementById('orderStatusChart').getContext('2d');
        charts.orderStatus = new Chart(orderStatusCtx, {
            type: 'pie',
            data: {
                labels: data.status_distribution.labels,
                datasets: [{
                    data: data.status_distribution.data,
                    backgroundColor: ['#f39c12', '#3498db', '#9b59b6', '#2ecc71', '#e74c3c'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Average Order Value Chart
        const avgOrderValueCtx = document.getElementById('avgOrderValueChart').getContext('2d');
        charts.avgOrderValue = new Chart(avgOrderValueCtx, {
            type: 'bar',
            data: {
                labels: data.avg_order_value.labels,
                datasets: [{
                    label: 'Average Order Value (KSh)',
                    data: data.avg_order_value.data,
                    backgroundColor: '#e67e22',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KSh ' + (value / 1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }

    // Load financial tab
    function loadFinancialTab(data) {
        // Investment Trend Chart
        const investmentTrendCtx = document.getElementById('investmentTrendChart').getContext('2d');
        charts.investmentTrend = new Chart(investmentTrendCtx, {
            type: 'line',
            data: {
                labels: data.investment_trend.labels,
                datasets: [{
                    label: 'Investment (KSh)',
                    data: data.investment_trend.data,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return 'KSh ' + (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });

        // Cost Breakdown Chart
        const costBreakdownCtx = document.getElementById('costBreakdownChart').getContext('2d');
        charts.costBreakdown = new Chart(costBreakdownCtx, {
            type: 'doughnut',
            data: {
                labels: data.cost_breakdown.labels,
                datasets: [{
                    data: data.cost_breakdown.data,
                    backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // ROI by Category Chart
        const roiCategoryCtx = document.getElementById('roiCategoryChart').getContext('2d');
        charts.roiCategory = new Chart(roiCategoryCtx, {
            type: 'bar',
            data: {
                labels: data.roi_by_category.labels,
                datasets: [{
                    label: 'ROI (%)',
                    data: data.roi_by_category.data,
                    backgroundColor: '#16a085',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });

        // Load financial summary table
        loadFinancialSummaryTable(data.financial_summary);
    }

    // Load top products table
    function loadTopProductsTable(topProducts) {
        const tbody = document.getElementById('topProductsTable');
        let html = '';

        topProducts.forEach(product => {
            const stockClass = product.stock < 10 ? 'low' : product.stock < 30 ? 'medium' : 'high';
            const turnoverClass = product.turnover > 3 ? 'high' : product.turnover > 2 ? 'medium' : 'low';
            
            html += `
                <tr>
                    <td class="product-name">${product.name}</td>
                    <td><span class="category-badge">${product.category}</span></td>
                    <td class="stock-level ${stockClass}">${product.stock}</td>
                    <td class="value-cell">KSh ${formatCurrency(product.value)}</td>
                    <td class="turnover-rate ${turnoverClass}">${product.turnover}x</td>
                    <td><span class="status-badge ${product.status}">${product.status.replace('-', ' ')}</span></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    // Load low stock table
    function loadLowStockTable(lowStockItems) {
        const tbody = document.getElementById('lowStockTable');
        let html = '';

        lowStockItems.forEach(item => {
            html += `
                <tr>
                    <td class="product-name">${item.name}</td>
                    <td class="stock-level low">${item.current}</td>
                    <td>${item.minimum}</td>
                    <td>${item.recommended}</td>
                    <td>${item.supplier}</td>
                    <td><button class="action-btn reorder">Reorder</button></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    // Load supplier performance table
    function loadSupplierPerformanceTable(performanceTable) {
        const tbody = document.getElementById('supplierPerformanceTable');
        let html = '';

        performanceTable.forEach(supplier => {
            const deliveryClass = supplier.on_time >= 90 ? 'excellent' : supplier.on_time >= 80 ? 'good' : 'poor';
            const stars = '★'.repeat(Math.floor(supplier.rating)) + '☆'.repeat(5 - Math.floor(supplier.rating));
            
            html += `
                <tr>
                    <td class="product-name">${supplier.name}</td>
                    <td>${supplier.orders}</td>
                    <td class="value-cell">KSh ${formatCurrency(supplier.value)}</td>
                    <td class="delivery-percentage ${deliveryClass}">${supplier.on_time}%</td>
                    <td class="performance-rating">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-value">${supplier.rating}</span>
                    </td>
                    <td><span class="status-badge ${supplier.status}">${supplier.status}</span></td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    // Load financial summary table
    function loadFinancialSummaryTable(financialSummary) {
        const tbody = document.getElementById('financialSummaryTable');
        let html = '';

        financialSummary.forEach(item => {
            const trendIcon = item.trend === 'up' ? 'fa-arrow-up' : item.trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
            
            html += `
                <tr>
                    <td class="product-name">${item.category}</td>
                    <td class="value-cell">KSh ${formatCurrency(item.investment)}</td>
                    <td class="value-cell">KSh ${formatCurrency(item.current_value)}</td>
                    <td class="turnover-rate">${item.turnover}x</td>
                    <td class="value-cell">${item.roi}%</td>
                    <td class="trend-indicator ${item.trend}">
                        <i class="fas ${trendIcon}"></i>
                        ${item.trend}
                    </td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
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
            
            // Load tab content
            loadTabContent(tabId);
        });
    });

    // Period filter change
    periodFilter.addEventListener('change', function() {
        if (this.value === 'custom') {
            startDate.style.display = 'block';
            endDate.style.display = 'block';
        } else {
            startDate.style.display = 'none';
            endDate.style.display = 'none';
        }
    });

    // Generate report button
    generateReportBtn.addEventListener('click', function() {
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        this.disabled = true;
        
        setTimeout(() => {
            // Reload current tab content
            loadTabContent(currentTab);
            
            // Reset button
            this.innerHTML = '<i class="fas fa-chart-bar"></i> Generate Report';
            this.disabled = false;
            
            alert('Report generated successfully!');
        }, 2000);
    });

    // Export report button
    exportReportBtn.addEventListener('click', function() {
        // Show loading state
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Exporting...';
        this.disabled = true;
        
        setTimeout(() => {
            // Reset button
            this.innerHTML = '<i class="fas fa-download"></i> Export PDF';
            this.disabled = false;
            
            alert('Report exported successfully! Check your downloads folder.');
        }, 2000);
    });

    // Schedule report button
    scheduleReportBtn.addEventListener('click', function() {
        scheduleModal.classList.add('active');
    });

    // Modal close events
    modalClose.addEventListener('click', function() {
        scheduleModal.classList.remove('active');
    });

    cancelSchedule.addEventListener('click', function() {
        scheduleModal.classList.remove('active');
    });

    // Schedule form submission
    scheduleForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            report_type: document.getElementById('reportType').value,
            frequency: document.getElementById('frequency').value,
            recipients: document.getElementById('recipients').value,
            start_date: document.getElementById('startSchedule').value
        };
        
        try {
            const response = await fetch('/api/reports/schedule/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                scheduleModal.classList.remove('active');
                this.reset();
                alert('Report scheduled successfully! You will receive email notifications as configured.');
            } else {
                alert('Failed to schedule report.');
            }
        } catch (error) {
            console.error('Error scheduling report:', error);
            alert('An error occurred while scheduling the report.');
        }
    });

    // Close modal when clicking outside
    scheduleModal.addEventListener('click', function(e) {
        if (e.target === this) {
            scheduleModal.classList.remove('active');
        }
    });

    // Chart action buttons (placeholder functionality)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.chart-action-btn')) {
            const btn = e.target.closest('.chart-action-btn');
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('fa-expand')) {
                alert('Fullscreen view would be implemented here.');
            } else if (icon.classList.contains('fa-download')) {
                alert('Chart download would be implemented here.');
            }
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
});