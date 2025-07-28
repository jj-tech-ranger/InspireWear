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

    // Sample inventory data for clothing store
    const inventoryData = {
        totalItems: 1842,
        lowStockItems: 68,
        inventoryValue: 148765,
        inventoryMovement: [
            { month: 'July', incoming: 320, outgoing: 280 },
            { month: 'August', incoming: 450, outgoing: 390 },
            { month: 'September', incoming: 380, outgoing: 420 },
            { month: 'October', incoming: 510, outgoing: 480 },
            { month: 'November', incoming: 420, outgoing: 450 },
            { month: 'December', incoming: 680, outgoing: 620 }
        ],
        inventoryCategories: [
            { category: 'Tops', count: 620, color: '#FF9AA2' },
            { category: 'Bottoms', count: 380, color: '#FFB7B2' },
            { category: 'Outerwear', count: 210, color: '#FFDAC1' },
            { category: 'Activewear', count: 450, color: '#E6E6FA' },
            { category: 'Accessories', count: 182, color: '#B5EAD7' }
        ],
        stockAlerts: [
            { item: 'Performance Tee', category: 'Tops', size: 'M', currentStock: 2, reorderLevel: 15, status: 'critical' },
            { item: 'Yoga Leggings', category: 'Activewear', size: 'S', currentStock: 3, reorderLevel: 10, status: 'critical' },
            { item: 'Denim Jacket', category: 'Outerwear', size: 'L', currentStock: 5, reorderLevel: 8, status: 'warning' },
            { item: 'Chino Shorts', category: 'Bottoms', size: '32', currentStock: 7, reorderLevel: 12, status: 'warning' },
            { item: 'Wool Beanie', category: 'Accessories', size: 'One Size', currentStock: 4, reorderLevel: 10, status: 'critical' }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalItems').textContent = formatNumber(inventoryData.totalItems);
        document.getElementById('lowStockItems').textContent = formatNumber(inventoryData.lowStockItems);
        document.getElementById('inventoryValue').textContent = formatCurrency(inventoryData.inventoryValue);

        // Load stock alerts table
        loadStockAlerts();

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

    // Format currency for USD
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Load stock alerts into the table
    function loadStockAlerts() {
        let html = '';

        inventoryData.stockAlerts.forEach(alert => {
            html += `
                <tr>
                    <td>${alert.item}</td>
                    <td>${alert.category}</td>
                    <td>${alert.size}</td>
                    <td>${alert.currentStock}</td>
                    <td>${alert.reorderLevel}</td>
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
    }

    // Initialize charts
    function initCharts() {
        // Inventory Movement Chart
        const movementCtx = document.getElementById('inventoryMovementCanvas').getContext('2d');
        new Chart(movementCtx, {
            type: 'line',
            data: {
                labels: inventoryData.inventoryMovement.map(item => item.month),
                datasets: [
                    {
                        label: 'Incoming Stock',
                        data: inventoryData.inventoryMovement.map(item => item.incoming),
                        backgroundColor: 'rgba(255, 154, 162, 0.2)',
                        borderColor: 'rgba(255, 154, 162, 1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Outgoing Stock',
                        data: inventoryData.inventoryMovement.map(item => item.outgoing),
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
                labels: inventoryData.inventoryCategories.map(item => item.category),
                datasets: [{
                    data: inventoryData.inventoryCategories.map(item => item.count),
                    backgroundColor: inventoryData.inventoryCategories.map(item => item.color),
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

    addItemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the form data to your backend
        alert('Product added successfully!');
        addItemModal.classList.remove('active');
        this.reset();
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