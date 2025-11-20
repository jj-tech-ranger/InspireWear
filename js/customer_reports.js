document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const reportType = document.getElementById('reportType');
    const timePeriod = document.getElementById('timePeriod');
    const customDateRange = document.getElementById('customDateRange');
    const locationFilter = document.getElementById('locationFilter');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const exportReportBtn = document.getElementById('exportReportBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const metricsTable = document.getElementById('metricsTable');
    const fullscreenChartModal = document.getElementById('fullscreenChartModal');
    const fullscreenModalClose = document.getElementById('fullscreenModalClose');
    const fullscreenChartTitle = document.getElementById('fullscreenChartTitle');
    const fullscreenChart = document.getElementById('fullscreenChart');

    // Chart instances
    let customerGrowthChart, customerLocationsChart, loyaltyTiersChart, feedbackSentimentChart, campaignPerformanceChart;

    // Initialize the page
    async function initPage() {
        try {
            const reportData = await fetch('/api/reports/customers/').then(res => res.json());
            // Load metrics table
            loadMetricsTable(reportData.metrics);

            // Initialize charts
            initCharts(reportData);
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 800);
        }
    }

    // Load metrics into the table
    function loadMetricsTable(metrics) {
        let html = '';

        metrics.forEach(item => {
            html += `
                <tr>
                    <td>${item.metric}</td>
                    <td>${item.current}</td>
                    <td>${item.previous}</td>
                    <td>${item.change}</td>
                    <td><i class="fas fa-arrow-${item.trend} trend-icon ${item.trend === 'up' ? 'positive' : 'negative'}"></i></td>
                </tr>
            `;
        });

        metricsTable.innerHTML = html;
    }

    // Initialize charts
    function initCharts(reportData) {
        // Customer Growth Chart
        const growthCtx = document.getElementById('customerGrowthChart').getContext('2d');
        customerGrowthChart = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: reportData.customer_growth.labels,
                datasets: [
                    {
                        label: 'New Customers',
                        data: reportData.customer_growth.new_customers,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Returning Customers',
                        data: reportData.customer_growth.returning_customers,
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Customer Locations Chart
        const locationsCtx = document.getElementById('customerLocationsChart').getContext('2d');
        customerLocationsChart = new Chart(locationsCtx, {
            type: 'doughnut',
            data: {
                labels: reportData.customer_locations.labels,
                datasets: [{
                    data: reportData.customer_locations.data,
                    backgroundColor: reportData.customer_locations.colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });

        // Loyalty Tiers Chart
        const tiersCtx = document.getElementById('loyaltyTiersChart').getContext('2d');
        loyaltyTiersChart = new Chart(tiersCtx, {
            type: 'pie',
            data: {
                labels: reportData.loyalty_tiers.labels,
                datasets: [{
                    data: reportData.loyalty_tiers.data,
                    backgroundColor: reportData.loyalty_tiers.colors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });

        // Feedback Sentiment Chart
        const sentimentCtx = document.getElementById('feedbackSentimentChart').getContext('2d');
        feedbackSentimentChart = new Chart(sentimentCtx, {
            type: 'bar',
            data: {
                labels: reportData.feedback_sentiment.labels,
                datasets: [{
                    data: reportData.feedback_sentiment.data,
                    backgroundColor: reportData.feedback_sentiment.colors,
                    borderWidth: 1
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
                        max: 100
                    }
                }
            }
        });

        // Campaign Performance Chart
        const campaignCtx = document.getElementById('campaignPerformanceChart').getContext('2d');
        campaignPerformanceChart = new Chart(campaignCtx, {
            type: 'radar',
            data: {
                labels: reportData.campaign_performance.labels,
                datasets: [{
                    data: reportData.campaign_performance.data,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 50
                    }
                }
            }
        });

        // Add click event to chart action buttons
        document.querySelectorAll('.chart-action-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const chartTitle = this.closest('.chart-header').querySelector('h3').textContent;
                openFullscreenChart(chartTitle);
            });
        });
    }

    // Open chart in fullscreen modal
    function openFullscreenChart(title) {
        fullscreenChartTitle.textContent = title;

        // Clone the appropriate chart data
        let chartConfig;
        switch(title) {
            case 'Customer Growth Trend':
                chartConfig = customerGrowthChart.config;
                break;
            case 'Customer Locations':
                chartConfig = customerLocationsChart.config;
                break;
            case 'Loyalty Tier Distribution':
                chartConfig = loyaltyTiersChart.config;
                break;
            case 'Feedback Sentiment':
                chartConfig = feedbackSentimentChart.config;
                break;
            case 'Campaign Performance':
                chartConfig = campaignPerformanceChart.config;
                break;
        }

        // Destroy previous chart if exists
        if (window.fullscreenChartInstance) {
            window.fullscreenChartInstance.destroy();
        }

        // Create new chart in modal
        const ctx = fullscreenChart.getContext('2d');
        window.fullscreenChartInstance = new Chart(ctx, chartConfig);

        fullscreenChartModal.classList.add('active');
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('crmTheme', newTheme);

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

    // Time period filter change
    timePeriod.addEventListener('change', function() {
        customDateRange.style.display = this.value === 'custom' ? 'flex' : 'none';
    });

    // Generate report button
    generateReportBtn.addEventListener('click', async function() {
        const params = new URLSearchParams({
            report_type: reportType.value,
            time_period: timePeriod.value,
            location: locationFilter.value,
            date_from: document.getElementById('dateFrom').value,
            date_to: document.getElementById('dateTo').value,
        });

        try {
            const reportData = await fetch(`/api/reports/customers/?${params.toString()}`).then(res => res.json());
            loadMetricsTable(reportData.metrics);
            initCharts(reportData);
            alert('Generating report with selected filters...');
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report.');
        }
    });

    // Export buttons
    exportReportBtn.addEventListener('click', function() {
        alert('Exporting report as PDF...');
    });

    exportDataBtn.addEventListener('click', function() {
        alert('Exporting data as CSV...');
    });

    // Fullscreen modal close
    fullscreenModalClose.addEventListener('click', function() {
        fullscreenChartModal.classList.remove('active');
    });

    // Close modal when clicking outside
    fullscreenChartModal.addEventListener('click', function(e) {
        if (e.target === this) {
            fullscreenChartModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('crmTheme');
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