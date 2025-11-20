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
    let productsCache = new Map();

    // --- API Communication ---
    async function fetchFromAPI(endpoint, options = {}) {
        morphOverlay.classList.add('active');
        try {
            const response = await fetch(endpoint, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
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
            const summary = await fetchFromAPI('/api/products/summary');
            document.getElementById('totalProducts').textContent = formatNumber(summary.totalProducts || 0);
            document.getElementById('activeProducts').textContent = formatNumber(summary.activeProducts || 0);
            document.getElementById('outOfStock').textContent = formatNumber(summary.outOfStock || 0);
            document.getElementById('totalValue').textContent = formatCurrency(summary.totalValue || 0);
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
            const data = await fetchFromAPI(`/api/products?${params.toString()}`);
            productsCache.clear();
            data.products.forEach(p => productsCache.set(p.id, p));

            totalProducts = data.totalProducts || 0;
            renderTable(data.products);
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
                    <td>${formatDate(product.lastUpdated)}</td>
                    <td class="actions-cell">
                        <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
        productsTableBody.innerHTML = html;
    }

    // --- CRUD Operations ---
    async function handleAddProduct(e) {
        e.preventDefault();
        const formData = new FormData(addProductForm);
        const newProduct = Object.fromEntries(formData.entries());

        try {
            await fetchFromAPI('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            showNotification('Product added successfully!');
            addProductModal.classList.remove('active');
            addProductForm.reset();
            await Promise.all([updateOverviewMetrics(), loadProductsTable()]);
        } catch (error) {
            // Error already shown by fetchFromAPI
        }
    }

    async function handleEditProduct(e) {
        e.preventDefault();
        const formData = new FormData(editProductForm);
        const updatedProduct = Object.fromEntries(formData.entries());
        const productId = updatedProduct.id;

        try {
            await fetchFromAPI(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
            showNotification('Product updated successfully!');
            editProductModal.classList.remove('active');
            await Promise.all([updateOverviewMetrics(), loadProductsTable()]);
        } catch (error) {
            // Error already shown by fetchFromAPI
        }
    }

    async function handleDeleteProduct(productId) {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await fetchFromAPI(`/api/products/${productId}`, { method: 'DELETE' });
            showNotification('Product deleted successfully!');
            await Promise.all([updateOverviewMetrics(), loadProductsTable()]);
        } catch (error) {
            // Error already shown by fetchFromAPI
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

    function openEditModal(productId) {
        const product = productsCache.get(productId);
        if (!product) {
            showNotification('Could not find product details.', 'error');
            return;
        }
        editProductForm.querySelector('#editProductId').value = product.id;
        editProductForm.querySelector('#editProductName').value = product.name;
        // ... populate other fields ...
        editProductModal.classList.add('active');
    }

    // --- Pagination ---
    function updatePagination() {
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        paginationInfo.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalProducts)} of ${totalProducts}`;
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage >= totalPages;
        // Simplified page number generation
        pageNumbers.innerHTML = `<button class="page-number active">${currentPage}</button>`;
    }

    function changePage(direction) {
        currentPage += direction;
        loadProductsTable();
    }

    // --- Event Listeners ---
    // Modal listeners
    addProductBtn.addEventListener('click', () => addProductModal.classList.add('active'));
    modalClose.addEventListener('click', () => addProductModal.classList.remove('active'));
    editModalClose.addEventListener('click', () => editProductModal.classList.remove('active'));
    addProductModal.addEventListener('click', (e) => e.target === addProductModal && addProductModal.classList.remove('active'));
    editProductModal.addEventListener('click', (e) => e.target === editProductModal && editProductModal.classList.remove('active'));

    // Form submissions
    addProductForm.addEventListener('submit', handleAddProduct);
    editProductForm.addEventListener('submit', handleEditProduct);

    // Table actions
    productsTableBody.addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        const productId = parseInt(target.closest('tr').dataset.id);
        if (target.classList.contains('edit-btn')) openEditModal(productId);
        if (target.classList.contains('delete-btn')) handleDeleteProduct(productId);
    });

    // Filtering and pagination
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
    const savedTheme = localStorage.getItem('inventoryTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.querySelector('.theme-icon').className = `theme-icon fas ${savedTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;

    initPage();
});