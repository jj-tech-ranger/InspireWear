document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const customersTable = document.getElementById('customersTable');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addCustomerBtn = document.getElementById('addCustomerBtn');
    const addCustomerModal = document.getElementById('addCustomerModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddCustomer = document.getElementById('cancelAddCustomer');
    const addCustomerForm = document.getElementById('addCustomerForm');
    const editCustomerModal = document.getElementById('editCustomerModal');
    const editModalClose = document.getElementById('editModalClose');
    const cancelEditCustomer = document.getElementById('cancelEditCustomer');
    const editCustomerForm = document.getElementById('editCustomerForm');
    const customerSearch = document.getElementById('customerSearch');
    const statusFilter = document.getElementById('statusFilter');
    const locationFilter = document.getElementById('locationFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    // Sample customer data for Kenyan clothing store
    const customersData = [
        { id: 1, firstName: 'Wanjiku', lastName: 'Mwangi', email: 'wanjiku@example.com', phone: '712345678', location: 'Nairobi', totalSpent: 12500, lastPurchase: '2025-06-15', status: 'active' },
        { id: 2, firstName: 'Kamau', lastName: 'Otieno', email: 'kamau@example.com', phone: '723456789', location: 'Mombasa', totalSpent: 8500, lastPurchase: '2025-06-10', status: 'active' },
        { id: 3, firstName: 'Achieng', lastName: 'Okoth', email: 'achieng@example.com', phone: '734567890', location: 'Kisumu', totalSpent: 4200, lastPurchase: '2025-05-28', status: 'pending' },
        { id: 4, firstName: 'Njoroge', lastName: 'Kariuki', email: 'njoroge@example.com', phone: '745678901', location: 'Nakuru', totalSpent: 15000, lastPurchase: '2025-06-18', status: 'active' },
        { id: 5, firstName: 'Fatuma', lastName: 'Abdi', email: 'fatuma@example.com', phone: '756789012', location: 'Nairobi', totalSpent: 0, lastPurchase: '2025-01-05', status: 'inactive' },
        { id: 6, firstName: 'James', lastName: 'Mutua', email: 'james@example.com', phone: '767890123', location: 'Nairobi', totalSpent: 3200, lastPurchase: '2025-06-12', status: 'active' },
        { id: 7, firstName: 'Grace', lastName: 'Wambui', email: 'grace@example.com', phone: '778901234', location: 'Nairobi', totalSpent: 7800, lastPurchase: '2025-06-05', status: 'active' },
        { id: 8, firstName: 'Peter', lastName: 'Kipchoge', email: 'peter@example.com', phone: '789012345', location: 'Eldoret', totalSpent: 5600, lastPurchase: '2025-05-20', status: 'active' },
        { id: 9, firstName: 'Sarah', lastName: 'Atieno', email: 'sarah@example.com', phone: '790123456', location: 'Kisumu', totalSpent: 2300, lastPurchase: '2025-05-15', status: 'pending' },
        { id: 10, firstName: 'David', lastName: 'Omondi', email: 'david@example.com', phone: '701234567', location: 'Nairobi', totalSpent: 9800, lastPurchase: '2025-06-20', status: 'active' },
        { id: 11, firstName: 'Lilian', lastName: 'Wanjiru', email: 'lilian@example.com', phone: '712345679', location: 'Thika', totalSpent: 4500, lastPurchase: '2025-06-08', status: 'active' },
        { id: 12, firstName: 'Brian', lastName: 'Kimani', email: 'brian@example.com', phone: '723456780', location: 'Nairobi', totalSpent: 6700, lastPurchase: '2025-06-14', status: 'active' },
        { id: 13, firstName: 'Esther', lastName: 'Nyambura', email: 'esther@example.com', phone: '734567891', location: 'Nakuru', totalSpent: 1200, lastPurchase: '2025-04-22', status: 'inactive' },
        { id: 14, firstName: 'Joseph', lastName: 'Kamande', email: 'joseph@example.com', phone: '745678902', location: 'Nairobi', totalSpent: 8900, lastPurchase: '2025-06-17', status: 'active' },
        { id: 15, firstName: 'Mercy', lastName: 'Chebet', email: 'mercy@example.com', phone: '756789013', location: 'Eldoret', totalSpent: 5400, lastPurchase: '2025-06-09', status: 'active' }
    ];

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 10;
    let filteredCustomers = [...customersData];

    // Initialize the page
    function initPage() {
        loadCustomers();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 800);
    }

    // Format currency (KES)
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount);
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Load customers into the table with pagination
    function loadCustomers() {
        // Apply filters
        applyFilters();

        // Calculate pagination
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

        let html = '';

        if (paginatedCustomers.length === 0) {
            html = `<tr><td colspan="8" class="no-results">No customers found matching your criteria</td></tr>`;
        } else {
            paginatedCustomers.forEach(customer => {
                html += `
                    <tr>
                        <td>${customer.id}</td>
                        <td>${customer.firstName} ${customer.lastName}</td>
                        <td>
                            <div>${customer.email}</div>
                            <div class="text-muted">+254 ${customer.phone}</div>
                        </td>
                        <td>${customer.location}</td>
                        <td>${formatCurrency(customer.totalSpent)}</td>
                        <td>${formatDate(customer.lastPurchase)}</td>
                        <td><span class="status ${customer.status}">${customer.status}</span></td>
                        <td>
                            <button class="action-btn view-btn" data-id="${customer.id}" title="View Profile"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-btn" data-id="${customer.id}" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" data-id="${customer.id}" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        customersTable.innerHTML = html;
        updatePaginationInfo();

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = parseInt(this.getAttribute('data-id'));
                openEditModal(customerId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = parseInt(this.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this customer?')) {
                    deleteCustomer(customerId);
                }
            });
        });
    }

    // Apply filters based on search and dropdowns
    function applyFilters() {
        const searchTerm = customerSearch.value.toLowerCase();
        const statusFilterValue = statusFilter.value;
        const locationFilterValue = locationFilter.value;

        filteredCustomers = customersData.filter(customer => {
            const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
            const matchesSearch = fullName.includes(searchTerm) ||
                                customer.email.toLowerCase().includes(searchTerm) ||
                                customer.phone.includes(searchTerm);

            const matchesStatus = statusFilterValue === 'all' || customer.status === statusFilterValue;
            const matchesLocation = locationFilterValue === 'all' || customer.location === locationFilterValue;

            return matchesSearch && matchesStatus && matchesLocation;
        });

        // Reset to first page when filters change
        currentPage = 1;
    }

    // Update pagination information
    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Open edit modal with customer data
    function openEditModal(customerId) {
        const customer = customersData.find(c => c.id === customerId);
        if (!customer) return;

        document.getElementById('editCustomerId').value = customer.id;
        document.getElementById('editFirstName').value = customer.firstName;
        document.getElementById('editLastName').value = customer.lastName;
        document.getElementById('editEmail').value = customer.email;
        document.getElementById('editPhone').value = customer.phone;
        document.getElementById('editLocation').value = customer.location;
        document.getElementById('editStatus').value = customer.status;

        editCustomerModal.classList.add('active');
    }

    // Delete customer
    function deleteCustomer(customerId) {
        const index = customersData.findIndex(c => c.id === customerId);
        if (index !== -1) {
            customersData.splice(index, 1);
            loadCustomers();
            alert('Customer deleted successfully!');
        }
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('crmTheme', newTheme);

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

    // Modal Functions
    addCustomerBtn.addEventListener('click', function() {
        addCustomerModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addCustomerModal.classList.remove('active');
    });

    cancelAddCustomer.addEventListener('click', function() {
        addCustomerModal.classList.remove('active');
    });

    addCustomerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Generate new customer ID
        const newId = customersData.length > 0 ? Math.max(...customersData.map(c => c.id)) + 1 : 1;

        // Create new customer
        const newCustomer = {
            id: newId,
            firstName: document.getElementById('customerFirstName').value,
            lastName: document.getElementById('customerLastName').value,
            email: document.getElementById('customerEmail').value,
            phone: document.getElementById('customerPhone').value,
            location: document.getElementById('customerLocation').value,
            totalSpent: 0,
            lastPurchase: new Date().toISOString().split('T')[0],
            status: 'active'
        };

        customersData.unshift(newCustomer);
        loadCustomers();

        alert('Customer added successfully!');
        addCustomerModal.classList.remove('active');
        this.reset();
    });

    // Edit customer form
    editCustomerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const customerId = parseInt(document.getElementById('editCustomerId').value);
        const customer = customersData.find(c => c.id === customerId);

        if (customer) {
            customer.firstName = document.getElementById('editFirstName').value;
            customer.lastName = document.getElementById('editLastName').value;
            customer.email = document.getElementById('editEmail').value;
            customer.phone = document.getElementById('editPhone').value;
            customer.location = document.getElementById('editLocation').value;
            customer.status = document.getElementById('editStatus').value;

            loadCustomers();
            alert('Customer updated successfully!');
            editCustomerModal.classList.remove('active');
        }
    });

    // Close edit modal
    editModalClose.addEventListener('click', function() {
        editCustomerModal.classList.remove('active');
    });

    cancelEditCustomer.addEventListener('click', function() {
        editCustomerModal.classList.remove('active');
    });

    // Close modals when clicking outside
    addCustomerModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addCustomerModal.classList.remove('active');
        }
    });

    editCustomerModal.addEventListener('click', function(e) {
        if (e.target === this) {
            editCustomerModal.classList.remove('active');
        }
    });

    // Filter event listeners
    customerSearch.addEventListener('input', loadCustomers);
    statusFilter.addEventListener('change', loadCustomers);
    locationFilter.addEventListener('change', loadCustomers);

    // Pagination event listeners
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadCustomers();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadCustomers();
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('crmTheme');
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