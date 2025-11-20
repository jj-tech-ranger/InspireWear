document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addPointsBtn = document.getElementById('addPointsBtn');
    const addPointsModal = document.getElementById('addPointsModal');
    const pointsModalClose = document.getElementById('pointsModalClose');
    const cancelAddPoints = document.getElementById('cancelAddPoints');
    const addPointsForm = document.getElementById('addPointsForm');
    const addRewardBtn = document.getElementById('addRewardBtn');
    const addRewardModal = document.getElementById('addRewardModal');
    const rewardModalClose = document.getElementById('rewardModalClose');
    const cancelAddReward = document.getElementById('cancelAddReward');
    const addRewardForm = document.getElementById('addRewardForm');
    const editProgramBtn = document.getElementById('editProgramBtn');
    const editProgramModal = document.getElementById('editProgramModal');
    const programModalClose = document.getElementById('programModalClose');
    const cancelEditProgram = document.getElementById('cancelEditProgram');
    const editProgramForm = document.getElementById('editProgramForm');
    const pointsReason = document.getElementById('pointsReason');
    const otherReasonContainer = document.getElementById('otherReasonContainer');
    const membersTable = document.getElementById('membersTable');
    const rewardsGrid = document.getElementById('rewardsGrid');
    const memberSelect = document.getElementById('memberSelect');

    // Initialize the page
    async function initPage() {
        try {
            const loyaltyData = await fetch('/api/loyalty/summary/').then(res => res.json());

            // Set overview numbers
            document.getElementById('totalMembers').textContent = formatNumber(loyaltyData.total_members);
            document.getElementById('pointsRedeemed').textContent = formatNumber(loyaltyData.points_redeemed);
            document.getElementById('redemptionRate').textContent = loyaltyData.redemption_rate;

            // Load top members table
            loadTopMembers();

            // Load rewards inventory
            loadRewards();

            // Populate member select dropdown
            populateMemberSelect();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 800);
        }
    }

    // Format numbers
    function formatNumber(number) {
        return new Intl.NumberFormat('en-US').format(number);
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-KE', options);
    }

    // Load top members into the table
    async function loadTopMembers() {
        try {
            const topMembers = await fetch('/api/loyalty/top-members/').then(res => res.json());
            let html = '';

            topMembers.forEach((member, index) => {
                html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${member.name}</td>
                        <td>${formatNumber(member.points)}</td>
                        <td>${formatDate(member.last_activity)}</td>
                        <td><span class="tier-badge ${member.tier}">${member.tier}</span></td>
                        <td>
                            <button class="action-btn view-btn" data-id="${member.id}" title="View Profile"><i class="fas fa-eye"></i></button>
                            <button class="action-btn points-btn" data-id="${member.id}" title="Add Points"><i class="fas fa-plus-circle"></i></button>
                            <button class="action-btn message-btn" data-id="${member.id}" title="Send Message"><i class="fas fa-envelope"></i></button>
                        </td>
                    </tr>
                `;
            });

            membersTable.innerHTML = html;

            // Add event listeners to action buttons
            document.querySelectorAll('.points-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const memberId = parseInt(this.getAttribute('data-id'));
                    const member = await fetch(`/api/members/${memberId}/`).then(res => res.json());
                    if (member) {
                        memberSelect.value = memberId;
                        addPointsModal.classList.add('active');
                    }
                });
            });
        } catch (error) {
            console.error('Error loading top members:', error);
            membersTable.innerHTML = '<tr><td colspan="6">Error loading members.</td></tr>';
        }
    }

    // Load rewards into the grid
    async function loadRewards() {
        try {
            const rewards = await fetch('/api/loyalty/rewards/').then(res => res.json());
            let html = '';

            rewards.forEach(reward => {
                html += `
                    <div class="reward-card">
                        <div class="reward-image">
                            ${reward.image ? `<img src="../img/rewards/${reward.image}" alt="${reward.name}">` : `<i class="fas fa-gift"></i>`}
                        </div>
                        <div class="reward-details">
                            <h4 class="reward-name">${reward.name}</h4>
                            <p class="reward-description">${reward.description}</p>
                            <div class="reward-meta">
                                <span class="reward-points">${formatNumber(reward.points)} pts</span>
                                <span class="reward-stock">${reward.stock > 0 ? `${reward.stock} available` : 'Out of stock'}</span>
                            </div>
                            <div class="reward-actions">
                                <button class="btn-secondary" data-id="${reward.id}"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-primary" data-id="${reward.id}"><i class="fas fa-gift"></i> Redeem</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            rewardsGrid.innerHTML = html;
        } catch (error) {
            console.error('Error loading rewards:', error);
            rewardsGrid.innerHTML = '<p>Error loading rewards.</p>';
        }
    }

    // Populate member select dropdown
    async function populateMemberSelect() {
        try {
            const allMembers = await fetch('/api/members/').then(res => res.json());
            let html = '<option value="">Select Member</option>';

            allMembers.forEach(member => {
                html += `<option value="${member.id}">${member.name}</option>`;
            });

            memberSelect.innerHTML = html;
        } catch (error) {
            console.error('Error populating member select:', error);
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

    // Points Reason Select Change
    pointsReason.addEventListener('change', function() {
        otherReasonContainer.style.display = this.value === 'other' ? 'block' : 'none';
    });

    // Modal Functions
    addPointsBtn.addEventListener('click', function() {
        addPointsModal.classList.add('active');
    });

    pointsModalClose.addEventListener('click', function() {
        addPointsModal.classList.remove('active');
    });

    cancelAddPoints.addEventListener('click', function() {
        addPointsModal.classList.remove('active');
    });

    addPointsForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const memberId = parseInt(memberSelect.value);
        const points = parseInt(pointsAmount.value);
        const reason = pointsReason.value === 'other' ? otherReason.value : pointsReason.value;

        if (memberId && points) {
            try {
                const response = await fetch('/api/loyalty/add-points/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ member_id: memberId, points, reason }),
                });

                if (response.ok) {
                    alert(`${points} points added to member ${memberId} for reason: ${reason}`);
                    addPointsModal.classList.remove('active');
                    this.reset();
                    otherReasonContainer.style.display = 'none';
                    initPage(); // Refresh data
                } else {
                    alert('Failed to add points.');
                }
            } catch (error) {
                console.error('Error adding points:', error);
                alert('An error occurred while adding points.');
            }
        }
    });

    addRewardBtn.addEventListener('click', function() {
        addRewardModal.classList.add('active');
    });

    rewardModalClose.addEventListener('click', function() {
        addRewardModal.classList.remove('active');
    });

    cancelAddReward.addEventListener('click', function() {
        addRewardModal.classList.remove('active');
    });

    addRewardForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(addRewardForm);
        const rewardData = Object.fromEntries(formData.entries());

        if (rewardData.name && rewardData.description && rewardData.points) {
            try {
                const response = await fetch('/api/loyalty/rewards/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rewardData),
                });

                if (response.ok) {
                    alert(`Reward "${rewardData.name}" added successfully!`);
                    addRewardModal.classList.remove('active');
                    this.reset();
                    loadRewards(); // Refresh rewards
                } else {
                    alert('Failed to add reward.');
                }
            } catch (error) {
                console.error('Error adding reward:', error);
                alert('An error occurred while adding the reward.');
            }
        }
    });

    editProgramBtn.addEventListener('click', function() {
        editProgramModal.classList.add('active');
    });

    programModalClose.addEventListener('click', function() {
        editProgramModal.classList.remove('active');
    });

    cancelEditProgram.addEventListener('click', function() {
        editProgramModal.classList.remove('active');
    });

    editProgramForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(editProgramForm);
        const programData = Object.fromEntries(formData.entries());

        if (programData.name && programData.points_rate && programData.signup_bonus && programData.birthday_bonus && programData.point_value) {
            try {
                const response = await fetch('/api/loyalty/program/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(programData),
                });

                if (response.ok) {
                    alert('Loyalty program updated successfully!');
                    editProgramModal.classList.remove('active');
                } else {
                    alert('Failed to update loyalty program.');
                }
            } catch (error) {
                console.error('Error updating loyalty program:', error);
                alert('An error occurred while updating the loyalty program.');
            }
        }
    });

    // Close modals when clicking outside
    const modals = [addPointsModal, addRewardModal, editProgramModal];
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