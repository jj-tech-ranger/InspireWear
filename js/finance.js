document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const transactionsTable = document.getElementById('transactionsTable');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const addTransactionModal = document.getElementById('addTransactionModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddTransaction = document.getElementById('cancelAddTransaction');
    const addTransactionForm = document.getElementById('addTransactionForm');

    // Sample financial data for Kenyan clothing store
    const financeData = {
        totalRevenue: 4842300,
        netProfit: 1245780,
        operatingExpenses: 2156420,
        financialMovement: [
            { month: 'July', revenue: 780000, expenses: 520000 },
            { month: 'August', revenue: 820000, expenses: 540000 },
            { month: 'September', revenue: 950000, expenses: 580000 },
            { month: 'October', revenue: 1050000, expenses: 620000 },
            { month: 'November', revenue: 880000, expenses: 560000 },
            { month: 'December', revenue: 1360000, expenses: 720000 }
        ],
        expenseCategories: [
            { category: 'Supplies', amount: 650000, color: '#3498db' },
            { category: 'Salaries', amount: 850000, color: '#2ecc71' },
            { category: 'Rent', amount: 300000, color: '#f1c40f' },
            { category: 'Utilities', amount: 180000, color: '#e74c3c' },
            { category: 'Marketing', amount: 176420, color: '#9b59b6' }
        ],
        recentTransactions: [
            { date: '2025-01-15', description: 'Sales - Nairobi Store', location: 'Nairobi', amount: 185000, type: 'income', status: 'completed' },
            { date: '2025-01-14', description: 'Supplier Payment - Fabric', location: 'Mombasa', amount: 75000, type: 'expense', status: 'completed' },
            { date: '2025-01-13', description: 'Online Sales', location: 'Online', amount: 92000, type: 'income', status: 'pending' },
            { date: '2025-01-12', description: 'January Salaries', location: 'Nairobi', amount: 420000, type: 'expense', status: 'completed' },
            { date: '2025-01-10', description: 'Shop Rent Payment', location: 'Nairobi', amount: 150000, type: 'expense', status: 'completed' }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalRevenue').textContent = formatCurrency(financeData.totalRevenue);
        document.getElementById('netProfit').textContent = formatCurrency(financeData.netProfit);
        document.getElementById('operatingExpenses').textContent = formatCurrency(financeData.operatingExpenses);

        // Load transactions table
        loadTransactions();

        // Initialize charts
        initCharts();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Format currency for KES
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load transactions into the table
    function loadTransactions() {
        let html = '';

        financeData.recentTransactions.forEach(transaction => {
            html += `
                <tr>
                    <td>${formatDate(transaction.date)}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.location}</td>
                    <td>${formatCurrency(transaction.amount)}</td>
                    <td>${transaction.type === 'income' ? '<span class="positive">Income</span>' : '<span class="negative">Expense</span>'}</td>
                    <td><span class="status ${transaction.status}">${transaction.status}</span></td>
                    <td>
                        <button class="action-btn" title="View Receipt"><i class="fas fa-receipt"></i></button>
                        <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        transactionsTable.innerHTML = html;
    }

    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // British format for day/month/year
    }

    // Initialize charts
    function initCharts() {
        // Revenue vs Expenses Chart
        const movementCtx = document.getElementById('revenueExpensesCanvas').getContext('2d');
        new Chart(movementCtx, {
            type: 'bar',
            data: {
                labels: financeData.financialMovement.map(item => item.month),
                datasets: [
                    {
                        label: 'Revenue (KSh)',
                        data: financeData.financialMovement.map(item => item.revenue),
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses (KSh)',
                        data: financeData.financialMovement.map(item => item.expenses),
                        backgroundColor: 'rgba(231, 76, 60, 0.7)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 1
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
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += 'KSh ' + context.raw.toLocaleString();
                                return label;
                            }
                        }
                    }
                }
            }
        });

        // Expense Breakdown Chart
        const categoryCtx = document.getElementById('expenseBreakdownCanvas').getContext('2d');
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: financeData.expenseCategories.map(item => item.category),
                datasets: [{
                    data: financeData.expenseCategories.map(item => item.amount),
                    backgroundColor: financeData.expenseCategories.map(item => item.color),
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
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += 'KSh ' + context.raw.toLocaleString();
                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'right',
                    }
                }
            }
        });
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('financeTheme', newTheme);

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

    // Modal Functions
    addTransactionBtn.addEventListener('click', function() {
        addTransactionModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addTransactionModal.classList.remove('active');
    });

    cancelAddTransaction.addEventListener('click', function() {
        addTransactionModal.classList.remove('active');
    });

    addTransactionForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        alert('Transaction added successfully!');
        addTransactionModal.classList.remove('active');
        this.reset();
    });

    // Close modal when clicking outside
    addTransactionModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addTransactionModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('financeTheme');
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