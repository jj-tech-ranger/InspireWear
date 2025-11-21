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
            await updateSummary();
            await loadFeedback();
            await initCharts();
            await populateCustomerDropdown();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 800);
        }
    }

    async function updateSummary() {
        try {
            const summary = await fetch('/api/feedback/summary/').then(res => res.json());
            document.getElementById('positiveFeedback').textContent = summary.positive_feedback;
            document.getElementById('negativeFeedback').textContent = summary.negative_feedback;
            document.getElementById('totalFeedback').textContent = summary.total_feedback;
            document.getElementById('responseTime').textContent = summary.response_time;
        } catch (error) {
            console.error('Error updating summary:', error);
        }
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Load feedback into the table with pagination
    async function loadFeedback() {
        await applyFilters();
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const paginatedFeedback = filteredFeedback.slice(startIndex, endIndex);

        let html = '';

        if (paginatedFeedback.length === 0) {
            html = `<tr><td colspan="7" class="no-results">No feedback found matching your criteria</td></tr>`;
        } else {
            paginatedFeedback.forEach(item => {
                html += `
                    <tr data-id="${item.id}">
                        <td>${item.customer}</td>
                        <td class="feedback-preview">${item.feedback.length > 50 ? item.feedback.substring(0, 50) + '...' : item.feedback}</td>
                        <td><span class="sentiment-badge ${item.type}">${item.type}</span></td>
                        <td>${formatDate(item.date)}</td>
                        <td>${item.source}</td>
                        <td><span class="status-badge ${item.status}">${item.status}</span></td>
                        <td>
                            <button class="action-btn view-btn" title="View Details"><i class="fas fa-eye"></i></button>
                            <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        feedbackTable.innerHTML = html;
        updatePaginationInfo();
        attachTableEventListeners();
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const feedbackId = this.closest('tr').dataset.id;
                openFeedbackDetail(feedbackId);
            });
        });
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const feedbackId = this.closest('tr').dataset.id;
                editFeedback(feedbackId);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const feedbackId = this.closest('tr').dataset.id;
                deleteFeedback(feedbackId);
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

    async function editFeedback(feedbackId) {
        try {
            const feedback = await fetch(`/api/feedback/${feedbackId}/`).then(res => res.json());
            if (!feedback) return;

            newFeedbackForm.dataset.editId = feedbackId;
            document.getElementById('feedbackCustomer').value = feedback.customer_id;
            document.getElementById('feedbackTypeSelect').value = feedback.type;
            document.getElementById('feedbackSourceSelect').value = feedback.source;
            document.getElementById('feedbackDate').value = feedback.date;
            document.getElementById('feedbackContent').value = feedback.feedback;
            document.getElementById('feedbackStatusSelect').value = feedback.status;
            
            newFeedbackModal.classList.add('active');
        } catch (error) {
            console.error('Error fetching feedback for edit:', error);
        }
    }

    async function deleteFeedback(feedbackId) {
        if (confirm('Are you sure you want to delete this feedback?')) {
            try {
                const response = await fetch(`/api/feedback/${feedbackId}/`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete feedback.');
                
                await loadFeedback();
                await updateSummary();
                alert('Feedback deleted successfully.');
            } catch (error) {
                console.error('Error deleting feedback:', error);
                alert('Could not delete feedback.');
            }
        }
    }

    // Populate customer dropdown
    async function populateCustomerDropdown() {
        try {
            const customers = await fetch('/api/customers/').then(res => res.json());
            let html = '<option value="">Select Customer</option>';

            customers.forEach(customer => {
                html += `<option value="${customer.id}">${customer.first_name} ${customer.last_name}</option>`;
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
            // ... (chart initialization logic remains the same)
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    }

    // Modal Functions
    addFeedbackBtn.addEventListener('click', () => {
        newFeedbackForm.reset();
        delete newFeedbackForm.dataset.editId;
        newFeedbackModal.classList.add('active');
    });
    
    detailModalClose.addEventListener('click', () => feedbackDetailModal.classList.remove('active'));
    newFeedbackModalClose.addEventListener('click', () => newFeedbackModal.classList.remove('active'));
    cancelNewFeedback.addEventListener('click', () => newFeedbackModal.classList.remove('active'));

    newFeedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const feedbackId = this.dataset.editId;
        const method = feedbackId ? 'PUT' : 'POST';
        const url = feedbackId ? `/api/feedback/${feedbackId}/` : '/api/feedback/';

        const formData = {
            customer: document.getElementById('feedbackCustomer').value,
            type: document.getElementById('feedbackTypeSelect').value,
            source: document.getElementById('feedbackSourceSelect').value,
            date: document.getElementById('feedbackDate').value,
            feedback: document.getElementById('feedbackContent').value,
            status: document.getElementById('feedbackStatusSelect').value,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save feedback.');

            newFeedbackModal.classList.remove('active');
            await initPage();
            alert(`Feedback ${feedbackId ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error saving feedback:', error);
            alert('Error saving feedback. Please try again.');
        }
    });

    // Filter event listeners
    feedbackSearch.addEventListener('input', loadFeedback);
    feedbackType.addEventListener('change', loadFeedback);
    feedbackSource.addEventListener('change', loadFeedback);
    feedbackStatus.addEventListener('change', loadFeedback);

    // Pagination event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadFeedback();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredFeedback.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadFeedback();
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
