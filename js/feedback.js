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

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 8;
    let filteredFeedback = [];

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/feedback/summary/').then(res => res.json());
            // Set overview numbers
            document.getElementById('positiveFeedback').textContent = summary.positive_feedback;
            document.getElementById('negativeFeedback').textContent = summary.negative_feedback;
            document.getElementById('totalFeedback').textContent = summary.total_feedback;
            document.getElementById('responseTime').textContent = summary.response_time;

            // Load feedback table
            await loadFeedback();

            // Load charts
            await initCharts();

            // Populate customer dropdown
            await populateCustomerDropdown();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 800);
        }
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Load feedback into the table with pagination
    async function loadFeedback() {
        // Apply filters
        await applyFilters();

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
    async function applyFilters() {
        const searchTerm = feedbackSearch.value.toLowerCase();
        const typeFilter = feedbackType.value;
        const sourceFilter = feedbackSource.value;
        const statusFilter = feedbackStatus.value;

        const params = new URLSearchParams({
            search: searchTerm,
            type: typeFilter,
            source: sourceFilter,
            status: statusFilter,
        });

        try {
            const feedback = await fetch(`/api/feedback/?${params.toString()}`).then(res => res.json());
            filteredFeedback = feedback;
            // Reset to first page when filters change
            currentPage = 1;
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    // Update pagination information
    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredFeedback.length / rowsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Open feedback detail modal
    async function openFeedbackDetail(feedbackId) {
        try {
            const feedback = await fetch(`/api/feedback/${feedbackId}/`).then(res => res.json());
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
        } catch (error) {
            console.error('Error opening feedback detail:', error);
        }
    }

    // Populate customer dropdown
    async function populateCustomerDropdown() {
        try {
            const customers = await fetch('/api/customers/').then(res => res.json());
            let html = '<option value="">Select Customer</option>';

            customers.forEach(customer => {
                html += `<option value="${customer.id}">${customer.name}</option>`;
            });

            feedbackCustomer.innerHTML = html;
        } catch (error) {
            console.error('Error populating customer dropdown:', error);
        }
    }

    // Initialize charts
    async function initCharts() {
        try {
            const chartData = await fetch('/api/feedback/charts/').then(res => res.json());
            // Sentiment Trend Chart
            const sentimentCtx = document.getElementById('sentimentChart').getContext('2d');
            new Chart(sentimentCtx, {
                type: 'line',
                data: {
                    labels: chartData.sentiment_trend.labels,
                    datasets: [
                        {
                            label: 'Positive',
                            data: chartData.sentiment_trend.positive,
                            backgroundColor: 'rgba(46, 204, 113, 0.2)',
                            borderColor: 'rgba(46, 204, 113, 1)',
                            borderWidth: 2,
                            tension: 0.4
                        },
                        {
                            label: 'Negative',
                            data: chartData.sentiment_trend.negative,
                            backgroundColor: 'rgba(231, 76, 60, 0.2)',
                            borderColor: 'rgba(231, 76, 60, 1)',
                            borderWidth: 2,
                            tension: 0.4
                        },
                        {
                            label: 'Neutral',
                            data: chartData.sentiment_trend.neutral,
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
                    labels: chartData.source_distribution.labels,
                    datasets: [{
                        data: chartData.source_distribution.data,
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

    newFeedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(newFeedbackForm);
        const feedbackData = Object.fromEntries(formData.entries());

        if (feedbackData.customer_id && feedbackData.date && feedbackData.content) {
            try {
                const response = await fetch('/api/feedback/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(feedbackData),
                });

                if (response.ok) {
                    alert('Feedback added successfully!');
                    newFeedbackModal.classList.remove('active');
                    this.reset();
                    await initPage(); // Refresh data
                } else {
                    alert('Failed to add feedback.');
                }
            } catch (error) {
                console.error('Error adding feedback:', error);
                alert('An error occurred while adding feedback.');
            }
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