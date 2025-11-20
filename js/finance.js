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

    // Initialize the page
    async function initPage() {
        try {
            const financeData = await fetch('/api/finance/summary/').then(res => res.json());

            // Set overview numbers
            document.getElementById('totalRevenue').textContent = formatCurrency(financeData.total_revenue);
            document.getElementById('netProfit').textContent = formatCurrency(financeData.net_profit);
            document.getElementById('operatingExpenses').textContent = formatCurrency(financeData.operating_expenses);

            // Load transactions table
            loadTransactions();

            // Initialize charts
            initCharts(financeData);
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
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
    async function loadTransactions() {
        try {
            const transactions = await fetch('/api/finance/transactions/').then(res => res.json());
            let html = '';

            transactions.forEach(transaction => {
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
        } catch (error) {
            console.error('Error loading transactions:', error);
            transactionsTable.innerHTML = '<tr><td colspan="7">Error loading transactions.</td></tr>';
        }
    }

    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB'); // British format for day/month/year
    }

    // Initialize charts
    function initCharts(financeData) {
        // Revenue vs Expenses Chart
        const movementCtx = document.getElementById('revenueExpensesCanvas').getContext('2d');
        new Chart(movementCtx, {
            type: 'bar',
            data: {
                labels: financeData.financial_movement.map(item => item.month),
                datasets: [
                    {
                        label: 'Revenue (KSh)',
                        data: financeData.financial_movement.map(item => item.revenue),
                        backgroundColor: 'rgba(52, 152, 219, 0.7)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses (KSh)',
                        data: financeData.financial_movement.map(item => item.expenses),
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
                labels: financeData.expense_categories.map(item => item.category),
                datasets: [{
                    data: financeData.expense_categories.map(item => item.amount),
                    backgroundColor: financeData.expense_categories.map(item => item.color),
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

    addTransactionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(addTransactionForm);
        const transactionData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/finance/transactions/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (response.ok) {
                alert('Transaction added successfully!');
                addTransactionModal.classList.remove('active');
                this.reset();
                initPage(); // Refresh data
            } else {
                alert('Failed to add transaction.');
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            alert('An error occurred while adding the transaction.');
        }
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