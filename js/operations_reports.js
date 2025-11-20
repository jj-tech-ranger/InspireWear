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

    // Pagination state
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredData = [];
    let sortColumn = null;
    let sortDirection = 'asc';
    let selectedExportFormat = null;

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/reports/operations/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('totalRevenue').textContent = formatCurrency(summary.total_revenue);
            document.getElementById('totalTransactions').textContent = formatNumber(summary.total_transactions);
            document.getElementById('avgTransaction').textContent = formatCurrency(summary.avg_transaction);
            document.getElementById('topLocation').textContent = summary.top_location;

            // Initialize charts
            await initCharts();

            // Load reports table
            await loadReportsTable();

            // Set default dates
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            document.getElementById('dateTo').value = today.toISOString().split('T')[0];
            document.getElementById('dateFrom').value = thirtyDaysAgo.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay
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
    async function initCharts() {
        try {
            const chartData = await fetch('/api/reports/operations/charts/').then(res => res.json());
            // Sales by Location Chart
            const salesCtx = document.getElementById('salesByLocationCanvas').getContext('2d');
            new Chart(salesCtx, {
                type: 'bar',
                data: {
                    labels: chartData.sales_by_location.map(item => item.location),
                    datasets: [{
                        label: 'Revenue (KES)',
                        data: chartData.sales_by_location.map(item => item.revenue),
                        backgroundColor: chartData.sales_by_location.map(item => item.color),
                        borderColor: chartData.sales_by_location.map(item => item.color),
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
                    labels: chartData.revenue_trends.map(item => formatDate(item.date)),
                    datasets: [{
                        label: 'Daily Revenue (KES)',
                        data: chartData.revenue_trends.map(item => item.revenue),
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
                    labels: chartData.staff_performance.map(item => item.name),
                    datasets: [{
                        data: chartData.staff_performance.map(item => item.sales),
                        backgroundColor: chartData.staff_performance.map(item => item.color),
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
                                    const staff = chartData.staff_performance[context.dataIndex];
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
                    labels: chartData.product_categories.map(item => item.category),
                    datasets: [{
                        data: chartData.product_categories.map(item => item.sales),
                        backgroundColor: chartData.product_categories.map(item => item.color),
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
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    // Load reports table
    async function loadReportsTable() {
        await filterReports();
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
    async function filterReports() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const location = document.getElementById('locationFilter').value;

        const params = new URLSearchParams({
            date_from: dateFrom,
            date_to: dateTo,
            location: location,
        });

        try {
            const data = await fetch(`/api/reports/operations/detailed/?${params.toString()}`).then(res => res.json());
            filteredData = data;
            currentPage = 1;
        } catch (error) {
            console.error('Error filtering reports:', error);
        }
    }

    // Report action functions
    window.viewReportDetails = async function(date, location) {
        const report = await fetch(`/api/reports/operations/detailed-report/?date=${date}&location=${location}`).then(res => res.json());
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

    window.deleteReport = async function(date, location) {
        if (confirm(`Are you sure you want to delete the report for ${location} on ${formatDate(date)}?`)) {
            try {
                const response = await fetch(`/api/reports/operations/detailed-report/?date=${date}&location=${location}`, { method: 'DELETE' });
                if (response.ok) {
                    await loadReportsTable();
                    alert('Report deleted successfully!');
                } else {
                    alert('Failed to delete report.');
                }
            } catch (error) {
                console.error('Error deleting report:', error);
                alert('An error occurred while deleting the report.');
            }
        }
    };

    // Event Listeners
    generateReportBtn.addEventListener('click', async function() {
        morphOverlay.classList.add('active');
        await loadReportsTable();
        morphOverlay.classList.remove('active');
    });

    refreshDataBtn.addEventListener('click', async function() {
        morphOverlay.classList.add('active');
        await initPage();
        morphOverlay.classList.remove('active');
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