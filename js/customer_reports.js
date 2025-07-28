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

    // Sample report data
    const reportData = {
        metrics: [
            { metric: "New Customers", current: "245", previous: "210", change: "+16.7%", trend: "up" },
            { metric: "Repeat Customers", current: "520", previous: "450", change: "+15.6%", trend: "up" },
            { metric: "Loyalty Signups", current: "180", previous: "150", change: "+20.0%", trend: "up" },
            { metric: "Avg. Order Value", current: "KES 3,450", previous: "KES 3,200", change: "+7.8%", trend: "up" },
            { metric: "Customer Satisfaction", current: "4.2", previous: "4.5", change: "-6.7%", trend: "down" },
            { metric: "Feedback Response Time", current: "4.2 hrs", previous: "3.8 hrs", change: "+10.5%", trend: "down" },
            { metric: "Email Open Rate", current: "32.5%", previous: "30.1%", change: "+8.0%", trend: "up" },
            { metric: "Email Click Rate", current: "8.7%", previous: "9.2%", change: "-5.4%", trend: "down" }
        ],
        customerGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            newCustomers: [120, 150, 180, 210, 190, 280],
            returningCustomers: [420, 450, 480, 520, 490, 620]
        },
        customerLocations: {
            labels: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Other'],
            data: [1250, 450, 320, 210, 220],
            colors: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6']
        },
        loyaltyTiers: {
            labels: ['Silver', 'Gold', 'Platinum'],
            data: [650, 350, 240],
            colors: ['#C0C0C0', '#FFD700', '#3498db']
        },
        feedbackSentiment: {
            labels: ['Positive', 'Negative', 'Neutral'],
            data: [78, 12, 10],
            colors: ['#2ecc71', '#e74c3c', '#95a5a6']
        },
        campaignPerformance: {
            labels: ['Open Rate', 'Click Rate', 'Conversion Rate'],
            data: [32.5, 8.7, 3.2],
            colors: ['#3498db', '#f1c40f', '#2ecc71']
        }
    };

    // Chart instances
    let customerGrowthChart, customerLocationsChart, loyaltyTiersChart, feedbackSentimentChart, campaignPerformanceChart;

    // Initialize the page
    function initPage() {
        // Load metrics table
        loadMetricsTable();

        // Initialize charts
        initCharts();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 800);
    }

    // Load metrics into the table
    function loadMetricsTable() {
        let html = '';

        reportData.metrics.forEach(item => {
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
    function initCharts() {
        // Customer Growth Chart
        const growthCtx = document.getElementById('customerGrowthChart').getContext('2d');
        customerGrowthChart = new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: reportData.customerGrowth.labels,
                datasets: [
                    {
                        label: 'New Customers',
                        data: reportData.customerGrowth.newCustomers,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Returning Customers',
                        data: reportData.customerGrowth.returningCustomers,
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
                labels: reportData.customerLocations.labels,
                datasets: [{
                    data: reportData.customerLocations.data,
                    backgroundColor: reportData.customerLocations.colors,
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
                labels: reportData.loyaltyTiers.labels,
                datasets: [{
                    data: reportData.loyaltyTiers.data,
                    backgroundColor: reportData.loyaltyTiers.colors,
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
                labels: reportData.feedbackSentiment.labels,
                datasets: [{
                    data: reportData.feedbackSentiment.data,
                    backgroundColor: reportData.feedbackSentiment.colors,
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
                labels: reportData.campaignPerformance.labels,
                datasets: [{
                    data: reportData.campaignPerformance.data,
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
    generateReportBtn.addEventListener('click', function() {
        // In a real app, this would regenerate the report with new filters
        alert('Generating report with selected filters...');
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