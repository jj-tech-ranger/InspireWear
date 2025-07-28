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

    // Sample CRM data for Kenyan clothing store
    const crmData = {
        totalCustomers: 2450,
        loyaltyMembers: 1240,
        repeatRate: 68,
        customerGrowth: [
            { month: 'July', newCustomers: 120, returningCustomers: 420 },
            { month: 'August', newCustomers: 150, returningCustomers: 450 },
            { month: 'September', newCustomers: 180, returningCustomers: 480 },
            { month: 'October', newCustomers: 210, returningCustomers: 520 },
            { month: 'November', newCustomers: 190, returningCustomers: 490 },
            { month: 'December', newCustomers: 280, returningCustomers: 620 }
        ],
        customerLocations: [
            { location: 'Nairobi', count: 1250, color: '#3498db' },
            { location: 'Mombasa', count: 450, color: '#2ecc71' },
            { location: 'Kisumu', count: 320, color: '#f1c40f' },
            { location: 'Nakuru', count: 210, color: '#e74c3c' },
            { location: 'Other', count: 220, color: '#9b59b6' }
        ],
        recentCustomers: [
            { id: 1, name: 'Wanjiku Mwangi', email: 'wanjiku@example.com', phone: '712345678', location: 'Nairobi', points: 1250, status: 'active' },
            { id: 2, name: 'Kamau Otieno', email: 'kamau@example.com', phone: '723456789', location: 'Mombasa', points: 850, status: 'active' },
            { id: 3, name: 'Achieng Okoth', email: 'achieng@example.com', phone: '734567890', location: 'Kisumu', points: 420, status: 'pending' },
            { id: 4, name: 'Njoroge Kariuki', email: 'njoroge@example.com', phone: '745678901', location: 'Nakuru', points: 1500, status: 'active' },
            { id: 5, name: 'Fatuma Abdi', email: 'fatuma@example.com', phone: '756789012', location: 'Nairobi', points: 0, status: 'inactive' }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalCustomers').textContent = formatNumber(crmData.totalCustomers);
        document.getElementById('loyaltyMembers').textContent = formatNumber(crmData.loyaltyMembers);
        document.getElementById('repeatRate').textContent = crmData.repeatRate;

        // Load customers table
        loadCustomers();

        // Initialize charts
        initCharts();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Load customers into the table
    function loadCustomers() {
        let html = '';

        crmData.recentCustomers.forEach(customer => {
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
    }

    // Initialize charts
    function initCharts() {
        // Customer Growth Chart
        const growthCtx = document.getElementById('customerGrowthCanvas').getContext('2d');
        new Chart(growthCtx, {
            type: 'line',
            data: {
                labels: crmData.customerGrowth.map(item => item.month),
                datasets: [
                    {
                        label: 'New Customers',
                        data: crmData.customerGrowth.map(item => item.newCustomers),
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Returning Customers',
                        data: crmData.customerGrowth.map(item => item.returningCustomers),
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
                labels: crmData.customerLocations.map(item => item.location),
                datasets: [{
                    data: crmData.customerLocations.map(item => item.count),
                    backgroundColor: crmData.customerLocations.map(item => item.color),
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
        // Here you would typically send the form data to your backend
        alert('Customer added successfully!');
        addCustomerModal.classList.remove('active');
        this.reset();
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