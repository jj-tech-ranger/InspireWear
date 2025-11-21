document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const editProductModal = document.getElementById('editProductModal');
    const modalClose = document.getElementById('modalClose');
    const editModalClose = document.getElementById('editModalClose');
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');
    const productsTableBody = document.getElementById('productsTableBody');
    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const locationFilter = document.getElementById('locationFilter');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');

    // State variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalProducts = 0;
    let currentFilters = {};

    // --- Initialization ---
    async function initPage() {
        try {
            await Promise.all([
                updateOverviewMetrics(),
                loadProductsTable()
            ]);
        } catch (error) {
            productsTableBody.innerHTML = `<tr><td colspan="10" class="text-center error-message">Failed to load initial data.</td></tr>`;
        }
    }

    // --- UI & Display Functions ---
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(amount);
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
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
            const summary = await fetch('/api/products/summary/').then(res => res.json());
            document.getElementById('totalProducts').textContent = formatNumber(summary.total_products || 0);
            document.getElementById('activeProducts').textContent = formatNumber(summary.active_products || 0);
            document.getElementById('outOfStock').textContent = formatNumber(summary.out_of_stock || 0);
            document.getElementById('totalValue').textContent = formatCurrency(summary.total_value || 0);
        } catch (error) {
            console.error("Failed to update overview metrics:", error);
        }
    }

    async function loadProductsTable() {
        const params = new URLSearchParams({
            page: currentPage,
            limit: itemsPerPage,
            ...currentFilters
        });

        try {
            const data = await fetch(`/api/products/?${params.toString()}`).then(res => res.json());
            totalProducts = data.count || 0;
            renderTable(data.results);
            updatePagination();
        } catch (error) {
            productsTableBody.innerHTML = `<tr><td colspan="10" class="text-center error-message">Could not load products.</td></tr>`;
        }
    }

    function renderTable(products) {
        if (products.length === 0) {
            productsTableBody.innerHTML = `<tr><td colspan="10" class="text-center">No products found.</td></tr>`;
            return;
        }

        const html = products.map(product => {
            const stockClass = product.stock === 0 ? 'stock-low' : product.stock < 20 ? 'stock-medium' : 'stock-high';
            const statusClass = product.status.replace(/\s+/g, '-').toLowerCase();
            return `
                <tr data-id="${product.id}">
                    <td><input type="checkbox" class="checkbox product-checkbox" data-id="${product.id}"></td>
                    <td>
                        <div class="product-info">
                            <img src="${product.image || '../img/placeholder.jpg'}" alt="${product.name}" class="product-image" onerror="this.src='../img/placeholder.jpg'">
                            <div><h4>${product.name}</h4><p>${product.description || ''}</p></div>
                        </div>
                    </td>
                    <td>${product.sku}</td>
                    <td>${product.category}</td>
                    <td class="price-cell">${formatCurrency(product.price)}</td>
                    <td class="stock-cell ${stockClass}">${product.stock}</td>
                    <td><span class="location-badge">${product.location}</span></td>
                    <td><span class="status ${statusClass}">${product.status}</span></td>
                    <td>${formatDate(product.last_updated)}</td>
                    <td class="actions-cell">
                        <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
        productsTableBody.innerHTML = html;
        attachTableEventListeners();
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.closest('tr').dataset.id;
                openEditModal(productId);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.closest('tr').dataset.id;
                handleDeleteProduct(productId);
            });
        });
    }

    // --- CRUD Operations ---
    async function handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const newProduct = Object.fromEntries(formData.entries());

        try {
            await fetch('/api/products/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            showNotification('Product added successfully!');
            addProductModal.classList.remove('active');
            addProductForm.reset();
            await initPage();
        } catch (error) {
            showNotification('Failed to add product.', 'error');
        }
    }

    async function handleEditProduct(e) {
        e.preventDefault();
        const formData = new FormData(editProductForm);
        const updatedProduct = Object.fromEntries(formData.entries());
        const productId = document.getElementById('editProductId').value;

        try {
            await fetch(`/api/products/${productId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
            showNotification('Product updated successfully!');
            editProductModal.classList.remove('active');
            await initPage();
        } catch (error) {
            showNotification('Failed to update product.', 'error');
        }
    }

    async function handleDeleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await fetch(`/api/products/${productId}/`, { method: 'DELETE' });
            showNotification('Product deleted successfully!');
            await initPage();
        } catch (error) {
            showNotification('Failed to delete product.', 'error');
        }
    }

    // --- Event Handlers ---
    function handleFilterChange() {
        currentFilters = {
            search: productSearch.value,
            category: categoryFilter.value,
            status: statusFilter.value,
            location: locationFilter.value
        };
        currentPage = 1;
        loadProductsTable();
    }

    async function openEditModal(productId) {
        try {
            const product = await fetch(`/api/products/${productId}/`).then(res => res.json());
            document.getElementById('editProductId').value = product.id;
            document.getElementById('editProductName').value = product.name;
            document.getElementById('editProductSKU').value = product.sku;
            document.getElementById('editProductCategory').value = product.category;
            document.getElementById('editProductPrice').value = product.price;
            document.getElementById('editProductStock').value = product.stock;
            document.getElementById('editProductLocation').value = product.location;
            document.getElementById('editProductDescription').value = product.description;
            editProductModal.classList.add('active');
        } catch (error) {
            showNotification('Could not find product details.', 'error');
        }
    }

    // --- Pagination ---
    function updatePagination() {
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        paginationInfo.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalProducts)} of ${totalProducts}`;
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage >= totalPages;
        pageNumbers.innerHTML = `<button class="page-number active">${currentPage}</button>`;
    }

    function changePage(direction) {
        currentPage += direction;
        loadProductsTable();
    }

    // --- Event Listeners ---
    addProductBtn.addEventListener('click', () => addProductModal.classList.add('active'));
    modalClose.addEventListener('click', () => addProductModal.classList.remove('active'));
    editModalClose.addEventListener('click', () => editProductModal.classList.remove('active'));
    addProductForm.addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleEditProduct);
    [productSearch, categoryFilter, statusFilter, locationFilter].forEach(el => el.addEventListener('input', handleFilterChange));
    prevPage.addEventListener('click', () => changePage(-1));
    nextPage.addEventListener('click', () => changePage(1));

    // Theme toggle
    themeToggle.addEventListener('click', function () {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('inventoryTheme', newTheme);
        this.querySelector('.theme-icon').className = `theme-icon fas ${newTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    });

    // --- Initial Load ---
    initPage();
});
