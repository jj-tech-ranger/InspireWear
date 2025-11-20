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

    // View state
    let currentView = 'grid';
    let currentPage = 1;
    const itemsPerPage = 12;
    let filteredVariants = [];

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/variants/summary/').then(res => res.json());
            // Set overview numbers
            document.getElementById('totalVariants').textContent = formatNumber(summary.total_variants);
            document.getElementById('activeVariants').textContent = formatNumber(summary.active_variants);
            document.getElementById('lowStockVariants').textContent = formatNumber(summary.low_stock_variants);
            document.getElementById('variantValue').textContent = formatCurrency(summary.variant_value);

            // Load variants
            await loadVariants();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
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
    async function loadVariants() {
        await applyFilters();
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
                            <h4>${variant.variant_name}</h4>
                            <p>${variant.product_name}</p>
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
                            <img src="${variant.image}" alt="${variant.product_name}" class="variant-product-image" onerror="this.src='../img/placeholder.jpg'">
                            <div class="variant-product-details">
                                <h4>${variant.product_name}</h4>
                                <p>${variant.notes}</p>
                            </div>
                        </div>
                    </td>
                    <td class="variant-info-cell">${variant.variant_name}</td>
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
    async function openEditModal(variantId) {
        const variant = await fetch(`/api/variants/${variantId}/`).then(res => res.json());
        if (!variant) return;

        document.getElementById('editVariantId').value = variant.id;
        document.getElementById('editParentProduct').value = variant.product_name;
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
    async function viewVariantDetails(variantId) {
        const variant = await fetch(`/api/variants/${variantId}/`).then(res => res.json());
        if (!variant) return;

        alert(`Variant Details:\n\nProduct: ${variant.product_name}\nVariant: ${variant.variant_name}\nSKU: ${variant.sku}\nSize: ${variant.size}\nColor: ${variant.color}\nPrice: KSh ${formatCurrency(variant.price)}\nStock: ${variant.stock}\nLocation: ${variant.location}\nStatus: ${variant.status}\nNotes: ${variant.notes}`);
    }

    // Delete variant
    async function deleteVariant(variantId) {
        if (confirm('Are you sure you want to delete this variant?')) {
            try {
                const response = await fetch(`/api/variants/${variantId}/`, { method: 'DELETE' });
                if (response.ok) {
                    await applyFilters();
                    alert('Variant deleted successfully!');
                } else {
                    alert('Failed to delete variant.');
                }
            } catch (error) {
                console.error('Error deleting variant:', error);
                alert('An error occurred while deleting the variant.');
            }
        }
    }

    // Apply filters
    async function applyFilters() {
        const searchTerm = variantSearch.value.toLowerCase();
        const productValue = productFilter.value;
        const sizeValue = sizeFilter.value;
        const colorValue = colorFilter.value;
        const locationValue = locationFilter.value;

        const params = new URLSearchParams({
            search: searchTerm,
            product: productValue,
            size: sizeValue,
            color: colorValue,
            location: locationValue,
        });

        try {
            const variants = await fetch(`/api/variants/?${params.toString()}`).then(res => res.json());
            filteredVariants = variants;
            currentPage = 1;
            loadVariants();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
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
    addVariantForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addVariantForm);
        const newVariant = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/variants/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newVariant),
            });
            if (response.ok) {
                await initPage();
                addVariantModal.classList.remove('active');
                this.reset();
                alert('Variant added successfully!');
            } else {
                alert('Failed to add variant.');
            }
        } catch (error) {
            console.error('Error adding variant:', error);
            alert('An error occurred while adding the variant.');
        }
    });

    // Edit variant form submission
    editVariantForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(editVariantForm);
        const updatedVariant = Object.fromEntries(formData.entries());
        const variantId = updatedVariant.id;

        try {
            const response = await fetch(`/api/variants/${variantId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedVariant),
            });
            if (response.ok) {
                await initPage();
                editVariantModal.classList.remove('active');
                alert('Variant updated successfully!');
            } else {
                alert('Failed to update variant.');
            }
        } catch (error) {
            console.error('Error updating variant:', error);
            alert('An error occurred while updating the variant.');
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