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

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 10;
    let filteredCustomers = [];

    // Initialize the page
    async function initPage() {
        await loadCustomers();

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
    async function loadCustomers() {
        // Apply filters
        await applyFilters();

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
                    <tr data-id="${customer.id}">
                        <td>${customer.id}</td>
                        <td>${customer.first_name} ${customer.last_name}</td>
                        <td>
                            <div>${customer.email}</div>
                            <div class="text-muted">+254 ${customer.phone}</div>
                        </td>
                        <td>${customer.location}</td>
                        <td>${formatCurrency(customer.total_spent)}</td>
                        <td>${formatDate(customer.last_purchase)}</td>
                        <td><span class="status ${customer.status}">${customer.status}</span></td>
                        <td>
                            <button class="action-btn view-btn" title="View Profile"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        customersTable.innerHTML = html;
        updatePaginationInfo();
        attachTableEventListeners();
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = this.closest('tr').dataset.id;
                openEditModal(customerId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const customerId = this.closest('tr').dataset.id;
                deleteCustomer(customerId);
            });
        });
    }

    // Apply filters based on search and dropdowns
    async function applyFilters() {
        const searchTerm = customerSearch.value.toLowerCase();
        const statusFilterValue = statusFilter.value;
        const locationFilterValue = locationFilter.value;

        const params = new URLSearchParams({
            search: searchTerm,
            status: statusFilterValue,
            location: locationFilterValue,
        });

        try {
            const customers = await fetch(`/api/customers/?${params.toString()}`).then(res => res.json());
            filteredCustomers = customers;
            currentPage = 1;
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    // Update pagination information
    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Open edit modal with customer data
    async function openEditModal(customerId) {
        try {
            const response = await fetch(`/api/customers/${customerId}/`);
            if (!response.ok) throw new Error('Failed to fetch customer details.');
            const customer = await response.json();

            document.getElementById('editCustomerId').value = customer.id;
            document.getElementById('editFirstName').value = customer.first_name;
            document.getElementById('editLastName').value = customer.last_name;
            document.getElementById('editEmail').value = customer.email;
            document.getElementById('editPhone').value = customer.phone;
            document.getElementById('editLocation').value = customer.location;
            document.getElementById('editStatus').value = customer.status;

            editCustomerModal.classList.add('active');
        } catch (error) {
            console.error('Error fetching customer for edit:', error);
            alert('Could not load customer details for editing.');
        }
    }

    // Delete customer
    async function deleteCustomer(customerId) {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                const response = await fetch(`/api/customers/${customerId}/`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete customer.');
                
                await loadCustomers();
                alert('Customer deleted successfully!');
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Could not delete customer.');
            }
        }
    }

    // Modal Functions
    addCustomerBtn.addEventListener('click', function() {
        addCustomerForm.reset();
        addCustomerModal.classList.add('active');
    });

    modalClose.addEventListener('click', () => addCustomerModal.classList.remove('active'));
    cancelAddCustomer.addEventListener('click', () => addCustomerModal.classList.remove('active'));
    editModalClose.addEventListener('click', () => editCustomerModal.classList.remove('active'));
    cancelEditCustomer.addEventListener('click', () => editCustomerModal.classList.remove('active'));

    addCustomerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(addCustomerForm);
        const newCustomer = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/customers/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomer),
            });
            if (!response.ok) throw new Error('Failed to add customer.');
            
            await loadCustomers();
            addCustomerModal.classList.remove('active');
            alert('Customer added successfully!');
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('An error occurred while adding the customer.');
        }
    });

    editCustomerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(editCustomerForm);
        const updatedCustomer = Object.fromEntries(formData.entries());
        const customerId = document.getElementById('editCustomerId').value;

        try {
            const response = await fetch(`/api/customers/${customerId}/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCustomer),
            });
            if (!response.ok) throw new Error('Failed to update customer.');

            await loadCustomers();
            editCustomerModal.classList.remove('active');
            alert('Customer updated successfully!');
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('An error occurred while updating the customer.');
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
    
    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('crmTheme', newTheme);
        const icon = this.querySelector('.theme-icon');
        icon.className = `theme-icon fas ${newTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    });

    // Initial page load
    initPage();
});
