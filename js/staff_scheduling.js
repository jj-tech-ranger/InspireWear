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

    // Initialize the page
    async function initPage() {
        try {
            const overview = await fetch('/api/staff/overview/').then(res => res.json());
            // Set overview numbers
            document.getElementById('totalStaff').textContent = overview.total_staff;
            document.getElementById('scheduledToday').textContent = overview.scheduled_today;
            document.getElementById('monthlyPayroll').textContent = formatCurrency(overview.monthly_payroll);
            document.getElementById('overtimeHours').textContent = overview.overtime_hours;

            // Populate staff dropdown
            await populateStaffDropdown();

            // Load schedule table
            await loadScheduleTable();

            // Load statistics
            await loadLocationStats();
            await loadShiftStats();

            // Update week display
            updateWeekDisplay();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay after a short delay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
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
    async function populateStaffDropdown() {
        const staffList = await fetch('/api/staff/').then(res => res.json());
        staffMemberSelect.innerHTML = '<option value="">Select Staff Member</option>';
        staffList.forEach(staff => {
            const option = document.createElement('option');
            option.value = staff.id;
            option.textContent = `${staff.name} - ${staff.position}`;
            staffMemberSelect.appendChild(option);
        });
    }

    // Load schedule table
    async function loadScheduleTable() {
        const staffList = await fetch('/api/staff/').then(res => res.json());
        const schedules = await fetch(`/api/schedules/?week_start=${currentWeekStart.toISOString().split('T')[0]}`).then(res => res.json());
        let html = '';

        staffList.forEach(staff => {
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

                const schedule = schedules.find(s =>
                    s.staff_id === staff.id && s.date === dateString
                );

                html += '<td class="shift-cell">';
                if (schedule) {
                    html += `
                        <div class="shift-block ${schedule.shift_type}" onclick="editSchedule(${schedule.id})">
                            <span class="shift-time">${getShiftTimeDisplay(schedule.shift_type)}</span>
                            <span class="shift-rate">KSh ${staff.hourly_rate}/hr</span>
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
    async function loadLocationStats() {
        const locations = await fetch('/api/locations/stats/').then(res => res.json());
        let html = '';
        locations.forEach(location => {
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
    async function loadShiftStats() {
        const shiftTypes = await fetch('/api/shifts/stats/').then(res => res.json());
        let html = '';
        shiftTypes.forEach(shift => {
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
    window.editSchedule = async function(scheduleId) {
        const schedule = await fetch(`/api/schedules/${scheduleId}/`).then(res => res.json());
        if (schedule) {
            modalTitle.textContent = 'Edit Schedule';
            staffMemberSelect.value = schedule.staff_id;
            locationSelect.value = schedule.location;
            startDateInput.value = schedule.date;
            endDateInput.value = schedule.date;
            shiftTypeSelect.value = schedule.shift_type;

            const staff = await fetch(`/api/staff/${schedule.staff_id}/`).then(res => res.json());
            hourlyRateInput.value = staff.hourly_rate;
            notesInput.value = schedule.notes;

            scheduleForm.dataset.editId = scheduleId;
            scheduleModal.classList.add('active');
        }
    };

    window.viewStaffDetails = async function(staffId) {
        const staff = await fetch(`/api/staff/${staffId}/`).then(res => res.json());
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
                        <p><strong>Hourly Rate:</strong> KSh ${staff.hourly_rate}</p>
                        <p><strong>Status:</strong> <span class="status ${staff.status}">${staff.status.replace('-', ' ')}</span></p>
                        <p><strong>Phone:</strong> ${staff.phone}</p>
                        <p><strong>Email:</strong> ${staff.email}</p>
                    </div>
                </div>
            `;

            staffDetailsModal.classList.add('active');
        }
    };

    window.addScheduleForStaff = async function(staffId) {
        modalTitle.textContent = 'Add Schedule';
        scheduleForm.reset();
        staffMemberSelect.value = staffId;

        const staff = await fetch(`/api/staff/${staffId}/`).then(res => res.json());
        if (staff) {
            locationSelect.value = staff.location;
            hourlyRateInput.value = staff.hourly_rate;
        }

        delete scheduleForm.dataset.editId;
        scheduleModal.classList.add('active');
    };

    window.deleteStaffSchedules = async function(staffId) {
        if (confirm('Are you sure you want to clear all schedules for this staff member this week?')) {
            try {
                const response = await fetch(`/api/schedules/clear-week/?staff_id=${staffId}&week_start=${currentWeekStart.toISOString().split('T')[0]}`, { method: 'DELETE' });
                if (response.ok) {
                    await loadScheduleTable();
                    showNotification('Schedules cleared successfully!', 'success');
                } else {
                    showNotification('Failed to clear schedules.', 'error');
                }
            } catch (error) {
                console.error('Error clearing schedules:', error);
                showNotification('An error occurred while clearing schedules.', 'error');
            }
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
    scheduleForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            staff_id: parseInt(staffMemberSelect.value),
            location: locationSelect.value,
            start_date: startDateInput.value,
            end_date: endDateInput.value,
            shift_type: shiftTypeSelect.value,
            hourly_rate: parseFloat(hourlyRateInput.value),
            notes: notesInput.value
        };

        try {
            let response;
            if (scheduleForm.dataset.editId) {
                // Edit existing schedule
                const scheduleId = parseInt(scheduleForm.dataset.editId);
                response = await fetch(`/api/schedules/${scheduleId}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            } else {
                // Add new schedule(s)
                response = await fetch('/api/schedules/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
            }

            if (response.ok) {
                showNotification(scheduleForm.dataset.editId ? 'Schedule updated successfully!' : 'Schedule(s) added successfully!', 'success');
                scheduleModal.classList.remove('active');
                await loadScheduleTable();
            } else {
                showNotification('Failed to save schedule.', 'error');
            }
        } catch (error) {
            console.error('Error saving schedule:', error);
            showNotification('An error occurred while saving the schedule.', 'error');
        }
    });

    // Export functionality
    exportScheduleBtn.addEventListener('click', async function() {
        const schedules = await fetch(`/api/schedules/?week_start=${currentWeekStart.toISOString().split('T')[0]}`).then(res => res.json());
        const staffList = await fetch('/api/staff/').then(res => res.json());
        const csvContent = generateScheduleCSV(schedules, staffList);
        downloadCSV(csvContent, 'staff_schedule.csv');
        showNotification('Schedule exported successfully!', 'success');
    });

    // Generate CSV content
    function generateScheduleCSV(schedules, staffList) {
        let csv = 'Staff Name,Position,Location,Date,Shift Type,Start Time,End Time,Hourly Rate (KSh),Notes\n';

        schedules.forEach(schedule => {
            const staff = staffList.find(s => s.id === schedule.staff_id);
            if (staff) {
                csv += `"${staff.name}","${staff.position}","${schedule.location}","${schedule.date}","${schedule.shift_type}","${schedule.start_time}","${schedule.end_time}","${staff.hourly_rate}","${schedule.notes}"\n`;
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
    staffMemberSelect.addEventListener('change', async function() {
        const staffId = parseInt(this.value);
        const staff = await fetch(`/api/staff/${staffId}/`).then(res => res.json());
        if (staff) {
            hourlyRateInput.value = staff.hourly_rate;
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