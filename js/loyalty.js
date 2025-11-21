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
    const membersTable = document.getElementById('membersTable');
    const rewardsGrid = document.getElementById('rewardsGrid');
    const memberSelect = document.getElementById('memberSelect');

    // Initialize the page
    async function initPage() {
        try {
            await updateSummary();
            await loadTopMembers();
            await loadRewards();
            await populateMemberSelect();
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
            const summary = await fetch('/api/loyalty/summary/').then(res => res.json());
            document.getElementById('totalMembers').textContent = formatNumber(summary.total_members);
            document.getElementById('pointsRedeemed').textContent = formatNumber(summary.points_redeemed);
            document.getElementById('redemptionRate').textContent = summary.redemption_rate;
        } catch (error) {
            console.error('Error updating summary:', error);
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
            const topMembers = await fetch('/api/loyalty/members/').then(res => res.json());
            let html = '';

            topMembers.forEach((member, index) => {
                html += `
                    <tr data-id="${member.id}">
                        <td>${index + 1}</td>
                        <td>${member.customer_name}</td>
                        <td>${formatNumber(member.points)}</td>
                        <td>${formatDate(member.last_activity)}</td>
                        <td><span class="tier-badge ${member.tier}">${member.tier}</span></td>
                        <td>
                            <button class="action-btn points-btn" title="Add Points"><i class="fas fa-plus-circle"></i></button>
                        </td>
                    </tr>
                `;
            });

            membersTable.innerHTML = html;
            attachTableEventListeners();
        } catch (error) {
            console.error('Error loading top members:', error);
            membersTable.innerHTML = '<tr><td colspan="6">Error loading members.</td></tr>';
        }
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.points-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const memberId = this.closest('tr').dataset.id;
                memberSelect.value = memberId;
                addPointsModal.classList.add('active');
            });
        });
    }

    // Load rewards into the grid
    async function loadRewards() {
        try {
            const rewards = await fetch('/api/loyalty/rewards/').then(res => res.json());
            let html = '';

            rewards.forEach(reward => {
                html += `
                    <div class="reward-card" data-id="${reward.id}">
                        <div class="reward-image">
                            ${reward.image ? `<img src="${reward.image}" alt="${reward.name}">` : `<i class="fas fa-gift"></i>`}
                        </div>
                        <div class="reward-details">
                            <h4 class="reward-name">${reward.name}</h4>
                            <p class="reward-description">${reward.description}</p>
                            <div class="reward-meta">
                                <span class="reward-points">${formatNumber(reward.points)} pts</span>
                                <span class="reward-stock">${reward.stock > 0 ? `${reward.stock} available` : 'Out of stock'}</span>
                            </div>
                            <div class="reward-actions">
                                <button class="btn-secondary edit-reward-btn"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-danger delete-reward-btn"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            rewardsGrid.innerHTML = html;
            attachRewardEventListeners();
        } catch (error) {
            console.error('Error loading rewards:', error);
            rewardsGrid.innerHTML = '<p>Error loading rewards.</p>';
        }
    }

    function attachRewardEventListeners() {
        document.querySelectorAll('.edit-reward-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rewardId = this.closest('.reward-card').dataset.id;
                editReward(rewardId);
            });
        });
        document.querySelectorAll('.delete-reward-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const rewardId = this.closest('.reward-card').dataset.id;
                deleteReward(rewardId);
            });
        });
    }

    // Populate member select dropdown
    async function populateMemberSelect() {
        try {
            const customers = await fetch('/api/customers/').then(res => res.json());
            let html = '<option value="">Select Member</option>';

            customers.forEach(customer => {
                html += `<option value="${customer.id}">${customer.first_name} ${customer.last_name}</option>`;
            });

            memberSelect.innerHTML = html;
        } catch (error) {
            console.error('Error populating member select:', error);
        }
    }

    async function editReward(rewardId) {
        try {
            const reward = await fetch(`/api/loyalty/rewards/${rewardId}/`).then(res => res.json());
            addRewardForm.dataset.editId = rewardId;
            document.getElementById('rewardName').value = reward.name;
            document.getElementById('rewardDescription').value = reward.description;
            document.getElementById('rewardPoints').value = reward.points;
            document.getElementById('rewardCategory').value = reward.category;
            document.getElementById('rewardStock').value = reward.stock;
            addRewardModal.classList.add('active');
        } catch (error) {
            console.error('Error fetching reward for edit:', error);
        }
    }

    async function deleteReward(rewardId) {
        if (confirm('Are you sure you want to delete this reward?')) {
            try {
                await fetch(`/api/loyalty/rewards/${rewardId}/`, { method: 'DELETE' });
                await loadRewards();
                alert('Reward deleted successfully.');
            } catch (error) {
                console.error('Error deleting reward:', error);
                alert('Could not delete reward.');
            }
        }
    }

    // Modal Functions
    addPointsBtn.addEventListener('click', () => addPointsModal.classList.add('active'));
    pointsModalClose.addEventListener('click', () => addPointsModal.classList.remove('active'));
    cancelAddPoints.addEventListener('click', () => addPointsModal.classList.remove('active'));

    addRewardBtn.addEventListener('click', () => {
        addRewardForm.reset();
        delete addRewardForm.dataset.editId;
        addRewardModal.classList.add('active');
    });
    rewardModalClose.addEventListener('click', () => addRewardModal.classList.remove('active'));
    cancelAddReward.addEventListener('click', () => addRewardModal.classList.remove('active'));

    addPointsForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        // ... (add points logic remains the same)
    });

    addRewardForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const rewardId = this.dataset.editId;
        const method = rewardId ? 'PUT' : 'POST';
        const url = rewardId ? `/api/loyalty/rewards/${rewardId}/` : '/api/loyalty/rewards/';

        const formData = {
            name: document.getElementById('rewardName').value,
            description: document.getElementById('rewardDescription').value,
            points: document.getElementById('rewardPoints').value,
            category: document.getElementById('rewardCategory').value,
            stock: document.getElementById('rewardStock').value,
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error('Failed to save reward.');
            
            addRewardModal.classList.remove('active');
            await loadRewards();
            alert(`Reward ${rewardId ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error saving reward:', error);
            alert('Error saving reward.');
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
