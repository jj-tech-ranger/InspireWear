document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addVariantBtn = document.getElementById('addVariantBtn');
    const addVariantModal = document.getElementById('addVariantModal');
    const editVariantModal = document.getElementById('editVariantModal');
    const modalClose = document.getElementById('modalClose');
    const editModalClose = document.getElementById('editModalClose');
    const cancelAddVariant = document.getElementById('cancelAddVariant');
    const cancelEditVariant = document.getElementById('cancelEditVariant');
    const addVariantForm = document.getElementById('addVariantForm');
    const editVariantForm = document.getElementById('editVariantForm');
    const variantsGrid = document.getElementById('variantsGrid');
    const variantsTableBody = document.getElementById('variantsTableBody');
    const variantsTableContainer = document.getElementById('variantsTableContainer');
    const variantSearch = document.getElementById('variantSearch');
    const productFilter = document.getElementById('productFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const colorFilter = document.getElementById('colorFilter');
    const locationFilter = document.getElementById('locationFilter');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const tableViewBtn = document.getElementById('tableViewBtn');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');

    // Sample variants data with Kenyan context
    const variantsData = {
        totalVariants: 4567,
        activeVariants: 4234,
        lowStockVariants: 333,
        variantValue: 18945600,
        variants: [
            {
                id: 1,
                productName: 'Kitenge Print Dress',
                variantName: 'Kitenge Print Dress - Red/M',
                sku: 'KTG-001-RED-M',
                size: 'M',
                color: 'Red',
                price: 2500,
                stock: 15,
                location: 'Nairobi',
                status: 'active',
                notes: 'Popular traditional design',
                lastUpdated: '2025-01-15',
                image: '../img/variant1.jpg'
            },
            {
                id: 2,
                productName: 'Kitenge Print Dress',
                variantName: 'Kitenge Print Dress - Blue/L',
                sku: 'KTG-001-BLUE-L',
                size: 'L',
                color: 'Blue',
                price: 2500,
                stock: 8,
                location: 'Nairobi',
                status: 'active',
                notes: 'Limited edition blue print',
                lastUpdated: '2025-01-14',
                image: '../img/variant2.jpg'
            },
            {
                id: 3,
                productName: 'Safari Cargo Pants',
                variantName: 'Safari Cargo Pants - Khaki/32',
                sku: 'SFR-002-KHK-32',
                size: '32',
                color: 'Khaki',
                price: 3200,
                stock: 23,
                location: 'Mombasa',
                status: 'active',
                notes: 'Safari adventure ready',
                lastUpdated: '2025-01-13',
                image: '../img/variant3.jpg'
            },
            {
                id: 4,
                productName: 'Safari Cargo Pants',
                variantName: 'Safari Cargo Pants - Olive/34',
                sku: 'SFR-002-OLV-34',
                size: '34',
                color: 'Olive',
                price: 3200,
                stock: 0,
                location: 'Mombasa',
                status: 'out-of-stock',
                notes: 'Restock needed',
                lastUpdated: '2025-01-12',
                image: '../img/variant4.jpg'
            },
            {
                id: 5,
                productName: 'Maasai Beaded Necklace',
                variantName: 'Maasai Beaded Necklace - Multi/One Size',
                sku: 'MSI-003-MLT-OS',
                size: 'One Size',
                color: 'Multi',
                price: 1800,
                stock: 45,
                location: 'Nairobi',
                status: 'active',
                notes: 'Handcrafted by Maasai artisans',
                lastUpdated: '2025-01-11',
                image: '../img/variant5.jpg'
            },
            {
                id: 6,
                productName: 'Kikoy Beach Wrap',
                variantName: 'Kikoy Beach Wrap - Blue/One Size',
                sku: 'KKY-004-BLUE-OS',
                size: 'One Size',
                color: 'Blue',
                price: 1500,
                stock: 67,
                location: 'Mombasa',
                status: 'active',
                notes: 'Traditional coastal design',
                lastUpdated: '2025-01-10',
                image: '../img/variant6.jpg'
            },
            {
                id: 7,
                productName: 'Kikoy Beach Wrap',
                variantName: 'Kikoy Beach Wrap - Green/One Size',
                sku: 'KKY-004-GRN-OS',
                size: 'One Size',
                color: 'Green',
                price: 1500,
                stock: 34,
                location: 'Mombasa',
                status: 'active',
                notes: 'Ocean-inspired colors',
                lastUpdated: '2025-01-09',
                image: '../img/variant7.jpg'
            },
            {
                id: 8,
                productName: 'Ankara Print Blazer',
                variantName: 'Ankara Print Blazer - Yellow/M',
                sku: 'ANK-005-YLW-M',
                size: 'M',
                color: 'Yellow',
                price: 4500,
                stock: 12,
                location: 'Kisumu',
                status: 'active',
                notes: 'Professional African print',
                lastUpdated: '2025-01-08',
                image: '../img/variant8.jpg'
            },
            {
                id: 9,
                productName: 'Ankara Print Blazer',
                variantName: 'Ankara Print Blazer - Multi/L',
                sku: 'ANK-005-MLT-L',
                size: 'L',
                color: 'Multi',
                price: 4500,
                stock: 6,
                location: 'Kisumu',
                status: 'active',
                notes: 'Vibrant mixed patterns',
                lastUpdated: '2025-01-07',
                image: '../img/variant9.jpg'
            },
            {
                id: 10,
                productName: 'Workout Leggings',
                variantName: 'Workout Leggings - Black/S',
                sku: 'WRK-006-BLK-S',
                size: 'S',
                color: 'Black',
                price: 2200,
                stock: 89,
                location: 'Nairobi',
                status: 'active',
                notes: 'High-performance fabric',
                lastUpdated: '2025-01-06',
                image: '../img/variant10.jpg'
            },
            {
                id: 11,
                productName: 'Workout Leggings',
                variantName: 'Workout Leggings - Blue/M',
                sku: 'WRK-006-BLUE-M',
                size: 'M',
                color: 'Blue',
                price: 2200,
                stock: 45,
                location: 'Nairobi',
                status: 'active',
                notes: 'Moisture-wicking technology',
                lastUpdated: '2025-01-05',
                image: '../img/variant11.jpg'
            },
            {
                id: 12,
                productName: 'Leather Sandals',
                variantName: 'Leather Sandals - Brown/40',
                sku: 'LTH-007-BRN-40',
                size: '40',
                color: 'Brown',
                price: 2800,
                stock: 34,
                location: 'Nakuru',
                status: 'active',
                notes: 'Handcrafted leather',
                lastUpdated: '2025-01-04',
                image: '../img/variant12.jpg'
            },
            {
                id: 13,
                productName: 'Leather Sandals',
                variantName: 'Leather Sandals - Black/42',
                sku: 'LTH-007-BLK-42',
                size: '42',
                color: 'Black',
                price: 2800,
                stock: 18,
                location: 'Nakuru',
                status: 'active',
                notes: 'Classic black leather',
                lastUpdated: '2025-01-03',
                image: '../img/variant13.jpg'
            },
            {
                id: 14,
                productName: 'Cotton Polo Shirt',
                variantName: 'Cotton Polo Shirt - White/L',
                sku: 'CTN-008-WHT-L',
                size: 'L',
                color: 'White',
                price: 1800,
                stock: 156,
                location: 'Eldoret',
                status: 'active',
                notes: '100% cotton comfort',
                lastUpdated: '2025-01-02',
                image: '../img/variant14.jpg'
            },
            {
                id: 15,
                productName: 'Cotton Polo Shirt',
                variantName: 'Cotton Polo Shirt - Blue/M',
                sku: 'CTN-008-BLUE-M',
                size: 'M',
                color: 'Blue',
                price: 1800,
                stock: 92,
                location: 'Eldoret',
                status: 'active',
                notes: 'Casual everyday wear',
                lastUpdated: '2025-01-01',
                image: '../img/variant15.jpg'
            }
        ]
    };

    // View state
    let currentView = 'grid';
    let currentPage = 1;
    const itemsPerPage = 12;
    let filteredVariants = [...variantsData.variants];

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalVariants').textContent = formatNumber(variantsData.totalVariants);
        document.getElementById('activeVariants').textContent = formatNumber(variantsData.activeVariants);
        document.getElementById('lowStockVariants').textContent = formatNumber(variantsData.lowStockVariants);
        document.getElementById('variantValue').textContent = formatCurrency(variantsData.variantValue);

        // Load variants
        loadVariants();

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

    // Load variants based on current view
    function loadVariants() {
        if (currentView === 'grid') {
            loadVariantsGrid();
        } else {
            loadVariantsTable();
        }
        updatePagination();
    }

    // Load variants in grid view
    function loadVariantsGrid() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageVariants = filteredVariants.slice(startIndex, endIndex);

        let html = '';

        pageVariants.forEach(variant => {
            const stockClass = getStockClass(variant.stock);
            const statusClass = variant.status.replace('-', '-');
            const colorClass = getColorClass(variant.color);
            
            html += `
                <div class="variant-card">
                    <div class="variant-header">
                        <div class="variant-info">
                            <h4>${variant.variantName}</h4>
                            <p>${variant.productName}</p>
                        </div>
                        <span class="variant-status ${statusClass}">${variant.status.replace('-', ' ')}</span>
                    </div>
                    <div class="variant-details">
                        <div class="variant-detail-row">
                            <span class="detail-label">SKU:</span>
                            <span class="detail-value">${variant.sku}</span>
                        </div>
                        <div class="variant-detail-row">
                            <span class="detail-label">Size:</span>
                            <span class="detail-value"><span class="size-badge">${variant.size}</span></span>
                        </div>
                        <div class="variant-detail-row">
                            <span class="detail-label">Color:</span>
                            <span class="detail-value">
                                ${variant.color}
                                <span class="color-swatch ${colorClass}"></span>
                            </span>
                        </div>
                        <div class="variant-detail-row">
                            <span class="detail-label">Stock:</span>
                            <span class="detail-value stock-value ${stockClass}">${variant.stock}</span>
                        </div>
                        <div class="variant-detail-row">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value"><span class="location-badge">${variant.location}</span></span>
                        </div>
                        <div class="variant-detail-row">
                            <span class="detail-label">Price:</span>
                            <span class="detail-value price-value">KSh ${formatCurrency(variant.price)}</span>
                        </div>
                    </div>
                    <div class="variant-actions">
                        <button class="variant-action-btn edit-btn" data-id="${variant.id}" title="Edit Variant">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="variant-action-btn view-btn" data-id="${variant.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="variant-action-btn delete delete-btn" data-id="${variant.id}" title="Delete Variant">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        variantsGrid.innerHTML = html;
        attachGridEventListeners();
    }

    // Load variants in table view
    function loadVariantsTable() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageVariants = filteredVariants.slice(startIndex, endIndex);

        let html = '';

        pageVariants.forEach(variant => {
            const stockClass = getStockClass(variant.stock);
            const statusClass = variant.status.replace('-', '-');
            const colorClass = getColorClass(variant.color);
            
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="checkbox variant-checkbox" data-id="${variant.id}">
                    </td>
                    <td>
                        <div class="variant-product-info">
                            <img src="${variant.image}" alt="${variant.productName}" class="variant-product-image" onerror="this.src='../img/placeholder.jpg'">
                            <div class="variant-product-details">
                                <h4>${variant.productName}</h4>
                                <p>${variant.notes}</p>
                            </div>
                        </div>
                    </td>
                    <td class="variant-info-cell">${variant.variantName}</td>
                    <td>${variant.sku}</td>
                    <td><span class="size-badge">${variant.size}</span></td>
                    <td class="color-cell">
                        ${variant.color}
                        <span class="table-color-swatch ${colorClass}"></span>
                    </td>
                    <td class="price-cell">KSh ${formatCurrency(variant.price)}</td>
                    <td class="stock-cell ${stockClass}">${variant.stock}</td>
                    <td><span class="location-badge">${variant.location}</span></td>
                    <td><span class="status ${statusClass}">${variant.status.replace('-', ' ')}</span></td>
                    <td class="actions-cell">
                        <button class="action-btn edit-btn" data-id="${variant.id}" title="Edit Variant">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn view-btn" data-id="${variant.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete delete-btn" data-id="${variant.id}" title="Delete Variant">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        variantsTableBody.innerHTML = html;
        attachTableEventListeners();
    }

    // Get stock level class
    function getStockClass(stock) {
        if (stock === 0) return 'stock-low';
        if (stock < 20) return 'stock-medium';
        return 'stock-high';
    }

    // Get color class for swatches
    function getColorClass(color) {
        const colorMap = {
            'Red': 'color-red',
            'Blue': 'color-blue',
            'Green': 'color-green',
            'Yellow': 'color-yellow',
            'Black': 'color-black',
            'White': 'color-white',
            'Multi': 'color-multi',
            'Khaki': 'color-yellow',
            'Olive': 'color-green',
            'Brown': 'color-red'
        };
        return colorMap[color] || 'color-multi';
    }

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredVariants.length);

        // Update pagination info
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredVariants.length} variants`;

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
                loadVariants();
            });
        });
    }

    // Attach event listeners to grid buttons
    function attachGridEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = parseInt(this.dataset.id);
                openEditModal(variantId);
            });
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = parseInt(this.dataset.id);
                viewVariantDetails(variantId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = parseInt(this.dataset.id);
                deleteVariant(variantId);
            });
        });
    }

    // Attach event listeners to table buttons
    function attachTableEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = parseInt(this.dataset.id);
                openEditModal(variantId);
            });
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = parseInt(this.dataset.id);
                viewVariantDetails(variantId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const variantId = parseInt(this.dataset.id);
                deleteVariant(variantId);
            });
        });

        // Variant checkboxes
        document.querySelectorAll('.variant-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateSelectAllState);
        });
    }

    // Open edit modal
    function openEditModal(variantId) {
        const variant = variantsData.variants.find(v => v.id === variantId);
        if (!variant) return;

        document.getElementById('editVariantId').value = variant.id;
        document.getElementById('editParentProduct').value = variant.productName;
        document.getElementById('editVariantSize').value = variant.size;
        document.getElementById('editVariantColor').value = variant.color;
        document.getElementById('editVariantSKU').value = variant.sku;
        document.getElementById('editVariantPrice').value = variant.price;
        document.getElementById('editVariantStock').value = variant.stock;
        document.getElementById('editVariantLocation').value = variant.location;
        document.getElementById('editVariantNotes').value = variant.notes;

        editVariantModal.classList.add('active');
    }

    // View variant details
    function viewVariantDetails(variantId) {
        const variant = variantsData.variants.find(v => v.id === variantId);
        if (!variant) return;

        alert(`Variant Details:\n\nProduct: ${variant.productName}\nVariant: ${variant.variantName}\nSKU: ${variant.sku}\nSize: ${variant.size}\nColor: ${variant.color}\nPrice: KSh ${formatCurrency(variant.price)}\nStock: ${variant.stock}\nLocation: ${variant.location}\nStatus: ${variant.status}\nNotes: ${variant.notes}`);
    }

    // Delete variant
    function deleteVariant(variantId) {
        if (confirm('Are you sure you want to delete this variant?')) {
            const index = variantsData.variants.findIndex(v => v.id === variantId);
            if (index !== -1) {
                variantsData.variants.splice(index, 1);
                applyFilters();
                alert('Variant deleted successfully!');
            }
        }
    }

    // Apply filters
    function applyFilters() {
        const searchTerm = variantSearch.value.toLowerCase();
        const productValue = productFilter.value;
        const sizeValue = sizeFilter.value;
        const colorValue = colorFilter.value;
        const locationValue = locationFilter.value;

        filteredVariants = variantsData.variants.filter(variant => {
            const matchesSearch = variant.variantName.toLowerCase().includes(searchTerm) ||
                                variant.productName.toLowerCase().includes(searchTerm) ||
                                variant.sku.toLowerCase().includes(searchTerm) ||
                                variant.notes.toLowerCase().includes(searchTerm);
            const matchesProduct = !productValue || variant.productName === productValue;
            const matchesSize = !sizeValue || variant.size === sizeValue;
            const matchesColor = !colorValue || variant.color === colorValue;
            const matchesLocation = !locationValue || variant.location === locationValue;

            return matchesSearch && matchesProduct && matchesSize && matchesColor && matchesLocation;
        });

        currentPage = 1;
        loadVariants();
    }

    // Update select all state
    function updateSelectAllState() {
        const checkboxes = document.querySelectorAll('.variant-checkbox');
        const checkedBoxes = document.querySelectorAll('.variant-checkbox:checked');
        
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

    // View toggle functionality
    gridViewBtn.addEventListener('click', function() {
        if (currentView !== 'grid') {
            currentView = 'grid';
            this.classList.add('active');
            tableViewBtn.classList.remove('active');
            variantsGrid.style.display = 'grid';
            variantsTableContainer.style.display = 'none';
            loadVariants();
        }
    });

    tableViewBtn.addEventListener('click', function() {
        if (currentView !== 'table') {
            currentView = 'table';
            this.classList.add('active');
            gridViewBtn.classList.remove('active');
            variantsGrid.style.display = 'none';
            variantsTableContainer.style.display = 'block';
            loadVariants();
        }
    });

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
    variantSearch.addEventListener('input', applyFilters);
    productFilter.addEventListener('change', applyFilters);
    sizeFilter.addEventListener('change', applyFilters);
    colorFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);

    // Select all checkbox
    selectAll.addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.variant-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Pagination event listeners
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadVariants();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredVariants.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadVariants();
        }
    });

    // Modal Functions
    addVariantBtn.addEventListener('click', function() {
        addVariantModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addVariantModal.classList.remove('active');
    });

    editModalClose.addEventListener('click', function() {
        editVariantModal.classList.remove('active');
    });

    cancelAddVariant.addEventListener('click', function() {
        addVariantModal.classList.remove('active');
    });

    cancelEditVariant.addEventListener('click', function() {
        editVariantModal.classList.remove('active');
    });

    // Add variant form submission
    addVariantForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const parentProduct = document.getElementById('parentProduct').value;
        const size = document.getElementById('variantSize').value;
        const color = document.getElementById('variantColor').value;
        
        const newVariant = {
            id: Date.now(),
            productName: parentProduct,
            variantName: `${parentProduct} - ${color}/${size}`,
            sku: document.getElementById('variantSKU').value,
            size: size,
            color: color,
            price: parseFloat(document.getElementById('variantPrice').value),
            stock: parseInt(document.getElementById('variantStock').value),
            location: document.getElementById('variantLocation').value,
            status: 'active',
            notes: document.getElementById('variantNotes').value,
            lastUpdated: new Date().toISOString().split('T')[0],
            image: '../img/placeholder.jpg'
        };

        variantsData.variants.unshift(newVariant);
        variantsData.totalVariants++;
        variantsData.activeVariants++;
        
        // Update overview numbers
        document.getElementById('totalVariants').textContent = formatNumber(variantsData.totalVariants);
        document.getElementById('activeVariants').textContent = formatNumber(variantsData.activeVariants);
        
        applyFilters();
        addVariantModal.classList.remove('active');
        this.reset();
        alert('Variant added successfully!');
    });

    // Edit variant form submission
    editVariantForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const variantId = parseInt(document.getElementById('editVariantId').value);
        const variantIndex = variantsData.variants.findIndex(v => v.id === variantId);
        
        if (variantIndex !== -1) {
            const oldStatus = variantsData.variants[variantIndex].status;
            const parentProduct = document.getElementById('editParentProduct').value;
            const size = document.getElementById('editVariantSize').value;
            const color = document.getElementById('editVariantColor').value;
            
            variantsData.variants[variantIndex] = {
                ...variantsData.variants[variantIndex],
                productName: parentProduct,
                variantName: `${parentProduct} - ${color}/${size}`,
                sku: document.getElementById('editVariantSKU').value,
                size: size,
                color: color,
                price: parseFloat(document.getElementById('editVariantPrice').value),
                stock: parseInt(document.getElementById('editVariantStock').value),
                location: document.getElementById('editVariantLocation').value,
                notes: document.getElementById('editVariantNotes').value,
                lastUpdated: new Date().toISOString().split('T')[0]
            };

            // Update status based on stock
            const newStock = parseInt(document.getElementById('editVariantStock').value);
            if (newStock === 0) {
                variantsData.variants[variantIndex].status = 'out-of-stock';
            } else if (variantsData.variants[variantIndex].status === 'out-of-stock') {
                variantsData.variants[variantIndex].status = 'active';
            }

            // Update overview numbers if status changed
            const newStatus = variantsData.variants[variantIndex].status;
            if (oldStatus !== newStatus) {
                if (oldStatus === 'out-of-stock' && newStatus === 'active') {
                    variantsData.activeVariants++;
                } else if (oldStatus === 'active' && newStatus === 'out-of-stock') {
                    variantsData.activeVariants--;
                }
                
                document.getElementById('activeVariants').textContent = formatNumber(variantsData.activeVariants);
            }
            
            applyFilters();
            editVariantModal.classList.remove('active');
            alert('Variant updated successfully!');
        }
    });

    // Close modals when clicking outside
    addVariantModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addVariantModal.classList.remove('active');
        }
    });

    editVariantModal.addEventListener('click', function(e) {
        if (e.target === this) {
            editVariantModal.classList.remove('active');
        }
    });

    // Bulk actions (placeholder)
    document.getElementById('bulkUpdateBtn').addEventListener('click', function() {
        alert('Bulk update functionality would be implemented here.');
    });

    document.getElementById('exportVariantsBtn').addEventListener('click', function() {
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

