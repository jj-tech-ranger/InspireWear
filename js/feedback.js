document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const feedbackSearch = document.getElementById('feedbackSearch');
    const feedbackType = document.getElementById('feedbackType');
    const feedbackSource = document.getElementById('feedbackSource');
    const feedbackStatus = document.getElementById('feedbackStatus');
    const exportFeedbackBtn = document.getElementById('exportFeedbackBtn');
    const feedbackTable = document.getElementById('feedbackTable');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const feedbackDetailModal = document.getElementById('feedbackDetailModal');
    const detailModalClose = document.getElementById('detailModalClose');
    const newFeedbackModal = document.getElementById('newFeedbackModal');
    const newFeedbackModalClose = document.getElementById('newFeedbackModalClose');
    const cancelNewFeedback = document.getElementById('cancelNewFeedback');
    const newFeedbackForm = document.getElementById('newFeedbackForm');
    const feedbackCustomer = document.getElementById('feedbackCustomer');
    const addFeedbackBtn = document.getElementById('addFeedbackBtn');

    // Sample feedback data
    const feedbackData = {
        positiveFeedback: 78,
        negativeFeedback: 12,
        totalFeedback: 245,
        responseTime: 4.2,
        feedback: [
            { id: 1, customer: 'Wanjiku Mwangi', feedback: 'I absolutely love the new summer collection! The quality is excellent and the designs are very stylish. Will definitely shop again.', type: 'positive', date: '2025-06-15', source: 'website', status: 'resolved', email: 'wanjiku@example.com', phone: '+254712345678' },
            { id: 2, customer: 'Kamau Otieno', feedback: 'The delivery took longer than expected and the shirt I ordered was the wrong size. Disappointed with this experience.', type: 'negative', date: '2025-06-14', source: 'email', status: 'in-progress', email: 'kamau@example.com', phone: '+254723456789' },
            { id: 3, customer: 'Achieng Okoth', feedback: 'I like the new designs but the prices seem a bit high compared to last season.', type: 'neutral', date: '2025-06-13', source: 'social', status: 'new', email: 'achieng@example.com', phone: '+254734567890' },
            { id: 4, customer: 'Njoroge Kariuki', feedback: 'Excellent customer service! The staff helped me find exactly what I was looking for.', type: 'positive', date: '2025-06-12', source: 'in-store', status: 'resolved', email: 'njoroge@example.com', phone: '+254745678901' },
            { id: 5, customer: 'Fatuma Abdi', feedback: 'The mobile app keeps crashing when I try to checkout. Very frustrating!', type: 'negative', date: '2025-06-11', source: 'website', status: 'in-progress', email: 'fatuma@example.com', phone: '+254756789012' },
            { id: 6, customer: 'James Mutua', feedback: 'Great selection of products and easy to navigate website. Checkout was smooth.', type: 'positive', date: '2025-06-10', source: 'website', status: 'resolved', email: 'james@example.com', phone: '+254767890123' },
            { id: 7, customer: 'Grace Wambui', feedback: 'I received a damaged item. How can I get a replacement?', type: 'negative', date: '2025-06-09', source: 'email', status: 'new', email: 'grace@example.com', phone: '+254778901234' },
            { id: 8, customer: 'Peter Kipchoge', feedback: 'The loyalty program benefits are really good. Keep up the good work!', type: 'positive', date: '2025-06-08', source: 'social', status: 'resolved', email: 'peter@example.com', phone: '+254789012345' },
            { id: 9, customer: 'Sarah Atieno', feedback: 'I would like to see more plus-size options in your collections.', type: 'neutral', date: '2025-06-07', source: 'website', status: 'new', email: 'sarah@example.com', phone: '+254790123456' },
            { id: 10, customer: 'David Omondi', feedback: 'Fast shipping and the product quality exceeded my expectations.', type: 'positive', date: '2025-06-06', source: 'website', status: 'resolved', email: 'david@example.com', phone: '+254701234567' }
        ],
        customers: [
            { id: 1, name: 'Wanjiku Mwangi' },
            { id: 2, name: 'Kamau Otieno' },
            { id: 3, name: 'Achieng Okoth' },
            { id: 4, name: 'Njoroge Kariuki' },
            { id: 5, name: 'Fatuma Abdi' },
            { id: 6, name: 'James Mutua' },
            { id: 7, name: 'Grace Wambui' },
            { id: 8, name: 'Peter Kipchoge' },
            { id: 9, name: 'Sarah Atieno' },
            { id: 10, name: 'David Omondi' },
            { id: 11, name: 'Lilian Wanjiru' },
            { id: 12, name: 'Brian Kimani' },
            { id: 13, name: 'Esther Nyambura' },
            { id: 14, name: 'Joseph Kamande' },
            { id: 15, name: 'Mercy Chebet' }
        ]
    };

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 8;
    let filteredFeedback = [...feedbackData.feedback];

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('positiveFeedback').textContent = feedbackData.positiveFeedback;
        document.getElementById('negativeFeedback').textContent = feedbackData.negativeFeedback;
        document.getElementById('totalFeedback').textContent = feedbackData.totalFeedback;
        document.getElementById('responseTime').textContent = feedbackData.responseTime;

        // Load feedback table
        loadFeedback();

        // Load charts
        initCharts();

        // Populate customer dropdown
        populateCustomerDropdown();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 800);
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Load feedback into the table with pagination
    function loadFeedback() {
        // Apply filters
        applyFilters();

        // Calculate pagination
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

        let html = '';

        if (paginatedFeedback.length === 0) {
            html = `<tr><td colspan="7" class="no-results">No feedback found matching your criteria</td></tr>`;
        } else {
            paginatedFeedback.forEach(item => {
                html += `
                    <tr>
                        <td>${item.customer}</td>
                        <td class="feedback-preview">${item.feedback.length > 50 ? item.feedback.substring(0, 50) + '...' : item.feedback}</td>
                        <td><span class="sentiment-badge ${item.type}">${item.type}</span></td>
                        <td>${formatDate(item.date)}</td>
                        <td>${item.source}</td>
                        <td><span class="status-badge ${item.status}">${item.status}</span></td>
                        <td>
                            <button class="action-btn view-btn" data-id="${item.id}" title="View Details"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-btn" data-id="${item.id}" title="Edit"><i class="fas fa-edit"></i></button>
                            ${item.status !== 'resolved' ? `<button class="action-btn resolve-btn" data-id="${item.id}" title="Mark Resolved"><i class="fas fa-check"></i></button>` : ''}
                        </td>
                    </tr>
                `;
            });
        }

        feedbackTable.innerHTML = html;
        updatePaginationInfo();

        // Add event listeners to action buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const feedbackId = parseInt(this.getAttribute('data-id'));
                openFeedbackDetail(feedbackId);
            });
        });
    }

    // Apply filters based on search and dropdowns
    function applyFilters() {
        const searchTerm = feedbackSearch.value.toLowerCase();
        const typeFilter = feedbackType.value;
        const sourceFilter = feedbackSource.value;
        const statusFilter = feedbackStatus.value;

        filteredFeedback = feedbackData.feedback.filter(item => {
            const matchesSearch = item.customer.toLowerCase().includes(searchTerm) ||
                                item.feedback.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
            const matchesSource = sourceFilter === 'all' || item.source === sourceFilter;
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

            return matchesSearch && matchesType && matchesSource && matchesStatus;
        });

        // Reset to first page when filters change
        currentPage = 1;
    }

    // Update pagination information
    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredFeedback.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Open feedback detail modal
    function openFeedbackDetail(feedbackId) {
        const feedback = feedbackData.feedback.find(f => f.id === feedbackId);
        if (!feedback) return;

        document.getElementById('detailCustomer').textContent = feedback.customer;
        document.getElementById('detailDate').textContent = formatDate(feedback.date);
        document.getElementById('detailSource').textContent = feedback.source;
        document.getElementById('detailType').innerHTML = `<span class="sentiment-badge ${feedback.type}">${feedback.type}</span>`;
        document.getElementById('detailStatus').innerHTML = `<span class="status-badge ${feedback.status}">${feedback.status}</span>`;
        document.getElementById('detailFeedback').textContent = feedback.feedback;
        document.getElementById('detailEmail').textContent = feedback.email;
        document.getElementById('detailPhone').textContent = feedback.phone;

        feedbackDetailModal.classList.add('active');
    }

    // Populate customer dropdown
    function populateCustomerDropdown() {
        let html = '<option value="">Select Customer</option>';

        feedbackData.customers.forEach(customer => {
            html += `<option value="${customer.id}">${customer.name}</option>`;
        });

        feedbackCustomer.innerHTML = html;
    }

    // Initialize charts
    function initCharts() {
        // Sentiment Trend Chart
        const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
        new Chart(sentimentCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Positive',
                        data: [65, 59, 70, 71, 76, 78],
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Negative',
                        data: [15, 20, 18, 14, 13, 12],
                        backgroundColor: 'rgba(231, 76, 60, 0.2)',
                        borderColor: 'rgba(231, 76, 60, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Neutral',
                        data: [20, 21, 12, 15, 11, 10],
                        backgroundColor: 'rgba(149, 165, 166, 0.2)',
                        borderColor: 'rgba(149, 165, 166, 1)',
                        borderWidth: 2,
                        tension: 0.4
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

        // Source Chart
        const sourceCtx = document.getElementById('sourceChart').getContext('2d');
        new Chart(sourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Website', 'Email', 'Social Media', 'In-Store', 'Phone'],
                datasets: [{
                    data: [45, 25, 15, 10, 5],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)',
                        'rgba(231, 76, 60, 0.8)'
                    ],
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

    // Filter event listeners
    feedbackSearch.addEventListener('input', loadFeedback);
    feedbackType.addEventListener('change', loadFeedback);
    feedbackSource.addEventListener('change', loadFeedback);
    feedbackStatus.addEventListener('change', loadFeedback);

    // Pagination event listeners
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadFeedback();
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredFeedback.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadFeedback();
        }
    });

    // Modal Functions
    detailModalClose.addEventListener('click', function() {
        feedbackDetailModal.classList.remove('active');
    });

    newFeedbackModalClose.addEventListener('click', function() {
        newFeedbackModal.classList.remove('active');
    });

    cancelNewFeedback.addEventListener('click', function() {
        newFeedbackModal.classList.remove('active');
    });

    newFeedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const customerId = parseInt(feedbackCustomer.value);
        const customer = feedbackData.customers.find(c => c.id === customerId);
        const type = document.getElementById('feedbackTypeSelect').value;
        const source = document.getElementById('feedbackSourceSelect').value;
        const date = document.getElementById('feedbackDate').value;
        const content = document.getElementById('feedbackContent').value;
        const status = document.getElementById('feedbackStatusSelect').value;

        if (customer && date && content) {
            // In a real app, you would send this data to your backend
            const newId = feedbackData.feedback.length > 0 ? Math.max(...feedbackData.feedback.map(f => f.id)) + 1 : 1;

            feedbackData.feedback.unshift({
                id: newId,
                customer: customer.name,
                feedback: content,
                type: type,
                date: date,
                source: source,
                status: status,
                email: 'example@email.com', // In real app, get from customer data
                phone: '+254700000000'      // In real app, get from customer data
            });

            feedbackData.totalFeedback++;
            document.getElementById('totalFeedback').textContent = feedbackData.totalFeedback;

            alert('Feedback added successfully!');
            newFeedbackModal.classList.remove('active');
            this.reset();
            loadFeedback();
        }
    });

    // Export button
    exportFeedbackBtn.addEventListener('click', function() {
        alert('Exporting feedback data...');
    });

    // Close modals when clicking outside
    const modals = [feedbackDetailModal, newFeedbackModal];
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                modal.classList.remove('active');
            }
        });
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