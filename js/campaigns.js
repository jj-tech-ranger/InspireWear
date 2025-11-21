document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    const createCampaignModal = document.getElementById('createCampaignModal');
    const campaignModalClose = document.getElementById('campaignModalClose');
    const cancelCreateCampaign = document.getElementById('cancelCreateCampaign');
    const createCampaignForm = document.getElementById('createCampaignForm');
    const campaignStatus = document.getElementById('campaignStatus');
    const campaignType = document.getElementById('campaignType');
    const campaignSearch = document.getElementById('campaignSearch');
    const campaignsTable = document.getElementById('campaignsTable');

    // Initialize the page
    async function initPage() {
        try {
            await loadCampaigns();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 800);
        }
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return 'Not sent';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Load campaigns into the table
    async function loadCampaigns() {
        const statusFilter = campaignStatus.value;
        const typeFilter = campaignType.value;
        const searchTerm = campaignSearch.value.toLowerCase();

        const url = new URL('/api/campaigns/', window.location.origin);
        url.searchParams.append('status', statusFilter);
        url.searchParams.append('type', typeFilter);
        url.searchParams.append('search', searchTerm);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const filteredCampaigns = await response.json();

            let html = '';

            if (filteredCampaigns.length === 0) {
                html = `<tr><td colspan="7" class="no-results">No campaigns found matching your criteria</td></tr>`;
            } else {
                filteredCampaigns.forEach(campaign => {
                    html += `
                        <tr data-id="${campaign.id}">
                            <td>${campaign.name}</td>
                            <td>${formatNumber(campaign.recipients)}</td>
                            <td><span class="status-badge ${campaign.status}">${campaign.status}</span></td>
                            <td>${formatDate(campaign.date)}</td>
                            <td>${campaign.open_rate ? `${campaign.open_rate}%` : '-'}</td>
                            <td>${campaign.click_rate ? `${campaign.click_rate}%` : '-'}</td>
                            <td>
                                <button class="action-btn view-btn" title="View Report"><i class="fas fa-chart-bar"></i></button>
                                <button class="action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                                <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
            }

            campaignsTable.innerHTML = html;
            attachTableEventListeners();
        } catch (error) {
            console.error('Error loading campaigns:', error);
            campaignsTable.innerHTML = `<tr><td colspan="7" class="no-results">Error loading campaigns. Please try again later.</td></tr>`;
        }
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const campaignId = this.closest('tr').dataset.id;
                editCampaign(campaignId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const campaignId = this.closest('tr').dataset.id;
                deleteCampaign(campaignId);
            });
        });
    }

    async function editCampaign(campaignId) {
        try {
            const response = await fetch(`/api/campaigns/${campaignId}/`);
            if (!response.ok) throw new Error('Failed to fetch campaign details.');
            const campaign = await response.json();

            // Populate and show the modal
            document.getElementById('campaignName').value = campaign.name;
            document.getElementById('campaignSubject').value = campaign.subject || '';
            document.getElementById('campaignTypeSelect').value = campaign.type;
            createCampaignForm.dataset.editId = campaignId;
            createCampaignModal.classList.add('active');
        } catch (error) {
            console.error('Error fetching campaign for edit:', error);
            alert('Could not load campaign details for editing.');
        }
    }

    async function deleteCampaign(campaignId) {
        if (confirm('Are you sure you want to delete this campaign?')) {
            try {
                const response = await fetch(`/api/campaigns/${campaignId}/`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete campaign.');
                
                await loadCampaigns();
                alert('Campaign deleted successfully.');
            } catch (error) {
                console.error('Error deleting campaign:', error);
                alert('Could not delete campaign.');
            }
        }
    }

    // Modal Functions
    createCampaignBtn.addEventListener('click', function() {
        createCampaignForm.reset();
        delete createCampaignForm.dataset.editId;
        createCampaignModal.classList.add('active');
    });

    campaignModalClose.addEventListener('click', () => createCampaignModal.classList.remove('active'));
    cancelCreateCampaign.addEventListener('click', () => createCampaignModal.classList.remove('active'));

    createCampaignForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const campaignId = this.dataset.editId;
        const method = campaignId ? 'PUT' : 'POST';
        const url = campaignId ? `/api/campaigns/${campaignId}/` : '/api/campaigns/';

        const formData = {
            name: document.getElementById('campaignName').value,
            subject: document.getElementById('campaignSubject').value,
            type: document.getElementById('campaignTypeSelect').value,
            recipients: 1000, // Placeholder
            status: 'draft', // Default status
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to save campaign.');

            createCampaignModal.classList.remove('active');
            await loadCampaigns();
            alert(`Campaign ${campaignId ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            console.error('Error saving campaign:', error);
            alert('Error saving campaign. Please try again.');
        }
    });

    // Filter event listeners
    campaignStatus.addEventListener('change', loadCampaigns);
    campaignType.addEventListener('change', loadCampaigns);
    campaignSearch.addEventListener('input', loadCampaigns);

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
