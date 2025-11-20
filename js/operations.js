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

    // Initialize the page
    async function initPage() {
        try {
            const operationsData = await fetch('/api/operations/summary/').then(res => res.json());
            // Set overview numbers
            document.getElementById('staffOnDuty').textContent = operationsData.staff_on_duty;
            document.getElementById('pendingReturns').textContent = operationsData.pending_returns;
            document.getElementById('completedTasks').textContent = operationsData.completed_tasks;

            // Load activities table
            await loadActivities();

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

    // Load activities into the table
    async function loadActivities() {
        try {
            const recentActivities = await fetch('/api/operations/activities/').then(res => res.json());
            let html = '';

            recentActivities.forEach(activity => {
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
        } catch (error) {
            console.error('Error loading activities:', error);
            activitiesTable.innerHTML = '<tr><td colspan="7">Error loading activities.</td></tr>';
        }
    }

    // Format time to HH:MM AM/PM
    function formatTime(dateTimeString) {
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    // Initialize charts
    async function initCharts() {
        try {
            const chartData = await fetch('/api/operations/charts/').then(res => res.json());
            // Store Traffic Chart
            const trafficCtx = document.getElementById('storeTrafficCanvas').getContext('2d');
            new Chart(trafficCtx, {
                type: 'line',
                data: {
                    labels: chartData.store_traffic.map(item => item.day),
                    datasets: [{
                        label: 'Customer Traffic',
                        data: chartData.store_traffic.map(item => item.customers),
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
                    labels: chartData.staff_distribution.map(item => item.location),
                    datasets: [{
                        data: chartData.staff_distribution.map(item => item.staff),
                        backgroundColor: chartData.staff_distribution.map(item => item.color),
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

    addActivityForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(addActivityForm);
        const newActivity = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/operations/activities/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newActivity),
            });
            if (response.ok) {
                alert('Activity added successfully!');
                addActivityModal.classList.remove('active');
                this.reset();
                await initPage(); // Refresh data
            } else {
                alert('Failed to add activity.');
            }
        } catch (error) {
            console.error('Error adding activity:', error);
            alert('An error occurred while adding the activity.');
        }
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