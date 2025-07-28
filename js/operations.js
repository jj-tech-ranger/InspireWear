document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const activitiesTable = document.getElementById('activitiesTable');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addActivityBtn = document.getElementById('addActivityBtn');
    const addActivityModal = document.getElementById('addActivityModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddActivity = document.getElementById('cancelAddActivity');
    const addActivityForm = document.getElementById('addActivityForm');

    // Sample operations data for Kenyan clothing store
    const operationsData = {
        staffOnDuty: 18,
        pendingReturns: 7,
        completedTasks: 42,
        storeTraffic: [
            { day: 'Mon', customers: 320 },
            { day: 'Tue', customers: 280 },
            { day: 'Wed', customers: 350 },
            { day: 'Thu', customers: 410 },
            { day: 'Fri', customers: 520 },
            { day: 'Sat', customers: 680 },
            { day: 'Sun', customers: 450 }
        ],
        staffDistribution: [
            { location: 'Nairobi', staff: 12, color: '#3498db' },
            { location: 'Mombasa', staff: 8, color: '#2ecc71' },
            { location: 'Kisumu', staff: 6, color: '#f1c40f' },
            { location: 'Nakuru', staff: 4, color: '#e74c3c' }
        ],
        recentActivities: [
            { time: '2025-01-15T09:30', activity: 'Morning Inventory Check', location: 'Nairobi', staff: 'John Mwangi', status: 'completed', priority: 'high' },
            { time: '2025-01-15T11:15', activity: 'Customer Return Processed', location: 'Mombasa', staff: 'Susan Akinyi', status: 'completed', priority: 'medium' },
            { time: '2025-01-15T14:00', activity: 'New Stock Arrival', location: 'Nairobi', staff: 'David Omondi', status: 'in-progress', priority: 'high' },
            { time: '2025-01-15T15:45', activity: 'Staff Training Session', location: 'Kisumu', staff: 'Grace Wambui', status: 'pending', priority: 'low' },
            { time: '2025-01-15T16:30', activity: 'End-of-Day Sales Report', location: 'Nairobi', staff: 'Peter Kamau', status: 'pending', priority: 'medium' }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('staffOnDuty').textContent = operationsData.staffOnDuty;
        document.getElementById('pendingReturns').textContent = operationsData.pendingReturns;
        document.getElementById('completedTasks').textContent = operationsData.completedTasks;

        // Load activities table
        loadActivities();

        // Initialize charts
        initCharts();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Load activities into the table
    function loadActivities() {
        let html = '';

        operationsData.recentActivities.forEach(activity => {
            html += `
                <tr>
                    <td>${formatTime(activity.time)}</td>
                    <td>${activity.activity}</td>
                    <td>${activity.location}</td>
                    <td>${activity.staff}</td>
                    <td><span class="status ${activity.status}">${activity.status.replace('-', ' ')}</span></td>
                    <td><span class="priority ${activity.priority}">${activity.priority}</span></td>
                    <td>
                        <button class="action-btn" title="View Details"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn" title="Delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });

        activitiesTable.innerHTML = html;
    }

    // Format time to HH:MM AM/PM
    function formatTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    // Initialize charts
    function initCharts() {
        // Store Traffic Chart
        const trafficCtx = document.getElementById('storeTrafficCanvas').getContext('2d');
        new Chart(trafficCtx, {
            type: 'line',
            data: {
                labels: operationsData.storeTraffic.map(item => item.day),
                datasets: [{
                    label: 'Customer Traffic',
                    data: operationsData.storeTraffic.map(item => item.customers),
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
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

        // Staff Distribution Chart
        const staffCtx = document.getElementById('staffDistributionCanvas').getContext('2d');
        new Chart(staffCtx, {
            type: 'pie',
            data: {
                labels: operationsData.staffDistribution.map(item => item.location),
                datasets: [{
                    data: operationsData.staffDistribution.map(item => item.staff),
                    backgroundColor: operationsData.staffDistribution.map(item => item.color),
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

    // Theme Toggle (same as finance.js)
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('operationsTheme', newTheme);

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

    // Profile Dropdown (same as finance.js)
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
    addActivityBtn.addEventListener('click', function() {
        addActivityModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addActivityModal.classList.remove('active');
    });

    cancelAddActivity.addEventListener('click', function() {
        addActivityModal.classList.remove('active');
    });

    addActivityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        alert('Activity added successfully!');
        addActivityModal.classList.remove('active');
        this.reset();
    });

    // Close modal when clicking outside
    addActivityModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addActivityModal.classList.remove('active');
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('operationsTheme');
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