document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const addExpenseModal = document.getElementById('addExpenseModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddExpense = document.getElementById('cancelAddExpense');
    const addExpenseForm = document.getElementById('addExpenseForm');
    const expensesTableBody = document.getElementById('expensesTableBody');
    const searchExpenses = document.getElementById('searchExpenses');
    const filterCategory = document.getElementById('filterCategory');
    const filterStatus = document.getElementById('filterStatus');
    const filterEmployee = document.getElementById('filterEmployee');
    const filterDateFrom = document.getElementById('filterDateFrom');
    const filterDateTo = document.getElementById('filterDateTo');
    const clearFilters = document.getElementById('clearFilters');
    const exportExpenses = document.getElementById('exportExpenses');
    const bulkApprove = document.getElementById('bulkApprove');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const saveDraftExpense = document.getElementById('saveDraftExpense');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const expenseReceipt = document.getElementById('expenseReceipt');
    const uploadedFiles = document.getElementById('uploadedFiles');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredExpenses = [];
    let sortColumn = '';
    let sortDirection = 'asc';
    let uploadedFilesList = [];

    // Initialize the page
    async function initPage() {
        try {
            await updateSummary();
            await applyFilters();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    async function updateSummary() {
        try {
            const summary = await fetch('/api/finance/summary/').then(res => res.json());
            document.getElementById('totalExpenses').textContent = formatCurrency(summary.total_expenses);
            document.getElementById('pendingExpenses').textContent = formatCurrency(summary.pending_expenses);
            document.getElementById('approvedExpenses').textContent = formatCurrency(summary.approved_expenses);
            document.getElementById('rejectedExpenses').textContent = formatCurrency(summary.rejected_expenses);
        } catch (error) {
            console.error('Error updating summary:', error);
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

    // Get category display name
    function getCategoryName(category) {
        const categories = {
            'supplies': 'Supplies',
            'travel': 'Travel',
            'meals': 'Meals & Entertainment',
            'utilities': 'Utilities',
            'rent': 'Rent & Facilities',
            'marketing': 'Marketing',
            'maintenance': 'Maintenance',
            'transport': 'Transport',
            'office': 'Office Expenses'
        };
        return categories[category] || category;
    }

    // Get status icon
    function getStatusIcon(status) {
        const icons = {
            'draft': 'fa-file',
            'submitted': 'fa-paper-plane',
            'approved': 'fa-check-circle',
            'rejected': 'fa-times-circle',
            'paid': 'fa-money-check-alt'
        };
        return icons[status] || 'fa-question-circle';
    }

    // Apply filters and search
    async function applyFilters() {
        const searchTerm = searchExpenses.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const statusFilter = filterStatus.value;
        const employeeFilter = filterEmployee.value;
        const dateFromFilter = filterDateFrom.value;
        const dateToFilter = filterDateTo.value;

        const params = new URLSearchParams({
            search: searchTerm,
            category: categoryFilter,
            status: statusFilter,
            employee: employeeFilter,
            date_from: dateFromFilter,
            date_to: dateToFilter,
            sort_by: sortColumn,
            sort_dir: sortDirection,
        });

        try {
            const expenses = await fetch(`/api/finance/transactions/?${params.toString()}`).then(res => res.json());
            filteredExpenses = expenses.filter(t => t.type === 'expense');
            currentPage = 1;
            renderExpenses();
            renderPagination();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    // Render expenses table
    function renderExpenses() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageExpenses = filteredExpenses.slice(startIndex, endIndex);

        let html = '';
        pageExpenses.forEach(expense => {
            const amountClass = expense.amount > 50000 ? 'amount-large' : '';
            
            html += `
                <tr data-id="${expense.id}">
                    <td>
                        <input type="checkbox" class="expense-checkbox" data-id="${expense.id}">
                    </td>
                    <td>${formatDate(expense.date)}</td>
                    <td>
                        <div class="employee-info">
                            ${expense.description}
                        </div>
                    </td>
                    <td>${expense.description}</td>
                    <td>${getCategoryName(expense.category)}</td>
                    <td class="amount-cell ${amountClass}">KSh ${formatCurrency(expense.amount)}</td>
                    <td>
                        <span class="expense-status ${expense.status}">
                            <i class="fas ${getStatusIcon(expense.status)}"></i>
                            ${expense.status}
                        </span>
                    </td>
                    <td>
                        <span class="receipt-status missing">
                            <i class="fas fa-exclamation-triangle"></i>
                            Missing
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn view-btn" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="table-action-btn edit-btn" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="table-action-btn delete-btn" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        expensesTableBody.innerHTML = html;
        attachTableEventListeners();

        // Update pagination info
        const totalExpenses = filteredExpenses.length;
        const showingStart = totalExpenses > 0 ? startIndex + 1 : 0;
        const showingEnd = Math.min(endIndex, totalExpenses);
        
        document.getElementById('showingStart').textContent = showingStart;
        document.getElementById('showingEnd').textContent = showingEnd;
        document.getElementById('totalExpensesCount').textContent = totalExpenses;
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const expenseId = this.closest('tr').dataset.id;
                editExpense(expenseId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const expenseId = this.closest('tr').dataset.id;
                deleteExpense(expenseId);
            });
        });
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
        
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages || totalPages === 0;

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

    window.goToPage = function(page) {
        currentPage = page;
        renderExpenses();
        renderPagination();
    };

    async function editExpense(expenseId) {
        try {
            const response = await fetch(`/api/finance/transactions/${expenseId}/`);
            if (!response.ok) throw new Error('Failed to fetch expense details.');
            const expense = await response.json();

            document.getElementById('expenseDate').value = expense.date;
            document.getElementById('expenseDescription').value = expense.description;
            document.getElementById('expenseCategory').value = expense.category;
            document.getElementById('expenseAmount').value = expense.amount;
            document.getElementById('expenseLocation').value = expense.location;
            addExpenseForm.dataset.editId = expenseId;
            addExpenseModal.classList.add('active');
        } catch (error) {
            console.error('Error fetching expense for edit:', error);
            alert('Could not load expense details for editing.');
        }
    }

    async function deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                const response = await fetch(`/api/finance/transactions/${expenseId}/`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete expense.');
                
                await applyFilters();
                await updateSummary();
                alert('Expense deleted successfully.');
            } catch (error) {
                console.error('Error deleting expense:', error);
                alert('Could not delete expense.');
            }
        }
    }

    // Modal Functions
    addExpenseBtn.addEventListener('click', function() {
        addExpenseForm.reset();
        delete addExpenseForm.dataset.editId;
        document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
        addExpenseModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => addExpenseModal.classList.remove('active'));
    cancelAddExpense.addEventListener('click', () => addExpenseModal.classList.remove('active'));

    addExpenseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const expenseId = this.dataset.editId;
        const method = expenseId ? 'PUT' : 'POST';
        const url = expenseId ? `/api/finance/transactions/${expenseId}/` : '/api/finance/transactions/';

        const formData = {
            date: document.getElementById('expenseDate').value,
            description: document.getElementById('expenseDescription').value,
            category: document.getElementById('expenseCategory').value,
            amount: document.getElementById('expenseAmount').value,
            location: document.getElementById('expenseLocation').value,
            type: 'expense',
            status: 'submitted',
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save expense.');

            addExpenseModal.classList.remove('active');
            await applyFilters();
            await updateSummary();
            alert(`Expense ${expenseId ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error saving expense:', error);
            alert('Error saving expense. Please try again.');
        }
    });

    // Event Listeners
    searchExpenses.addEventListener('input', applyFilters);
    filterCategory.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterEmployee.addEventListener('change', applyFilters);
    filterDateFrom.addEventListener('change', applyFilters);
    filterDateTo.addEventListener('change', applyFilters);
    clearFilters.addEventListener('click', () => {
        searchExpenses.value = '';
        filterCategory.value = '';
        filterStatus.value = '';
        filterEmployee.value = '';
        filterDateFrom.value = '';
        filterDateTo.value = '';
        applyFilters();
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('financeTheme', newTheme);
        const icon = this.querySelector('.theme-icon');
        icon.className = `theme-icon fas ${newTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    });

    // Initial page load
    initPage();
});
