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

    // Initialize the page
    async function initPage() {
        try {
            const crmData = await fetch('/api/customers/summary/').then(res => res.json());
            // Set overview numbers
            document.getElementById('totalCustomers').textContent = formatNumber(crmData.total_customers);
            document.getElementById('loyaltyMembers').textContent = formatNumber(crmData.loyalty_members);
            document.getElementById('repeatRate').textContent = crmData.repeat_rate;

            // Load customers table
            await loadCustomers();

            // Initialize charts
            await initCharts();
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

    // Load customers into the table
    async function loadCustomers() {
        try {
            const recentCustomers = await fetch('/api/customers/recent/').then(res => res.json());
            let html = '';

            recentCustomers.forEach(customer => {
                html += `
                    <tr>
                        <td>${customer.name}</td>
                        <td>${customer.email}</td>
                        <td>+254 ${customer.phone}</td>
                        <td>${customer.location}</td>
                        <td>${formatNumber(customer.points)}</td>
                        <td><span class="status ${customer.status}">${customer.status}</span></td>
                        <td>
                            <button class="action-btn" title="View Profile"><i class="fas fa-user"></i></button>
                            <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn" title="Send Email"><i class="fas fa-envelope"></i></button>
                        </td>
                    </tr>
                `;
            });

            customersTable.innerHTML = html;
        } catch (error) {
            console.error('Error loading customers:', error);
            customersTable.innerHTML = '<tr><td colspan="7">Error loading customers.</td></tr>';
        }
    }

    // Initialize charts
    async function initCharts() {
        try {
            const chartData = await fetch('/api/customers/charts/').then(res => res.json());
            // Customer Growth Chart
            const growthCtx = document.getElementById('customerGrowthCanvas').getContext('2d');
            new Chart(growthCtx, {
                type: 'line',
                data: {
                    labels: chartData.customer_growth.map(item => item.month),
                    datasets: [
                        {
                            label: 'New Customers',
                            data: chartData.customer_growth.map(item => item.new_customers),
                            backgroundColor: 'rgba(52, 152, 219, 0.2)',
                            borderColor: 'rgba(52, 152, 219, 1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        },
                        {
                            label: 'Returning Customers',
                            data: chartData.customer_growth.map(item => item.returning_customers),
                            backgroundColor: 'rgba(46, 204, 113, 0.2)',
                            borderColor: 'rgba(46, 204, 113, 1)',
                            borderWidth: 2,
                            tension: 0.4,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Customer Locations Chart
            const locationsCtx = document.getElementById('customerLocationsCanvas').getContext('2d');
            new Chart(locationsCtx, {
                type: 'doughnut',
                data: {
                    labels: chartData.customer_locations.map(item => item.location),
                    datasets: [{
                        data: chartData.customer_locations.map(item => item.count),
                        backgroundColor: chartData.customer_locations.map(item => item.color),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing charts:', error);
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

    addCustomerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(addCustomerForm);
        const customerData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/customers/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            });

            if (response.ok) {
                alert('Customer added successfully!');
                addCustomerModal.classList.remove('active');
                this.reset();
                initPage(); // Refresh data
            } else {
                alert('Failed to add customer.');
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('An error occurred while adding the customer.');
        }
    });

    // Close modal when clicking outside
    addCustomerModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addCustomerModal.classList.remove('active');
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