document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const createOrderBtn = document.getElementById('createOrderBtn');
    const createOrderModal = document.getElementById('createOrderModal');
    const orderDetailsModal = document.getElementById('orderDetailsModal');
    const updateStatusModal = document.getElementById('updateStatusModal');
    const modalClose = document.getElementById('modalClose');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const statusModalClose = document.getElementById('statusModalClose');
    const cancelCreateOrder = document.getElementById('cancelCreateOrder');
    const closeOrderDetails = document.getElementById('closeOrderDetails');
    const updateOrderStatus = document.getElementById('updateOrderStatus');
    const cancelStatusUpdate = document.getElementById('cancelStatusUpdate');
    const createOrderForm = document.getElementById('createOrderForm');
    const updateStatusForm = document.getElementById('updateStatusForm');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const orderSearch = document.getElementById('orderSearch');
    const statusFilter = document.getElementById('statusFilter');
    const supplierFilter = document.getElementById('supplierFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const dateFilter = document.getElementById('dateFilter');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');
    const addOrderItem = document.getElementById('addOrderItem');
    const orderItemsList = document.getElementById('orderItemsList');

    // Sample orders data with Kenyan context
    const ordersData = {
        totalOrders: 156,
        pendingOrders: 23,
        deliveredOrders: 118,
        ordersValue: 3245600,
        orders: [
            {
                id: 'ORD-2025-001',
                supplier: 'Nairobi Textile Mills',
                items: [
                    { product: 'Kitenge Print Dress', quantity: 50, unitPrice: 2500, total: 125000 },
                    { product: 'Cotton Polo Shirt', quantity: 30, unitPrice: 1800, total: 54000 }
                ],
                orderDate: '2025-01-15',
                expectedDelivery: '2025-01-25',
                deliveryLocation: 'Nairobi',
                subtotal: 179000,
                tax: 28640,
                total: 207640,
                priority: 'high',
                status: 'confirmed',
                notes: 'Rush order for new collection launch',
                createdBy: 'John Doe',
                lastUpdated: '2025-01-16'
            },
            {
                id: 'ORD-2025-002',
                supplier: 'Mombasa Leather Works',
                items: [
                    { product: 'Leather Sandals', quantity: 25, unitPrice: 2800, total: 70000 }
                ],
                orderDate: '2025-01-14',
                expectedDelivery: '2025-01-28',
                deliveryLocation: 'Mombasa',
                subtotal: 70000,
                tax: 11200,
                total: 81200,
                priority: 'medium',
                status: 'shipped',
                notes: 'Quality leather sandals for summer collection',
                createdBy: 'Jane Smith',
                lastUpdated: '2025-01-18'
            },
            {
                id: 'ORD-2025-003',
                supplier: 'Kisumu Beads & Crafts',
                items: [
                    { product: 'Maasai Beaded Necklace', quantity: 100, unitPrice: 1800, total: 180000 },
                    { product: 'Kikoy Beach Wrap', quantity: 75, unitPrice: 1500, total: 112500 }
                ],
                orderDate: '2025-01-13',
                expectedDelivery: '2025-01-23',
                deliveryLocation: 'Kisumu',
                subtotal: 292500,
                tax: 46800,
                total: 339300,
                priority: 'low',
                status: 'delivered',
                notes: 'Traditional accessories for cultural events',
                createdBy: 'Mary Johnson',
                lastUpdated: '2025-01-20'
            },
            {
                id: 'ORD-2025-004',
                supplier: 'Eldoret Packaging Solutions',
                items: [
                    { product: 'Eco Packaging Boxes', quantity: 500, unitPrice: 150, total: 75000 },
                    { product: 'Shopping Bags', quantity: 1000, unitPrice: 80, total: 80000 }
                ],
                orderDate: '2025-01-12',
                expectedDelivery: '2025-01-22',
                deliveryLocation: 'Eldoret',
                subtotal: 155000,
                tax: 24800,
                total: 179800,
                priority: 'medium',
                status: 'pending',
                notes: 'Sustainable packaging materials',
                createdBy: 'David Wilson',
                lastUpdated: '2025-01-12'
            },
            {
                id: 'ORD-2025-005',
                supplier: 'Nakuru Equipment Suppliers',
                items: [
                    { product: 'Industrial Sewing Machine', quantity: 2, unitPrice: 85000, total: 170000 }
                ],
                orderDate: '2025-01-11',
                expectedDelivery: '2025-02-01',
                deliveryLocation: 'Nakuru',
                subtotal: 170000,
                tax: 27200,
                total: 197200,
                priority: 'high',
                status: 'confirmed',
                notes: 'Equipment upgrade for production line',
                createdBy: 'Sarah Brown',
                lastUpdated: '2025-01-15'
            },
            {
                id: 'ORD-2025-006',
                supplier: 'Thika Cotton Weavers',
                items: [
                    { product: 'Organic Cotton Fabric', quantity: 200, unitPrice: 1200, total: 240000 }
                ],
                orderDate: '2025-01-10',
                expectedDelivery: '2025-01-20',
                deliveryLocation: 'Thika',
                subtotal: 240000,
                tax: 38400,
                total: 278400,
                priority: 'medium',
                status: 'shipped',
                notes: 'Premium organic cotton for eco-friendly line',
                createdBy: 'Michael Davis',
                lastUpdated: '2025-01-17'
            },
            {
                id: 'ORD-2025-007',
                supplier: 'Coastal Accessories Ltd',
                items: [
                    { product: 'Beach Accessories Set', quantity: 80, unitPrice: 2200, total: 176000 }
                ],
                orderDate: '2025-01-09',
                expectedDelivery: '2025-01-19',
                deliveryLocation: 'Mombasa',
                subtotal: 176000,
                tax: 28160,
                total: 204160,
                priority: 'low',
                status: 'delivered',
                notes: 'Coastal themed accessories for resort wear',
                createdBy: 'Lisa Anderson',
                lastUpdated: '2025-01-19'
            },
            {
                id: 'ORD-2025-008',
                supplier: 'Highland Wool Suppliers',
                items: [
                    { product: 'Wool Fabric', quantity: 150, unitPrice: 3200, total: 480000 }
                ],
                orderDate: '2025-01-08',
                expectedDelivery: '2025-01-30',
                deliveryLocation: 'Eldoret',
                subtotal: 480000,
                tax: 76800,
                total: 556800,
                priority: 'high',
                status: 'pending',
                notes: 'High-quality wool for winter collection',
                createdBy: 'Robert Taylor',
                lastUpdated: '2025-01-08'
            },
            {
                id: 'ORD-2025-009',
                supplier: 'Urban Packaging Co.',
                items: [
                    { product: 'Premium Gift Boxes', quantity: 300, unitPrice: 250, total: 75000 },
                    { product: 'Branded Labels', quantity: 2000, unitPrice: 25, total: 50000 }
                ],
                orderDate: '2025-01-07',
                expectedDelivery: '2025-01-17',
                deliveryLocation: 'Nairobi',
                subtotal: 125000,
                tax: 20000,
                total: 145000,
                priority: 'medium',
                status: 'delivered',
                notes: 'Premium packaging for luxury items',
                createdBy: 'Emma Wilson',
                lastUpdated: '2025-01-17'
            },
            {
                id: 'ORD-2025-010',
                supplier: 'Rift Valley Textiles',
                items: [
                    { product: 'Denim Fabric', quantity: 120, unitPrice: 2800, total: 336000 }
                ],
                orderDate: '2025-01-06',
                expectedDelivery: '2025-01-26',
                deliveryLocation: 'Nakuru',
                subtotal: 336000,
                tax: 53760,
                total: 389760,
                priority: 'low',
                status: 'cancelled',
                notes: 'Order cancelled due to quality issues',
                createdBy: 'James Miller',
                lastUpdated: '2025-01-14'
            }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredOrders = [...ordersData.orders];
    let currentOrderForUpdate = null;

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalOrders').textContent = formatNumber(ordersData.totalOrders);
        document.getElementById('pendingOrders').textContent = formatNumber(ordersData.pendingOrders);
        document.getElementById('deliveredOrders').textContent = formatNumber(ordersData.deliveredOrders);
        document.getElementById('ordersValue').textContent = formatCurrency(ordersData.ordersValue);

        // Load orders table
        loadOrdersTable();

        // Set minimum date for expected delivery
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.getElementById('expectedDelivery').min = tomorrow.toISOString().split('T')[0];

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Format currency for Kenyan Shillings
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load orders into the table
    function loadOrdersTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageOrders = filteredOrders.slice(startIndex, endIndex);

        let html = '';

        pageOrders.forEach(order => {
            const statusClass = order.status;
            const priorityClass = order.priority;
            
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="checkbox order-checkbox" data-id="${order.id}">
                    </td>
                    <td>
                        <span class="order-id" data-id="${order.id}">${order.id}</span>
                    </td>
                    <td class="supplier-cell">${order.supplier}</td>
                    <td>
                        <span class="items-count">${order.items.length} item${order.items.length > 1 ? 's' : ''}</span>
                    </td>
                    <td>${formatDate(order.orderDate)}</td>
                    <td>${formatDate(order.expectedDelivery)}</td>
                    <td class="order-total">KSh ${formatCurrency(order.total)}</td>
                    <td><span class="priority ${priorityClass}">${order.priority}</span></td>
                    <td><span class="status ${statusClass}">${order.status}</span></td>
                    <td class="actions-cell">
                        <button class="action-btn view-btn" data-id="${order.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-btn" data-id="${order.id}" title="Update Status">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete delete-btn" data-id="${order.id}" title="Cancel Order">
                            <i class="fas fa-times"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        ordersTableBody.innerHTML = html;
        updatePagination();
        attachTableEventListeners();
    }

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredOrders.length);

        // Update pagination info
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredOrders.length} orders`;

        // Update pagination buttons
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages;

        // Generate page numbers
        generatePageNumbers(totalPages);
    }

    // Generate page numbers
    function generatePageNumbers(totalPages) {
        let html = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            html += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `;
        }

        pageNumbers.innerHTML = html;

        // Attach page number event listeners
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', function() {
                currentPage = parseInt(this.dataset.page);
                loadOrdersTable();
            });
        });
    }

    // Attach event listeners to table elements
    function attachTableEventListeners() {
        // Order ID click to view details
        document.querySelectorAll('.order-id').forEach(element => {
            element.addEventListener('click', function() {
                const orderId = this.dataset.id;
                viewOrderDetails(orderId);
            });
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.id;
                viewOrderDetails(orderId);
            });
        });

        // Edit buttons (update status)
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.id;
                openUpdateStatusModal(orderId);
            });
        });

        // Delete buttons (cancel order)
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.id;
                cancelOrder(orderId);
            });
        });

        // Order checkboxes
        document.querySelectorAll('.order-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllState);
        });
    }

    // View order details
    function viewOrderDetails(orderId) {
        const order = ordersData.orders.find(o => o.id === orderId);
        if (!order) return;

        currentOrderForUpdate = order;

        document.getElementById('orderDetailsTitle').textContent = `Order ${order.id}`;
        
        const detailsContent = document.getElementById('orderDetailsContent');
        
        let itemsTableHtml = '';
        order.items.forEach(item => {
            itemsTableHtml += `
                <tr>
                    <td>${item.product}</td>
                    <td>${item.quantity}</td>
                    <td>KSh ${formatCurrency(item.unitPrice)}</td>
                    <td>KSh ${formatCurrency(item.total)}</td>
                </tr>
            `;
        });

        detailsContent.innerHTML = `
            <div class="order-details-content">
                <div class="details-section">
                    <h4>Order Information</h4>
                    <div class="details-grid">
                        <div class="details-item">
                            <label>Order ID:</label>
                            <span>${order.id}</span>
                        </div>
                        <div class="details-item">
                            <label>Supplier:</label>
                            <span>${order.supplier}</span>
                        </div>
                        <div class="details-item">
                            <label>Order Date:</label>
                            <span>${formatDate(order.orderDate)}</span>
                        </div>
                        <div class="details-item">
                            <label>Expected Delivery:</label>
                            <span>${formatDate(order.expectedDelivery)}</span>
                        </div>
                        <div class="details-item">
                            <label>Delivery Location:</label>
                            <span>${order.deliveryLocation}</span>
                        </div>
                        <div class="details-item">
                            <label>Priority:</label>
                            <span class="priority ${order.priority}">${order.priority}</span>
                        </div>
                        <div class="details-item">
                            <label>Status:</label>
                            <span class="status ${order.status}">${order.status}</span>
                        </div>
                        <div class="details-item">
                            <label>Created By:</label>
                            <span>${order.createdBy}</span>
                        </div>
                        <div class="details-item full-width">
                            <label>Notes:</label>
                            <span>${order.notes}</span>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Order Items</h4>
                    <table class="order-items-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsTableHtml}
                        </tbody>
                    </table>
                </div>
                
                <div class="details-section">
                    <h4>Order Summary</h4>
                    <div class="order-summary">
                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>KSh ${formatCurrency(order.subtotal)}</span>
                        </div>
                        <div class="summary-row">
                            <span>Tax (16%):</span>
                            <span>KSh ${formatCurrency(order.tax)}</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>KSh ${formatCurrency(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        orderDetailsModal.classList.add('active');
    }

    // Open update status modal
    function openUpdateStatusModal(orderId) {
        const order = ordersData.orders.find(o => o.id === orderId);
        if (!order) return;

        currentOrderForUpdate = order;
        document.getElementById('updateOrderId').value = order.id;
        document.getElementById('newStatus').value = order.status;
        document.getElementById('statusNotes').value = '';

        updateStatusModal.classList.add('active');
    }

    // Cancel order
    function cancelOrder(orderId) {
        if (confirm('Are you sure you want to cancel this order?')) {
            const orderIndex = ordersData.orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                const oldStatus = ordersData.orders[orderIndex].status;
                ordersData.orders[orderIndex].status = 'cancelled';
                ordersData.orders[orderIndex].lastUpdated = new Date().toISOString().split('T')[0];

                // Update overview numbers
                if (oldStatus === 'pending') {
                    ordersData.pendingOrders--;
                    document.getElementById('pendingOrders').textContent = formatNumber(ordersData.pendingOrders);
                } else if (oldStatus === 'delivered') {
                    ordersData.deliveredOrders--;
                    document.getElementById('deliveredOrders').textContent = formatNumber(ordersData.deliveredOrders);
                }
                
                applyFilters();
                alert('Order cancelled successfully!');
            }
        }
    }

    // Apply filters
    function applyFilters() {
        const searchTerm = orderSearch.value.toLowerCase();
        const statusValue = statusFilter.value;
        const supplierValue = supplierFilter.value;
        const priorityValue = priorityFilter.value;
        const dateValue = dateFilter.value;

        filteredOrders = ordersData.orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm) ||
                                order.supplier.toLowerCase().includes(searchTerm) ||
                                order.notes.toLowerCase().includes(searchTerm) ||
                                order.createdBy.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusValue || order.status === statusValue;
            const matchesSupplier = !supplierValue || order.supplier === supplierValue;
            const matchesPriority = !priorityValue || order.priority === priorityValue;
            const matchesDate = !dateValue || order.orderDate === dateValue;

            return matchesSearch && matchesStatus && matchesSupplier && matchesPriority && matchesDate;
        });

        currentPage = 1;
        loadOrdersTable();
    }

    // Update select all state
    function updateSelectAllState() {
        const checkboxes = document.querySelectorAll('.order-checkbox');
        const checkedBoxes = document.querySelectorAll('.order-checkbox:checked');
        
        if (checkedBoxes.length === 0) {
            selectAll.indeterminate = false;
            selectAll.checked = false;
        } else if (checkedBoxes.length === checkboxes.length) {
            selectAll.indeterminate = false;
            selectAll.checked = true;
        } else {
            selectAll.indeterminate = true;
            selectAll.checked = false;
        }
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Calculate order item total
    function calculateItemTotal(row) {
        const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const total = quantity * price;
        row.querySelector('.item-total').value = `KSh ${formatCurrency(total)}`;
        calculateOrderTotal();
    }

    // Calculate order total
    function calculateOrderTotal() {
        let subtotal = 0;
        document.querySelectorAll('.order-item-row').forEach(row => {
            const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
            const price = parseFloat(row.querySelector('.item-price').value) || 0;
            subtotal += quantity * price;
        });

        const tax = subtotal * 0.16; // 16% VAT
        const total = subtotal + tax;

        document.getElementById('orderSubtotal').textContent = `KSh ${formatCurrency(subtotal)}`;
        document.getElementById('orderTax').textContent = `KSh ${formatCurrency(tax)}`;
        document.getElementById('orderTotal').textContent = `KSh ${formatCurrency(total)}`;
    }

    // Add new order item row
    function addOrderItemRow() {
        const newRow = document.createElement('div');
        newRow.className = 'order-item-row';
        newRow.innerHTML = `
            <div class="form-group">
                <label>Product</label>
                <select class="item-product" required>
                    <option value="">Select Product</option>
                    <option value="Kitenge Print Dress">Kitenge Print Dress</option>
                    <option value="Safari Cargo Pants">Safari Cargo Pants</option>
                    <option value="Maasai Beaded Necklace">Maasai Beaded Necklace</option>
                    <option value="Kikoy Beach Wrap">Kikoy Beach Wrap</option>
                    <option value="Ankara Print Blazer">Ankara Print Blazer</option>
                </select>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="item-quantity" min="1" required>
            </div>
            <div class="form-group">
                <label>Unit Price (KSh)</label>
                <input type="number" class="item-price" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Total</label>
                <input type="text" class="item-total" readonly>
            </div>
            <div class="form-group">
                <label>&nbsp;</label>
                <button type="button" class="btn-danger remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        orderItemsList.appendChild(newRow);
        attachOrderItemEvents(newRow);
    }

    // Attach events to order item row
    function attachOrderItemEvents(row) {
        const quantityInput = row.querySelector('.item-quantity');
        const priceInput = row.querySelector('.item-price');
        const removeBtn = row.querySelector('.remove-item');

        quantityInput.addEventListener('input', () => calculateItemTotal(row));
        priceInput.addEventListener('input', () => calculateItemTotal(row));
        
        removeBtn.addEventListener('click', () => {
            if (orderItemsList.children.length > 1) {
                row.remove();
                calculateOrderTotal();
            } else {
                alert('At least one item is required for an order.');
            }
        });
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('inventoryTheme', newTheme);

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

    // Search and filter event listeners
    orderSearch.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    supplierFilter.addEventListener('change', applyFilters);
    priorityFilter.addEventListener('change', applyFilters);
    dateFilter.addEventListener('change', applyFilters);

    // Select all checkbox
    selectAll.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.order-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Pagination event listeners
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadOrdersTable();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadOrdersTable();
        }
    });

    // Modal Functions
    createOrderBtn.addEventListener('click', function() {
        createOrderModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        createOrderModal.classList.remove('active');
    });

    detailsModalClose.addEventListener('click', function() {
        orderDetailsModal.classList.remove('active');
    });

    statusModalClose.addEventListener('click', function() {
        updateStatusModal.classList.remove('active');
    });

    cancelCreateOrder.addEventListener('click', function() {
        createOrderModal.classList.remove('active');
    });

    closeOrderDetails.addEventListener('click', function() {
        orderDetailsModal.classList.remove('active');
    });

    updateOrderStatus.addEventListener('click', function() {
        orderDetailsModal.classList.remove('active');
        if (currentOrderForUpdate) {
            openUpdateStatusModal(currentOrderForUpdate.id);
        }
    });

    cancelStatusUpdate.addEventListener('click', function() {
        updateStatusModal.classList.remove('active');
    });

    // Add order item button
    addOrderItem.addEventListener('click', addOrderItemRow);

    // Create order form submission
    createOrderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Collect order items
        const items = [];
        let subtotal = 0;
        
        document.querySelectorAll('.order-item-row').forEach(row => {
            const product = row.querySelector('.item-product').value;
            const quantity = parseInt(row.querySelector('.item-quantity').value);
            const unitPrice = parseFloat(row.querySelector('.item-price').value);
            const total = quantity * unitPrice;
            
            if (product && quantity && unitPrice) {
                items.push({ product, quantity, unitPrice, total });
                subtotal += total;
            }
        });

        if (items.length === 0) {
            alert('Please add at least one item to the order.');
            return;
        }

        const tax = subtotal * 0.16;
        const total = subtotal + tax;
        
        const newOrder = {
            id: `ORD-2025-${String(ordersData.orders.length + 1).padStart(3, '0')}`,
            supplier: document.getElementById('orderSupplier').value,
            items: items,
            orderDate: new Date().toISOString().split('T')[0],
            expectedDelivery: document.getElementById('expectedDelivery').value,
            deliveryLocation: document.getElementById('deliveryLocation').value,
            subtotal: subtotal,
            tax: tax,
            total: total,
            priority: document.getElementById('orderPriority').value,
            status: 'pending',
            notes: document.getElementById('orderNotes').value,
            createdBy: 'Current User',
            lastUpdated: new Date().toISOString().split('T')[0]
        };

        ordersData.orders.unshift(newOrder);
        ordersData.totalOrders++;
        ordersData.pendingOrders++;
        
        // Update overview numbers
        document.getElementById('totalOrders').textContent = formatNumber(ordersData.totalOrders);
        document.getElementById('pendingOrders').textContent = formatNumber(ordersData.pendingOrders);
        
        applyFilters();
        createOrderModal.classList.remove('active');
        this.reset();
        
        // Reset order items to single row
        orderItemsList.innerHTML = `
            <div class="order-item-row">
                <div class="form-group">
                    <label>Product</label>
                    <select class="item-product" required>
                        <option value="">Select Product</option>
                        <option value="Kitenge Print Dress">Kitenge Print Dress</option>
                        <option value="Safari Cargo Pants">Safari Cargo Pants</option>
                        <option value="Maasai Beaded Necklace">Maasai Beaded Necklace</option>
                        <option value="Kikoy Beach Wrap">Kikoy Beach Wrap</option>
                        <option value="Ankara Print Blazer">Ankara Print Blazer</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Quantity</label>
                    <input type="number" class="item-quantity" min="1" required>
                </div>
                <div class="form-group">
                    <label>Unit Price (KSh)</label>
                    <input type="number" class="item-price" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Total</label>
                    <input type="text" class="item-total" readonly>
                </div>
                <div class="form-group">
                    <label>&nbsp;</label>
                    <button type="button" class="btn-danger remove-item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Reattach events to the reset row
        attachOrderItemEvents(orderItemsList.querySelector('.order-item-row'));
        calculateOrderTotal();
        
        alert('Order created successfully!');
    });

    // Update status form submission
    updateStatusForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('updateOrderId').value;
        const newStatus = document.getElementById('newStatus').value;
        const statusNotes = document.getElementById('statusNotes').value;
        
        const orderIndex = ordersData.orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            const oldStatus = ordersData.orders[orderIndex].status;
            ordersData.orders[orderIndex].status = newStatus;
            ordersData.orders[orderIndex].lastUpdated = new Date().toISOString().split('T')[0];
            
            if (statusNotes) {
                ordersData.orders[orderIndex].notes += `\n\nStatus Update: ${statusNotes}`;
            }

            // Update overview numbers based on status change
            if (oldStatus === 'pending' && newStatus !== 'pending') {
                ordersData.pendingOrders--;
            } else if (oldStatus !== 'pending' && newStatus === 'pending') {
                ordersData.pendingOrders++;
            }
            
            if (oldStatus === 'delivered' && newStatus !== 'delivered') {
                ordersData.deliveredOrders--;
            } else if (oldStatus !== 'delivered' && newStatus === 'delivered') {
                ordersData.deliveredOrders++;
            }
            
            // Update overview display
            document.getElementById('pendingOrders').textContent = formatNumber(ordersData.pendingOrders);
            document.getElementById('deliveredOrders').textContent = formatNumber(ordersData.deliveredOrders);
            
            applyFilters();
            updateStatusModal.classList.remove('active');
            alert('Order status updated successfully!');
        }
    });

    // Close modals when clicking outside
    createOrderModal.addEventListener('click', function(e) {
        if (e.target === this) {
            createOrderModal.classList.remove('active');
        }
    });

    orderDetailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            orderDetailsModal.classList.remove('active');
        }
    });

    updateStatusModal.addEventListener('click', function(e) {
        if (e.target === this) {
            updateStatusModal.classList.remove('active');
        }
    });

    // Bulk actions (placeholder)
    document.getElementById('bulkActionsBtn').addEventListener('click', function() {
        alert('Bulk actions functionality would be implemented here.');
    });

    document.getElementById('exportOrdersBtn').addEventListener('click', function() {
        alert('Export functionality would be implemented here.');
    });

    // Initialize order item events for the default row
    attachOrderItemEvents(orderItemsList.querySelector('.order-item-row'));

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('inventoryTheme');
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

