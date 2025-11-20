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
            const summary = await fetch('/api/reports/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('totalRevenue').textContent = formatCurrency(summary.total_revenue);
            document.getElementById('totalExpenses').textContent = formatCurrency(summary.total_expenses);
            document.getElementById('netProfit').textContent = formatCurrency(summary.net_profit);
            document.getElementById('profitMargin').textContent = summary.profit_margin;

            // Set default dates
            const today = new Date();
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            dateTo.value = today.toISOString().split('T')[0];
            dateFrom.value = firstDayOfMonth.toISOString().split('T')[0];

            // Initialize charts
            await initializeCharts();

            // Generate default report
            await generateReportContent();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay
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

    // Initialize charts
    async function initializeCharts() {
        try {
            const chartData = await fetch('/api/reports/charts/').then(res => res.json());
            // Revenue vs Expenses Chart
            const revenueCtx = document.getElementById('revenueExpensesChart').getContext('2d');
            revenueExpensesChart = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: chartData.monthly_data.months,
                    datasets: [{
                        label: 'Revenue',
                        data: chartData.monthly_data.revenue,
                        borderColor: '#2ecc71',
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Expenses',
                        data: chartData.monthly_data.expenses,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': KSh ' + formatCurrency(context.parsed.y);
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'KSh ' + formatCurrency(value);
                                }
                            }
                        }
                    }
                }
            });

            // Expense Breakdown Chart
            const expenseCtx = document.getElementById('expenseBreakdownChart').getContext('2d');
            expenseBreakdownChart = new Chart(expenseCtx, {
                type: 'doughnut',
                data: {
                    labels: chartData.expense_breakdown.labels,
                    datasets: [{
                        data: chartData.expense_breakdown.amounts,
                        backgroundColor: chartData.expense_breakdown.colors,
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return context.label + ': KSh ' + formatCurrency(context.parsed) + ' (' + percentage + '%)';
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
            let content = '';
            
            switch (type) {
                case 'profit_loss':
                    content = generateProfitLossReport(reportData);
                    break;
                case 'balance_sheet':
                    content = generateBalanceSheetReport(reportData);
                    break;
                case 'cash_flow':
                    content = generateCashFlowReport(reportData);
                    break;
                case 'expense_report':
                    content = generateExpenseReport(reportData);
                    break;
                case 'revenue_analysis':
                    content = generateRevenueAnalysisReport(reportData);
                    break;
                case 'budget_variance':
                    content = generateBudgetVarianceReport(reportData);
                    break;
                default:
                    content = generateProfitLossReport(reportData);
            }
            
            reportContent.innerHTML = content;
        } catch (error) {
            console.error('Error generating report content:', error);
            reportContent.innerHTML = '<p>Error generating report.</p>';
        }
    }

    // Generate Profit & Loss Statement
    function generateProfitLossReport(data) {
        const grossProfit = data.revenue.total - data.expenses.cost_of_goods_sold;
        const operatingExpenses = data.expenses.total - data.expenses.cost_of_goods_sold;
        const operatingIncome = grossProfit - operatingExpenses;
        
        return `
            <div class="report-header">
                <div class="company-name">InspireWear</div>
                <h2>Profit & Loss Statement</h2>
                <div class="report-period">For the Month Ended January 31, 2025</div>
            </div>
            
            <div class="report-section">
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KSh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="section-header">
                            <td><strong>REVENUE</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Sales Revenue</td>
                            <td data-label="Amount">${formatCurrency(data.revenue.sales)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Other Income</td>
                            <td data-label="Amount">${formatCurrency(data.revenue.other_income)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Revenue</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.revenue.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>COST OF GOODS SOLD</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Raw Materials & Direct Labor</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.cost_of_goods_sold)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Gross Profit</strong></td>
                            <td data-label="Amount"><strong class="${grossProfit >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(grossProfit)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>OPERATING EXPENSES</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Salaries & Wages</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.salaries_wages)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Rent</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.rent)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Utilities</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.utilities)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Marketing</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.marketing)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Transport</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.transport)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Depreciation</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.depreciation)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Other Expenses</td>
                            <td data-label="Amount">${formatCurrency(data.expenses.other)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Operating Expenses</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(operatingExpenses)}</strong></td>
                        </tr>
                        
                        <tr class="grand-total">
                            <td><strong>NET INCOME</strong></td>
                            <td data-label="Amount"><strong class="${data.net_income >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.net_income)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="key-metrics">
                <div class="metric-card">
                    <h5>Gross Profit Margin</h5>
                    <div class="metric-value">${formatPercentage((grossProfit / data.revenue.total) * 100)}</div>
                </div>
                <div class="metric-card">
                    <h5>Operating Margin</h5>
                    <div class="metric-value">${formatPercentage((operatingIncome / data.revenue.total) * 100)}</div>
                </div>
                <div class="metric-card">
                    <h5>Net Profit Margin</h5>
                    <div class="metric-value">${formatPercentage((data.net_income / data.revenue.total) * 100)}</div>
                </div>
            </div>
        `;
    }

    // Generate Balance Sheet Report
    function generateBalanceSheetReport(data) {
        return `
            <div class="report-header">
                <div class="company-name">InspireWear</div>
                <h2>Balance Sheet</h2>
                <div class="report-period">As at January 31, 2025</div>
            </div>
            
            <div class="balance-sheet-section">
                <h4>ASSETS</h4>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KSh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="section-header">
                            <td><strong>Current Assets</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Cash and Cash Equivalents</td>
                            <td data-label="Amount">${formatCurrency(data.assets.current_assets.cash)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accounts Receivable</td>
                            <td data-label="Amount">${formatCurrency(data.assets.current_assets.accounts_receivable)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Inventory</td>
                            <td data-label="Amount">${formatCurrency(data.assets.current_assets.inventory)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Prepaid Expenses</td>
                            <td data-label="Amount">${formatCurrency(data.assets.current_assets.prepaid_expenses)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Current Assets</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.assets.current_assets.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>Fixed Assets</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Equipment</td>
                            <td data-label="Amount">${formatCurrency(data.assets.fixed_assets.equipment)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Furniture & Fixtures</td>
                            <td data-label="Amount">${formatCurrency(data.assets.fixed_assets.furniture)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Vehicles</td>
                            <td data-label="Amount">${formatCurrency(data.assets.fixed_assets.vehicles)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Less: Accumulated Depreciation</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.assets.fixed_assets.accumulated_depreciation))})</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Fixed Assets</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.assets.fixed_assets.total)}</strong></td>
                        </tr>
                        
                        <tr class="grand-total">
                            <td><strong>TOTAL ASSETS</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.assets.total_assets)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="balance-sheet-section">
                <h4>LIABILITIES & EQUITY</h4>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KSh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="section-header">
                            <td><strong>Current Liabilities</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accounts Payable</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.current_liabilities.accounts_payable)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Short-term Loans</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.current_liabilities.short_term_loans)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accrued Expenses</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.current_liabilities.accrued_expenses)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Current Liabilities</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.current_liabilities.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>Long-term Liabilities</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Long-term Loans</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.long_term_liabilities.long_term_loans)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Long-term Liabilities</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.long_term_liabilities.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-total">
                            <td><strong>Total Liabilities</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.total_liabilities)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>Equity</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Share Capital</td>
                            <td data-label="Amount">${formatCurrency(data.equity.share_capital)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Retained Earnings</td>
                            <td data-label="Amount">${formatCurrency(data.equity.retained_earnings)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Equity</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.equity.total)}</strong></td>
                        </tr>
                        
                        <tr class="grand-total">
                            <td><strong>TOTAL LIABILITIES & EQUITY</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.total_liabilities + data.equity.total)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="balance-equation">
                Assets = Liabilities + Equity<br>
                KSh ${formatCurrency(data.assets.total_assets)} = KSh ${formatCurrency(data.liabilities.total_liabilities)} + KSh ${formatCurrency(data.equity.total)}
            </div>
            
            <div class="key-metrics">
                <div class="metric-card">
                    <h5>Current Ratio</h5>
                    <div class="metric-value">${(data.assets.current_assets.total / data.liabilities.current_liabilities.total).toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <h5>Debt-to-Equity Ratio</h5>
                    <div class="metric-value">${(data.liabilities.total_liabilities / data.equity.total).toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <h5>Return on Equity</h5>
                    <div class="metric-value">${formatPercentage((data.net_income / data.equity.total) * 100)}</div>
                </div>
            </div>
        `;
    }

    // Generate Cash Flow Statement
    function generateCashFlowReport(data) {
        return `
            <div class="report-header">
                <div class="company-name">InspireWear</div>
                <h2>Cash Flow Statement</h2>
                <div class="report-period">For the Month Ended January 31, 2025</div>
            </div>
            
            <div class="cash-flow-section">
                <h4>CASH FLOWS FROM OPERATING ACTIVITIES</h4>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KSh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Net Income</td>
                            <td data-label="Amount" class="${data.operating.net_income >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.net_income)}</td>
                        </tr>
                        <tr>
                            <td>Adjustments for:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Depreciation</td>
                            <td data-label="Amount">${formatCurrency(data.operating.depreciation)}</td>
                        </tr>
                        <tr>
                            <td>Changes in Working Capital:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accounts Receivable</td>
                            <td data-label="Amount" class="${data.operating.accounts_receivable_change >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.accounts_receivable_change)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Inventory</td>
                            <td data-label="Amount" class="${data.operating.inventory_change >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.inventory_change)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accounts Payable</td>
                            <td data-label="Amount" class="${data.operating.accounts_payable_change >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.accounts_payable_change)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Net Cash from Operating Activities</strong></td>
                            <td data-label="Amount"><strong class="${data.operating.total >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.total)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="cash-flow-section">
                <h4>CASH FLOWS FROM INVESTING ACTIVITIES</h4>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KSh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Purchase of Equipment</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.investing.equipment_purchase))})</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Net Cash from Investing Activities</strong></td>
                            <td data-label="Amount"><strong class="${data.investing.total >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.investing.total)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="cash-flow-section">
                <h4>CASH FLOWS FROM FINANCING ACTIVITIES</h4>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Amount (KSh)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Loan Proceeds</td>
                            <td data-label="Amount" class="amount-positive">${formatCurrency(data.financing.loan_proceeds)}</td>
                        </tr>
                        <tr>
                            <td>Loan Repayments</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.financing.loan_repayments))})</td>
                        </tr>
                        <tr>
                            <td>Dividends Paid</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.financing.dividends_paid))})</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Net Cash from Financing Activities</strong></td>
                            <td data-label="Amount"><strong class="${data.financing.total >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.financing.total)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="cash-flow-summary">
                <h5>CASH FLOW SUMMARY</h5>
                <table class="financial-table">
                    <tbody>
                        <tr>
                            <td><strong>Net Increase (Decrease) in Cash</strong></td>
                            <td data-label="Amount"><strong class="${data.net_cash_flow >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.net_cash_flow)}</strong></td>
                        </tr>
                        <tr>
                            <td>Cash at Beginning of Period</td>
                            <td data-label="Amount">${formatCurrency(data.beginning_cash)}</td>
                        </tr>
                        <tr class="grand-total">
                            <td><strong>Cash at End of Period</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.ending_cash)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // Generate Expense Report
    function generateExpenseReport(data) {
        const total = data.amounts.reduce((a, b) => a + b, 0);
        
        return `
            <div class="report-header">
                <div class="company-name">InspireWear</div>
                <h2>Expense Analysis Report</h2>
                <div class="report-period">For the Month Ended January 31, 2025</div>
            </div>
            
            <div class="report-section">
                <h3>Expense Breakdown by Category</h3>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount (KSh)</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.labels.map((label, index) => {
                            const percentage = ((data.amounts[index] / total) * 100).toFixed(1);
                            return `
                                <tr>
                                    <td>${label}</td>
                                    <td data-label="Amount">${formatCurrency(data.amounts[index])}</td>
                                    <td data-label="Percentage">${percentage}%</td>
                                </tr>
                            `;
                        }).join('')}
                        <tr class="grand-total">
                            <td><strong>Total Expenses</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(total)}</strong></td>
                            <td data-label="Percentage"><strong>100.0%</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="key-metrics">
                <div class="metric-card">
                    <h5>Largest Expense Category</h5>
                    <div class="metric-value">${data.labels[0]}</div>
                    <div class="metric-change">KSh ${formatCurrency(data.amounts[0])}</div>
                </div>
                <div class="metric-card">
                    <h5>Average Daily Expense</h5>
                    <div class="metric-value">KSh ${formatCurrency(total / 31)}</div>
                    <div class="metric-change">Based on 31 days</div>
                </div>
                <div class="metric-card">
                    <h5>Fixed vs Variable</h5>
                    <div class="metric-value">65% Fixed</div>
                    <div class="metric-change">35% Variable</div>
                </div>
            </div>
        `;
    }

    // Generate Revenue Analysis Report
    function generateRevenueAnalysisReport(data) {
        const monthlyRevenue = data.monthly_revenue;
        const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
        const previousMonth = monthlyRevenue[monthlyRevenue.length - 2];
        const growth = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
        
        return `
            <div class="report-header">
                <div class="company-name">InspireWear</div>
                <h2>Revenue Analysis Report</h2>
                <div class="report-period">For the Month Ended January 31, 2025</div>
            </div>
            
            <div class="report-section">
                <h3>Monthly Revenue Trend</h3>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Revenue (KSh)</th>
                            <th>Growth %</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.months.map((month, index) => {
                            const revenue = monthlyRevenue[index];
                            const prevRevenue = index > 0 ? monthlyRevenue[index - 1] : revenue;
                            const monthGrowth = index > 0 ? ((revenue - prevRevenue) / prevRevenue * 100).toFixed(1) : '0.0';
                            return `
                                <tr>
                                    <td>${month}</td>
                                    <td data-label="Revenue">${formatCurrency(revenue)}</td>
                                    <td data-label="Growth" class="${parseFloat(monthGrowth) >= 0 ? 'amount-positive' : 'amount-negative'}">${monthGrowth}%</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="report-section">
                <h3>Revenue Sources</h3>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Amount (KSh)</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Direct Sales</td>
                            <td data-label="Amount">${formatCurrency(1960000)}</td>
                            <td data-label="Percentage">80.0%</td>
                        </tr>
                        <tr>
                            <td>Online Shop</td>
                            <td data-label="Amount">${formatCurrency(367500)}</td>
                            <td data-label="Percentage">15.0%</td>
                        </tr>
                        <tr>
                            <td>Wholesale</td>
                            <td data-label="Amount">${formatCurrency(122500)}</td>
                            <td data-label="Percentage">5.0%</td>
                        </tr>
                        <tr class="grand-total">
                            <td><strong>Total Revenue</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(2450000)}</strong></td>
                            <td data-label="Percentage"><strong>100.0%</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="key-metrics">
                <div class="metric-card">
                    <h5>Monthly Growth Rate</h5>
                    <div class="metric-value">${growth}%</div>
                    <div class="metric-change ${parseFloat(growth) >= 0 ? 'positive' : 'negative'}">vs Previous Month</div>
                </div>
                <div class="metric-card">
                    <h5>Average Monthly Revenue</h5>
                    <div class="metric-value">KSh ${formatCurrency(monthlyRevenue.reduce((a, b) => a + b, 0) / monthlyRevenue.length)}</div>
                    <div class="metric-change">Last 6 Months</div>
                </div>
                <div class="metric-card">
                    <h5>Revenue per Day</h5>
                    <div class="metric-value">KSh ${formatCurrency(currentMonth / 31)}</div>
                    <div class="metric-change">Current Month</div>
                </div>
            </div>
        `;
    }

    // Generate Budget Variance Report
    function generateBudgetVarianceReport(data) {
        return `
            <div class="report-header">
                <div class="company-name">InspireWear</div>
                <h2>Budget Variance Report</h2>
                <div class="report-period">For the Month Ended January 31, 2025</div>
            </div>
            
            <div class="report-section">
                <h3>Budget vs Actual Performance</h3>
                <table class="financial-table">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Budget (KSh)</th>
                            <th>Actual (KSh)</th>
                            <th>Variance (KSh)</th>
                            <th>Variance %</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => {
                            const variance = item.actual - item.budget;
                            const variancePercent = ((variance / item.budget) * 100).toFixed(1);
                            const isRevenue = item.category === 'Revenue';
                            const isPositive = isRevenue ? variance >= 0 : variance <= 0;
                            
                            return `
                                <tr>
                                    <td>${item.category}</td>
                                    <td data-label="Budget">${formatCurrency(item.budget)}</td>
                                    <td data-label="Actual">${formatCurrency(item.actual)}</td>
                                    <td data-label="Variance" class="${isPositive ? 'amount-positive' : 'amount-negative'}">${variance >= 0 ? '' : '-'}${formatCurrency(Math.abs(variance))}</td>
                                    <td data-label="Variance %" class="${isPositive ? 'amount-positive' : 'amount-negative'}">${variancePercent}%</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="key-metrics">
                <div class="metric-card">
                    <h5>Revenue Variance</h5>
                    <div class="metric-value amount-positive">+6.5%</div>
                    <div class="metric-change positive">Above Budget</div>
                </div>
                <div class="metric-card">
                    <h5>Expense Variance</h5>
                    <div class="metric-value amount-negative">+8.2%</div>
                    <div class="metric-change negative">Over Budget</div>
                </div>
                <div class="metric-card">
                    <h5>Budget Accuracy</h5>
                    <div class="metric-value">92.3%</div>
                    <div class="metric-change">Overall Performance</div>
                </div>
            </div>
        `;
    }

    // Event Listeners
    reportPeriod.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'flex';
        } else {
            customDateRange.style.display = 'none';
        }
    });

    generateReport.addEventListener('click', async function() {
        await generateReportContent();
        alert('Report generated successfully!');
    });

    exportPDF.addEventListener('click', function() {
        window.print();
    });

    exportExcel.addEventListener('click', function() {
        alert('Excel export functionality would be implemented here.');
    });

    scheduleReport.addEventListener('click', function() {
        document.getElementById('scheduleReportType').value = reportType.value;
        scheduleReportModal.classList.add('active');
    });

    scheduleFrequency.addEventListener('change', function() {
        const frequency = this.value;
        
        weeklyDayGroup.style.display = frequency === 'weekly' ? 'block' : 'none';
        monthlyDateGroup.style.display = ['monthly', 'quarterly', 'yearly'].includes(frequency) ? 'block' : 'none';
    });

    // Chart period buttons
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data based on period
            await initializeCharts();
            alert(`Chart updated for ${this.dataset.period} period`);
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('financeTheme', newTheme);

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

    // Modal Functions
    modalClose.addEventListener('click', function() {
        scheduleReportModal.classList.remove('active');
    });

    cancelSchedule.addEventListener('click', function() {
        scheduleReportModal.classList.remove('active');
    });

    scheduleReportForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const scheduleData = Object.fromEntries(formData);
        
        try {
            const response = await fetch('/api/reports/schedule/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scheduleData),
            });

            if (response.ok) {
                scheduleReportModal.classList.remove('active');
                alert('Report scheduled successfully!');
            } else {
                alert('Failed to schedule report.');
            }
        } catch (error) {
            console.error('Error scheduling report:', error);
            alert('An error occurred while scheduling the report.');
        }
    });

    // Close modal when clicking outside
    scheduleReportModal.addEventListener('click', function(e) {
        if (e.target === this) {
            scheduleReportModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('financeTheme');
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