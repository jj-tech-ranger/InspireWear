document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const addTransactionModal = document.getElementById('addTransactionModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddTransaction = document.getElementById('cancelAddTransaction');
    const addTransactionForm = document.getElementById('addTransactionForm');
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const searchTransactions = document.getElementById('searchTransactions');
    const filterType = document.getElementById('filterType');
    const filterStatus = document.getElementById('filterStatus');
    const filterLocation = document.getElementById('filterLocation');
    const filterDateFrom = document.getElementById('filterDateFrom');
    const filterDateTo = document.getElementById('filterDateTo');
    const clearFilters = document.getElementById('clearFilters');
    const exportTransactions = document.getElementById('exportTransactions');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    // Sample transactions data for Kenyan clothing store
    const transactionsData = {
        summary: {
            totalIncome: 2847500,
            totalExpenses: 1892300,
            netFlow: 955200,
            pendingAmount: 124800
        },
        transactions: [
            { id: 1, date: '2025-01-20', description: 'Sales - Westgate Mall Store', location: 'Nairobi', category: 'sales', amount: 285000, type: 'income', status: 'completed', notes: 'Weekend sales peak' },
            { id: 2, date: '2025-01-19', description: 'Fabric Purchase - Cotton Suppliers', location: 'Mombasa', category: 'supplies', amount: 125000, type: 'expense', status: 'completed', notes: 'Bulk cotton purchase for Q1' },
            { id: 3, date: '2025-01-18', description: 'Online Store Sales', location: 'Online', category: 'sales', amount: 156000, type: 'income', status: 'pending', notes: 'Payment processing' },
            { id: 4, date: '2025-01-17', description: 'Staff Salaries - January', location: 'Nairobi', category: 'salaries', amount: 420000, type: 'expense', status: 'completed', notes: 'Monthly payroll' },
            { id: 5, date: '2025-01-16', description: 'Rent Payment - Sarit Centre', location: 'Nairobi', category: 'rent', amount: 180000, type: 'expense', status: 'completed', notes: 'Monthly rent' },
            { id: 6, date: '2025-01-15', description: 'Sales - Kisumu Branch', location: 'Kisumu', category: 'sales', amount: 98000, type: 'income', status: 'completed', notes: 'New branch performance' },
            { id: 7, date: '2025-01-14', description: 'Marketing Campaign - Facebook Ads', location: 'Online', category: 'marketing', amount: 45000, type: 'expense', status: 'completed', notes: 'Q1 digital marketing' },
            { id: 8, date: '2025-01-13', description: 'Utility Bills - Electricity', location: 'Nairobi', category: 'utilities', amount: 28000, type: 'expense', status: 'completed', notes: 'Monthly electricity' },
            { id: 9, date: '2025-01-12', description: 'Sales - Nakuru Outlet', location: 'Nakuru', category: 'sales', amount: 142000, type: 'income', status: 'completed', notes: 'Strong weekend sales' },
            { id: 10, date: '2025-01-11', description: 'Transport - Delivery Costs', location: 'Nairobi', category: 'transport', amount: 15000, type: 'expense', status: 'completed', notes: 'Customer deliveries' },
            { id: 11, date: '2025-01-10', description: 'Sales - Mombasa Store', location: 'Mombasa', category: 'sales', amount: 198000, type: 'income', status: 'completed', notes: 'Tourist season boost' },
            { id: 12, date: '2025-01-09', description: 'Equipment Maintenance', location: 'Nairobi', category: 'maintenance', amount: 32000, type: 'expense', status: 'pending', notes: 'Sewing machine service' },
            { id: 13, date: '2025-01-08', description: 'Wholesale Order - Boutiques', location: 'Eldoret', category: 'sales', amount: 275000, type: 'income', status: 'completed', notes: 'Bulk order from local boutiques' },
            { id: 14, date: '2025-01-07', description: 'Insurance Premium', location: 'Nairobi', category: 'utilities', amount: 85000, type: 'expense', status: 'completed', notes: 'Annual business insurance' },
            { id: 15, date: '2025-01-06', description: 'Sales Return Processing', location: 'Online', category: 'sales', amount: -12000, type: 'expense', status: 'completed', notes: 'Customer returns refund' },
            { id: 16, date: '2025-01-05', description: 'New Stock Purchase - Accessories', location: 'Nairobi', category: 'supplies', amount: 95000, type: 'expense', status: 'completed', notes: 'Belts, bags, and jewelry' },
            { id: 17, date: '2025-01-04', description: 'Sales - Weekend Market', location: 'Kisumu', category: 'sales', amount: 67000, type: 'income', status: 'completed', notes: 'Local market stall' },
            { id: 18, date: '2025-01-03', description: 'Office Supplies', location: 'Nairobi', category: 'supplies', amount: 8500, type: 'expense', status: 'completed', notes: 'Stationery and printing' },
            { id: 19, date: '2025-01-02', description: 'Sales - New Year Promotion', location: 'Nairobi', category: 'sales', amount: 320000, type: 'income', status: 'completed', notes: 'New Year sale event' },
            { id: 20, date: '2025-01-01', description: 'Bank Charges', location: 'Nairobi', category: 'utilities', amount: 2500, type: 'expense', status: 'completed', notes: 'Monthly bank fees' }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredTransactions = [...transactionsData.transactions];
    let sortColumn = '';
    let sortDirection = 'asc';

    // Initialize the page
    function initPage() {
        // Set summary numbers
        document.getElementById('totalIncome').textContent = formatCurrency(transactionsData.summary.totalIncome);
        document.getElementById('totalExpenses').textContent = formatCurrency(transactionsData.summary.totalExpenses);
        document.getElementById('netFlow').textContent = formatCurrency(transactionsData.summary.netFlow);
        document.getElementById('pendingAmount').textContent = formatCurrency(transactionsData.summary.pendingAmount);

        // Load transactions
        applyFilters();

        // Set default date range (last 30 days)
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        filterDateTo.value = today.toISOString().split('T')[0];
        filterDateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];

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

    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    // Apply filters and search
    function applyFilters() {
        const searchTerm = searchTransactions.value.toLowerCase();
        const typeFilter = filterType.value;
        const statusFilter = filterStatus.value;
        const locationFilter = filterLocation.value;
        const dateFromFilter = filterDateFrom.value;
        const dateToFilter = filterDateTo.value;

        filteredTransactions = transactionsData.transactions.filter(transaction => {
            const matchesSearch = transaction.description.toLowerCase().includes(searchTerm) ||
                                transaction.location.toLowerCase().includes(searchTerm) ||
                                transaction.category.toLowerCase().includes(searchTerm);
            
            const matchesType = !typeFilter || transaction.type === typeFilter;
            const matchesStatus = !statusFilter || transaction.status === statusFilter;
            const matchesLocation = !locationFilter || transaction.location === locationFilter;
            
            let matchesDateRange = true;
            if (dateFromFilter && dateToFilter) {
                const transactionDate = new Date(transaction.date);
                const fromDate = new Date(dateFromFilter);
                const toDate = new Date(dateToFilter);
                matchesDateRange = transactionDate >= fromDate && transactionDate <= toDate;
            }

            return matchesSearch && matchesType && matchesStatus && matchesLocation && matchesDateRange;
        });

        // Apply sorting
        if (sortColumn) {
            filteredTransactions.sort((a, b) => {
                let aValue = a[sortColumn];
                let bValue = b[sortColumn];

                if (sortColumn === 'date') {
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                } else if (sortColumn === 'amount') {
                    aValue = Math.abs(aValue);
                    bValue = Math.abs(bValue);
                }

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        currentPage = 1;
        renderTransactions();
        renderPagination();
    }

    // Render transactions table
    function renderTransactions() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageTransactions = filteredTransactions.slice(startIndex, endIndex);

        let html = '';
        pageTransactions.forEach(transaction => {
            const amountClass = transaction.type === 'income' ? 'positive' : 'negative';
            const amountPrefix = transaction.type === 'income' ? '+' : '-';
            
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="transaction-checkbox" data-id="${transaction.id}">
                    </td>
                    <td>${formatDate(transaction.date)}</td>
                    <td>${transaction.description}</td>
                    <td>${transaction.location}</td>
                    <td>${getCategoryName(transaction.category)}</td>
                    <td class="amount-cell ${amountClass}">${amountPrefix}${formatCurrency(transaction.amount)}</td>
                    <td>
                        <span class="transaction-type ${transaction.type}">${transaction.type}</span>
                    </td>
                    <td>
                        <span class="status-indicator ${transaction.status}">
                            <i class="fas ${getStatusIcon(transaction.status)}"></i>
                            ${transaction.status}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn" onclick="viewTransaction(${transaction.id})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="table-action-btn" onclick="editTransaction(${transaction.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="table-action-btn delete" onclick="deleteTransaction(${transaction.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        transactionsTableBody.innerHTML = html;

        // Update pagination info
        const totalTransactions = filteredTransactions.length;
        const showingStart = totalTransactions > 0 ? startIndex + 1 : 0;
        const showingEnd = Math.min(endIndex, totalTransactions);
        
        document.getElementById('showingStart').textContent = showingStart;
        document.getElementById('showingEnd').textContent = showingEnd;
        document.getElementById('totalTransactions').textContent = totalTransactions;
    }

    // Get category display name
    function getCategoryName(category) {
        const categories = {
            'sales': 'Sales Revenue',
            'supplies': 'Supplies',
            'salaries': 'Salaries',
            'rent': 'Rent',
            'utilities': 'Utilities',
            'marketing': 'Marketing',
            'transport': 'Transport',
            'maintenance': 'Maintenance'
        };
        return categories[category] || category;
    }

    // Get status icon
    function getStatusIcon(status) {
        const icons = {
            'completed': 'fa-check-circle',
            'pending': 'fa-clock',
            'failed': 'fa-times-circle'
        };
        return icons[status] || 'fa-question-circle';
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        
        // Update navigation buttons
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages || totalPages === 0;

        // Generate page numbers
        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        pageNumbers.innerHTML = paginationHTML;
    }

    // Global functions for pagination and actions
    window.goToPage = function(page) {
        currentPage = page;
        renderTransactions();
        renderPagination();
    };

    window.viewTransaction = function(id) {
        const transaction = transactionsData.transactions.find(t => t.id === id);
        if (transaction) {
            alert(`Transaction Details:\n\nDate: ${formatDate(transaction.date)}\nDescription: ${transaction.description}\nLocation: ${transaction.location}\nAmount: KSh ${formatCurrency(transaction.amount)}\nType: ${transaction.type}\nStatus: ${transaction.status}\nNotes: ${transaction.notes || 'None'}`);
        }
    };

    window.editTransaction = function(id) {
        const transaction = transactionsData.transactions.find(t => t.id === id);
        if (transaction) {
            // Populate form with transaction data
            document.getElementById('transactionDate').value = transaction.date;
            document.getElementById('transactionDescription').value = transaction.description;
            document.getElementById('transactionLocation').value = transaction.location;
            document.getElementById('transactionType').value = transaction.type;
            document.getElementById('transactionAmount').value = Math.abs(transaction.amount);
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionNotes').value = transaction.notes || '';
            
            addTransactionModal.classList.add('active');
        }
    };

    window.deleteTransaction = function(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            const index = transactionsData.transactions.findIndex(t => t.id === id);
            if (index !== -1) {
                transactionsData.transactions.splice(index, 1);
                applyFilters();
                alert('Transaction deleted successfully!');
            }
        }
    };

    // Event Listeners
    searchTransactions.addEventListener('input', applyFilters);
    filterType.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterLocation.addEventListener('change', applyFilters);
    filterDateFrom.addEventListener('change', applyFilters);
    filterDateTo.addEventListener('change', applyFilters);

    clearFilters.addEventListener('click', function() {
        searchTransactions.value = '';
        filterType.value = '';
        filterStatus.value = '';
        filterLocation.value = '';
        filterDateFrom.value = '';
        filterDateTo.value = '';
        applyFilters();
    });

    // Sorting functionality
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const column = this.dataset.column;
            
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }

            // Update sort icons
            document.querySelectorAll('.sort-icon').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            this.className = `fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} sort-icon active`;

            applyFilters();
        });
    });

    // Pagination navigation
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderTransactions();
            renderPagination();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderTransactions();
            renderPagination();
        }
    });

    // Select all functionality
    selectAll.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.transaction-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Export functionality
    exportTransactions.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.transaction-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        let dataToExport = filteredTransactions;
        if (selectedIds.length > 0) {
            dataToExport = filteredTransactions.filter(t => selectedIds.includes(t.id));
        }

        exportToCSV(dataToExport);
    });

    // Export to CSV function
    function exportToCSV(data) {
        const headers = ['Date', 'Description', 'Location', 'Category', 'Amount (KSh)', 'Type', 'Status', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...data.map(transaction => [
                transaction.date,
                `"${transaction.description}"`,
                transaction.location,
                getCategoryName(transaction.category),
                transaction.amount,
                transaction.type,
                transaction.status,
                `"${transaction.notes || ''}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

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
    addTransactionBtn.addEventListener('click', function() {
        addTransactionForm.reset();
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
        
        const newTransaction = {
            id: Math.max(...transactionsData.transactions.map(t => t.id)) + 1,
            date: document.getElementById('transactionDate').value,
            description: document.getElementById('transactionDescription').value,
            location: document.getElementById('transactionLocation').value,
            category: document.getElementById('transactionCategory').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            type: document.getElementById('transactionType').value,
            status: 'pending',
            notes: document.getElementById('transactionNotes').value
        };

        transactionsData.transactions.unshift(newTransaction);
        applyFilters();
        addTransactionModal.classList.remove('active');
        alert('Transaction added successfully!');
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

