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
            await updateSummary();
            await applyFilters();
            addInvoiceItem(); // Add initial item row in the modal
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    async function updateSummary() {
        try {
            const summary = await fetch('/api/finance/summary/').then(res => res.json());
            document.getElementById('totalInvoices').textContent = summary.total_invoices;
            document.getElementById('paidAmount').textContent = formatCurrency(summary.paid_amount);
            document.getElementById('pendingAmount').textContent = formatCurrency(summary.pending_amount);
            document.getElementById('overdueAmount').textContent = formatCurrency(summary.overdue_amount);
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

    // Apply filters and search
    async function applyFilters() {
        const params = new URLSearchParams({
            search: searchInvoices.value.toLowerCase(),
            status: filterStatus.value,
            customer: filterCustomer.value,
            date_from: filterDateFrom.value,
            date_to: filterDateTo.value,
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
            html += `
                <tr data-id="${invoice.id}">
                    <td><input type="checkbox" class="invoice-checkbox" data-id="${invoice.id}"></td>
                    <td><span class="invoice-number">${invoice.id}</span></td>
                    <td>${invoice.customer}</td>
                    <td>${formatDate(invoice.date)}</td>
                    <td>${formatDate(invoice.due_date)}</td>
                    <td class="amount-cell">KSh ${formatCurrency(invoice.amount)}</td>
                    <td><span class="invoice-status ${invoice.status}">${invoice.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn view-btn" title="View Invoice"><i class="fas fa-eye"></i></button>
                            <button class="table-action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="table-action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        invoicesTableBody.innerHTML = html;
        attachTableEventListeners();
        updatePaginationInfo();
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.closest('tr').dataset.id;
                editInvoice(invoiceId);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const invoiceId = this.closest('tr').dataset.id;
                deleteInvoice(invoiceId);
            });
        });
    }

    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
        document.getElementById('paginationInfo').textContent = `Showing ${currentPage} of ${totalPages} pages`;
    }

    // Other functions (addInvoiceItem, calculateInvoiceTotals, etc.) remain the same

    // Initialize the page
    initPage();
});
