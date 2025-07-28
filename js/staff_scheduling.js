document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const scheduleTableBody = document.getElementById('scheduleTableBody');
    const locationStats = document.getElementById('locationStats');
    const shiftStats = document.getElementById('shiftStats');

    // Schedule controls
    const prevWeekBtn = document.getElementById('prevWeek');
    const nextWeekBtn = document.getElementById('nextWeek');
    const currentWeekDisplay = document.getElementById('currentWeek');
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const exportScheduleBtn = document.getElementById('exportScheduleBtn');
    const printScheduleBtn = document.getElementById('printScheduleBtn');

    // Modal elements
    const scheduleModal = document.getElementById('scheduleModal');
    const modalClose = document.getElementById('modalClose');
    const cancelSchedule = document.getElementById('cancelSchedule');
    const scheduleForm = document.getElementById('scheduleForm');
    const modalTitle = document.getElementById('modalTitle');
    const staffDetailsModal = document.getElementById('staffDetailsModal');
    const staffDetailsClose = document.getElementById('staffDetailsClose');

    // Form elements
    const staffMemberSelect = document.getElementById('staffMember');
    const locationSelect = document.getElementById('location');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const shiftTypeSelect = document.getElementById('shiftType');
    const hourlyRateInput = document.getElementById('hourlyRate');
    const notesInput = document.getElementById('notes');

    // Current week tracking
    let currentWeekStart = new Date();
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1); // Start from Monday

    // Sample staff scheduling data for Kenyan clothing store
    const staffData = {
        overview: {
            totalStaff: 32,
            scheduledToday: 24,
            monthlyPayroll: 2450000, // KSh
            overtimeHours: 156
        },
        staff: [
            { id: 1, name: 'John Mwangi', position: 'Store Manager', location: 'Nairobi Central', hourlyRate: 800, status: 'active', phone: '+254 712 345 678', email: 'john.mwangi@inspirewear.co.ke' },
            { id: 2, name: 'Susan Akinyi', position: 'Sales Associate', location: 'Nairobi Central', hourlyRate: 450, status: 'active', phone: '+254 723 456 789', email: 'susan.akinyi@inspirewear.co.ke' },
            { id: 3, name: 'David Omondi', position: 'Inventory Clerk', location: 'Nairobi Central', hourlyRate: 400, status: 'active', phone: '+254 734 567 890', email: 'david.omondi@inspirewear.co.ke' },
            { id: 4, name: 'Grace Wambui', position: 'Cashier', location: 'Nairobi Westlands', hourlyRate: 420, status: 'active', phone: '+254 745 678 901', email: 'grace.wambui@inspirewear.co.ke' },
            { id: 5, name: 'Peter Kamau', position: 'Security Guard', location: 'Nairobi Central', hourlyRate: 350, status: 'active', phone: '+254 756 789 012', email: 'peter.kamau@inspirewear.co.ke' },
            { id: 6, name: 'Mary Njeri', position: 'Sales Associate', location: 'Mombasa', hourlyRate: 450, status: 'active', phone: '+254 767 890 123', email: 'mary.njeri@inspirewear.co.ke' },
            { id: 7, name: 'James Otieno', position: 'Store Manager', location: 'Mombasa', hourlyRate: 750, status: 'active', phone: '+254 778 901 234', email: 'james.otieno@inspirewear.co.ke' },
            { id: 8, name: 'Catherine Wanjiku', position: 'Visual Merchandiser', location: 'Kisumu', hourlyRate: 500, status: 'active', phone: '+254 789 012 345', email: 'catherine.wanjiku@inspirewear.co.ke' },
            { id: 9, name: 'Michael Kiprop', position: 'Sales Associate', location: 'Nakuru', hourlyRate: 420, status: 'on-leave', phone: '+254 790 123 456', email: 'michael.kiprop@inspirewear.co.ke' },
            { id: 10, name: 'Agnes Moraa', position: 'Cashier', location: 'Eldoret', hourlyRate: 400, status: 'active', phone: '+254 701 234 567', email: 'agnes.moraa@inspirewear.co.ke' }
        ],
        schedules: [
            { id: 1, staffId: 1, date: '2025-01-20', shiftType: 'full', startTime: '08:00', endTime: '18:00', location: 'Nairobi Central', notes: 'Opening shift' },
            { id: 2, staffId: 2, date: '2025-01-20', shiftType: 'morning', startTime: '06:00', endTime: '14:00', location: 'Nairobi Central', notes: '' },
            { id: 3, staffId: 3, date: '2025-01-20', shiftType: 'afternoon', startTime: '14:00', endTime: '22:00', location: 'Nairobi Central', notes: 'Inventory check' },
            { id: 4, staffId: 4, date: '2025-01-20', shiftType: 'full', startTime: '08:00', endTime: '18:00', location: 'Nairobi Westlands', notes: '' },
            { id: 5, staffId: 5, date: '2025-01-20', shiftType: 'night', startTime: '22:00', endTime: '06:00', location: 'Nairobi Central', notes: 'Night security' },
            { id: 6, staffId: 6, date: '2025-01-21', shiftType: 'morning', startTime: '06:00', endTime: '14:00', location: 'Mombasa', notes: '' },
            { id: 7, staffId: 7, date: '2025-01-21', shiftType: 'full', startTime: '08:00', endTime: '18:00', location: 'Mombasa', notes: 'Store opening' },
            { id: 8, staffId: 8, date: '2025-01-22', shiftType: 'afternoon', startTime: '14:00', endTime: '22:00', location: 'Kisumu', notes: 'Window display update' },
            { id: 9, staffId: 10, date: '2025-01-23', shiftType: 'morning', startTime: '06:00', endTime: '14:00', location: 'Eldoret', notes: '' }
        ],
        locations: [
            { name: 'Nairobi Central', staff: 12, color: '#3498db' },
            { name: 'Nairobi Westlands', staff: 8, color: '#2ecc71' },
            { name: 'Mombasa', staff: 6, color: '#f1c40f' },
            { name: 'Kisumu', staff: 4, color: '#e74c3c' },
            { name: 'Nakuru', staff: 2, color: '#9b59b6' },
            { name: 'Eldoret', staff: 3, color: '#e67e22' }
        ],
        shiftTypes: [
            { name: 'Morning', count: 45, percentage: 35 },
            { name: 'Afternoon', count: 38, percentage: 30 },
            { name: 'Night', count: 25, percentage: 20 },
            { name: 'Full Day', count: 20, percentage: 15 }
        ]
    };

    // Initialize the page
    function initPage() {
        // Set overview numbers
        document.getElementById('totalStaff').textContent = staffData.overview.totalStaff;
        document.getElementById('scheduledToday').textContent = staffData.overview.scheduledToday;
        document.getElementById('monthlyPayroll').textContent = formatCurrency(staffData.overview.monthlyPayroll);
        document.getElementById('overtimeHours').textContent = staffData.overview.overtimeHours;

        // Populate staff dropdown
        populateStaffDropdown();

        // Load schedule table
        loadScheduleTable();

        // Load statistics
        loadLocationStats();
        loadShiftStats();

        // Update week display
        updateWeekDisplay();

        // Hide loading overlay after a short delay
        setTimeout(() => {
            morphOverlay.classList.remove('active');
        }, 1000);
    }

    // Format currency in Kenyan Shillings
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-KE', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    // Format time to HH:MM
    function formatTime(timeString) {
        return timeString;
    }

    // Get staff initials for avatar
    function getStaffInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Get shift time display
    function getShiftTimeDisplay(shiftType) {
        const shiftTimes = {
            'morning': '6:00 AM - 2:00 PM',
            'afternoon': '2:00 PM - 10:00 PM',
            'night': '10:00 PM - 6:00 AM',
            'full': '8:00 AM - 6:00 PM'
        };
        return shiftTimes[shiftType] || '';
    }

    // Populate staff dropdown
    function populateStaffDropdown() {
        staffMemberSelect.innerHTML = '<option value="">Select Staff Member</option>';
        staffData.staff.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.id;
            option.textContent = `${staff.name} - ${staff.position}`;
            staffMemberSelect.appendChild(option);
        });
    }

    // Load schedule table
    function loadScheduleTable() {
        let html = '';

        staffData.staff.forEach(staff => {
            html += `
                <tr>
                    <td>
                        <div class="staff-info">
                            <div class="staff-avatar">${getStaffInitials(staff.name)}</div>
                            <div class="staff-details">
                                <h4>${staff.name}</h4>
                                <p>${staff.position} • ${staff.location}</p>
                            </div>
                        </div>
                    </td>
            `;

            // Generate cells for each day of the week
            for (let day = 0; day < 7; day++) {
                const currentDate = new Date(currentWeekStart);
                currentDate.setDate(currentWeekStart.getDate() + day);
                const dateString = currentDate.toISOString().split('T')[0];

                const schedule = staffData.schedules.find(s =>
                    s.staffId === staff.id && s.date === dateString
                );

                html += '<td class="shift-cell">';
                if (schedule) {
                    const staffMember = staffData.staff.find(s => s.id === schedule.staffId);
                    html += `
                        <div class="shift-block ${schedule.shiftType}" onclick="editSchedule(${schedule.id})">
                            <span class="shift-time">${getShiftTimeDisplay(schedule.shiftType)}</span>
                            <span class="shift-rate">KSh ${staffMember.hourlyRate}/hr</span>
                        </div>
                    `;
                }
                html += '</td>';
            }

            html += `
                    <td>
                        <button class="action-btn" onclick="viewStaffDetails(${staff.id})" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="addScheduleForStaff(${staff.id})" title="Add Schedule">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteStaffSchedules(${staff.id})" title="Clear Week">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        scheduleTableBody.innerHTML = html;
    }

    // Load location statistics
    function loadLocationStats() {
        let html = '';
        staffData.locations.forEach(location => {
            html += `
                <div class="location-stat">
                    <span class="stat-label">${location.name}</span>
                    <span class="stat-value">${location.staff} staff</span>
                </div>
            `;
        });
        locationStats.innerHTML = html;
    }

    // Load shift statistics
    function loadShiftStats() {
        let html = '';
        staffData.shiftTypes.forEach(shift => {
            html += `
                <div class="shift-stat">
                    <span class="stat-label">${shift.name} Shift</span>
                    <span class="stat-value">${shift.count} (${shift.percentage}%)</span>
                </div>
            `;
        });
        shiftStats.innerHTML = html;
    }

    // Update week display
    function updateWeekDisplay() {
        const endDate = new Date(currentWeekStart);
        endDate.setDate(currentWeekStart.getDate() + 6);

        const options = { month: 'long', day: 'numeric' };
        const startStr = currentWeekStart.toLocaleDateString('en-US', options);
        const endStr = endDate.toLocaleDateString('en-US', options);
        const year = currentWeekStart.getFullYear();

        currentWeekDisplay.textContent = `Week of ${startStr} - ${endStr}, ${year}`;
    }

    // Week navigation
    prevWeekBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekDisplay();
        loadScheduleTable();
    });

    nextWeekBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekDisplay();
        loadScheduleTable();
    });

    // Global functions for onclick handlers
    window.editSchedule = function(scheduleId) {
        const schedule = staffData.schedules.find(s => s.id === scheduleId);
        if (schedule) {
            modalTitle.textContent = 'Edit Schedule';
            staffMemberSelect.value = schedule.staffId;
            locationSelect.value = schedule.location;
            startDateInput.value = schedule.date;
            endDateInput.value = schedule.date;
            shiftTypeSelect.value = schedule.shiftType;

            const staff = staffData.staff.find(s => s.id === schedule.staffId);
            hourlyRateInput.value = staff.hourlyRate;
            notesInput.value = schedule.notes;

            scheduleForm.dataset.editId = scheduleId;
            scheduleModal.classList.add('active');
        }
    };

    window.viewStaffDetails = function(staffId) {
        const staff = staffData.staff.find(s => s.id === staffId);
        if (staff) {
            document.getElementById('staffDetailsTitle').textContent = `${staff.name} - Details`;

            const staffInfo = document.getElementById('staffInfo');
            staffInfo.innerHTML = `
                <div class="staff-detail-card">
                    <div class="staff-avatar-large">${getStaffInitials(staff.name)}</div>
                    <div class="staff-detail-info">
                        <h3>${staff.name}</h3>
                        <p><strong>Position:</strong> ${staff.position}</p>
                        <p><strong>Location:</strong> ${staff.location}</p>
                        <p><strong>Hourly Rate:</strong> KSh ${staff.hourlyRate}</p>
                        <p><strong>Status:</strong> <span class="status ${staff.status}">${staff.status.replace('-', ' ')}</span></p>
                        <p><strong>Phone:</strong> ${staff.phone}</p>
                        <p><strong>Email:</strong> ${staff.email}</p>
                    </div>
                </div>
            `;

            staffDetailsModal.classList.add('active');
        }
    };

    window.addScheduleForStaff = function(staffId) {
        modalTitle.textContent = 'Add Schedule';
        scheduleForm.reset();
        staffMemberSelect.value = staffId;

        const staff = staffData.staff.find(s => s.id === staffId);
        if (staff) {
            locationSelect.value = staff.location;
            hourlyRateInput.value = staff.hourlyRate;
        }

        delete scheduleForm.dataset.editId;
        scheduleModal.classList.add('active');
    };

    window.deleteStaffSchedules = function(staffId) {
        if (confirm('Are you sure you want to clear all schedules for this staff member this week?')) {
            // Remove schedules for this staff member in the current week
            const weekStart = new Date(currentWeekStart);
            const weekEnd = new Date(currentWeekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            staffData.schedules = staffData.schedules.filter(schedule => {
                const scheduleDate = new Date(schedule.date);
                return !(schedule.staffId === staffId &&
                        scheduleDate >= weekStart &&
                        scheduleDate <= weekEnd);
            });

            loadScheduleTable();
            showNotification('Schedules cleared successfully!', 'success');
        }
    };

    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#38a169' : type === 'error' ? '#e53e3e' : '#3182ce'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 500;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('staffSchedulingTheme', newTheme);

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
    addScheduleBtn.addEventListener('click', function() {
        modalTitle.textContent = 'Add New Schedule';
        scheduleForm.reset();
        delete scheduleForm.dataset.editId;
        scheduleModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        scheduleModal.classList.remove('active');
    });

    cancelSchedule.addEventListener('click', function() {
        scheduleModal.classList.remove('active');
    });

    staffDetailsClose.addEventListener('click', function() {
        staffDetailsModal.classList.remove('active');
    });

    // Schedule form submission
    scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = {
            staffId: parseInt(staffMemberSelect.value),
            location: locationSelect.value,
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            shiftType: shiftTypeSelect.value,
            hourlyRate: parseFloat(hourlyRateInput.value),
            notes: notesInput.value
        };

        if (scheduleForm.dataset.editId) {
            // Edit existing schedule
            const scheduleId = parseInt(scheduleForm.dataset.editId);
            const scheduleIndex = staffData.schedules.findIndex(s => s.id === scheduleId);
            if (scheduleIndex !== -1) {
                staffData.schedules[scheduleIndex] = {
                    ...staffData.schedules[scheduleIndex],
                    ...formData,
                    date: formData.startDate
                };
                showNotification('Schedule updated successfully!', 'success');
            }
        } else {
            // Add new schedule(s)
            const startDate = new Date(formData.startDate);
            const endDate = new Date(formData.endDate);

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const dateString = date.toISOString().split('T')[0];

                // Check if schedule already exists for this staff and date
                const existingSchedule = staffData.schedules.find(s =>
                    s.staffId === formData.staffId && s.date === dateString
                );

                if (!existingSchedule) {
                    const newSchedule = {
                        id: Date.now() + Math.random(), // Simple ID generation
                        staffId: formData.staffId,
                        date: dateString,
                        shiftType: formData.shiftType,
                        startTime: getShiftStartTime(formData.shiftType),
                        endTime: getShiftEndTime(formData.shiftType),
                        location: formData.location,
                        notes: formData.notes
                    };

                    staffData.schedules.push(newSchedule);
                }
            }
            showNotification('Schedule(s) added successfully!', 'success');
        }

        scheduleModal.classList.remove('active');
        loadScheduleTable();
    });

    // Get shift start time
    function getShiftStartTime(shiftType) {
        const times = {
            'morning': '06:00',
            'afternoon': '14:00',
            'night': '22:00',
            'full': '08:00'
        };
        return times[shiftType] || '08:00';
    }

    // Get shift end time
    function getShiftEndTime(shiftType) {
        const times = {
            'morning': '14:00',
            'afternoon': '22:00',
            'night': '06:00',
            'full': '18:00'
        };
        return times[shiftType] || '18:00';
    }

    // Export functionality
    exportScheduleBtn.addEventListener('click', function() {
        const csvContent = generateScheduleCSV();
        downloadCSV(csvContent, 'staff_schedule.csv');
        showNotification('Schedule exported successfully!', 'success');
    });

    // Generate CSV content
    function generateScheduleCSV() {
        let csv = 'Staff Name,Position,Location,Date,Shift Type,Start Time,End Time,Hourly Rate (KSh),Notes\n';

        staffData.schedules.forEach(schedule => {
            const staff = staffData.staff.find(s => s.id === schedule.staffId);
            if (staff) {
                csv += `"${staff.name}","${staff.position}","${schedule.location}","${schedule.date}","${schedule.shiftType}","${schedule.startTime}","${schedule.endTime}","${staff.hourlyRate}","${schedule.notes}"\n`;
            }
        });

        return csv;
    }

    // Download CSV file
    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    // Print functionality
    printScheduleBtn.addEventListener('click', function() {
        window.print();
        showNotification('Print dialog opened!', 'info');
    });

    // Close modals when clicking outside
    scheduleModal.addEventListener('click', function(e) {
        if (e.target === this) {
            scheduleModal.classList.remove('active');
        }
    });

    staffDetailsModal.addEventListener('click', function(e) {
        if (e.target === this) {
            staffDetailsModal.classList.remove('active');
        }
    });

    // Auto-populate hourly rate when staff is selected
    staffMemberSelect.addEventListener('change', function() {
        const staffId = parseInt(this.value);
        const staff = staffData.staff.find(s => s.id === staffId);
        if (staff) {
            hourlyRateInput.value = staff.hourlyRate;
            locationSelect.value = staff.location;
        }
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('staffSchedulingTheme');
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
