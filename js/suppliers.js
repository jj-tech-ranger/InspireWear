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

    // Sample suppliers data with Kenyan context
    const suppliersData = {
        totalSuppliers: 47,
        activeSuppliers: 42,
        pendingOrders: 23,
        monthlyValue: 2456800,
        suppliers: [
            {
                id: 1,
                name: 'Nairobi Textile Mills',
                code: 'NTM-001',
                contactPerson: 'James Mwangi',
                category: 'Fabric Suppliers',
                phone: '+254 722 123 456',
                email: 'james@nairotextiles.co.ke',
                address: 'Industrial Area, Nairobi\nP.O. Box 12345-00100',
                location: 'Nairobi',
                paymentTerms: 30,
                status: 'active',
                notes: 'Reliable supplier for cotton and polyester fabrics',
                joinDate: '2023-03-15',
                lastOrder: '2025-01-10',
                totalOrders: 45,
                rating: 4.8
            },
            {
                id: 2,
                name: 'Mombasa Leather Works',
                code: 'MLW-002',
                contactPerson: 'Fatima Hassan',
                category: 'Leather Goods',
                phone: '+254 733 234 567',
                email: 'fatima@mombasaleather.com',
                address: 'Old Town, Mombasa\nP.O. Box 5678-80100',
                location: 'Mombasa',
                paymentTerms: 45,
                status: 'active',
                notes: 'Premium leather supplier, excellent quality',
                joinDate: '2022-11-20',
                lastOrder: '2025-01-08',
                totalOrders: 67,
                rating: 4.9
            },
            {
                id: 3,
                name: 'Kisumu Beads & Crafts',
                code: 'KBC-003',
                contactPerson: 'Mary Otieno',
                category: 'Accessories',
                phone: '+254 744 345 678',
                email: 'mary@kisumubeads.co.ke',
                address: 'Kondele Market, Kisumu\nP.O. Box 9876-40100',
                location: 'Kisumu',
                paymentTerms: 21,
                status: 'active',
                notes: 'Traditional beadwork and accessories',
                joinDate: '2023-07-10',
                lastOrder: '2025-01-05',
                totalOrders: 23,
                rating: 4.6
            },
            {
                id: 4,
                name: 'Eldoret Packaging Solutions',
                code: 'EPS-004',
                contactPerson: 'David Kiprop',
                category: 'Packaging',
                phone: '+254 755 456 789',
                email: 'david@eldoretpack.com',
                address: 'Langas Road, Eldoret\nP.O. Box 3456-30100',
                location: 'Eldoret',
                paymentTerms: 14,
                status: 'active',
                notes: 'Eco-friendly packaging materials',
                joinDate: '2023-01-25',
                lastOrder: '2025-01-12',
                totalOrders: 89,
                rating: 4.7
            },
            {
                id: 5,
                name: 'Nakuru Equipment Suppliers',
                code: 'NES-005',
                contactPerson: 'Grace Wanjiku',
                category: 'Equipment',
                phone: '+254 766 567 890',
                email: 'grace@nakuruequip.co.ke',
                address: 'Kenyatta Avenue, Nakuru\nP.O. Box 7890-20100',
                location: 'Nakuru',
                paymentTerms: 60,
                status: 'active',
                notes: 'Industrial sewing machines and equipment',
                joinDate: '2022-09-12',
                lastOrder: '2024-12-28',
                totalOrders: 34,
                rating: 4.5
            },
            {
                id: 6,
                name: 'Thika Cotton Weavers',
                code: 'TCW-006',
                contactPerson: 'Peter Kamau',
                category: 'Fabric Suppliers',
                phone: '+254 777 678 901',
                email: 'peter@thikacotton.com',
                address: 'Blue Post Area, Thika\nP.O. Box 2345-01000',
                location: 'Thika',
                paymentTerms: 30,
                status: 'active',
                notes: 'Organic cotton specialist',
                joinDate: '2023-05-18',
                lastOrder: '2025-01-07',
                totalOrders: 28,
                rating: 4.4
            },
            {
                id: 7,
                name: 'Machakos Dye Works',
                code: 'MDW-007',
                contactPerson: 'Susan Mutua',
                category: 'Fabric Suppliers',
                phone: '+254 788 789 012',
                email: 'susan@machakosdy.co.ke',
                address: 'Machakos Town, Machakos\nP.O. Box 4567-90100',
                location: 'Machakos',
                paymentTerms: 21,
                status: 'pending',
                notes: 'Fabric dyeing and printing services',
                joinDate: '2024-11-30',
                lastOrder: 'N/A',
                totalOrders: 0,
                rating: 0
            },
            {
                id: 8,
                name: 'Coastal Accessories Ltd',
                code: 'CAL-008',
                contactPerson: 'Ahmed Ali',
                category: 'Accessories',
                phone: '+254 799 890 123',
                email: 'ahmed@coastalacc.com',
                address: 'Nyali, Mombasa\nP.O. Box 6789-80100',
                location: 'Mombasa',
                paymentTerms: 30,
                status: 'active',
                notes: 'Beach and coastal themed accessories',
                joinDate: '2023-02-14',
                lastOrder: '2025-01-09',
                totalOrders: 52,
                rating: 4.3
            },
            {
                id: 9,
                name: 'Highland Wool Suppliers',
                code: 'HWS-009',
                contactPerson: 'John Kiptoo',
                category: 'Fabric Suppliers',
                phone: '+254 710 901 234',
                email: 'john@highlandwool.co.ke',
                address: 'Kapsabet Road, Eldoret\nP.O. Box 8901-30100',
                location: 'Eldoret',
                paymentTerms: 45,
                status: 'active',
                notes: 'High-quality wool and warm fabrics',
                joinDate: '2022-12-05',
                lastOrder: '2025-01-11',
                totalOrders: 41,
                rating: 4.6
            },
            {
                id: 10,
                name: 'Urban Packaging Co.',
                code: 'UPC-010',
                contactPerson: 'Lucy Njeri',
                category: 'Packaging',
                phone: '+254 721 012 345',
                email: 'lucy@urbanpack.co.ke',
                address: 'Westlands, Nairobi\nP.O. Box 1234-00600',
                location: 'Nairobi',
                paymentTerms: 21,
                status: 'active',
                notes: 'Modern packaging solutions and branding',
                joinDate: '2023-08-22',
                lastOrder: '2025-01-13',
                totalOrders: 36,
                rating: 4.7
            },
            {
                id: 11,
                name: 'Safari Leather Crafts',
                code: 'SLC-011',
                contactPerson: 'Michael Ochieng',
                category: 'Leather Goods',
                phone: '+254 732 123 456',
                email: 'michael@safarileather.com',
                address: 'Kondele, Kisumu\nP.O. Box 5432-40100',
                location: 'Kisumu',
                paymentTerms: 30,
                status: 'inactive',
                notes: 'Traditional leather crafts, currently on hold',
                joinDate: '2023-04-10',
                lastOrder: '2024-10-15',
                totalOrders: 18,
                rating: 4.2
            },
            {
                id: 12,
                name: 'Rift Valley Textiles',
                code: 'RVT-012',
                contactPerson: 'Elizabeth Chebet',
                category: 'Fabric Suppliers',
                phone: '+254 743 234 567',
                email: 'elizabeth@riftvalley.co.ke',
                address: 'Nakuru Industrial Area\nP.O. Box 6543-20100',
                location: 'Nakuru',
                paymentTerms: 30,
                status: 'active',
                notes: 'Wide range of textile materials',
                joinDate: '2022-06-30',
                lastOrder: '2025-01-06',
                totalOrders: 73,
                rating: 4.8
            }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 12;
    let filteredSuppliers = [...suppliersData.suppliers];
    let currentSupplierForEdit = null;

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalSuppliers').textContent = formatNumber(suppliersData.totalSuppliers);
        document.getElementById('activeSuppliers').textContent = formatNumber(suppliersData.activeSuppliers);
        document.getElementById('pendingOrders').textContent = formatNumber(suppliersData.pendingOrders);
        document.getElementById('monthlyValue').textContent = formatCurrency(suppliersData.monthlyValue);

        // Load suppliers grid
        loadSuppliersGrid();

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

    // Load suppliers into the grid
    function loadSuppliersGrid() {
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
                            <p>${supplier.code} • ${supplier.contactPerson}</p>
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
                            <span class="detail-value payment-terms">${supplier.paymentTerms} days</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Total Orders:</span>
                            <span class="detail-value">${supplier.totalOrders}</span>
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
    function contactSupplier(supplierId) {
        const supplier = suppliersData.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        const message = `Contact ${supplier.name}:\n\nPhone: ${supplier.phone}\nEmail: ${supplier.email}\nContact Person: ${supplier.contactPerson}`;
        alert(message);
    }

    // View supplier details
    function viewSupplierDetails(supplierId) {
        const supplier = suppliersData.suppliers.find(s => s.id === supplierId);
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
                            <span>${supplier.contactPerson}</span>
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
                            <span class="payment-terms">${supplier.paymentTerms} days</span>
                        </div>
                        <div class="details-item">
                            <label>Join Date:</label>
                            <span>${formatDate(supplier.joinDate)}</span>
                        </div>
                        <div class="details-item">
                            <label>Last Order:</label>
                            <span>${supplier.lastOrder !== 'N/A' ? formatDate(supplier.lastOrder) : 'N/A'}</span>
                        </div>
                        <div class="details-item">
                            <label>Total Orders:</label>
                            <span>${supplier.totalOrders}</span>
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
    function openEditModal(supplierId) {
        const supplier = suppliersData.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        document.getElementById('editSupplierId').value = supplier.id;
        document.getElementById('editSupplierName').value = supplier.name;
        document.getElementById('editSupplierCode').value = supplier.code;
        document.getElementById('editContactPerson').value = supplier.contactPerson;
        document.getElementById('editSupplierCategory').value = supplier.category;
        document.getElementById('editSupplierPhone').value = supplier.phone;
        document.getElementById('editSupplierEmail').value = supplier.email;
        document.getElementById('editSupplierAddress').value = supplier.address;
        document.getElementById('editSupplierLocation').value = supplier.location;
        document.getElementById('editPaymentTerms').value = supplier.paymentTerms;
        document.getElementById('editSupplierNotes').value = supplier.notes;

        editSupplierModal.classList.add('active');
    }

    // Delete supplier
    function deleteSupplier(supplierId) {
        if (confirm('Are you sure you want to delete this supplier?')) {
            const index = suppliersData.suppliers.findIndex(s => s.id === supplierId);
            if (index !== -1) {
                suppliersData.suppliers.splice(index, 1);
                suppliersData.totalSuppliers--;
                if (suppliersData.suppliers[index]?.status === 'active') {
                    suppliersData.activeSuppliers--;
                }
                
                // Update overview numbers
                document.getElementById('totalSuppliers').textContent = formatNumber(suppliersData.totalSuppliers);
                document.getElementById('activeSuppliers').textContent = formatNumber(suppliersData.activeSuppliers);
                
                applyFilters();
                alert('Supplier deleted successfully!');
            }
        }
    }

    // Apply filters
    function applyFilters() {
        const searchTerm = supplierSearch.value.toLowerCase();
        const statusValue = statusFilter.value;
        const locationValue = locationFilter.value;
        const categoryValue = categoryFilter.value;

        filteredSuppliers = suppliersData.suppliers.filter(supplier => {
            const matchesSearch = supplier.name.toLowerCase().includes(searchTerm) ||
                                supplier.code.toLowerCase().includes(searchTerm) ||
                                supplier.contactPerson.toLowerCase().includes(searchTerm) ||
                                supplier.email.toLowerCase().includes(searchTerm) ||
                                supplier.notes.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusValue || supplier.status === statusValue;
            const matchesLocation = !locationValue || supplier.location === locationValue;
            const matchesCategory = !categoryValue || supplier.category === categoryValue;

            return matchesSearch && matchesStatus && matchesLocation && matchesCategory;
        });

        currentPage = 1;
        loadSuppliersGrid();
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
    addSupplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const newSupplier = {
            id: Date.now(),
            name: document.getElementById('supplierName').value,
            code: document.getElementById('supplierCode').value,
            contactPerson: document.getElementById('contactPerson').value,
            category: document.getElementById('supplierCategory').value,
            phone: document.getElementById('supplierPhone').value,
            email: document.getElementById('supplierEmail').value,
            address: document.getElementById('supplierAddress').value,
            location: document.getElementById('supplierLocation').value,
            paymentTerms: parseInt(document.getElementById('paymentTerms').value),
            status: 'active',
            notes: document.getElementById('supplierNotes').value,
            joinDate: new Date().toISOString().split('T')[0],
            lastOrder: 'N/A',
            totalOrders: 0,
            rating: 0
        };

        suppliersData.suppliers.unshift(newSupplier);
        suppliersData.totalSuppliers++;
        suppliersData.activeSuppliers++;
        
        // Update overview numbers
        document.getElementById('totalSuppliers').textContent = formatNumber(suppliersData.totalSuppliers);
        document.getElementById('activeSuppliers').textContent = formatNumber(suppliersData.activeSuppliers);
        
        applyFilters();
        addSupplierModal.classList.remove('active');
        this.reset();
        alert('Supplier added successfully!');
    });

    // Edit supplier form submission
    editSupplierForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const supplierId = parseInt(document.getElementById('editSupplierId').value);
        const supplierIndex = suppliersData.suppliers.findIndex(s => s.id === supplierId);
        
        if (supplierIndex !== -1) {
            suppliersData.suppliers[supplierIndex] = {
                ...suppliersData.suppliers[supplierIndex],
                name: document.getElementById('editSupplierName').value,
                code: document.getElementById('editSupplierCode').value,
                contactPerson: document.getElementById('editContactPerson').value,
                category: document.getElementById('editSupplierCategory').value,
                phone: document.getElementById('editSupplierPhone').value,
                email: document.getElementById('editSupplierEmail').value,
                address: document.getElementById('editSupplierAddress').value,
                location: document.getElementById('editSupplierLocation').value,
                paymentTerms: parseInt(document.getElementById('editPaymentTerms').value),
                notes: document.getElementById('editSupplierNotes').value
            };
            
            applyFilters();
            editSupplierModal.classList.remove('active');
            alert('Supplier updated successfully!');
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

