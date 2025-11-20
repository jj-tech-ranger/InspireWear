document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const createInvoiceBtn = document.getElementById('createInvoiceBtn');
    const createInvoiceModal = document.getElementById('createInvoiceModal');
    const modalClose = document.getElementById('modalClose');
    const cancelCreateInvoice = document.getElementById('cancelCreateInvoice');
    const createInvoiceForm = document.getElementById('createInvoiceForm');
    const invoicesTableBody = document.getElementById('invoicesTableBody');
    const searchInvoices = document.getElementById('searchInvoices');
    const filterStatus = document.getElementById('filterStatus');
    const filterCustomer = document.getElementById('filterCustomer');
    const filterDateFrom = document.getElementById('filterDateFrom');
    const filterDateTo = document.getElementById('filterDateTo');
    const clearFilters = document.getElementById('clearFilters');
    const exportInvoices = document.getElementById('exportInvoices');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const addItemBtn = document.getElementById('addItemBtn');
    const invoiceItemsList = document.getElementById('invoiceItemsList');
    const saveDraftBtn = document.getElementById('saveDraftBtn');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredInvoices = [];
    let sortColumn = '';
    let sortDirection = 'asc';
    let invoiceItemCount = 0;

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/invoices/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('totalInvoices').textContent = summary.total_invoices;
            document.getElementById('paidAmount').textContent = formatCurrency(summary.paid_amount);
            document.getElementById('pendingAmount').textContent = formatCurrency(summary.pending_amount);
            document.getElementById('overdueAmount').textContent = formatCurrency(summary.overdue_amount);

            // Set default dates
            const today = new Date();
            const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
            filterDateTo.value = today.toISOString().split('T')[0];
            filterDateFrom.value = thirtyDaysAgo.toISOString().split('T')[0];

            // Set default invoice date
            document.getElementById('invoiceDate').value = today.toISOString().split('T')[0];
            const dueDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
            document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];

            // Load invoices
            await applyFilters();

            // Add initial invoice item
            addInvoiceItem();
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

    // Check if date is overdue
    function isOverdue(dueDateString) {
        const dueDate = new Date(dueDateString);
        const today = new Date();
        return dueDate < today;
    }

    // Check if date is due soon (within 7 days)
    function isDueSoon(dueDateString) {
        const dueDate = new Date(dueDateString);
        const today = new Date();
        const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
        return dueDate <= sevenDaysFromNow && dueDate >= today;
    }

    // Apply filters and search
    async function applyFilters() {
        const searchTerm = searchInvoices.value.toLowerCase();
        const statusFilter = filterStatus.value;
        const customerFilter = filterCustomer.value;
        const dateFromFilter = filterDateFrom.value;
        const dateToFilter = filterDateTo.value;

        const params = new URLSearchParams({
            search: searchTerm,
            status: statusFilter,
            customer: customerFilter,
            date_from: dateFromFilter,
            date_to: dateToFilter,
            sort_by: sortColumn,
            sort_dir: sortDirection,
        });

        try {
            const invoices = await fetch(`/api/invoices/?${params.toString()}`).then(res => res.json());
            filteredInvoices = invoices;
            currentPage = 1;
            renderInvoices();
            renderPagination();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    // Render invoices table
    function renderInvoices() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageInvoices = filteredInvoices.slice(startIndex, endIndex);

        let html = '';
        pageInvoices.forEach(invoice => {
            const dueDateClass = isOverdue(invoice.due_date) ? 'overdue' : 
                               isDueSoon(invoice.due_date) ? 'due-soon' : '';
            
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="invoice-checkbox" data-id="${invoice.id}">
                    </td>
                    <td>
                        <span class="invoice-number">${invoice.number}</span>
                    </td>
                    <td>
                        <div class="customer-info">
                            ${invoice.customer}
                            <div class="customer-location">${invoice.location}</div>
                        </div>
                    </td>
                    <td>${formatDate(invoice.date)}</td>
                    <td>
                        <span class="due-date ${dueDateClass}">${formatDate(invoice.due_date)}</span>
                    </td>
                    <td class="amount-cell">KSh ${formatCurrency(invoice.amount)}</td>
                    <td>
                        <span class="invoice-status ${invoice.status}">
                            <i class="fas ${getStatusIcon(invoice.status)}"></i>
                            ${invoice.status}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn" onclick="viewInvoice(${invoice.id})" title="View Invoice">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="table-action-btn" onclick="editInvoice(${invoice.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="table-action-btn" onclick="downloadInvoice(${invoice.id})" title="Download PDF">
                                <i class="fas fa-download"></i>
                            </button>
                            <button class="table-action-btn delete" onclick="deleteInvoice(${invoice.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        invoicesTableBody.innerHTML = html;

        // Update pagination info
        const totalInvoices = filteredInvoices.length;
        const showingStart = totalInvoices > 0 ? startIndex + 1 : 0;
        const showingEnd = Math.min(endIndex, totalInvoices);
        
        document.getElementById('showingStart').textContent = showingStart;
        document.getElementById('showingEnd').textContent = showingEnd;
        document.getElementById('totalInvoicesCount').textContent = totalInvoices;
    }

    // Get status icon
    function getStatusIcon(status) {
        const icons = {
            'draft': 'fa-file',
            'sent': 'fa-paper-plane',
            'paid': 'fa-check-circle',
            'overdue': 'fa-exclamation-triangle',
            'cancelled': 'fa-times-circle'
        };
        return icons[status] || 'fa-question-circle';
    }

    // Add invoice item
    function addInvoiceItem() {
        invoiceItemCount++;
        const itemHtml = `
            <div class="invoice-item" data-item="${invoiceItemCount}">
                <input type="text" placeholder="Item description" class="item-description" required>
                <input type="number" placeholder="1" min="1" class="item-quantity" value="1" required>
                <input type="number" placeholder="0.00" min="0" step="0.01" class="item-price" required>
                <span class="item-total">KSh 0.00</span>
                <button type="button" class="remove-item-btn" onclick="removeInvoiceItem(${invoiceItemCount})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        invoiceItemsList.insertAdjacentHTML('beforeend', itemHtml);
        
        // Add event listeners for calculation
        const newItem = document.querySelector(`[data-item="${invoiceItemCount}"]`);
        const quantityInput = newItem.querySelector('.item-quantity');
        const priceInput = newItem.querySelector('.item-price');
        
        quantityInput.addEventListener('input', calculateInvoiceTotals);
        priceInput.addEventListener('input', calculateInvoiceTotals);
    }

    // Remove invoice item
    window.removeInvoiceItem = function(itemId) {
        const item = document.querySelector(`[data-item="${itemId}"]`);
        if (item) {
            item.remove();
            calculateInvoiceTotals();
        }
    };

    // Calculate invoice totals
    function calculateInvoiceTotals() {
        let subtotal = 0;
        
        document.querySelectorAll('.invoice-item').forEach(item => {
            const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(item.querySelector('.item-price').value) || 0;
            const total = quantity * price;
            
            item.querySelector('.item-total').textContent = `KSh ${formatCurrency(total)}`;
            subtotal += total;
        });
        
        const vat = subtotal * 0.16; // 16% VAT
        const total = subtotal + vat;
        
        document.getElementById('subtotalAmount').textContent = formatCurrency(subtotal);
        document.getElementById('vatAmount').textContent = formatCurrency(vat);
        document.getElementById('totalAmount').textContent = formatCurrency(total);
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
        
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

    // Global functions
    window.goToPage = function(page) {
        currentPage = page;
        renderInvoices();
        renderPagination();
    };

    window.viewInvoice = async function(id) {
        const invoice = await fetch(`/api/invoices/${id}/`).then(res => res.json());
        if (invoice) {
            showInvoicePreview(invoice);
        }
    };

    window.editInvoice = async function(id) {
        const invoice = await fetch(`/api/invoices/${id}/`).then(res => res.json());
        if (invoice) {
            populateInvoiceForm(invoice);
            createInvoiceModal.classList.add('active');
        }
    };

    window.downloadInvoice = function(id) {
        alert(`Downloading invoice PDF...`);
        window.open(`/api/invoices/${id}/download/`, '_blank');
    };

    window.deleteInvoice = async function(id) {
        if (confirm('Are you sure you want to delete this invoice?')) {
            try {
                const response = await fetch(`/api/invoices/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await applyFilters();
                    alert('Invoice deleted successfully!');
                } else {
                    alert('Failed to delete invoice.');
                }
            } catch (error) {
                console.error('Error deleting invoice:', error);
                alert('An error occurred while deleting the invoice.');
            }
        }
    };

    // Show invoice preview
    function showInvoicePreview(invoice) {
        const subtotal = invoice.items.reduce((sum, item) => sum + item.total, 0);
        const vat = subtotal * 0.16;
        const total = subtotal + vat;

        const previewHtml = `
            <div class="invoice-header">
                <div class="company-info">
                    <h2>InspireWear</h2>
                    <p>P.O. Box 12345, Nairobi, Kenya</p>
                    <p>Phone: +254 700 123 456</p>
                    <p>Email: info@inspirewear.co.ke</p>
                    <p>PIN: P051234567A</p>
                </div>
                <div class="invoice-title">
                    <h1>INVOICE</h1>
                    <p><strong>${invoice.number}</strong></p>
                </div>
            </div>
            
            <div class="invoice-details">
                <div class="bill-to">
                    <h3>Bill To:</h3>
                    <p><strong>${invoice.customer}</strong></p>
                    <p>${invoice.address}</p>
                    <p>${invoice.location}</p>
                    <p>Phone: ${invoice.phone}</p>
                    <p>Email: ${invoice.email}</p>
                </div>
                <div class="invoice-info">
                    <h3>Invoice Details:</h3>
                    <p><strong>Invoice Date:</strong> ${formatDate(invoice.date)}</p>
                    <p><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</p>
                    <p><strong>Status:</strong> ${invoice.status.toUpperCase()}</p>
                </div>
            </div>
            
            <table class="invoice-items-table">
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Unit Price (KSh)</th>
                        <th>Total (KSh)</th>
                    </tr>
                </thead>
                <tbody>
                    ${invoice.items.map(item => `
                        <tr>
                            <td>${item.description}</td>
                            <td>${item.quantity}</td>
                            <td>${formatCurrency(item.unit_price)}</td>
                            <td>${formatCurrency(item.total)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <table class="invoice-totals-table">
                <tr>
                    <td>Subtotal:</td>
                    <td>KSh ${formatCurrency(subtotal)}</td>
                </tr>
                <tr>
                    <td>VAT (16%):</td>
                    <td>KSh ${formatCurrency(vat)}</td>
                </tr>
                <tr class="total-row">
                    <td>Total:</td>
                    <td>KSh ${formatCurrency(total)}</td>
                </tr>
            </table>
            
            <div class="invoice-footer">
                <p><strong>Payment Terms:</strong> Payment is due within 30 days of invoice date.</p>
                <p><strong>Notes:</strong> ${invoice.notes || 'Thank you for your business!'}</p>
            </div>
        `;

        document.getElementById('invoicePreviewContent').innerHTML = previewHtml;
        document.getElementById('invoicePreviewModal').classList.add('active');
    }

    // Populate invoice form for editing
    function populateInvoiceForm(invoice) {
        document.getElementById('customerName').value = invoice.customer;
        document.getElementById('customerEmail').value = invoice.email;
        document.getElementById('customerPhone').value = invoice.phone;
        document.getElementById('customerLocation').value = invoice.location;
        document.getElementById('customerAddress').value = invoice.address;
        document.getElementById('invoiceDate').value = invoice.date;
        document.getElementById('dueDate').value = invoice.due_date;
        document.getElementById('invoiceNotes').value = invoice.notes || '';

        // Clear existing items
        invoiceItemsList.innerHTML = '';
        invoiceItemCount = 0;

        // Add invoice items
        invoice.items.forEach(item => {
            addInvoiceItem();
            const currentItem = document.querySelector(`[data-item="${invoiceItemCount}"]`);
            currentItem.querySelector('.item-description').value = item.description;
            currentItem.querySelector('.item-quantity').value = item.quantity;
            currentItem.querySelector('.item-price').value = item.unit_price;
        });

        calculateInvoiceTotals();
    }

    // Event Listeners
    searchInvoices.addEventListener('input', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    filterCustomer.addEventListener('change', applyFilters);
    filterDateFrom.addEventListener('change', applyFilters);
    filterDateTo.addEventListener('change', applyFilters);

    clearFilters.addEventListener('click', function() {
        searchInvoices.value = '';
        filterStatus.value = '';
        filterCustomer.value = '';
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
            renderInvoices();
            renderPagination();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderInvoices();
            renderPagination();
        }
    });

    // Add item button
    addItemBtn.addEventListener('click', addInvoiceItem);

    // Export functionality
    exportInvoices.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.invoice-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        let dataToExport = filteredInvoices;
        if (selectedIds.length > 0) {
            dataToExport = filteredInvoices.filter(inv => selectedIds.includes(inv.id));
        }

        exportToCSV(dataToExport);
    });

    // Export to CSV function
    function exportToCSV(data) {
        const headers = ['Invoice #', 'Customer', 'Date', 'Due Date', 'Amount (KSh)', 'Status', 'Location'];
        const csvContent = [
            headers.join(','),
            ...data.map(invoice => [
                invoice.number,
                `"${invoice.customer}"`,
                invoice.date,
                invoice.due_date,
                invoice.amount,
                invoice.status,
                invoice.location
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
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
    createInvoiceBtn.addEventListener('click', function() {
        createInvoiceForm.reset();
        invoiceItemsList.innerHTML = '';
        invoiceItemCount = 0;
        addInvoiceItem();
        calculateInvoiceTotals();
        
        // Set default dates
        const today = new Date();
        document.getElementById('invoiceDate').value = today.toISOString().split('T')[0];
        const dueDate = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
        
        createInvoiceModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        createInvoiceModal.classList.remove('active');
    });

    cancelCreateInvoice.addEventListener('click', function() {
        createInvoiceModal.classList.remove('active');
    });

    // Save as draft
    saveDraftBtn.addEventListener('click', async function() {
        const invoiceData = getInvoiceFormData();
        invoiceData.status = 'draft';

        try {
            const response = await fetch('/api/invoices/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });
            if (response.ok) {
                alert('Invoice saved as draft!');
                createInvoiceModal.classList.remove('active');
                await applyFilters();
            } else {
                alert('Failed to save draft.');
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            alert('An error occurred while saving the draft.');
        }
    });

    createInvoiceForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const invoiceData = getInvoiceFormData();
        invoiceData.status = 'sent';

        try {
            const response = await fetch('/api/invoices/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(invoiceData),
            });
            if (response.ok) {
                await applyFilters();
                createInvoiceModal.classList.remove('active');
                alert('Invoice created and sent successfully!');
            } else {
                alert('Failed to create invoice.');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
            alert('An error occurred while creating the invoice.');
        }
    });

    function getInvoiceFormData() {
        const items = [];
        document.querySelectorAll('.invoice-item').forEach(item => {
            const description = item.querySelector('.item-description').value;
            const quantity = parseFloat(item.querySelector('.item-quantity').value);
            const unitPrice = parseFloat(item.querySelector('.item-price').value);
            
            if (description && quantity && unitPrice) {
                items.push({
                    description,
                    quantity,
                    unit_price: unitPrice,
                    total: quantity * unitPrice
                });
            }
        });

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const amount = subtotal * 1.16; // Including VAT

        return {
            customer: document.getElementById('customerName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            location: document.getElementById('customerLocation').value,
            address: document.getElementById('customerAddress').value,
            date: document.getElementById('invoiceDate').value,
            due_date: document.getElementById('dueDate').value,
            amount,
            items,
            notes: document.getElementById('invoiceNotes').value
        };
    }

    // Close modals when clicking outside
    createInvoiceModal.addEventListener('click', function(e) {
        if (e.target === this) {
            createInvoiceModal.classList.remove('active');
        }
    });

    document.getElementById('invoicePreviewModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    document.getElementById('previewModalClose').addEventListener('click', function() {
        document.getElementById('invoicePreviewModal').classList.remove('active');
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