document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addProductBtn = document.getElementById('addProductBtn');
    const addProductModal = document.getElementById('addProductModal');
    const editProductModal = document.getElementById('editProductModal');
    const modalClose = document.getElementById('modalClose');
    const editModalClose = document.getElementById('editModalClose');
    const cancelAddProduct = document.getElementById('cancelAddProduct');
    const cancelEditProduct = document.getElementById('cancelEditProduct');
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

    // Sample products data with Kenyan context
    const productsData = {
        totalProducts: 1842,
        activeProducts: 1674,
        outOfStock: 168,
        totalValue: 14876500,
        products: [
            {
                id: 1,
                name: 'Kitenge Print Dress',
                sku: 'KTG-001',
                category: 'Tops',
                price: 2500,
                stock: 45,
                location: 'Nairobi',
                status: 'active',
                description: 'Traditional Kenyan print dress with modern cut',
                lastUpdated: '2025-01-15',
                image: '../img/product1.jpg'
            },
            {
                id: 2,
                name: 'Safari Cargo Pants',
                sku: 'SFR-002',
                category: 'Bottoms',
                price: 3200,
                stock: 23,
                location: 'Mombasa',
                status: 'active',
                description: 'Durable cargo pants perfect for safari adventures',
                lastUpdated: '2025-01-14',
                image: '../img/product2.jpg'
            },
            {
                id: 3,
                name: 'Maasai Beaded Necklace',
                sku: 'MSI-003',
                category: 'Accessories',
                price: 1800,
                stock: 0,
                location: 'Nairobi',
                status: 'out-of-stock',
                description: 'Handcrafted traditional Maasai beaded jewelry',
                lastUpdated: '2025-01-13',
                image: '../img/product3.jpg'
            },
            {
                id: 4,
                name: 'Kikoy Beach Wrap',
                sku: 'KKY-004',
                category: 'Accessories',
                price: 1500,
                stock: 67,
                location: 'Mombasa',
                status: 'active',
                description: 'Traditional coastal wrap perfect for beach wear',
                lastUpdated: '2025-01-12',
                image: '../img/product4.jpg'
            },
            {
                id: 5,
                name: 'Ankara Print Blazer',
                sku: 'ANK-005',
                category: 'Outerwear',
                price: 4500,
                stock: 12,
                location: 'Kisumu',
                status: 'active',
                description: 'Professional blazer with vibrant African print',
                lastUpdated: '2025-01-11',
                image: '../img/product5.jpg'
            },
            {
                id: 6,
                name: 'Workout Leggings',
                sku: 'WRK-006',
                category: 'Activewear',
                price: 2200,
                stock: 89,
                location: 'Nairobi',
                status: 'active',
                description: 'High-performance leggings for fitness enthusiasts',
                lastUpdated: '2025-01-10',
                image: '../img/product6.jpg'
            },
            {
                id: 7,
                name: 'Leather Sandals',
                sku: 'LTH-007',
                category: 'Accessories',
                price: 2800,
                stock: 34,
                location: 'Nakuru',
                status: 'active',
                description: 'Handcrafted leather sandals with traditional design',
                lastUpdated: '2025-01-09',
                image: '../img/product7.jpg'
            },
            {
                id: 8,
                name: 'Cotton Polo Shirt',
                sku: 'CTN-008',
                category: 'Tops',
                price: 1800,
                stock: 156,
                location: 'Eldoret',
                status: 'active',
                description: 'Comfortable cotton polo shirt for casual wear',
                lastUpdated: '2025-01-08',
                image: '../img/product8.jpg'
            },
            {
                id: 9,
                name: 'Denim Jacket',
                sku: 'DNM-009',
                category: 'Outerwear',
                price: 3800,
                stock: 5,
                location: 'Nairobi',
                status: 'active',
                description: 'Classic denim jacket with modern fit',
                lastUpdated: '2025-01-07',
                image: '../img/product9.jpg'
            },
            {
                id: 10,
                name: 'Running Shorts',
                sku: 'RUN-010',
                category: 'Activewear',
                price: 1600,
                stock: 78,
                location: 'Mombasa',
                status: 'active',
                description: 'Lightweight shorts for running and sports',
                lastUpdated: '2025-01-06',
                image: '../img/product10.jpg'
            },
            {
                id: 11,
                name: 'Wax Print Skirt',
                sku: 'WAX-011',
                category: 'Bottoms',
                price: 2100,
                stock: 0,
                location: 'Kisumu',
                status: 'out-of-stock',
                description: 'Colorful wax print skirt with traditional patterns',
                lastUpdated: '2025-01-05',
                image: '../img/product11.jpg'
            },
            {
                id: 12,
                name: 'Sports Bra',
                sku: 'SPT-012',
                category: 'Activewear',
                price: 1400,
                stock: 92,
                location: 'Nairobi',
                status: 'active',
                description: 'Supportive sports bra for active lifestyle',
                lastUpdated: '2025-01-04',
                image: '../img/product12.jpg'
            },
            {
                id: 13,
                name: 'Casual Chinos',
                sku: 'CHN-013',
                category: 'Bottoms',
                price: 2700,
                stock: 41,
                location: 'Nakuru',
                status: 'active',
                description: 'Versatile chino pants for smart casual wear',
                lastUpdated: '2025-01-03',
                image: '../img/product13.jpg'
            },
            {
                id: 14,
                name: 'Windbreaker Jacket',
                sku: 'WND-014',
                category: 'Outerwear',
                price: 3500,
                stock: 18,
                location: 'Eldoret',
                status: 'active',
                description: 'Lightweight windbreaker for outdoor activities',
                lastUpdated: '2025-01-02',
                image: '../img/product14.jpg'
            },
            {
                id: 15,
                name: 'Canvas Sneakers',
                sku: 'CNV-015',
                category: 'Accessories',
                price: 2400,
                stock: 63,
                location: 'Mombasa',
                status: 'active',
                description: 'Comfortable canvas sneakers for everyday wear',
                lastUpdated: '2025-01-01',
                image: '../img/product15.jpg'
            }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredProducts = [...productsData.products];

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalProducts').textContent = formatNumber(productsData.totalProducts);
        document.getElementById('activeProducts').textContent = formatNumber(productsData.activeProducts);
        document.getElementById('outOfStock').textContent = formatNumber(productsData.outOfStock);
        document.getElementById('totalValue').textContent = formatCurrency(productsData.totalValue);

        // Load products table
        loadProductsTable();

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

    // Load products into the table
    function loadProductsTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageProducts = filteredProducts.slice(startIndex, endIndex);

        let html = '';

        pageProducts.forEach(product => {
            const stockClass = getStockClass(product.stock);
            const statusClass = product.status.replace('-', '-');
            
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="checkbox product-checkbox" data-id="${product.id}">
                    </td>
                    <td>
                        <div class="product-info">
                            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='../img/placeholder.jpg'">
                            <div class="product-details">
                                <h4>${product.name}</h4>
                                <p>${product.description}</p>
                            </div>
                        </div>
                    </td>
                    <td>${product.sku}</td>
                    <td>${product.category}</td>
                    <td class="price-cell">KSh ${formatCurrency(product.price)}</td>
                    <td class="stock-cell ${stockClass}">${product.stock}</td>
                    <td><span class="location-badge">${product.location}</span></td>
                    <td><span class="status ${statusClass}">${product.status.replace('-', ' ')}</span></td>
                    <td>${formatDate(product.lastUpdated)}</td>
                    <td class="actions-cell">
                        <button class="action-btn edit-btn" data-id="${product.id}" title="Edit Product">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn view-btn" data-id="${product.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete delete-btn" data-id="${product.id}" title="Delete Product">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        productsTableBody.innerHTML = html;
        updatePagination();
        attachTableEventListeners();
    }

    // Get stock level class
    function getStockClass(stock) {
        if (stock === 0) return 'stock-low';
        if (stock < 20) return 'stock-medium';
        return 'stock-high';
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

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

        // Update pagination info
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredProducts.length} products`;

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
                loadProductsTable();
            });
        });
    }

    // Attach event listeners to table buttons
    function attachTableEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                openEditModal(productId);
            });
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                viewProductDetails(productId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.dataset.id);
                deleteProduct(productId);
            });
        });

        // Product checkboxes
        document.querySelectorAll('.product-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllState);
        });
    }

    // Open edit modal
    function openEditModal(productId) {
        const product = productsData.products.find(p => p.id === productId);
        if (!product) return;

        document.getElementById('editProductId').value = product.id;
        document.getElementById('editProductName').value = product.name;
        document.getElementById('editProductSKU').value = product.sku;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stock;
        document.getElementById('editProductLocation').value = product.location;
        document.getElementById('editProductDescription').value = product.description;

        editProductModal.classList.add('active');
    }

    // View product details
    function viewProductDetails(productId) {
        const product = productsData.products.find(p => p.id === productId);
        if (!product) return;

        alert(`Product Details:\n\nName: ${product.name}\nSKU: ${product.sku}\nCategory: ${product.category}\nPrice: KSh ${formatCurrency(product.price)}\nStock: ${product.stock}\nLocation: ${product.location}\nStatus: ${product.status}\nDescription: ${product.description}`);
    }

    // Delete product
    function deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            const index = productsData.products.findIndex(p => p.id === productId);
            if (index !== -1) {
                productsData.products.splice(index, 1);
                applyFilters();
                alert('Product deleted successfully!');
            }
        }
    }

    // Apply filters
    function applyFilters() {
        const searchTerm = productSearch.value.toLowerCase();
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;
        const locationValue = locationFilter.value;

        filteredProducts = productsData.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.sku.toLowerCase().includes(searchTerm) ||
                                product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryValue || product.category === categoryValue;
            const matchesStatus = !statusValue || product.status === statusValue;
            const matchesLocation = !locationValue || product.location === locationValue;

            return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
        });

        currentPage = 1;
        loadProductsTable();
    }

    // Update select all state
    function updateSelectAllState() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        const checkedBoxes = document.querySelectorAll('.product-checkbox:checked');
        
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
    productSearch.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);

    // Select all checkbox
    selectAll.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Pagination event listeners
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadProductsTable();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadProductsTable();
        }
    });

    // Modal Functions
    addProductBtn.addEventListener('click', function() {
        addProductModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addProductModal.classList.remove('active');
    });

    editModalClose.addEventListener('click', function() {
        editProductModal.classList.remove('active');
    });

    cancelAddProduct.addEventListener('click', function() {
        addProductModal.classList.remove('active');
    });

    cancelEditProduct.addEventListener('click', function() {
        editProductModal.classList.remove('active');
    });

    // Add product form submission
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newProduct = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            sku: document.getElementById('productSKU').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            stock: parseInt(document.getElementById('productStock').value),
            location: document.getElementById('productLocation').value,
            status: 'active',
            description: document.getElementById('productDescription').value,
            lastUpdated: new Date().toISOString().split('T')[0],
            image: '../img/placeholder.jpg'
        };

        productsData.products.unshift(newProduct);
        productsData.totalProducts++;
        productsData.activeProducts++;
        
        // Update overview numbers
        document.getElementById('totalProducts').textContent = formatNumber(productsData.totalProducts);
        document.getElementById('activeProducts').textContent = formatNumber(productsData.activeProducts);
        
        applyFilters();
        addProductModal.classList.remove('active');
        this.reset();
        alert('Product added successfully!');
    });

    // Edit product form submission
    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const productId = parseInt(document.getElementById('editProductId').value);
        const productIndex = productsData.products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            const oldStatus = productsData.products[productIndex].status;
            
            productsData.products[productIndex] = {
                ...productsData.products[productIndex],
                name: document.getElementById('editProductName').value,
                sku: document.getElementById('editProductSKU').value,
                category: document.getElementById('editProductCategory').value,
                price: parseFloat(document.getElementById('editProductPrice').value),
                stock: parseInt(document.getElementById('editProductStock').value),
                location: document.getElementById('editProductLocation').value,
                description: document.getElementById('editProductDescription').value,
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            // Update status based on stock
            const newStock = parseInt(document.getElementById('editProductStock').value);
            if (newStock === 0) {
                productsData.products[productIndex].status = 'out-of-stock';
            } else if (productsData.products[productIndex].status === 'out-of-stock') {
                productsData.products[productIndex].status = 'active';
            }

            // Update overview numbers if status changed
            const newStatus = productsData.products[productIndex].status;
            if (oldStatus !== newStatus) {
                if (oldStatus === 'out-of-stock' && newStatus === 'active') {
                    productsData.activeProducts++;
                    productsData.outOfStock--;
                } else if (oldStatus === 'active' && newStatus === 'out-of-stock') {
                    productsData.activeProducts--;
                    productsData.outOfStock++;
                }
                
                document.getElementById('activeProducts').textContent = formatNumber(productsData.activeProducts);
                document.getElementById('outOfStock').textContent = formatNumber(productsData.outOfStock);
            }
            
            applyFilters();
            editProductModal.classList.remove('active');
            alert('Product updated successfully!');
        }
    });

    // Close modals when clicking outside
    addProductModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addProductModal.classList.remove('active');
        }
    });

    editProductModal.addEventListener('click', function(e) {
        if (e.target === this) {
            editProductModal.classList.remove('active');
        }
    });

    // Bulk actions (placeholder)
    document.getElementById('bulkImportBtn').addEventListener('click', function() {
        alert('Bulk import functionality would be implemented here.');
    });

    document.getElementById('exportBtn').addEventListener('click', function() {
        alert('Export functionality would be implemented here.');
    });

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

