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
            const summary = await fetch('/api/expenses/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('totalExpenses').textContent = formatCurrency(summary.total_expenses);
            document.getElementById('pendingExpenses').textContent = formatCurrency(summary.pending_expenses);
            document.getElementById('approvedExpenses').textContent = formatCurrency(summary.approved_expenses);
            document.getElementById('rejectedExpenses').textContent = formatCurrency(summary.rejected_expenses);

            // Set default dates
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            filterDateTo.value = today.toISOString().split('T')[0];
            filterDateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];

            // Set default expense date
            document.getElementById('expenseDate').value = today.toISOString().split('T')[0];

            // Load expenses
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
            const expenses = await fetch(`/api/expenses/?${params.toString()}`).then(res => res.json());
            filteredExpenses = expenses;
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
                <tr>
                    <td>
                        <input type="checkbox" class="expense-checkbox" data-id="${expense.id}">
                    </td>
                    <td>${formatDate(expense.date)}</td>
                    <td>
                        <div class="employee-info">
                            ${expense.employee}
                            <div class="employee-department">${expense.department}</div>
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
                        ${expense.priority === 'urgent' ? '<span class="priority-indicator urgent">Urgent</span>' : ''}
                    </td>
                    <td>
                        <span class="receipt-status ${expense.has_receipt ? 'available' : 'missing'}" 
                              onclick="${expense.has_receipt ? `viewReceipt(${expense.id})` : ''}">
                            <i class="fas ${expense.has_receipt ? 'fa-file-image' : 'fa-exclamation-triangle'}"></i>
                            ${expense.has_receipt ? `${expense.receipt_count} file(s)` : 'Missing'}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn" onclick="viewExpense(${expense.id})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="table-action-btn" onclick="editExpense(${expense.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${expense.status === 'submitted' ? `
                                <button class="table-action-btn" onclick="approveExpense(${expense.id})" title="Approve">
                                    <i class="fas fa-check"></i>
                                </button>
                                <button class="table-action-btn" onclick="rejectExpense(${expense.id})" title="Reject">
                                    <i class="fas fa-times"></i>
                                </button>
                            ` : ''}
                            <button class="table-action-btn delete" onclick="deleteExpense(${expense.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        expensesTableBody.innerHTML = html;

        // Update pagination info
        const totalExpenses = filteredExpenses.length;
        const showingStart = totalExpenses > 0 ? startIndex + 1 : 0;
        const showingEnd = Math.min(endIndex, totalExpenses);
        
        document.getElementById('showingStart').textContent = showingStart;
        document.getElementById('showingEnd').textContent = showingEnd;
        document.getElementById('totalExpensesCount').textContent = totalExpenses;
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

    // File upload handling
    function setupFileUpload() {
        // Drag and drop functionality
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });

        // File input change
        expenseReceipt.addEventListener('change', function() {
            handleFileUpload(this.files);
        });
    }

    // Handle file upload
    function handleFileUpload(files) {
        Array.from(files).forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert(`File ${file.name} is too large. Maximum size is 5MB.`);
                return;
            }

            if (!file.type.match(/^image\/|^application\/pdf$/)) {
                alert(`File ${file.name} is not supported. Please upload images or PDF files.`);
                return;
            }

            uploadedFilesList.push(file);
            displayUploadedFile(file);
        });
    }

    // Display uploaded file
    function displayUploadedFile(file) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'uploaded-file';
        fileDiv.innerHTML = `
            <i class="fas ${file.type.includes('pdf') ? 'fa-file-pdf' : 'fa-file-image'}"></i>
            <span>${file.name}</span>
            <button type="button" class="remove-file" onclick="removeUploadedFile('${file.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        uploadedFiles.appendChild(fileDiv);
    }

    // Remove uploaded file
    window.removeUploadedFile = function(fileName) {
        uploadedFilesList = uploadedFilesList.filter(file => file.name !== fileName);
        const fileElements = uploadedFiles.querySelectorAll('.uploaded-file');
        fileElements.forEach(element => {
            if (element.textContent.includes(fileName)) {
                element.remove();
            }
        });
    };

    // Global functions
    window.goToPage = function(page) {
        currentPage = page;
        renderExpenses();
        renderPagination();
    };

    window.viewExpense = async function(id) {
        const expense = await fetch(`/api/expenses/${id}/`).then(res => res.json());
        if (expense) {
            showExpenseDetails(expense);
        }
    };

    window.editExpense = async function(id) {
        const expense = await fetch(`/api/expenses/${id}/`).then(res => res.json());
        if (expense) {
            populateExpenseForm(expense);
            addExpenseModal.classList.add('active');
        }
    };

    window.approveExpense = async function(id) {
        if (confirm('Are you sure you want to approve this expense?')) {
            try {
                const response = await fetch(`/api/expenses/${id}/approve/`, { method: 'POST' });
                if (response.ok) {
                    await applyFilters();
                    alert('Expense approved successfully!');
                } else {
                    alert('Failed to approve expense.');
                }
            } catch (error) {
                console.error('Error approving expense:', error);
                alert('An error occurred while approving the expense.');
            }
        }
    };

    window.rejectExpense = async function(id) {
        const reason = prompt('Please provide a reason for rejection:');
        if (reason) {
            try {
                const response = await fetch(`/api/expenses/${id}/reject/`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reason }),
                });
                if (response.ok) {
                    await applyFilters();
                    alert('Expense rejected successfully!');
                } else {
                    alert('Failed to reject expense.');
                }
            } catch (error) {
                console.error('Error rejecting expense:', error);
                alert('An error occurred while rejecting the expense.');
            }
        }
    };

    window.deleteExpense = async function(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            try {
                const response = await fetch(`/api/expenses/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await applyFilters();
                    alert('Expense deleted successfully!');
                } else {
                    alert('Failed to delete expense.');
                }
            } catch (error) {
                console.error('Error deleting expense:', error);
                alert('An error occurred while deleting the expense.');
            }
        }
    };

    window.viewReceipt = async function(id) {
        const expense = await fetch(`/api/expenses/${id}/`).then(res => res.json());
        if (expense && expense.has_receipt) {
            showReceiptViewer(expense);
        }
    };

    // Show expense details
    function showExpenseDetails(expense) {
        const detailsHtml = `
            <div class="detail-section">
                <h4>Basic Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${formatDate(expense.date)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Employee:</span>
                    <span class="detail-value">${expense.employee} (${expense.department})</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Description:</span>
                    <span class="detail-value">${expense.description}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">${getCategoryName(expense.category)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value">KSh ${formatCurrency(expense.amount)}</span>
                </div>
            </div>
            <div class="detail-section">
                <h4>Additional Details</h4>
                <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${expense.location}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Vendor:</span>
                    <span class="detail-value">${expense.vendor}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority:</span>
                    <span class="detail-value priority-indicator ${expense.priority}">${expense.priority}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Approver:</span>
                    <span class="detail-value">${expense.approver}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value expense-status ${expense.status}">
                        <i class="fas ${getStatusIcon(expense.status)}"></i>
                        ${expense.status}
                    </span>
                </div>
                ${expense.notes ? `
                <div class="detail-item">
                    <span class="detail-label">Notes:</span>
                    <span class="detail-value">${expense.notes}</span>
                </div>
                ` : ''}
            </div>
        `;

        let actionsHtml = '';
        if (expense.status === 'submitted') {
            actionsHtml = `
                <button class="action-btn approve" onclick="approveExpense(${expense.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="action-btn reject" onclick="rejectExpense(${expense.id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            `;
        }
        actionsHtml += `
            <button class="action-btn edit" onclick="editExpense(${expense.id})">
                <i class="fas fa-edit"></i> Edit
            </button>
        `;

        document.getElementById('expenseDetailsContent').innerHTML = detailsHtml;
        document.getElementById('expenseActions').innerHTML = actionsHtml;
        document.getElementById('expenseDetailsModal').classList.add('active');
    }

    // Show receipt viewer
    function showReceiptViewer(expense) {
        // Simulate receipt viewing (in real app, would load actual files)
        const receiptHtml = `
            <div class="receipt-navigation">
                <button class="receipt-nav-btn" onclick="previousReceipt()" ${expense.receipt_count <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-left"></i>
                </button>
                <span class="receipt-counter">1 of ${expense.receipt_count}</span>
                <button class="receipt-nav-btn" onclick="nextReceipt()" ${expense.receipt_count <= 1 ? 'disabled' : ''}>
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
            <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkV4cGVuc2UgUmVjZWlwdDwvdGV4dD4KICA8dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+S1NoICR7Zm9ybWF0Q3VycmVuY3koZXhwZW5zZS5hbW91bnQpfTwvdGV4dD4KPC9zdmc+" alt="Receipt" />
        `;

        document.getElementById('receiptViewerContent').innerHTML = receiptHtml;
        document.getElementById('receiptViewerModal').classList.add('active');
    }

    // Populate expense form for editing
    function populateExpenseForm(expense) {
        document.getElementById('expenseDate').value = expense.date;
        document.getElementById('expenseEmployee').value = expense.employee;
        document.getElementById('expenseDescription').value = expense.description;
        document.getElementById('expenseCategory').value = expense.category;
        document.getElementById('expenseAmount').value = expense.amount;
        document.getElementById('expenseLocation').value = expense.location;
        document.getElementById('expenseVendor').value = expense.vendor;
        document.getElementById('expenseApprover').value = expense.approver;
        document.getElementById('expensePriority').value = expense.priority;
        document.getElementById('expenseNotes').value = expense.notes || '';
    }

    // Event Listeners
    searchExpenses.addEventListener('input', applyFilters);
    filterCategory.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterEmployee.addEventListener('change', applyFilters);
    filterDateFrom.addEventListener('change', applyFilters);
    filterDateTo.addEventListener('change', applyFilters);

    clearFilters.addEventListener('click', function() {
        searchExpenses.value = '';
        filterCategory.value = '';
        filterStatus.value = '';
        filterEmployee.value = '';
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
            renderExpenses();
            renderPagination();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderExpenses();
            renderPagination();
        }
    });

    // Bulk approve functionality
    bulkApprove.addEventListener('click', async function() {
        const selectedCheckboxes = document.querySelectorAll('.expense-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        if (selectedIds.length === 0) {
            alert('Please select expenses to approve.');
            return;
        }

        if (confirm(`Are you sure you want to approve ${selectedIds.length} expense(s)?`)) {
            try {
                const response = await fetch('/api/expenses/bulk-approve/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ids: selectedIds }),
                });
                if (response.ok) {
                    await applyFilters();
                    alert('Selected expenses approved successfully!');
                } else {
                    alert('Failed to approve expenses.');
                }
            } catch (error) {
                console.error('Error bulk approving expenses:', error);
                alert('An error occurred while approving expenses.');
            }
        }
    });

    // Export functionality
    exportExpenses.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.expense-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        let dataToExport = filteredExpenses;
        if (selectedIds.length > 0) {
            dataToExport = filteredExpenses.filter(exp => selectedIds.includes(exp.id));
        }

        exportToCSV(dataToExport);
    });

    // Export to CSV function
    function exportToCSV(data) {
        const headers = ['Date', 'Employee', 'Description', 'Category', 'Amount (KSh)', 'Status', 'Location', 'Vendor'];
        const csvContent = [
            headers.join(','),
            ...data.map(expense => [
                expense.date,
                `"${expense.employee}"`,
                `"${expense.description}"`,
                getCategoryName(expense.category),
                expense.amount,
                expense.status,
                expense.location,
                `"${expense.vendor}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
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
    addExpenseBtn.addEventListener('click', function() {
        addExpenseForm.reset();
        uploadedFilesList = [];
        uploadedFiles.innerHTML = '';
        
        // Set default date
        const today = new Date();
        document.getElementById('expenseDate').value = today.toISOString().split('T')[0];
        
        addExpenseModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addExpenseModal.classList.remove('active');
    });

    cancelAddExpense.addEventListener('click', function() {
        addExpenseModal.classList.remove('active');
    });

    // Save as draft
    saveDraftExpense.addEventListener('click', async function() {
        const formData = new FormData(addExpenseForm);
        const expenseData = Object.fromEntries(formData.entries());
        expenseData.status = 'draft';

        try {
            const response = await fetch('/api/expenses/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            });
            if (response.ok) {
                alert('Expense saved as draft!');
                addExpenseModal.classList.remove('active');
                await applyFilters();
            } else {
                alert('Failed to save draft.');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('An error occurred while saving the draft.');
        }
    });

    addExpenseForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addExpenseForm);
        const expenseData = Object.fromEntries(formData.entries());
        expenseData.status = 'submitted';

        try {
            const response = await fetch('/api/expenses/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData),
            });
            if (response.ok) {
                await applyFilters();
                addExpenseModal.classList.remove('active');
                alert('Expense submitted for approval successfully!');
            } else {
                alert('Failed to submit expense.');
            }
        } catch (error) {
            console.error('Error submitting expense:', error);
            alert('An error occurred while submitting the expense.');
        }
    });

    // Close modals when clicking outside
    addExpenseModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addExpenseModal.classList.remove('active');
        }
    });

    document.getElementById('expenseDetailsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    document.getElementById('receiptViewerModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Modal close buttons
    document.getElementById('detailsModalClose').addEventListener('click', function() {
        document.getElementById('expenseDetailsModal').classList.remove('active');
    });

    document.getElementById('receiptModalClose').addEventListener('click', function() {
        document.getElementById('receiptViewerModal').classList.remove('active');
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

    // Setup file upload
    setupFileUpload();

    // Show loading overlay initially
    morphOverlay.classList.add('active');

    // Initialize the page
    initPage();
});