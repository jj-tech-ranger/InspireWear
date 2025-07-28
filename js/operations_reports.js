document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const exportModal = document.getElementById('exportModal');
    const exportModalClose = document.getElementById('exportModalClose');
    const cancelExport = document.getElementById('cancelExport');
    const confirmExport = document.getElementById('confirmExport');
    const reportDetailsModal = document.getElementById('reportDetailsModal');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const reportsTableBody = document.getElementById('reportsTableBody');
    const pagination = document.getElementById('pagination');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    const exportTableBtn = document.getElementById('exportTableBtn');

    // Report data with Kenyan context
    const reportsData = {
        summary: {
            totalRevenue: 2450000,
            totalTransactions: 1847,
            avgTransaction: 1327,
            topLocation: 'Nairobi'
        },
        salesByLocation: [
            { location: 'Nairobi', revenue: 980000, transactions: 742, color: '#3498db' },
            { location: 'Mombasa', revenue: 650000, transactions: 489, color: '#2ecc71' },
            { location: 'Kisumu', revenue: 420000, transactions: 318, color: '#f1c40f' },
            { location: 'Nakuru', revenue: 280000, transactions: 212, color: '#e74c3c' },
            { location: 'Eldoret', revenue: 120000, transactions: 86, color: '#9b59b6' }
        ],
        revenueTrends: [
            { date: '2025-01-01', revenue: 75000 },
            { date: '2025-01-02', revenue: 82000 },
            { date: '2025-01-03', revenue: 78000 },
            { date: '2025-01-04', revenue: 91000 },
            { date: '2025-01-05', revenue: 88000 },
            { date: '2025-01-06', revenue: 95000 },
            { date: '2025-01-07', revenue: 102000 },
            { date: '2025-01-08', revenue: 89000 },
            { date: '2025-01-09', revenue: 97000 },
            { date: '2025-01-10', revenue: 105000 },
            { date: '2025-01-11', revenue: 112000 },
            { date: '2025-01-12', revenue: 98000 },
            { date: '2025-01-13', revenue: 108000 },
            { date: '2025-01-14', revenue: 115000 },
            { date: '2025-01-15', revenue: 125000 },
            { date: '2025-01-16', revenue: 118000 },
            { date: '2025-01-17', revenue: 132000 },
            { date: '2025-01-18', revenue: 128000 },
            { date: '2025-01-19', revenue: 135000 },
            { date: '2025-01-20', revenue: 142000 },
            { date: '2025-01-21', revenue: 138000 }
        ],
        staffPerformance: [
            { name: 'John Mwangi', sales: 185000, location: 'Nairobi', color: '#3498db' },
            { name: 'Susan Akinyi', sales: 142000, location: 'Mombasa', color: '#2ecc71' },
            { name: 'David Omondi', sales: 128000, location: 'Nairobi', color: '#f1c40f' },
            { name: 'Grace Wambui', sales: 115000, location: 'Kisumu', color: '#e74c3c' },
            { name: 'Peter Kamau', sales: 98000, location: 'Nakuru', color: '#9b59b6' },
            { name: 'Mary Njeri', sales: 87000, location: 'Eldoret', color: '#34495e' }
        ],
        productCategories: [
            { category: 'Casual Wear', sales: 890000, color: '#3498db' },
            { category: 'Formal Wear', sales: 650000, color: '#2ecc71' },
            { category: 'Sportswear', sales: 480000, color: '#f1c40f' },
            { category: 'Accessories', sales: 280000, color: '#e74c3c' },
            { category: 'Footwear', sales: 150000, color: '#9b59b6' }
        ],
        detailedReports: [
            { date: '2025-01-21', location: 'Nairobi', revenue: 138000, transactions: 104, staff: 12, performance: 'excellent' },
            { date: '2025-01-21', location: 'Mombasa', revenue: 95000, transactions: 71, staff: 8, performance: 'good' },
            { date: '2025-01-21', location: 'Kisumu', revenue: 62000, transactions: 47, staff: 6, performance: 'good' },
            { date: '2025-01-21', location: 'Nakuru', revenue: 41000, transactions: 31, staff: 4, performance: 'average' },
            { date: '2025-01-21', location: 'Eldoret', revenue: 18000, transactions: 13, staff: 3, performance: 'average' },
            { date: '2025-01-20', location: 'Nairobi', revenue: 142000, transactions: 107, staff: 12, performance: 'excellent' },
            { date: '2025-01-20', location: 'Mombasa', revenue: 98000, transactions: 74, staff: 8, performance: 'excellent' },
            { date: '2025-01-20', location: 'Kisumu', revenue: 65000, transactions: 49, staff: 6, performance: 'good' },
            { date: '2025-01-20', location: 'Nakuru', revenue: 43000, transactions: 32, staff: 4, performance: 'good' },
            { date: '2025-01-20', location: 'Eldoret', revenue: 19000, transactions: 14, staff: 3, performance: 'average' },
            { date: '2025-01-19', location: 'Nairobi', revenue: 135000, transactions: 102, staff: 12, performance: 'excellent' },
            { date: '2025-01-19', location: 'Mombasa', revenue: 92000, transactions: 69, staff: 8, performance: 'good' },
            { date: '2025-01-19', location: 'Kisumu', revenue: 61000, transactions: 46, staff: 6, performance: 'good' },
            { date: '2025-01-19', location: 'Nakuru', revenue: 40000, transactions: 30, staff: 4, performance: 'average' },
            { date: '2025-01-19', location: 'Eldoret', revenue: 17000, transactions: 13, staff: 3, performance: 'poor' },
            { date: '2025-01-18', location: 'Nairobi', revenue: 128000, transactions: 96, staff: 12, performance: 'excellent' },
            { date: '2025-01-18', location: 'Mombasa', revenue: 87000, transactions: 66, staff: 8, performance: 'good' },
            { date: '2025-01-18', location: 'Kisumu', revenue: 58000, transactions: 44, staff: 6, performance: 'average' },
            { date: '2025-01-18', location: 'Nakuru', revenue: 38000, transactions: 29, staff: 4, performance: 'average' },
            { date: '2025-01-18', location: 'Eldoret', revenue: 16000, transactions: 12, staff: 3, performance: 'poor' }
        ]
    };

    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredData = [...reportsData.detailedReports];
    let sortColumn = null;
    let sortDirection = 'asc';
    let selectedExportFormat = null;

    // Initialize the page
    function initPage() {
        // Set summary numbers
        document.getElementById('totalRevenue').textContent = formatCurrency(reportsData.summary.totalRevenue);
        document.getElementById('totalTransactions').textContent = formatNumber(reportsData.summary.totalTransactions);
        document.getElementById('avgTransaction').textContent = formatCurrency(reportsData.summary.avgTransaction);
        document.getElementById('topLocation').textContent = reportsData.summary.topLocation;

        // Initialize charts
        initCharts();

        // Load reports table
        loadReportsTable();

        // Set default dates
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        document.getElementById('dateTo').value = today.toISOString().split('T')[0];
        document.getElementById('dateFrom').value = thirtyDaysAgo.toISOString().split('T')[0];

        // Hide loading overlay
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

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-KE').format(number);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Initialize charts
    function initCharts() {
        // Sales by Location Chart
        const salesCtx = document.getElementById('salesByLocationCanvas').getContext('2d');
        new Chart(salesCtx, {
            type: 'bar',
            data: {
                labels: reportsData.salesByLocation.map(item => item.location),
                datasets: [{
                    label: 'Revenue (KES)',
                    data: reportsData.salesByLocation.map(item => item.revenue),
                    backgroundColor: reportsData.salesByLocation.map(item => item.color),
                    borderColor: reportsData.salesByLocation.map(item => item.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Revenue: KES ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KES ' + formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });

        // Revenue Trends Chart
        const trendsCtx = document.getElementById('revenueTrendsCanvas').getContext('2d');
        new Chart(trendsCtx, {
            type: 'line',
            data: {
                labels: reportsData.revenueTrends.map(item => formatDate(item.date)),
                datasets: [{
                    label: 'Daily Revenue (KES)',
                    data: reportsData.revenueTrends.map(item => item.revenue),
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Revenue: KES ${formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'KES ' + formatCurrency(value);
                            }
                        }
                    }
                }
            }
        });

        // Staff Performance Chart
        const staffCtx = document.getElementById('staffPerformanceCanvas').getContext('2d');
        new Chart(staffCtx, {
            type: 'doughnut',
            data: {
                labels: reportsData.staffPerformance.map(item => item.name),
                datasets: [{
                    data: reportsData.staffPerformance.map(item => item.sales),
                    backgroundColor: reportsData.staffPerformance.map(item => item.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const staff = reportsData.staffPerformance[context.dataIndex];
                                return `${staff.name}: KES ${formatCurrency(context.parsed)} (${staff.location})`;
                            }
                        }
                    }
                }
            }
        });

        // Product Categories Chart
        const categoriesCtx = document.getElementById('productCategoriesCanvas').getContext('2d');
        new Chart(categoriesCtx, {
            type: 'pie',
            data: {
                labels: reportsData.productCategories.map(item => item.category),
                datasets: [{
                    data: reportsData.productCategories.map(item => item.sales),
                    backgroundColor: reportsData.productCategories.map(item => item.color),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: KES ${formatCurrency(context.parsed)}`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Load reports table
    function loadReportsTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);

        let html = '';
        if (pageData.length === 0) {
            html = '<tr><td colspan="7" class="loading-table">No data available</td></tr>';
        } else {
            pageData.forEach(report => {
                html += `
                    <tr>
                        <td>${formatDate(report.date)}</td>
                        <td>${report.location}</td>
                        <td>KES ${formatCurrency(report.revenue)}</td>
                        <td>${formatNumber(report.transactions)}</td>
                        <td>${report.staff}</td>
                        <td><span class="performance-indicator ${report.performance}">${report.performance}</span></td>
                        <td>
                            <button class="action-btn" title="View Details" onclick="viewReportDetails('${report.date}', '${report.location}')">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="action-btn" title="Edit" onclick="editReport('${report.date}', '${report.location}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn" title="Delete" onclick="deleteReport('${report.date}', '${report.location}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
        }

        reportsTableBody.innerHTML = html;
        updatePagination();
    }

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

        let html = `
            <button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // Page numbers
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            html += `
                <button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        }

        html += `
            <button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="page-info">
                Showing ${startItem}-${endItem} of ${filteredData.length} entries
            </div>
        `;

        pagination.innerHTML = html;
    }

    // Change page
    window.changePage = function(page) {
        currentPage = page;
        loadReportsTable();
    };

    // Sort table
    function sortTable(column) {
        if (sortColumn === column) {
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }

        // Update sort indicators
        document.querySelectorAll('.sortable').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
        });

        const currentTh = document.querySelector(`[data-column="${column}"]`);
        currentTh.classList.add(`sorted-${sortDirection}`);

        // Sort data
        filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            if (column === 'date') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        currentPage = 1;
        loadReportsTable();
    }

    // Filter reports
    function filterReports() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const location = document.getElementById('locationFilter').value;

        filteredData = reportsData.detailedReports.filter(report => {
            const reportDate = new Date(report.date);
            const fromDate = dateFrom ? new Date(dateFrom) : null;
            const toDate = dateTo ? new Date(dateTo) : null;

            const dateMatch = (!fromDate || reportDate >= fromDate) &&
                            (!toDate || reportDate <= toDate);
            const locationMatch = location === 'all' || report.location === location;

            return dateMatch && locationMatch;
        });

        currentPage = 1;
        loadReportsTable();
    }

    // Report action functions
    window.viewReportDetails = function(date, location) {
        const report = reportsData.detailedReports.find(r => r.date === date && r.location === location);
        if (report) {
            const content = `
                <div class="report-details">
                    <h4>Report Details for ${location} - ${formatDate(date)}</h4>
                    <div class="details-grid">
                        <div class="detail-item">
                            <label>Revenue:</label>
                            <span>KES ${formatCurrency(report.revenue)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Transactions:</label>
                            <span>${formatNumber(report.transactions)}</span>
                        </div>
                        <div class="detail-item">
                            <label>Staff Count:</label>
                            <span>${report.staff}</span>
                        </div>
                        <div class="detail-item">
                            <label>Performance:</label>
                            <span class="performance-indicator ${report.performance}">${report.performance}</span>
                        </div>
                        <div class="detail-item">
                            <label>Average per Transaction:</label>
                            <span>KES ${formatCurrency(Math.round(report.revenue / report.transactions))}</span>
                        </div>
                        <div class="detail-item">
                            <label>Revenue per Staff:</label>
                            <span>KES ${formatCurrency(Math.round(report.revenue / report.staff))}</span>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('reportDetailsContent').innerHTML = content;
            reportDetailsModal.classList.add('active');
        }
    };

    window.editReport = function(date, location) {
        alert(`Edit functionality for ${location} on ${formatDate(date)} would be implemented here.`);
    };

    window.deleteReport = function(date, location) {
        if (confirm(`Are you sure you want to delete the report for ${location} on ${formatDate(date)}?`)) {
            alert('Report deleted successfully!');
        }
    };

    // Event Listeners
    generateReportBtn.addEventListener('click', function() {
        morphOverlay.classList.add('active');
        setTimeout(() => {
            filterReports();
            morphOverlay.classList.remove('active');
        }, 1000);
    });

    refreshDataBtn.addEventListener('click', function() {
        morphOverlay.classList.add('active');
        setTimeout(() => {
            filteredData = [...reportsData.detailedReports];
            currentPage = 1;
            loadReportsTable();
            morphOverlay.classList.remove('active');
        }, 500);
    });

    exportReportBtn.addEventListener('click', function() {
        exportModal.classList.add('active');
    });

    exportTableBtn.addEventListener('click', function() {
        exportModal.classList.add('active');
    });

    // Export modal functionality
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.export-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedExportFormat = this.dataset.format;
            confirmExport.disabled = false;
        });
    });

    confirmExport.addEventListener('click', function() {
        if (selectedExportFormat) {
            alert(`Exporting report as ${selectedExportFormat.toUpperCase()}...`);
            exportModal.classList.remove('active');
            selectedExportFormat = null;
            confirmExport.disabled = true;
            document.querySelectorAll('.export-option').forEach(opt => opt.classList.remove('selected'));
        }
    });

    // Modal close handlers
    exportModalClose.addEventListener('click', () => exportModal.classList.remove('active'));
    cancelExport.addEventListener('click', () => exportModal.classList.remove('active'));
    detailsModalClose.addEventListener('click', () => reportDetailsModal.classList.remove('active'));

    // Close modals when clicking outside
    exportModal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
    });

    reportDetailsModal.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('active');
    });

    // Table sorting
    document.querySelectorAll('.sortable').forEach(th => {
        th.addEventListener('click', function() {
            sortTable(this.dataset.column);
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('operationsTheme', newTheme);

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

    // Check for saved theme
    const savedTheme = localStorage.getItem('operationsTheme');
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