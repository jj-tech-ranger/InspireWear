document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const reportType = document.getElementById('reportType');
    const reportPeriod = document.getElementById('reportPeriod');
    const customDateRange = document.getElementById('customDateRange');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    const generateReport = document.getElementById('generateReport');
    const exportPDF = document.getElementById('exportPDF');
    const exportExcel = document.getElementById('exportExcel');
    const scheduleReport = document.getElementById('scheduleReport');
    const scheduleReportModal = document.getElementById('scheduleReportModal');
    const modalClose = document.getElementById('modalClose');
    const cancelSchedule = document.getElementById('cancelSchedule');
    const scheduleReportForm = document.getElementById('scheduleReportForm');
    const scheduleFrequency = document.getElementById('scheduleFrequency');
    const weeklyDayGroup = document.getElementById('weeklyDayGroup');
    const monthlyDateGroup = document.getElementById('monthlyDateGroup');
    const reportContent = document.getElementById('reportContent');

    // Chart variables
    let revenueExpensesChart = null;
    let expenseBreakdownChart = null;

    // Initialize the page
    async function initPage() {
        try {
            await generateReportContent();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Format currency for KES
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
    }

    // Format percentage
    function formatPercentage(value) {
        return value.toFixed(1) + '%';
    }

    // Generate report content based on selected type
    async function generateReportContent() {
        const type = reportType.value;
        const period = reportPeriod.value;
        const from = dateFrom.value;
        const to = dateTo.value;

        const params = new URLSearchParams({
            type,
            period,
            from,
            to,
        });

        try {
            const reportData = await fetch(`/api/reports/generate/?${params.toString()}`).then(res => res.json());
            
            // Update summary cards
            document.getElementById('totalRevenue').textContent = formatCurrency(reportData.summary.total_revenue);
            document.getElementById('totalExpenses').textContent = formatCurrency(reportData.summary.total_expenses);
            document.getElementById('netProfit').textContent = formatCurrency(reportData.summary.net_profit);
            document.getElementById('profitMargin').textContent = reportData.summary.profit_margin;

            // Update charts
            updateCharts(reportData);

            // Render the specific report table
            let content = '';
            switch (type) {
                case 'profit_loss':
                    content = generateProfitLossReport(reportData.details);
                    break;
                // Add cases for other report types
                default:
                    content = '<p>Select a report type to view details.</p>';
            }
            reportContent.innerHTML = content;

        } catch (error) {
            console.error('Error generating report content:', error);
            reportContent.innerHTML = '<p>Error generating report.</p>';
        }
    }

    function updateCharts(reportData) {
        if (revenueExpensesChart) revenueExpensesChart.destroy();
        const revenueCtx = document.getElementById('revenueExpensesChart').getContext('2d');
        revenueExpensesChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: reportData.charts.revenue_expenses.labels,
                datasets: [
                    {
                        label: 'Revenue',
                        data: reportData.charts.revenue_expenses.revenue,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        fill: true
                    },
                    {
                        label: 'Expenses',
                        data: reportData.charts.revenue_expenses.expenses,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        fill: true
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        if (expenseBreakdownChart) expenseBreakdownChart.destroy();
        const expenseCtx = document.getElementById('expenseBreakdownChart').getContext('2d');
        expenseBreakdownChart = new Chart(expenseCtx, {
            type: 'doughnut',
            data: {
                labels: reportData.charts.expense_breakdown.labels,
                datasets: [{
                    data: reportData.charts.expense_breakdown.data,
                    backgroundColor: ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function generateProfitLossReport(data) {
        // This function would generate the HTML table for the P&L report
        return '<table>... P&L Report ...</table>';
    }

    // Event Listeners
    generateReport.addEventListener('click', generateReportContent);

    // Theme Toggle and other UI event listeners...
    
    // Initial page load
    initPage();
});
