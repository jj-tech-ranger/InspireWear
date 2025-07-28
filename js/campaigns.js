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

    // Sample email campaign data
    const campaignData = {
        totalCampaigns: 24,
        openRate: 32.5,
        clickRate: 8.7,
        conversionRate: 3.2,
        campaigns: [
            { id: 1, name: 'Summer Sale 2025', recipients: 2450, status: 'sent', date: '2025-06-15', openRate: 32.5, clickRate: 8.7, type: 'promotional' },
            { id: 2, name: 'New Arrivals - June', recipients: 2450, status: 'sent', date: '2025-06-10', openRate: 28.7, clickRate: 7.2, type: 'promotional' },
            { id: 3, name: 'Loyalty Rewards Update', recipients: 1240, status: 'sent', date: '2025-06-05', openRate: 35.2, clickRate: 9.5, type: 'loyalty' },
            { id: 4, name: 'Monthly Newsletter', recipients: 2450, status: 'sent', date: '2025-06-01', openRate: 25.8, clickRate: 6.3, type: 'newsletter' },
            { id: 5, name: 'Abandoned Cart Reminder', recipients: 320, status: 'sent', date: '2025-05-28', openRate: 38.4, clickRate: 12.1, type: 'transactional' },
            { id: 6, name: 'Eid Special Offers', recipients: 2450, status: 'scheduled', date: '2025-06-25', openRate: null, clickRate: null, type: 'promotional' },
            { id: 7, name: 'Winter Collection Preview', recipients: 0, status: 'draft', date: null, openRate: null, clickRate: null, type: 'promotional' }
        ],
        templates: [
            { id: 1, name: 'Summer Sale', category: 'promotional', type: 'discount', preview: 'summer_sale.jpg' },
            { id: 2, name: 'New Arrivals', category: 'promotional', type: 'product_showcase', preview: 'new_arrivals.jpg' },
            { id: 3, name: 'Loyalty Rewards', category: 'loyalty', type: 'basic', preview: 'loyalty.jpg' },
            { id: 4, name: 'Newsletter', category: 'newsletter', type: 'basic', preview: 'newsletter.jpg' },
            { id: 5, name: 'Abandoned Cart', category: 'transactional', type: 'basic', preview: 'abandoned_cart.jpg' },
            { id: 6, name: 'Birthday Special', category: 'loyalty', type: 'discount', preview: 'birthday.jpg' }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalCampaigns').textContent = campaignData.totalCampaigns;
        document.getElementById('openRate').textContent = campaignData.openRate;
        document.getElementById('clickRate').textContent = campaignData.clickRate;
        document.getElementById('conversionRate').textContent = campaignData.conversionRate;

        // Load campaigns table
        loadCampaigns();

        // Load templates grid
        loadTemplates();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 800);
    }

    // Format date
    function formatDate(dateString) {
        if (!dateString) return 'Not sent';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Load campaigns into the table
    function loadCampaigns() {
        const statusFilter = campaignStatus.value;
        const typeFilter = campaignType.value;
        const searchTerm = campaignSearch.value.toLowerCase();

        let filteredCampaigns = campaignData.campaigns.filter(campaign => {
            const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
            const matchesType = typeFilter === 'all' || campaign.type === typeFilter;
            const matchesSearch = campaign.name.toLowerCase().includes(searchTerm);
            return matchesStatus && matchesType && matchesSearch;
        });

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
                        <td>${campaign.openRate ? `${campaign.openRate}%` : '-'}</td>
                        <td>${campaign.clickRate ? `${campaign.clickRate}%` : '-'}</td>
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
    }

    // Load templates into the grid
    function loadTemplates() {
        let html = '';

        campaignData.templates.forEach(template => {
            html += `
                <div class="template-card">
                    <div class="template-image">
                        <img src="../img/templates/${template.preview}" alt="${template.name}">
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
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Open campaign report
    function openCampaignReport(campaignId) {
        const campaign = campaignData.campaigns.find(c => c.id === campaignId);
        if (!campaign) return;

        // Set report data
        document.getElementById('reportCampaignName').textContent = campaign.name;
        document.getElementById('reportSentDate').textContent = formatDate(campaign.date);
        document.getElementById('reportRecipients').textContent = formatNumber(campaign.recipients);

        // Show modal
        reportModal.classList.add('active');

        // Initialize charts
        initReportCharts();
    }

    // Initialize report charts
    function initReportCharts() {
        // Performance Chart
        const performanceCtx = document.getElementById('performanceChart').getContext('2d');
        new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [
                    {
                        label: 'Opens',
                        data: [120, 190, 170, 220, 180, 150, 100],
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2,
                        tension: 0.4
                    },
                    {
                        label: 'Clicks',
                        data: [30, 50, 45, 60, 50, 40, 25],
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
                labels: ['Mobile', 'Desktop', 'Tablet', 'Other'],
                datasets: [{
                    data: [65, 25, 8, 2],
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

    createCampaignForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const campaignName = document.getElementById('campaignName').value;
        const campaignSubject = document.getElementById('campaignSubject').value;

        if (campaignName && campaignSubject) {
            alert(`Campaign "${campaignName}" created successfully!`);
            createCampaignModal.classList.remove('active');
            this.reset();

            // Add to campaigns array and reload
            const newId = campaignData.campaigns.length > 0 ? Math.max(...campaignData.campaigns.map(c => c.id)) + 1 : 1;
            campaignData.campaigns.push({
                id: newId,
                name: campaignName,
                recipients: 0,
                status: 'draft',
                date: null,
                openRate: null,
                clickRate: null,
                type: document.getElementById('campaignTypeSelect').value
            });

            loadCampaigns();
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

    createTemplateForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const templateName = document.getElementById('templateName').value;
        const templateSubject = document.getElementById('templateSubject').value;

        if (templateName && templateSubject) {
            alert(`Template "${templateName}" created successfully!`);
            createTemplateModal.classList.remove('active');
            this.reset();

            // Add to templates array and reload
            const newId = campaignData.templates.length > 0 ? Math.max(...campaignData.templates.map(t => t.id)) + 1 : 1;
            campaignData.templates.push({
                id: newId,
                name: templateName,
                category: document.getElementById('templateCategory').value,
                type: document.getElementById('templateType').value,
                preview: 'default.jpg'
            });

            loadTemplates();
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
        }
    }

    // Show loading overlay initially
    morphOverlay.classList.add('active');

    // Initialize the page
    initPage();
});