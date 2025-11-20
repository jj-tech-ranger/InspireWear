document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const alertsTable = document.getElementById('alertsTable');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addItemBtn = document.getElementById('addItemBtn');
    const addItemModal = document.getElementById('addItemModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddItem = document.getElementById('cancelAddItem');
    const addItemForm = document.getElementById('addItemForm');

    // Initialize the page
    async function initPage() {
        try {
            const inventoryData = await fetch('/api/inventory/summary/').then(res => res.json());
            // Set overview numbers
            document.getElementById('totalItems').textContent = formatNumber(inventoryData.total_items);
            document.getElementById('lowStockItems').textContent = formatNumber(inventoryData.low_stock_items);
            document.getElementById('inventoryValue').textContent = formatCurrency(inventoryData.inventory_value);

            // Load stock alerts table
            await loadStockAlerts();

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

    // Format currency for USD
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load stock alerts into the table
    async function loadStockAlerts() {
        try {
            const stockAlerts = await fetch('/api/inventory/alerts/').then(res => res.json());
            let html = '';

            stockAlerts.forEach(alert => {
                html += `
                    <tr>
                        <td>${alert.item}</td>
                        <td>${alert.category}</td>
                        <td>${alert.size}</td>
                        <td>${alert.current_stock}</td>
                        <td>${alert.reorder_level}</td>
                        <td><span class="status ${alert.status}">${alert.status}</span></td>
                        <td>
                            <button class="action-btn" title="Reorder"><i class="fas fa-shopping-cart"></i></button>
                            <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn" title="View Details"><i class="fas fa-eye"></i></button>
                        </td>
                    </tr>
                `;
            });

            alertsTable.innerHTML = html;
        } catch (error) {
            console.error('Error loading stock alerts:', error);
            alertsTable.innerHTML = '<tr><td colspan="7">Error loading stock alerts.</td></tr>';
        }
    }

    // Initialize charts
    async function initCharts() {
        try {
            const chartData = await fetch('/api/inventory/charts/').then(res => res.json());
            // Inventory Movement Chart
            const movementCtx = document.getElementById('inventoryMovementCanvas').getContext('2d');
            new Chart(movementCtx, {
                type: 'line',
                data: {
                    labels: chartData.inventory_movement.map(item => item.month),
                    datasets: [
                        {
                            label: 'Incoming Stock',
                            data: chartData.inventory_movement.map(item => item.incoming),
                            backgroundColor: 'rgba(255, 154, 162, 0.2)',
                            borderColor: 'rgba(255, 154, 162, 1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Outgoing Stock',
                            data: chartData.inventory_movement.map(item => item.outgoing),
                            backgroundColor: 'rgba(93, 107, 198, 0.2)',
                            borderColor: 'rgba(93, 107, 198, 1)',
                            borderWidth: 2,
                            tension: 0.3,
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
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.raw;
                                    return label;
                                }
                            }
                        }
                    }
                }
            });

            // Inventory Category Chart
            const categoryCtx = document.getElementById('inventoryCategoryCanvas').getContext('2d');
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: chartData.inventory_categories.map(item => item.category),
                    datasets: [{
                        data: chartData.inventory_categories.map(item => item.count),
                        backgroundColor: chartData.inventory_categories.map(item => item.color),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.raw + ' items';
                                    return label;
                                }
                            }
                        },
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

    // Modal Functions
    addItemBtn.addEventListener('click', function() {
        addItemModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addItemModal.classList.remove('active');
    });

    cancelAddItem.addEventListener('click', function() {
        addItemModal.classList.remove('active');
    });

    addItemForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(addItemForm);
        const newItem = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/inventory/items/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });
            if (response.ok) {
                alert('Product added successfully!');
                addItemModal.classList.remove('active');
                this.reset();
                await initPage(); // Refresh data
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('An error occurred while adding the product.');
        }
    });

    // Close modal when clicking outside
    addItemModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addItemModal.classList.remove('active');
        }
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