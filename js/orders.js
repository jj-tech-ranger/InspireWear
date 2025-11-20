document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const createOrderBtn = document.getElementById('createOrderBtn');
    const createOrderModal = document.getElementById('createOrderModal');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const updateStatusModal = document.getElementById('updateStatusModal');
    const modalClose = document.getElementById('modalClose');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const statusModalClose = document.getElementById('statusModalClose');
    const createOrderForm = document.getElementById('createOrderForm');
    const updateStatusForm = document.getElementById('updateStatusForm');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const orderSearch = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const supplierFilter = document.getElementById('supplierFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const dateFilter = document.getElementById('dateFilter');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');
    const addOrderItem = document.getElementById('addOrderItem');
    const orderItemsList = document.getElementById('orderItemsList');

    // State variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalOrders = 0;
    let currentFilters = {};

    // --- API Communication ---
    async function fetchFromAPI(endpoint, options = {}) {
        morphOverlay.classList.add('active');
        try {
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            // For DELETE requests, there might not be a JSON body
            if (options.method === 'DELETE' || response.status === 204) {
                return;
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            showNotification(error.message, 'error');
            throw error;
        } finally {
            setTimeout(() => morphOverlay.classList.remove('active'), 300);
        }
    }

    // --- Initialization ---
    async function initPage() {
        try {
            await Promise.all([
                updateOverviewMetrics(),
                loadOrdersTable()
            ]);
            document.getElementById('expectedDelivery').min = new Date().toISOString().split('T')[0];
        } catch (error) {
            ordersTableBody.innerHTML = `<tr><td colspan="10" class="text-center error-message">Failed to load initial data.</td></tr>`;
        }
    }

    // --- UI & Display Functions ---
    const formatNumber = (number) => new Intl.NumberFormat('en-US').format(number);
    const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    // --- Data Loading and Rendering ---
    async function updateOverviewMetrics() {
        try {
            const summary = await fetchFromAPI('/api/orders/summary');
            document.getElementById('totalOrders').textContent = formatNumber(summary.totalOrders || 0);
            document.getElementById('pendingOrders').textContent = formatNumber(summary.pendingOrders || 0);
            document.getElementById('deliveredOrders').textContent = formatNumber(summary.deliveredOrders || 0);
            document.getElementById('ordersValue').textContent = formatCurrency(summary.ordersValue || 0);
        } catch (error) {
            console.error("Failed to update overview metrics:", error);
        }
    }

    async function loadOrdersTable() {
        const params = new URLSearchParams({ page: currentPage, limit: itemsPerPage, ...currentFilters });
        try {
            const data = await fetchFromAPI(`/api/orders?${params.toString()}`);
            totalOrders = data.totalOrders || 0;
            renderTable(data.orders);
            updatePagination();
        } catch (error) {
            ordersTableBody.innerHTML = `<tr><td colspan="10" class="text-center error-message">Could not load orders.</td></tr>`;
        }
    }

    function renderTable(orders) {
        if (!orders || orders.length === 0) {
            ordersTableBody.innerHTML = `<tr><td colspan="10" class="text-center">No orders found.</td></tr>`;
            return;
        }
        const html = orders.map(order => `
            <tr data-id="${order.id}">
                <td><input type="checkbox" class="checkbox order-checkbox" data-id="${order.id}"></td>
                <td><span class="order-id" data-id="${order.id}">${order.id}</span></td>
                <td>${order.supplier}</td>
                <td>${order.items.length} items</td>
                <td>${formatDate(order.orderDate)}</td>
                <td>${formatDate(order.expectedDelivery)}</td>
                <td class="order-total">${formatCurrency(order.total)}</td>
                <td><span class="priority ${order.priority}">${order.priority}</span></td>
                <td><span class="status ${order.status}">${order.status}</span></td>
                <td class="actions-cell">
                    <button class="action-btn view-btn" title="View"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit-btn" title="Update Status"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete-btn" title="Cancel"><i class="fas fa-times"></i></button>
                </td>
            </tr>`).join('');
        ordersTableBody.innerHTML = html;
    }

    async function viewOrderDetails(orderId) {
        try {
            const order = await fetchFromAPI(`/api/orders/${orderId}`);
            document.getElementById('orderDetailsTitle').textContent = `Order ${order.id}`;
            document.getElementById('orderDetailsContent').innerHTML = `
                <!-- Order details content -->
            `;
            orderDetailsModal.classList.add('active');
        } catch (error) {
            showNotification('Failed to fetch order details.', 'error');
        }
    }

    // --- CRUD Operations ---
    async function handleCreateOrder(e) {
        e.preventDefault();
        const formData = new FormData(createOrderForm);
        const orderData = Object.fromEntries(formData.entries());
        orderData.items = []; // Populate this from the dynamic item rows
        try {
            await fetchFromAPI('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            showNotification('Order created successfully!');
            createOrderModal.classList.remove('active');
            createOrderForm.reset();
            await Promise.all([updateOverviewMetrics(), loadOrdersTable()]);
        } catch (error) {
            // Error already handled by fetchFromAPI
        }
    }

    async function handleUpdateStatus(e) {
        e.preventDefault();
        const orderId = document.getElementById('updateOrderId').value;
        const newStatus = document.getElementById('newStatus').value;
        const notes = document.getElementById('statusNotes').value;
        try {
            await fetchFromAPI(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, notes })
            });
            showNotification('Order status updated!');
            updateStatusModal.classList.remove('active');
            await Promise.all([updateOverviewMetrics(), loadOrdersTable()]);
        } catch (error) {
            // Error handled
        }
    }

    async function cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) return;
        try {
            await fetchFromAPI(`/api/orders/${orderId}`, { method: 'DELETE' });
            showNotification('Order cancelled successfully!');
            await Promise.all([updateOverviewMetrics(), loadOrdersTable()]);
        } catch (error) {
            // Error handled
        }
    }

    // --- Event Handlers ---
    function handleFilterChange() {
        currentFilters = {
            search: orderSearch.value,
            status: statusFilter.value,
            supplier: supplierFilter.value,
            priority: priorityFilter.value,
            date: dateFilter.value
        };
        currentPage = 1;
        loadOrdersTable();
    }

    function openUpdateStatusModal(orderId) {
        document.getElementById('updateOrderId').value = orderId;
        updateStatusModal.classList.add('active');
    }

    // --- Pagination ---
    function updatePagination() {
        const totalPages = Math.ceil(totalOrders / itemsPerPage);
        paginationInfo.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalOrders)} of ${totalOrders}`;
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage >= totalPages;
        pageNumbers.innerHTML = `<button class="page-number active">${currentPage}</button>`;
    }

    function changePage(direction) {
        currentPage += direction;
        loadOrdersTable();
    }

    // --- Event Listeners ---
    createOrderBtn.addEventListener('click', () => createOrderModal.classList.add('active'));
    [modalClose, detailsModalClose, statusModalClose].forEach(btn => btn.addEventListener('click', () => btn.closest('.modal').classList.remove('active')));
    createOrderForm.addEventListener('submit', handleCreateOrder);
    updateStatusForm.addEventListener('submit', handleUpdateStatus);
    ordersTableBody.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const orderId = button.closest('tr').dataset.id;
        if (button.classList.contains('view-btn')) viewOrderDetails(orderId);
        if (button.classList.contains('edit-btn')) openUpdateStatusModal(orderId);
        if (button.classList.contains('delete-btn')) cancelOrder(orderId);
    });
    [orderSearch, statusFilter, supplierFilter, priorityFilter, dateFilter].forEach(el => el.addEventListener('input', handleFilterChange));
    prevPage.addEventListener('click', () => changePage(-1));
    nextPage.addEventListener('click', () => changePage(1));
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('inventoryTheme', newTheme);
        themeToggle.querySelector('.theme-icon').className = `theme-icon fas ${newTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    });

    // --- Initial Load ---
    const savedTheme = localStorage.getItem('inventoryTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('.theme-icon').className = `theme-icon fas ${savedTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    initPage();
});