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

    // Sample loyalty program data
    const loyaltyData = {
        totalMembers: 1240,
        pointsRedeemed: 245800,
        redemptionRate: 68,
        topMembers: [
            { id: 1, name: 'Wanjiku Mwangi', points: 42500, lastActivity: '2025-06-15', tier: 'platinum' },
            { id: 2, name: 'Njoroge Kariuki', points: 38700, lastActivity: '2025-06-18', tier: 'platinum' },
            { id: 3, name: 'Grace Wambui', points: 21500, lastActivity: '2025-06-12', tier: 'gold' },
            { id: 4, name: 'Kamau Otieno', points: 18700, lastActivity: '2025-06-10', tier: 'gold' },
            { id: 5, name: 'David Omondi', points: 9800, lastActivity: '2025-06-20', tier: 'silver' },
            { id: 6, name: 'James Mutua', points: 8700, lastActivity: '2025-06-14', tier: 'silver' },
            { id: 7, name: 'Lilian Wanjiru', points: 6500, lastActivity: '2025-06-08', tier: 'silver' },
            { id: 8, name: 'Joseph Kamande', points: 5900, lastActivity: '2025-06-17', tier: 'silver' },
            { id: 9, name: 'Mercy Chebet', points: 5400, lastActivity: '2025-06-09', tier: 'silver' },
            { id: 10, name: 'Brian Kimani', points: 4700, lastActivity: '2025-06-14', tier: 'silver' }
        ],
        rewards: [
            { id: 1, name: '10% Discount Voucher', description: 'Get 10% off your next purchase', points: 1000, category: 'discount', stock: 45, image: 'discount.jpg' },
            { id: 2, name: 'Free T-Shirt', description: 'Premium InspireWear branded t-shirt', points: 2500, category: 'product', stock: 12, image: 'tshirt.jpg' },
            { id: 3, name: 'Free Shipping', description: 'Free shipping on your next order', points: 1500, category: 'service', stock: 0, image: 'shipping.jpg' },
            { id: 4, name: 'VIP Shopping Day', description: 'Exclusive shopping event invitation', points: 5000, category: 'experience', stock: 8, image: 'vip.jpg' },
            { id: 5, name: '5% Discount Voucher', description: 'Get 5% off your next purchase', points: 500, category: 'discount', stock: 120, image: 'discount.jpg' },
            { id: 6, name: 'Styling Session', description: 'Free personal styling session', points: 3000, category: 'service', stock: 5, image: 'styling.jpg' }
        ],
        allMembers: [
            { id: 1, name: 'Wanjiku Mwangi' },
            { id: 2, name: 'Njoroge Kariuki' },
            { id: 3, name: 'Grace Wambui' },
            { id: 4, name: 'Kamau Otieno' },
            { id: 5, name: 'David Omondi' },
            { id: 6, name: 'James Mutua' },
            { id: 7, name: 'Lilian Wanjiru' },
            { id: 8, name: 'Joseph Kamande' },
            { id: 9, name: 'Mercy Chebet' },
            { id: 10, name: 'Brian Kimani' },
            { id: 11, name: 'Esther Nyambura' },
            { id: 12, name: 'Peter Kipchoge' },
            { id: 13, name: 'Sarah Atieno' },
            { id: 14, name: 'Fatuma Abdi' },
            { id: 15, name: 'Achieng Okoth' }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalMembers').textContent = formatNumber(loyaltyData.totalMembers);
        document.getElementById('pointsRedeemed').textContent = formatNumber(loyaltyData.pointsRedeemed);
        document.getElementById('redemptionRate').textContent = loyaltyData.redemptionRate;

        // Load top members table
        loadTopMembers();

        // Load rewards inventory
        loadRewards();

        // Populate member select dropdown
        populateMemberSelect();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 800);
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
    function loadTopMembers() {
        let html = '';

        loyaltyData.topMembers.forEach((member, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${member.name}</td>
                    <td>${formatNumber(member.points)}</td>
                    <td>${formatDate(member.lastActivity)}</td>
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
            btn.addEventListener('click', function() {
                const memberId = parseInt(this.getAttribute('data-id'));
                const member = loyaltyData.allMembers.find(m => m.id === memberId);
                if (member) {
                    memberSelect.value = memberId;
                    addPointsModal.classList.add('active');
                }
            });
        });
    }

    // Load rewards into the grid
    function loadRewards() {
        let html = '';

        loyaltyData.rewards.forEach(reward => {
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
    }

    // Populate member select dropdown
    function populateMemberSelect() {
        let html = '<option value="">Select Member</option>';

        loyaltyData.allMembers.forEach(member => {
            html += `<option value="${member.id}">${member.name}</option>`;
        });

        memberSelect.innerHTML = html;
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

    addPointsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const memberId = parseInt(memberSelect.value);
        const points = parseInt(pointsAmount.value);
        const reason = pointsReason.value === 'other' ? otherReason.value : pointsReason.value;

        if (memberId && points) {
            // In a real app, you would send this data to your backend
            alert(`${points} points added to member ${memberId} for reason: ${reason}`);
            addPointsModal.classList.remove('active');
            this.reset();
            otherReasonContainer.style.display = 'none';
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

    addRewardForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const rewardName = rewardName.value;
        const description = rewardDescription.value;
        const points = parseInt(rewardPoints.value);
        const category = rewardCategory.value;
        const stock = parseInt(rewardStock.value);

        if (rewardName && description && points) {
            // In a real app, you would send this data to your backend
            alert(`Reward "${rewardName}" added successfully!`);
            addRewardModal.classList.remove('active');
            this.reset();

            // Add to rewards array and reload
            const newId = loyaltyData.rewards.length > 0 ? Math.max(...loyaltyData.rewards.map(r => r.id)) + 1 : 1;
            loyaltyData.rewards.push({
                id: newId,
                name: rewardName,
                description: description,
                points: points,
                category: category,
                stock: stock,
                image: null
            });

            loadRewards();
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

    editProgramForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const programName = programName.value;
        const pointsRate = parseInt(pointsRate.value);
        const signupBonus = parseInt(signupBonus.value);
        const birthdayBonus = parseInt(birthdayBonus.value);
        const pointValue = parseFloat(pointValue.value);

        if (programName && pointsRate && signupBonus && birthdayBonus && pointValue) {
            // In a real app, you would send this data to your backend
            alert('Loyalty program updated successfully!');
            editProgramModal.classList.remove('active');
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