document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const addSupplierModal = document.getElementById('addSupplierModal');
    const editSupplierModal = document.getElementById('editSupplierModal');
    const supplierDetailsModal = document.getElementById('supplierDetailsModal');
    const modalClose = document.getElementById('modalClose');
    const editModalClose = document.getElementById('editModalClose');
    const detailsModalClose = document.getElementById('detailsModalClose');
    const cancelAddSupplier = document.getElementById('cancelAddSupplier');
    const cancelEditSupplier = document.getElementById('cancelEditSupplier');
    const closeSupplierDetails = document.getElementById('closeSupplierDetails');
    const editFromDetails = document.getElementById('editFromDetails');
    const addSupplierForm = document.getElementById('addSupplierForm');
    const editSupplierForm = document.getElementById('editSupplierForm');
    const suppliersGrid = document.getElementById('suppliersGrid');
    const supplierSearch = document.getElementById('supplierSearch');
    const statusFilter = document.getElementById('statusFilter');
    const locationFilter = document.getElementById('locationFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const paginationInfo = document.getElementById('paginationInfo');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 12;
    let filteredSuppliers = [];
    let currentSupplierForEdit = null;

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/suppliers/summary/').then(res => res.json());
            // Set overview numbers
            document.getElementById('totalSuppliers').textContent = formatNumber(summary.total_suppliers);
            document.getElementById('activeSuppliers').textContent = formatNumber(summary.active_suppliers);
            document.getElementById('pendingOrders').textContent = formatNumber(summary.pending_orders);
            document.getElementById('monthlyValue').textContent = formatCurrency(summary.monthly_value);

            // Load suppliers grid
            await loadSuppliersGrid();
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

    // Load suppliers into the grid
    async function loadSuppliersGrid() {
        await applyFilters();
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageSuppliers = filteredSuppliers.slice(startIndex, endIndex);

        let html = '';

        pageSuppliers.forEach(supplier => {
            const statusClass = supplier.status;
            const ratingStars = generateRatingStars(supplier.rating);
            
            html += `
                <div class="supplier-card">
                    <div class="supplier-header">
                        <div class="supplier-info">
                            <h4>${supplier.name}</h4>
                            <p>${supplier.code} • ${supplier.contact_person}</p>
                        </div>
                        <span class="supplier-status ${statusClass}">${supplier.status}</span>
                    </div>
                    <div class="supplier-contact">
                        <div class="contact-item">
                            <i class="fas fa-phone contact-icon"></i>
                            <span class="contact-text">${supplier.phone}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-envelope contact-icon"></i>
                            <span class="contact-text email">${supplier.email}</span>
                        </div>
                        <div class="contact-item">
                            <i class="fas fa-map-marker-alt contact-icon"></i>
                            <span class="contact-text">${supplier.address.split('\\n')[0]}</span>
                        </div>
                    </div>
                    <div class="supplier-details">
                        <div class="detail-row">
                            <span class="detail-label">Category:</span>
                            <span class="detail-value"><span class="category-badge">${supplier.category}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Location:</span>
                            <span class="detail-value"><span class="location-badge">${supplier.location}</span></span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Payment Terms:</span>
                            <span class="detail-value payment-terms">${supplier.payment_terms} days</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Total Orders:</span>
                            <span class="detail-value">${supplier.total_orders}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Rating:</span>
                            <span class="detail-value">${ratingStars} (${supplier.rating || 'N/A'})</span>
                        </div>
                    </div>
                    <div class="supplier-actions">
                        <button class="supplier-action-btn contact contact-btn" data-id="${supplier.id}" title="Contact Supplier">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="supplier-action-btn view-btn" data-id="${supplier.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="supplier-action-btn edit-btn" data-id="${supplier.id}" title="Edit Supplier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="supplier-action-btn delete delete-btn" data-id="${supplier.id}" title="Delete Supplier">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        suppliersGrid.innerHTML = html;
        updatePagination();
        attachGridEventListeners();
    }

    // Generate rating stars
    function generateRatingStars(rating) {
        if (!rating) return '<span style="color: var(--text-secondary);">No rating</span>';
        
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" style="color: #f1c40f;"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #f1c40f;"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star" style="color: #bdc3c7;"></i>';
        }
        
        return stars;
    }

    // Update pagination
    function updatePagination() {
        const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
        const startItem = (currentPage - 1) * itemsPerPage + 1;
        const endItem = Math.min(currentPage * itemsPerPage, filteredSuppliers.length);

        // Update pagination info
        paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${filteredSuppliers.length} suppliers`;

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
                loadSuppliersGrid();
            });
        });
    }

    // Attach event listeners to grid buttons
    function attachGridEventListeners() {
        // Contact buttons
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.dataset.id);
                contactSupplier(supplierId);
            });
        });

        // View buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.dataset.id);
                viewSupplierDetails(supplierId);
            });
        });

        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.dataset.id);
                openEditModal(supplierId);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const supplierId = parseInt(this.dataset.id);
                deleteSupplier(supplierId);
            });
        });
    }

    // Contact supplier
    async function contactSupplier(supplierId) {
        const supplier = await fetch(`/api/suppliers/${supplierId}/`).then(res => res.json());
        if (!supplier) return;

        const message = `Contact ${supplier.name}:\n\nPhone: ${supplier.phone}\nEmail: ${supplier.email}\nContact Person: ${supplier.contact_person}`;
        alert(message);
    }

    // View supplier details
    async function viewSupplierDetails(supplierId) {
        const supplier = await fetch(`/api/suppliers/${supplierId}/`).then(res => res.json());
        if (!supplier) return;

        currentSupplierForEdit = supplier;

        document.getElementById('supplierDetailsTitle').textContent = supplier.name;
        
        const detailsContent = document.getElementById('supplierDetailsContent');
        detailsContent.innerHTML = `
            <div class="supplier-details-content">
                <div class="details-section">
                    <h4>Basic Information</h4>
                    <div class="details-grid">
                        <div class="details-item">
                            <label>Supplier Name:</label>
                            <span>${supplier.name}</span>
                        </div>
                        <div class="details-item">
                            <label>Supplier Code:</label>
                            <span>${supplier.code}</span>
                        </div>
                        <div class="details-item">
                            <label>Contact Person:</label>
                            <span>${supplier.contact_person}</span>
                        </div>
                        <div class="details-item">
                            <label>Category:</label>
                            <span class="category-badge">${supplier.category}</span>
                        </div>
                        <div class="details-item">
                            <label>Status:</label>
                            <span class="supplier-status ${supplier.status}">${supplier.status}</span>
                        </div>
                        <div class="details-item">
                            <label>Rating:</label>
                            <span>${generateRatingStars(supplier.rating)} (${supplier.rating || 'N/A'})</span>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Contact Information</h4>
                    <div class="details-grid">
                        <div class="details-item">
                            <label>Phone:</label>
                            <span>${supplier.phone}</span>
                        </div>
                        <div class="details-item">
                            <label>Email:</label>
                            <span>${supplier.email}</span>
                        </div>
                        <div class="details-item">
                            <label>Location:</label>
                            <span class="location-badge">${supplier.location}</span>
                        </div>
                        <div class="details-item address full-width">
                            <label>Address:</label>
                            <span>${supplier.address}</span>
                        </div>
                    </div>
                </div>
                
                <div class="details-section">
                    <h4>Business Information</h4>
                    <div class="details-grid">
                        <div class="details-item">
                            <label>Payment Terms:</label>
                            <span class="payment-terms">${supplier.payment_terms} days</span>
                        </div>
                        <div class="details-item">
                            <label>Join Date:</label>
                            <span>${formatDate(supplier.join_date)}</span>
                        </div>
                        <div class="details-item">
                            <label>Last Order:</label>
                            <span>${supplier.last_order !== 'N/A' ? formatDate(supplier.last_order) : 'N/A'}</span>
                        </div>
                        <div class="details-item">
                            <label>Total Orders:</label>
                            <span>${supplier.total_orders}</span>
                        </div>
                        <div class="details-item full-width">
                            <label>Notes:</label>
                            <span>${supplier.notes}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        supplierDetailsModal.classList.add('active');
    }

    // Open edit modal
    async function openEditModal(supplierId) {
        const supplier = await fetch(`/api/suppliers/${supplierId}/`).then(res => res.json());
        if (!supplier) return;

        document.getElementById('editSupplierId').value = supplier.id;
        document.getElementById('editSupplierName').value = supplier.name;
        document.getElementById('editSupplierCode').value = supplier.code;
        document.getElementById('editContactPerson').value = supplier.contact_person;
        document.getElementById('editSupplierCategory').value = supplier.category;
        document.getElementById('editSupplierPhone').value = supplier.phone;
        document.getElementById('editSupplierEmail').value = supplier.email;
        document.getElementById('editSupplierAddress').value = supplier.address;
        document.getElementById('editSupplierLocation').value = supplier.location;
        document.getElementById('editPaymentTerms').value = supplier.payment_terms;
        document.getElementById('editSupplierNotes').value = supplier.notes;

        editSupplierModal.classList.add('active');
    }

    // Delete supplier
    async function deleteSupplier(supplierId) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            try {
                const response = await fetch(`/api/suppliers/${supplierId}/`, { method: 'DELETE' });
                if (response.ok) {
                    await initPage();
                    alert('Supplier deleted successfully!');
                } else {
                    alert('Failed to delete supplier.');
                }
            } catch (error) {
                console.error('Error deleting supplier:', error);
                alert('An error occurred while deleting the supplier.');
            }
        }
    }

    // Apply filters
    async function applyFilters() {
        const searchTerm = supplierSearch.value.toLowerCase();
        const statusValue = statusFilter.value;
        const locationValue = locationFilter.value;
        const categoryValue = categoryFilter.value;

        const params = new URLSearchParams({
            search: searchTerm,
            status: statusValue,
            location: locationValue,
            category: categoryValue,
        });

        try {
            const suppliers = await fetch(`/api/suppliers/?${params.toString()}`).then(res => res.json());
            filteredSuppliers = suppliers;
            currentPage = 1;
            loadSuppliersGrid();
        } catch (error) {
            console.error('Error applying filters:', error);
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
    supplierSearch.addEventListener('input', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    locationFilter.addEventListener('change', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);

    // Pagination event listeners
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadSuppliersGrid();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadSuppliersGrid();
        }
    });

    // Modal Functions
    addSupplierBtn.addEventListener('click', function() {
        addSupplierModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addSupplierModal.classList.remove('active');
    });

    editModalClose.addEventListener('click', function() {
        editSupplierModal.classList.remove('active');
    });

    detailsModalClose.addEventListener('click', function() {
        supplierDetailsModal.classList.remove('active');
    });

    cancelAddSupplier.addEventListener('click', function() {
        addSupplierModal.classList.remove('active');
    });

    cancelEditSupplier.addEventListener('click', function() {
        editSupplierModal.classList.remove('active');
    });

    closeSupplierDetails.addEventListener('click', function() {
        supplierDetailsModal.classList.remove('active');
    });

    editFromDetails.addEventListener('click', function() {
        supplierDetailsModal.classList.remove('active');
        if (currentSupplierForEdit) {
            openEditModal(currentSupplierForEdit.id);
        }
    });

    // Add supplier form submission
    addSupplierForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addSupplierForm);
        const newSupplier = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/suppliers/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSupplier),
            });
            if (response.ok) {
                await initPage();
                addSupplierModal.classList.remove('active');
                this.reset();
                alert('Supplier added successfully!');
            } else {
                alert('Failed to add supplier.');
            }
        } catch (error) {
            console.error('Error adding supplier:', error);
            alert('An error occurred while adding the supplier.');
        }
    });

    // Edit supplier form submission
    editSupplierForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(editSupplierForm);
        const updatedSupplier = Object.fromEntries(formData.entries());
        const supplierId = updatedSupplier.id;
        
        try {
            const response = await fetch(`/api/suppliers/${supplierId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedSupplier),
            });
            if (response.ok) {
                await initPage();
                editSupplierModal.classList.remove('active');
                alert('Supplier updated successfully!');
            } else {
                alert('Failed to update supplier.');
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
            alert('An error occurred while updating the supplier.');
        }
    });

    // Close modals when clicking outside
    addSupplierModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addSupplierModal.classList.remove('active');
        }
    });

    editSupplierModal.addEventListener('click', function(e) {
        if (e.target === this) {
            editSupplierModal.classList.remove('active');
        }
    });

    supplierDetailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            supplierDetailsModal.classList.remove('active');
        }
    });

    // Bulk actions (placeholder)
    document.getElementById('importSuppliersBtn').addEventListener('click', function() {
        alert('Import functionality would be implemented here.');
    });

    document.getElementById('exportSuppliersBtn').addEventListener('click', function() {
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