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

    // Sample data for reports
    const reportsData = {
        overview: {
            totalProducts: 247,
            totalStockValue: 4567890,
            lowStockItems: 23,
            turnoverRate: 2.4,
            inventoryTrend: {
                labels: ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22'],
                data: [4200000, 4350000, 4450000, 4567890]
            },
            categoryDistribution: {
                labels: ['Dresses', 'Pants', 'Accessories', 'Footwear', 'Tops'],
                data: [35, 25, 20, 12, 8]
            },
            topProducts: [
                { name: 'Kitenge Print Dress', category: 'Dresses', stock: 45, value: 225000, turnover: 3.2, status: 'active' },
                { name: 'Safari Cargo Pants', category: 'Pants', stock: 32, value: 192000, turnover: 2.8, status: 'active' },
                { name: 'Maasai Beaded Necklace', category: 'Accessories', stock: 78, value: 156000, turnover: 4.1, status: 'active' },
                { name: 'Leather Sandals', category: 'Footwear', stock: 8, value: 112000, turnover: 1.9, status: 'low-stock' },
                { name: 'Ankara Print Blazer', category: 'Tops', stock: 15, value: 135000, turnover: 2.3, status: 'reorder' }
            ]
        },
        inventory: {
            stockByLocation: {
                labels: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret'],
                data: [1850000, 1200000, 850000, 450000, 217890]
            },
            abcAnalysis: {
                labels: ['A Items (High Value)', 'B Items (Medium Value)', 'C Items (Low Value)'],
                data: [20, 30, 50]
            },
            agingAnalysis: {
                labels: ['0-30 days', '31-60 days', '61-90 days', '90+ days'],
                data: [65, 20, 10, 5]
            },
            lowStockItems: [
                { name: 'Kitenge Print Dress', current: 3, minimum: 10, recommended: 25, supplier: 'Nairobi Textile Mills' },
                { name: 'Leather Sandals', current: 8, minimum: 15, recommended: 30, supplier: 'Mombasa Leather Works' },
                { name: 'Maasai Beaded Necklace', current: 12, minimum: 20, recommended: 40, supplier: 'Kisumu Beads & Crafts' },
                { name: 'Safari Cargo Pants', current: 5, minimum: 12, recommended: 25, supplier: 'Nairobi Textile Mills' },
                { name: 'Kikoy Beach Wrap', current: 7, minimum: 15, recommended: 30, supplier: 'Coastal Accessories Ltd' }
            ]
        },
        suppliers: {
            performance: {
                labels: ['Nairobi Textile Mills', 'Mombasa Leather Works', 'Kisumu Beads & Crafts', 'Eldoret Packaging', 'Nakuru Equipment'],
                data: [4.8, 4.9, 4.6, 4.7, 4.5]
            },
            orderValue: {
                labels: ['Nairobi Textile Mills', 'Mombasa Leather Works', 'Kisumu Beads & Crafts', 'Eldoret Packaging', 'Nakuru Equipment'],
                data: [850000, 420000, 380000, 280000, 320000]
            },
            deliveryPerformance: {
                labels: ['On Time', 'Late', 'Early'],
                data: [85, 12, 3]
            },
            performanceTable: [
                { name: 'Nairobi Textile Mills', orders: 45, value: 850000, onTime: 92, rating: 4.8, status: 'active' },
                { name: 'Mombasa Leather Works', orders: 28, value: 420000, onTime: 89, rating: 4.9, status: 'active' },
                { name: 'Kisumu Beads & Crafts', orders: 32, value: 380000, onTime: 85, rating: 4.6, status: 'active' },
                { name: 'Eldoret Packaging Solutions', orders: 18, value: 280000, onTime: 94, rating: 4.7, status: 'active' },
                { name: 'Nakuru Equipment Suppliers', orders: 12, value: 320000, onTime: 78, rating: 4.5, status: 'active' }
            ]
        },
        orders: {
            trends: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [12, 18, 15, 23]
            },
            statusDistribution: {
                labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
                data: [23, 45, 32, 118, 8]
            },
            avgOrderValue: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [185000, 220000, 195000, 245000]
            }
        },
        financial: {
            investmentTrend: {
                labels: ['Oct', 'Nov', 'Dec', 'Jan'],
                data: [3800000, 4100000, 4350000, 4567890]
            },
            costBreakdown: {
                labels: ['Raw Materials', 'Labor', 'Overhead', 'Packaging', 'Shipping'],
                data: [45, 25, 15, 10, 5]
            },
            roiByCategory: {
                labels: ['Dresses', 'Pants', 'Accessories', 'Footwear', 'Tops'],
                data: [18.5, 15.2, 22.8, 12.3, 16.7]
            },
            financialSummary: [
                { category: 'Dresses', investment: 1800000, currentValue: 2133000, turnover: 3.2, roi: 18.5, trend: 'up' },
                { category: 'Pants', investment: 1200000, investment: 1382400, turnover: 2.8, roi: 15.2, trend: 'up' },
                { category: 'Accessories', investment: 800000, currentValue: 982400, turnover: 4.1, roi: 22.8, trend: 'up' },
                { category: 'Footwear', investment: 500000, currentValue: 561500, turnover: 1.9, roi: 12.3, trend: 'down' },
                { category: 'Tops', investment: 400000, currentValue: 466800, turnover: 2.3, roi: 16.7, trend: 'stable' }
            ]
        }
    };

    let currentTab = 'overview';

    // Initialize the page
    function initPage() {
        // Set overview metrics
        document.getElementById('totalProducts').textContent = formatNumber(reportsData.overview.totalProducts);
        document.getElementById('totalStockValue').textContent = formatCurrency(reportsData.overview.totalStockValue);
        document.getElementById('lowStockItems').textContent = formatNumber(reportsData.overview.lowStockItems);
        document.getElementById('turnoverRate').textContent = reportsData.overview.turnoverRate + 'x';

        // Load initial tab content
        loadTabContent('overview');

        // Set minimum date for schedule
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('startSchedule').min = tomorrow.toISOString().split('T')[0];

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1500);
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
    function loadTabContent(tabName) {
        currentTab = tabName;
        
        // Destroy existing charts
        Object.values(charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        charts = {};

        switch (tabName) {
            case 'overview':
                loadOverviewTab();
                break;
            case 'inventory':
                loadInventoryTab();
                break;
            case 'suppliers':
                loadSuppliersTab();
                break;
            case 'orders':
                loadOrdersTab();
                break;
            case 'financial':
                loadFinancialTab();
                break;
        }
    }

    // Load overview tab
    function loadOverviewTab() {
        // Inventory Trend Chart
        const inventoryTrendCtx = document.getElementById('inventoryTrendChart').getContext('2d');
        charts.inventoryTrend = new Chart(inventoryTrendCtx, {
            type: 'line',
            data: {
                labels: reportsData.overview.inventoryTrend.labels,
                datasets: [{
                    label: 'Inventory Value (KSh)',
                    data: reportsData.overview.inventoryTrend.data,
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
                labels: reportsData.overview.categoryDistribution.labels,
                datasets: [{
                    data: reportsData.overview.categoryDistribution.data,
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
        loadTopProductsTable();
    }

    // Load inventory tab
    function loadInventoryTab() {
        // Stock by Location Chart
        const stockLocationCtx = document.getElementById('stockLocationChart').getContext('2d');
        charts.stockLocation = new Chart(stockLocationCtx, {
            type: 'bar',
            data: {
                labels: reportsData.inventory.stockByLocation.labels,
                datasets: [{
                    label: 'Stock Value (KSh)',
                    data: reportsData.inventory.stockByLocation.data,
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
                labels: reportsData.inventory.abcAnalysis.labels,
                datasets: [{
                    data: reportsData.inventory.abcAnalysis.data,
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
                labels: reportsData.inventory.agingAnalysis.labels,
                datasets: [{
                    label: 'Percentage',
                    data: reportsData.inventory.agingAnalysis.data,
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
        loadLowStockTable();
    }

    // Load suppliers tab
    function loadSuppliersTab() {
        // Supplier Performance Chart
        const supplierPerformanceCtx = document.getElementById('supplierPerformanceChart').getContext('2d');
        charts.supplierPerformance = new Chart(supplierPerformanceCtx, {
            type: 'radar',
            data: {
                labels: reportsData.suppliers.performance.labels,
                datasets: [{
                    label: 'Rating',
                    data: reportsData.suppliers.performance.data,
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
                labels: reportsData.suppliers.orderValue.labels,
                datasets: [{
                    label: 'Order Value (KSh)',
                    data: reportsData.suppliers.orderValue.data,
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
                labels: reportsData.suppliers.deliveryPerformance.labels,
                datasets: [{
                    data: reportsData.suppliers.deliveryPerformance.data,
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
        loadSupplierPerformanceTable();
    }

    // Load orders tab
    function loadOrdersTab() {
        // Order Trends Chart
        const orderTrendsCtx = document.getElementById('orderTrendsChart').getContext('2d');
        charts.orderTrends = new Chart(orderTrendsCtx, {
            type: 'line',
            data: {
                labels: reportsData.orders.trends.labels,
                datasets: [{
                    label: 'Number of Orders',
                    data: reportsData.orders.trends.data,
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
                labels: reportsData.orders.statusDistribution.labels,
                datasets: [{
                    data: reportsData.orders.statusDistribution.data,
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
                labels: reportsData.orders.avgOrderValue.labels,
                datasets: [{
                    label: 'Average Order Value (KSh)',
                    data: reportsData.orders.avgOrderValue.data,
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
    function loadFinancialTab() {
        // Investment Trend Chart
        const investmentTrendCtx = document.getElementById('investmentTrendChart').getContext('2d');
        charts.investmentTrend = new Chart(investmentTrendCtx, {
            type: 'line',
            data: {
                labels: reportsData.financial.investmentTrend.labels,
                datasets: [{
                    label: 'Investment (KSh)',
                    data: reportsData.financial.investmentTrend.data,
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
                labels: reportsData.financial.costBreakdown.labels,
                datasets: [{
                    data: reportsData.financial.costBreakdown.data,
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
                labels: reportsData.financial.roiByCategory.labels,
                datasets: [{
                    label: 'ROI (%)',
                    data: reportsData.financial.roiByCategory.data,
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
        loadFinancialSummaryTable();
    }

    // Load top products table
    function loadTopProductsTable() {
        const tbody = document.getElementById('topProductsTable');
        let html = '';

        reportsData.overview.topProducts.forEach(product => {
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
    function loadLowStockTable() {
        const tbody = document.getElementById('lowStockTable');
        let html = '';

        reportsData.inventory.lowStockItems.forEach(item => {
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
    function loadSupplierPerformanceTable() {
        const tbody = document.getElementById('supplierPerformanceTable');
        let html = '';

        reportsData.suppliers.performanceTable.forEach(supplier => {
            const deliveryClass = supplier.onTime >= 90 ? 'excellent' : supplier.onTime >= 80 ? 'good' : 'poor';
            const stars = '★'.repeat(Math.floor(supplier.rating)) + '☆'.repeat(5 - Math.floor(supplier.rating));
            
            html += `
                <tr>
                    <td class="product-name">${supplier.name}</td>
                    <td>${supplier.orders}</td>
                    <td class="value-cell">KSh ${formatCurrency(supplier.value)}</td>
                    <td class="delivery-percentage ${deliveryClass}">${supplier.onTime}%</td>
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
    function loadFinancialSummaryTable() {
        const tbody = document.getElementById('financialSummaryTable');
        let html = '';

        reportsData.financial.financialSummary.forEach(item => {
            const trendIcon = item.trend === 'up' ? 'fa-arrow-up' : item.trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
            
            html += `
                <tr>
                    <td class="product-name">${item.category}</td>
                    <td class="value-cell">KSh ${formatCurrency(item.investment)}</td>
                    <td class="value-cell">KSh ${formatCurrency(item.currentValue)}</td>
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
    scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            reportType: document.getElementById('reportType').value,
            frequency: document.getElementById('frequency').value,
            recipients: document.getElementById('recipients').value,
            startDate: document.getElementById('startSchedule').value
        };
        
        scheduleModal.classList.remove('active');
        this.reset();
        alert('Report scheduled successfully! You will receive email notifications as configured.');
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

