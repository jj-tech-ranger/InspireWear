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

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredTransactions = [];
    let sortColumn = '';
    let sortDirection = 'asc';

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/transactions/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('totalIncome').textContent = formatCurrency(summary.total_income);
            document.getElementById('totalExpenses').textContent = formatCurrency(summary.total_expenses);
            document.getElementById('netFlow').textContent = formatCurrency(summary.net_flow);
            document.getElementById('pendingAmount').textContent = formatCurrency(summary.pending_amount);

            // Load transactions
            await applyFilters();

            // Set default date range (last 30 days)
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            filterDateTo.value = today.toISOString().split('T')[0];
            filterDateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];
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

    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    // Apply filters and search
    async function applyFilters() {
        const searchTerm = searchTransactions.value.toLowerCase();
        const typeFilter = filterType.value;
        const statusFilter = filterStatus.value;
        const locationFilter = filterLocation.value;
        const dateFromFilter = filterDateFrom.value;
        const dateToFilter = filterDateTo.value;

        const params = new URLSearchParams({
            search: searchTerm,
            type: typeFilter,
            status: statusFilter,
            location: locationFilter,
            date_from: dateFromFilter,
            date_to: dateToFilter,
            sort_by: sortColumn,
            sort_dir: sortDirection,
        });

        try {
            const transactions = await fetch(`/api/transactions/?${params.toString()}`).then(res => res.json());
            filteredTransactions = transactions;
            currentPage = 1;
            renderTransactions();
            renderPagination();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
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

    window.viewTransaction = async function(id) {
        const transaction = await fetch(`/api/transactions/${id}/`).then(res => res.json());
        if (transaction) {
            alert(`Transaction Details:\n\nDate: ${formatDate(transaction.date)}\nDescription: ${transaction.description}\nLocation: ${transaction.location}\nAmount: KSh ${formatCurrency(transaction.amount)}\nType: ${transaction.type}\nStatus: ${transaction.status}\nNotes: ${transaction.notes || 'None'}`);
        }
    };

    window.editTransaction = async function(id) {
        const transaction = await fetch(`/api/transactions/${id}/`).then(res => res.json());
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

    window.deleteTransaction = async function(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                const response = await fetch(`/api/transactions/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await applyFilters();
                    alert('Transaction deleted successfully!');
                } else {
                    alert('Failed to delete transaction.');
                }
            } catch (error) {
                console.error('Error deleting transaction:', error);
                alert('An error occurred while deleting the transaction.');
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

    addTransactionForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addTransactionForm);
        const newTransaction = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/transactions/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTransaction),
            });
            if (response.ok) {
                await applyFilters();
                addTransactionModal.classList.remove('active');
                alert('Transaction added successfully!');
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