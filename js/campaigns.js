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
    const createTemplateBtn = document.getElementById('createTemplateBtn');
    const createTemplateModal = document.getElementById('createTemplateModal');
    const templateModalClose = document.getElementById('templateModalClose');
    const cancelCreateTemplate = document.getElementById('cancelCreateTemplate');
    const createTemplateForm = document.getElementById('createTemplateForm');
    const campaignStatus = document.getElementById('campaignStatus');
    const campaignType = document.getElementById('campaignType');
    const campaignSearch = document.getElementById('campaignSearch');
    const campaignsTable = document.getElementById('campaignsTable');
    const templatesGrid = document.getElementById('templatesGrid');
    const campaignSchedule = document.getElementById('campaignSchedule');
    const scheduleDateContainer = document.getElementById('scheduleDateContainer');
    const customSegmentRadio = document.getElementById('customSegment');
    const segmentSelect = document.getElementById('segmentSelect');
    const reportModal = document.getElementById('campaignReportModal');
    const reportModalClose = document.getElementById('reportModalClose');

    // Initialize the page
    async function initPage() {
        try {
            const response = await fetch('/api/campaigns/overview/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const overviewData = await response.json();

            // Set overview numbers
            document.getElementById('totalCampaigns').textContent = overviewData.totalCampaigns;
            document.getElementById('openRate').textContent = overviewData.openRate;
            document.getElementById('clickRate').textContent = overviewData.clickRate;
            document.getElementById('conversionRate').textContent = overviewData.conversionRate;

            // Load campaigns table
            loadCampaigns();

            // Load templates grid
            loadTemplates();
        } catch (error) {
            console.error('Error initializing page:', error);
            // Optionally, display an error message to the user
        } finally {
            // Hide loading overlay after a short delay
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
                        <tr>
                            <td>${campaign.name}</td>
                            <td>${formatNumber(campaign.recipients)}</td>
                            <td><span class="status-badge ${campaign.status}">${campaign.status}</span></td>
                            <td>${formatDate(campaign.date)}</td>
                            <td>${campaign.open_rate ? `${campaign.open_rate}%` : '-'}</td>
                            <td>${campaign.click_rate ? `${campaign.click_rate}%` : '-'}</td>
                            <td>
                                <button class="action-btn view-btn" data-id="${campaign.id}" title="View Report"><i class="fas fa-chart-bar"></i></button>
                                <button class="action-btn edit-btn" data-id="${campaign.id}" title="Edit"><i class="fas fa-edit"></i></button>
                                <button class="action-btn duplicate-btn" data-id="${campaign.id}" title="Duplicate"><i class="fas fa-copy"></i></button>
                                ${campaign.status === 'draft' ? '<button class="action-btn delete-btn" data-id="' + campaign.id + '" title="Delete"><i class="fas fa-trash"></i></button>' : ''}
                            </td>
                        </tr>
                    `;
                });
            }

            campaignsTable.innerHTML = html;

            // Add event listeners to action buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const campaignId = parseInt(this.getAttribute('data-id'));
                    openCampaignReport(campaignId);
                });
            });
        } catch (error) {
            console.error('Error loading campaigns:', error);
            campaignsTable.innerHTML = `<tr><td colspan="7" class="no-results">Error loading campaigns. Please try again later.</td></tr>`;
        }
    }

    // Load templates into the grid
    async function loadTemplates() {
        try {
            const response = await fetch('/api/templates/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const templates = await response.json();

            let html = '';

            templates.forEach(template => {
                html += `
                    <div class="template-card">
                        <div class="template-image">
                            <img src="${template.preview_url}" alt="${template.name}">
                        </div>
                        <div class="template-details">
                            <h4 class="template-name">${template.name}</h4>
                            <p class="template-category">${template.category} • ${template.type}</p>
                            <div class="template-actions">
                                <button class="btn-secondary" data-id="${template.id}"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-primary" data-id="${template.id}"><i class="fas fa-envelope"></i> Use</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            templatesGrid.innerHTML = html;
        } catch (error) {
            console.error('Error loading templates:', error);
            templatesGrid.innerHTML = `<p class="no-results">Error loading templates. Please try again later.</p>`;
        }
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Open campaign report
    async function openCampaignReport(campaignId) {
        try {
            const response = await fetch(`/api/campaigns/${campaignId}/report/`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const campaign = await response.json();

            // Set report data
            document.getElementById('reportCampaignName').textContent = campaign.name;
            document.getElementById('reportSentDate').textContent = formatDate(campaign.date);
            document.getElementById('reportRecipients').textContent = formatNumber(campaign.recipients);

            // Show modal
            reportModal.classList.add('active');

            // Initialize charts with fetched data
            initReportCharts(campaign.report_data);
        } catch (error) {
            console.error(`Error opening campaign report for campaign ID ${campaignId}:`, error);
            // Optionally, show an error to the user
        }
    }

    // Initialize report charts
    function initReportCharts(reportData) {
        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart').getContext('2d');
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: reportData.performance.labels, //['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [
                    {
                        label: 'Opens',
                        data: reportData.performance.opens, //[120, 190, 170, 220, 180, 150, 100],
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Clicks',
                        data: reportData.performance.clicks, //[30, 50, 45, 60, 50, 40, 25],
                        backgroundColor: 'rgba(46, 204, 113, 0.2)',
                        borderColor: 'rgba(46, 204, 113, 1)',
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

        // Device Chart
        const deviceCtx = document.getElementById('deviceChart').getContext('2d');
        new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: reportData.devices.labels, //['Mobile', 'Desktop', 'Tablet', 'Other'],
                datasets: [{
                    data: reportData.devices.data, //[65, 25, 8, 2],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(46, 204, 113, 0.8)',
                        'rgba(241, 196, 15, 0.8)'
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

    // Modal Functions
    createCampaignBtn.addEventListener('click', function() {
        createCampaignModal.classList.add('active');
    });

    campaignModalClose.addEventListener('click', function() {
        createCampaignModal.classList.remove('active');
    });

    cancelCreateCampaign.addEventListener('click', function() {
        createCampaignModal.classList.remove('active');
    });

    createCampaignForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const campaignName = document.getElementById('campaignName').value;
        const campaignSubject = document.getElementById('campaignSubject').value;
        const campaignType = document.getElementById('campaignTypeSelect').value;

        if (campaignName && campaignSubject) {
            try {
                const response = await fetch('/api/campaigns/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // Include CSRF token if needed by Django
                        // 'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        name: campaignName,
                        subject: campaignSubject,
                        type: campaignType,
                        status: 'draft'
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                alert(`Campaign "${campaignName}" created successfully!`);
                createCampaignModal.classList.remove('active');
                this.reset();
                loadCampaigns(); // Reload campaigns to show the new one
            } catch (error) {
                console.error('Error creating campaign:', error);
                alert('Error creating campaign. Please try again.');
            }
        }
    });

    createTemplateBtn.addEventListener('click', function() {
        createTemplateModal.classList.add('active');
    });

    templateModalClose.addEventListener('click', function() {
        createTemplateModal.classList.remove('active');
    });

    cancelCreateTemplate.addEventListener('click', function() {
        createTemplateModal.classList.remove('active');
    });

    createTemplateForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const templateName = document.getElementById('templateName').value;
        const templateSubject = document.getElementById('templateSubject').value;
        const templateCategory = document.getElementById('templateCategory').value;
        const templateType = document.getElementById('templateType').value;

        if (templateName && templateSubject) {
            try {
                const response = await fetch('/api/templates/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: JSON.stringify({
                        name: templateName,
                        subject: templateSubject,
                        category: templateCategory,
                        type: templateType
                    })
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                alert(`Template "${templateName}" created successfully!`);
                createTemplateModal.classList.remove('active');
                this.reset();
                loadTemplates(); // Reload templates
            } catch (error) {
                console.error('Error creating template:', error);
                alert('Error creating template. Please try again.');
            }
        }
    });

    // Schedule date toggle
    campaignSchedule.addEventListener('change', function() {
        scheduleDateContainer.style.display = this.value === 'scheduled' ? 'block' : 'none';
    });

    // Segment select toggle
    customSegmentRadio.addEventListener('change', function() {
        segmentSelect.disabled = !this.checked;
    });

    // Report modal close
    reportModalClose.addEventListener('click', function() {
        reportModal.classList.remove('active');
    });

    // Filter event listeners
    campaignStatus.addEventListener('change', loadCampaigns);
    campaignType.addEventListener('change', loadCampaigns);
    campaignSearch.addEventListener('input', loadCampaigns);

    // Close modals when clicking outside
    const modals = [createCampaignModal, createTemplateModal, reportModal];
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
        .
    }

    // Show loading overlay initially
    morphOverlay.classList.add('active');

    // Initialize the page
    initPage();
});