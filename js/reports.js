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

    // Sample financial data for Kenyan clothing store
    const financialData = {
        summary: {
            totalRevenue: 2450000,
            totalExpenses: 1892300,
            netProfit: 557700,
            profitMargin: 22.8
        },
        monthlyData: {
            revenue: [1850000, 2100000, 1950000, 2200000, 2350000, 2450000],
            expenses: [1650000, 1750000, 1680000, 1820000, 1890000, 1892300],
            months: ['Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024', 'Jan 2025']
        },
        expenseBreakdown: {
            labels: ['Salaries & Wages', 'Raw Materials', 'Utilities', 'Rent', 'Marketing', 'Transport', 'Other'],
            amounts: [850000, 425000, 180000, 150000, 125000, 95000, 67300],
            colors: ['#3498db', '#e74c3c', '#f39c12', '#9b59b6', '#2ecc71', '#34495e', '#95a5a6']
        },
        profitLoss: {
            revenue: {
                sales: 2450000,
                otherIncome: 25000,
                total: 2475000
            },
            expenses: {
                costOfGoodsSold: 980000,
                salariesWages: 850000,
                rent: 150000,
                utilities: 180000,
                marketing: 125000,
                transport: 95000,
                depreciation: 45000,
                other: 67300,
                total: 2492300
            },
            netIncome: -17300
        },
        balanceSheet: {
            assets: {
                currentAssets: {
                    cash: 450000,
                    accountsReceivable: 320000,
                    inventory: 680000,
                    prepaidExpenses: 45000,
                    total: 1495000
                },
                fixedAssets: {
                    equipment: 850000,
                    furniture: 120000,
                    vehicles: 450000,
                    accumulatedDepreciation: -180000,
                    total: 1240000
                },
                totalAssets: 2735000
            },
            liabilities: {
                currentLiabilities: {
                    accountsPayable: 280000,
                    shortTermLoans: 150000,
                    accruedExpenses: 85000,
                    total: 515000
                },
                longTermLiabilities: {
                    longTermLoans: 650000,
                    total: 650000
                },
                totalLiabilities: 1165000
            },
            equity: {
                shareCapital: 1000000,
                retainedEarnings: 570000,
                total: 1570000
            }
        },
        cashFlow: {
            operating: {
                netIncome: -17300,
                depreciation: 45000,
                accountsReceivableChange: -25000,
                inventoryChange: -45000,
                accountsPayableChange: 35000,
                total: -7300
            },
            investing: {
                equipmentPurchase: -120000,
                total: -120000
            },
            financing: {
                loanProceeds: 200000,
                loanRepayments: -85000,
                dividendsPaid: -50000,
                total: 65000
            },
            netCashFlow: -62300,
            beginningCash: 512300,
            endingCash: 450000
        }
    };

    // Initialize the page
    function initPage() {
        // Set summary numbers
        document.getElementById('totalRevenue').textContent = formatCurrency(financialData.summary.totalRevenue);
        document.getElementById('totalExpenses').textContent = formatCurrency(financialData.summary.totalExpenses);
        document.getElementById('netProfit').textContent = formatCurrency(financialData.summary.netProfit);
        document.getElementById('profitMargin').textContent = financialData.summary.profitMargin;

        // Set default dates
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        dateTo.value = today.toISOString().split('T')[0];
        dateFrom.value = firstDayOfMonth.toISOString().split('T')[0];

        // Initialize charts
        initializeCharts();

        // Generate default report
        generateReportContent();

        // Hide loading overlay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
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
    function initializeCharts() {
        // Revenue vs Expenses Chart
        const revenueCtx = document.getElementById('revenueExpensesChart').getContext('2d');
        revenueExpensesChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: financialData.monthlyData.months,
                datasets: [{
                    label: 'Revenue',
                    data: financialData.monthlyData.revenue,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Expenses',
                    data: financialData.monthlyData.expenses,
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
                labels: financialData.expenseBreakdown.labels,
                datasets: [{
                    data: financialData.expenseBreakdown.amounts,
                    backgroundColor: financialData.expenseBreakdown.colors,
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
    }

    // Generate report content based on selected type
    function generateReportContent() {
        const type = reportType.value;
        const period = reportPeriod.value;
        
        let content = '';
        
        switch (type) {
            case 'profit_loss':
                content = generateProfitLossReport();
                break;
            case 'balance_sheet':
                content = generateBalanceSheetReport();
                break;
            case 'cash_flow':
                content = generateCashFlowReport();
                break;
            case 'expense_report':
                content = generateExpenseReport();
                break;
            case 'revenue_analysis':
                content = generateRevenueAnalysisReport();
                break;
            case 'budget_variance':
                content = generateBudgetVarianceReport();
                break;
            default:
                content = generateProfitLossReport();
        }
        
        reportContent.innerHTML = content;
    }

    // Generate Profit & Loss Statement
    function generateProfitLossReport() {
        const data = financialData.profitLoss;
        const grossProfit = data.revenue.total - data.expenses.costOfGoodsSold;
        const operatingExpenses = data.expenses.total - data.expenses.costOfGoodsSold;
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
                            <td data-label="Amount">${formatCurrency(data.revenue.otherIncome)}</td>
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
                            <td data-label="Amount">${formatCurrency(data.expenses.costOfGoodsSold)}</td>
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
                            <td data-label="Amount">${formatCurrency(data.expenses.salariesWages)}</td>
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
                            <td data-label="Amount"><strong class="${data.netIncome >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.netIncome)}</strong></td>
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
                    <div class="metric-value">${formatPercentage((data.netIncome / data.revenue.total) * 100)}</div>
                </div>
            </div>
        `;
    }

    // Generate Balance Sheet Report
    function generateBalanceSheetReport() {
        const data = financialData.balanceSheet;
        
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
                            <td data-label="Amount">${formatCurrency(data.assets.currentAssets.cash)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accounts Receivable</td>
                            <td data-label="Amount">${formatCurrency(data.assets.currentAssets.accountsReceivable)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Inventory</td>
                            <td data-label="Amount">${formatCurrency(data.assets.currentAssets.inventory)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Prepaid Expenses</td>
                            <td data-label="Amount">${formatCurrency(data.assets.currentAssets.prepaidExpenses)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Current Assets</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.assets.currentAssets.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>Fixed Assets</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Equipment</td>
                            <td data-label="Amount">${formatCurrency(data.assets.fixedAssets.equipment)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Furniture & Fixtures</td>
                            <td data-label="Amount">${formatCurrency(data.assets.fixedAssets.furniture)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Vehicles</td>
                            <td data-label="Amount">${formatCurrency(data.assets.fixedAssets.vehicles)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Less: Accumulated Depreciation</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.assets.fixedAssets.accumulatedDepreciation))})</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Fixed Assets</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.assets.fixedAssets.total)}</strong></td>
                        </tr>
                        
                        <tr class="grand-total">
                            <td><strong>TOTAL ASSETS</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.assets.totalAssets)}</strong></td>
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
                            <td data-label="Amount">${formatCurrency(data.liabilities.currentLiabilities.accountsPayable)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Short-term Loans</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.currentLiabilities.shortTermLoans)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accrued Expenses</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.currentLiabilities.accruedExpenses)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Current Liabilities</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.currentLiabilities.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>Long-term Liabilities</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Long-term Loans</td>
                            <td data-label="Amount">${formatCurrency(data.liabilities.longTermLiabilities.longTermLoans)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Long-term Liabilities</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.longTermLiabilities.total)}</strong></td>
                        </tr>
                        
                        <tr class="section-total">
                            <td><strong>Total Liabilities</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.totalLiabilities)}</strong></td>
                        </tr>
                        
                        <tr class="section-header">
                            <td><strong>Equity</strong></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td class="indent-1">Share Capital</td>
                            <td data-label="Amount">${formatCurrency(data.equity.shareCapital)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Retained Earnings</td>
                            <td data-label="Amount">${formatCurrency(data.equity.retainedEarnings)}</td>
                        </tr>
                        <tr class="section-total">
                            <td><strong>Total Equity</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.equity.total)}</strong></td>
                        </tr>
                        
                        <tr class="grand-total">
                            <td><strong>TOTAL LIABILITIES & EQUITY</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.liabilities.totalLiabilities + data.equity.total)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="balance-equation">
                Assets = Liabilities + Equity<br>
                KSh ${formatCurrency(data.assets.totalAssets)} = KSh ${formatCurrency(data.liabilities.totalLiabilities)} + KSh ${formatCurrency(data.equity.total)}
            </div>
            
            <div class="key-metrics">
                <div class="metric-card">
                    <h5>Current Ratio</h5>
                    <div class="metric-value">${(data.assets.currentAssets.total / data.liabilities.currentLiabilities.total).toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <h5>Debt-to-Equity Ratio</h5>
                    <div class="metric-value">${(data.liabilities.totalLiabilities / data.equity.total).toFixed(2)}</div>
                </div>
                <div class="metric-card">
                    <h5>Return on Equity</h5>
                    <div class="metric-value">${formatPercentage((financialData.profitLoss.netIncome / data.equity.total) * 100)}</div>
                </div>
            </div>
        `;
    }

    // Generate Cash Flow Statement
    function generateCashFlowReport() {
        const data = financialData.cashFlow;
        
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
                            <td data-label="Amount" class="${data.operating.netIncome >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.netIncome)}</td>
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
                            <td data-label="Amount" class="${data.operating.accountsReceivableChange >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.accountsReceivableChange)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Inventory</td>
                            <td data-label="Amount" class="${data.operating.inventoryChange >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.inventoryChange)}</td>
                        </tr>
                        <tr>
                            <td class="indent-1">Accounts Payable</td>
                            <td data-label="Amount" class="${data.operating.accountsPayableChange >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.operating.accountsPayableChange)}</td>
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
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.investing.equipmentPurchase))})</td>
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
                            <td data-label="Amount" class="amount-positive">${formatCurrency(data.financing.loanProceeds)}</td>
                        </tr>
                        <tr>
                            <td>Loan Repayments</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.financing.loanRepayments))})</td>
                        </tr>
                        <tr>
                            <td>Dividends Paid</td>
                            <td data-label="Amount" class="amount-negative">(${formatCurrency(Math.abs(data.financing.dividendsPaid))})</td>
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
                            <td data-label="Amount"><strong class="${data.netCashFlow >= 0 ? 'amount-positive' : 'amount-negative'}">${formatCurrency(data.netCashFlow)}</strong></td>
                        </tr>
                        <tr>
                            <td>Cash at Beginning of Period</td>
                            <td data-label="Amount">${formatCurrency(data.beginningCash)}</td>
                        </tr>
                        <tr class="grand-total">
                            <td><strong>Cash at End of Period</strong></td>
                            <td data-label="Amount"><strong>${formatCurrency(data.endingCash)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    // Generate Expense Report
    function generateExpenseReport() {
        const data = financialData.expenseBreakdown;
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
    function generateRevenueAnalysisReport() {
        const monthlyRevenue = financialData.monthlyData.revenue;
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
                        ${financialData.monthlyData.months.map((month, index) => {
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
    function generateBudgetVarianceReport() {
        const budgetData = [
            { category: 'Revenue', budget: 2300000, actual: 2450000 },
            { category: 'Salaries & Wages', budget: 800000, actual: 850000 },
            { category: 'Raw Materials', budget: 400000, actual: 425000 },
            { category: 'Utilities', budget: 160000, actual: 180000 },
            { category: 'Rent', budget: 150000, actual: 150000 },
            { category: 'Marketing', budget: 100000, actual: 125000 },
            { category: 'Transport', budget: 80000, actual: 95000 }
        ];
        
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
                        ${budgetData.map(item => {
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

    generateReport.addEventListener('click', function() {
        generateReportContent();
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
        btn.addEventListener('click', function() {
            document.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update chart data based on period
            // This would typically fetch new data from the server
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

    scheduleReportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const scheduleData = Object.fromEntries(formData);
        
        console.log('Schedule Data:', scheduleData);
        
        scheduleReportModal.classList.remove('active');
        alert('Report scheduled successfully!');
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

