document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const morphOverlay = document.getElementById('morphOverlay');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const addEmployeeModal = document.getElementById('addEmployeeModal');
    const modalClose = document.getElementById('modalClose');
    const cancelAddEmployee = document.getElementById('cancelAddEmployee');
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    const payrollTableBody = document.getElementById('payrollTableBody');
    const searchEmployees = document.getElementById('searchEmployees');
    const filterDepartment = document.getElementById('filterDepartment');
    const filterStatus = document.getElementById('filterStatus');
    const filterPayrollPeriod = document.getElementById('filterPayrollPeriod');
    const clearFilters = document.getElementById('clearFilters');
    const exportPayroll = document.getElementById('exportPayroll');
    const processPayroll = document.getElementById('processPayroll');
    const selectAll = document.getElementById('selectAll');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    const pageNumbers = document.getElementById('pageNumbers');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredEmployees = [];
    let sortColumn = '';
    let sortDirection = 'asc';

    // Initialize the page
    async function initPage() {
        try {
            const summary = await fetch('/api/payroll/summary/').then(res => res.json());
            // Set summary numbers
            document.getElementById('totalPayroll').textContent = formatCurrency(summary.total_payroll);
            document.getElementById('activeEmployees').textContent = summary.active_employees;
            document.getElementById('processedPayroll').textContent = formatCurrency(summary.processed_payroll);
            document.getElementById('pendingPayroll').textContent = formatCurrency(summary.pending_payroll);

            // Set default payroll date
            const today = new Date();
            const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            document.getElementById('payrollDate').value = lastDayOfMonth.toISOString().split('T')[0];

            // Load employees
            await applyFilters();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            // Hide loading overlay
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    // Format currency for KES
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
    }

    // Format date to DD/MM/YYYY
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    }

    // Get employee initials for avatar
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }

    // Calculate total allowances
    function calculateAllowances(employee) {
        return employee.housing_allowance + employee.transport_allowance + employee.medical_allowance;
    }

    // Calculate deductions (PAYE, NSSF, NHIF)
    function calculateDeductions(employee) {
        const grossSalary = employee.basic_salary + calculateAllowances(employee);
        
        // NSSF calculation (6% of basic salary, max KSh 1,080)
        const nssf = Math.min(employee.basic_salary * 0.06, 1080);
        
        // NHIF calculation (based on gross salary bands)
        let nhif = 0;
        if (grossSalary <= 5999) nhif = 150;
        else if (grossSalary <= 7999) nhif = 300;
        else if (grossSalary <= 11999) nhif = 400;
        else if (grossSalary <= 14999) nhif = 500;
        else if (grossSalary <= 19999) nhif = 600;
        else if (grossSalary <= 24999) nhif = 750;
        else if (grossSalary <= 29999) nhif = 850;
        else if (grossSalary <= 34999) nhif = 900;
        else if (grossSalary <= 39999) nhif = 950;
        else if (grossSalary <= 44999) nhif = 1000;
        else if (grossSalary <= 49999) nhif = 1100;
        else if (grossSalary <= 59999) nhif = 1200;
        else if (grossSalary <= 69999) nhif = 1300;
        else if (grossSalary <= 79999) nhif = 1400;
        else if (grossSalary <= 89999) nhif = 1500;
        else if (grossSalary <= 99999) nhif = 1600;
        else nhif = 1700;
        
        // PAYE calculation (simplified)
        const taxableIncome = grossSalary - nssf - nhif - 2400; // Personal relief
        let paye = 0;
        if (taxableIncome > 0) {
            if (taxableIncome <= 24000) {
                paye = taxableIncome * 0.1;
            } else if (taxableIncome <= 32333) {
                paye = 2400 + (taxableIncome - 24000) * 0.25;
            } else {
                paye = 2400 + 2083 + (taxableIncome - 32333) * 0.3;
            }
            paye = Math.max(0, paye - 2400); // Apply personal relief
        }
        
        return {
            nssf: Math.round(nssf),
            nhif: nhif,
            paye: Math.round(paye),
            total: Math.round(nssf + nhif + paye)
        };
    }

    // Calculate net pay
    function calculateNetPay(employee) {
        const grossSalary = employee.basic_salary + calculateAllowances(employee);
        const deductions = calculateDeductions(employee);
        return grossSalary - deductions.total;
    }

    // Apply filters and search
    async function applyFilters() {
        const searchTerm = searchEmployees.value.toLowerCase();
        const departmentFilter = filterDepartment.value;
        const statusFilter = filterStatus.value;

        const params = new URLSearchParams({
            search: searchTerm,
            department: departmentFilter,
            status: statusFilter,
            sort_by: sortColumn,
            sort_dir: sortDirection,
        });

        try {
            const employees = await fetch(`/api/payroll/employees/?${params.toString()}`).then(res => res.json());
            filteredEmployees = employees;
            currentPage = 1;
            renderEmployees();
            renderPagination();
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }

    // Render employees table
    function renderEmployees() {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageEmployees = filteredEmployees.slice(startIndex, endIndex);

        let html = '';
        pageEmployees.forEach(employee => {
            const allowances = calculateAllowances(employee);
            const deductions = calculateDeductions(employee);
            const netPay = calculateNetPay(employee);
            
            html += `
                <tr>
                    <td>
                        <input type="checkbox" class="employee-checkbox" data-id="${employee.id}">
                    </td>
                    <td>
                        <div class="employee-info">
                            <div class="employee-avatar">${getInitials(employee.name)}</div>
                            <div class="employee-details">
                                <div class="employee-name">${employee.name}</div>
                                <div class="employee-id">${employee.employee_id}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="department-badge ${employee.department.toLowerCase()}">${employee.department}</span>
                    </td>
                    <td>${employee.position}</td>
                    <td class="salary-amount">KSh ${formatCurrency(employee.basic_salary)}</td>
                    <td class="allowances">KSh ${formatCurrency(allowances)}</td>
                    <td class="deductions">KSh ${formatCurrency(deductions.total)}</td>
                    <td class="net-pay">KSh ${formatCurrency(netPay)}</td>
                    <td>
                        <span class="employee-status ${employee.status}">
                            <i class="fas ${getStatusIcon(employee.status)}"></i>
                            ${employee.status.replace('_', ' ')}
                        </span>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn" onclick="viewPayrollDetails(${employee.id})" title="View Details">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="table-action-btn" onclick="editEmployee(${employee.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="table-action-btn" onclick="generatePayslip(${employee.id})" title="Generate Payslip">
                                <i class="fas fa-file-alt"></i>
                            </button>
                            <button class="table-action-btn delete" onclick="deleteEmployee(${employee.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });

        payrollTableBody.innerHTML = html;

        // Update pagination info
        const totalEmployees = filteredEmployees.length;
        const showingStart = totalEmployees > 0 ? startIndex + 1 : 0;
        const showingEnd = Math.min(endIndex, totalEmployees);
        
        document.getElementById('showingStart').textContent = showingStart;
        document.getElementById('showingEnd').textContent = showingEnd;
        document.getElementById('totalEmployeesCount').textContent = totalEmployees;
    }

    // Get status icon
    function getStatusIcon(status) {
        const icons = {
            'active': 'fa-check-circle',
            'inactive': 'fa-times-circle',
            'on_leave': 'fa-calendar-times'
        };
        return icons[status] || 'fa-question-circle';
    }

    // Render pagination
    function renderPagination() {
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        
        prevPage.disabled = currentPage === 1;
        nextPage.disabled = currentPage === totalPages || totalPages === 0;

        let paginationHTML = '';
        const maxVisiblePages = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="page-number ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        }

        pageNumbers.innerHTML = paginationHTML;
    }

    // Global functions
    window.goToPage = function(page) {
        currentPage = page;
        renderEmployees();
        renderPagination();
    };

    window.viewPayrollDetails = async function(id) {
        const employee = await fetch(`/api/payroll/employees/${id}/`).then(res => res.json());
        if (employee) {
            showPayrollDetails(employee);
        }
    };

    window.editEmployee = async function(id) {
        const employee = await fetch(`/api/payroll/employees/${id}/`).then(res => res.json());
        if (employee) {
            populateEmployeeForm(employee);
            addEmployeeModal.classList.add('active');
        }
    };

    window.generatePayslip = async function(id) {
        const employee = await fetch(`/api/payroll/employees/${id}/`).then(res => res.json());
        if (employee) {
            showPayslip(employee);
        }
    };

    window.deleteEmployee = async function(id) {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                const response = await fetch(`/api/payroll/employees/${id}/`, { method: 'DELETE' });
                if (response.ok) {
                    await applyFilters();
                    alert('Employee deleted successfully!');
                } else {
                    alert('Failed to delete employee.');
                }
            } catch (error) {
                console.error('Error deleting employee:', error);
                alert('An error occurred while deleting the employee.');
            }
        }
    };

    // Show payroll details
    function showPayrollDetails(employee) {
        const allowances = calculateAllowances(employee);
        const deductions = calculateDeductions(employee);
        const netPay = calculateNetPay(employee);

        const detailsHtml = `
            <div class="detail-section">
                <h4>Employee Information</h4>
                <div class="detail-item">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${employee.name}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Employee ID:</span>
                    <span class="detail-value">${employee.employee_id}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${employee.department}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Position:</span>
                    <span class="detail-value">${employee.position}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">${formatDate(employee.start_date)}</span>
                </div>
            </div>
            <div class="detail-section">
                <h4>Salary Breakdown</h4>
                <div class="detail-item">
                    <span class="detail-label">Basic Salary:</span>
                    <span class="detail-value">KSh ${formatCurrency(employee.basic_salary)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Housing Allowance:</span>
                    <span class="detail-value">KSh ${formatCurrency(employee.housing_allowance)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Transport Allowance:</span>
                    <span class="detail-value">KSh ${formatCurrency(employee.transport_allowance)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Medical Allowance:</span>
                    <span class="detail-value">KSh ${formatCurrency(employee.medical_allowance)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Total Deductions:</span>
                    <span class="detail-value">KSh ${formatCurrency(deductions.total)}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Net Pay:</span>
                    <span class="detail-value">KSh ${formatCurrency(netPay)}</span>
                </div>
            </div>
        `;

        const actionsHtml = `
            <button class="action-btn view-payslip" onclick="generatePayslip(${employee.id})">
                <i class="fas fa-file-alt"></i> Generate Payslip
            </button>
            <button class="action-btn edit" onclick="editEmployee(${employee.id})">
                <i class="fas fa-edit"></i> Edit Employee
            </button>
        `;

        document.getElementById('payrollDetailsContent').innerHTML = detailsHtml;
        document.getElementById('payrollActions').innerHTML = actionsHtml;
        document.getElementById('payrollDetailsModal').classList.add('active');
    }

    // Show payslip
    function showPayslip(employee) {
        const allowances = calculateAllowances(employee);
        const deductions = calculateDeductions(employee);
        const grossSalary = employee.basic_salary + allowances;
        const netPay = calculateNetPay(employee);

        const payslipHtml = `
            <div class="payslip-container">
                <div class="payslip-header">
                    <h2>InspireWear</h2>
                    <p>P.O. Box 12345, Nairobi, Kenya</p>
                    <div class="payslip-period">Payslip for January 2025</div>
                </div>
                
                <div class="payslip-employee-info">
                    <div>
                        <h4>Employee Details</h4>
                        <p><strong>Name:</strong> ${employee.name}</p>
                        <p><strong>Employee ID:</strong> ${employee.employee_id}</p>
                        <p><strong>Department:</strong> ${employee.department}</p>
                        <p><strong>Position:</strong> ${employee.position}</p>
                        <p><strong>KRA PIN:</strong> ${employee.kra_pin}</p>
                    </div>
                    <div>
                        <h4>Bank Details</h4>
                        <p><strong>Bank:</strong> ${employee.bank_name}</p>
                        <p><strong>Account:</strong> ${employee.account_number}</p>
                        <p><strong>Payment Date:</strong> ${formatDate(new Date())}</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                    <div class="payslip-earnings">
                        <h4>Earnings</h4>
                        <div class="payslip-item">
                            <span>Basic Salary</span>
                            <span>KSh ${formatCurrency(employee.basic_salary)}</span>
                        </div>
                        <div class="payslip-item">
                            <span>Housing Allowance</span>
                            <span>KSh ${formatCurrency(employee.housing_allowance)}</span>
                        </div>
                        <div class="payslip-item">
                            <span>Transport Allowance</span>
                            <span>KSh ${formatCurrency(employee.transport_allowance)}</span>
                        </div>
                        <div class="payslip-item">
                            <span>Medical Allowance</span>
                            <span>KSh ${formatCurrency(employee.medical_allowance)}</span>
                        </div>
                        <div class="payslip-item" style="font-weight: bold; border-top: 2px solid #3498db; margin-top: 0.5rem; padding-top: 0.5rem;">
                            <span>Gross Salary</span>
                            <span>KSh ${formatCurrency(grossSalary)}</span>
                        </div>
                    </div>
                    
                    <div class="payslip-deductions">
                        <h4>Deductions</h4>
                        <div class="payslip-item">
                            <span>PAYE Tax</span>
                            <span>KSh ${formatCurrency(deductions.paye)}</span>
                        </div>
                        <div class="payslip-item">
                            <span>NSSF</span>
                            <span>KSh ${formatCurrency(deductions.nssf)}</span>
                        </div>
                        <div class="payslip-item">
                            <span>NHIF</span>
                            <span>KSh ${formatCurrency(deductions.nhif)}</span>
                        </div>
                        <div class="payslip-item" style="font-weight: bold; border-top: 2px solid #e74c3c; margin-top: 0.5rem; padding-top: 0.5rem;">
                            <span>Total Deductions</span>
                            <span>KSh ${formatCurrency(deductions.total)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="payslip-total">
                    <h3>Net Pay: KSh ${formatCurrency(netPay)}</h3>
                </div>
            </div>
        `;

        // Create a new modal for payslip
        const payslipModal = document.createElement('div');
        payslipModal.className = 'modal-overlay';
        payslipModal.innerHTML = `
            <div class="modal large">
                <div class="modal-header">
                    <h3>Payslip - ${employee.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${payslipHtml}
                    <div style="text-align: center; margin-top: 1rem;">
                        <button class="btn-primary" onclick="printPayslip()">
                            <i class="fas fa-print"></i> Print Payslip
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(payslipModal);
        payslipModal.classList.add('active');

        // Add close functionality
        payslipModal.querySelector('.modal-close').addEventListener('click', function() {
            payslipModal.remove();
        });

        payslipModal.addEventListener('click', function(e) {
            if (e.target === this) {
                payslipModal.remove();
            }
        });
    }

    // Print payslip function
    window.printPayslip = function() {
        window.print();
    };

    // Populate employee form for editing
    function populateEmployeeForm(employee) {
        document.getElementById('employeeName').value = employee.name;
        document.getElementById('employeeId').value = employee.employee_id;
        document.getElementById('employeeEmail').value = employee.email;
        document.getElementById('employeePhone').value = employee.phone;
        document.getElementById('employeeNationalId').value = employee.national_id;
        document.getElementById('employeeKraPin').value = employee.kra_pin;
        document.getElementById('employeeDepartment').value = employee.department;
        document.getElementById('employeePosition').value = employee.position;
        document.getElementById('employeeStartDate').value = employee.start_date;
        document.getElementById('employeeStatus').value = employee.status;
        document.getElementById('basicSalary').value = employee.basic_salary;
        document.getElementById('housingAllowance').value = employee.housing_allowance;
        document.getElementById('transportAllowance').value = employee.transport_allowance;
        document.getElementById('medicalAllowance').value = employee.medical_allowance;
        document.getElementById('bankName').value = employee.bank_name;
        document.getElementById('accountNumber').value = employee.account_number;
    }

    // Event Listeners
    searchEmployees.addEventListener('input', applyFilters);
    filterDepartment.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);

    clearFilters.addEventListener('click', function() {
        searchEmployees.value = '';
        filterDepartment.value = '';
        filterStatus.value = '';
        applyFilters();
    });

    // Sorting functionality
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const column = this.dataset.column;
            
            if (sortColumn === column) {
                sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                sortColumn = column;
                sortDirection = 'asc';
            }

            document.querySelectorAll('.sort-icon').forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            this.className = `fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'} sort-icon active`;

            applyFilters();
        });
    });

    // Pagination navigation
    prevPage.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderEmployees();
            renderPagination();
        }
    });

    nextPage.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderEmployees();
            renderPagination();
        }
    });

    // Process payroll functionality
    processPayroll.addEventListener('click', function() {
        document.getElementById('processPayrollModal').classList.add('active');
    });

    document.getElementById('processPayrollForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const selectedEmployees = document.querySelectorAll('.employee-checkbox:checked');
        if (selectedEmployees.length === 0) {
            alert('Please select employees to process payroll for.');
            return;
        }

        if (confirm(`Process payroll for ${selectedEmployees.length} employee(s)?`)) {
            const employeeIds = Array.from(selectedEmployees).map(cb => cb.dataset.id);
            try {
                const response = await fetch('/api/payroll/process/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ employee_ids: employeeIds }),
                });

                if (response.ok) {
                    await applyFilters();
                    document.getElementById('processPayrollModal').classList.remove('active');
                    alert('Payroll processed successfully!');
                } else {
                    alert('Failed to process payroll.');
                }
            } catch (error) {
                console.error('Error processing payroll:', error);
                alert('An error occurred while processing payroll.');
            }
        }
    });

    // Export functionality
    exportPayroll.addEventListener('click', function() {
        const selectedCheckboxes = document.querySelectorAll('.employee-checkbox:checked');
        const selectedIds = Array.from(selectedCheckboxes).map(cb => parseInt(cb.dataset.id));
        
        let dataToExport = filteredEmployees;
        if (selectedIds.length > 0) {
            dataToExport = filteredEmployees.filter(emp => selectedIds.includes(emp.id));
        }

        exportToCSV(dataToExport);
    });

    // Export to CSV function
    function exportToCSV(data) {
        const headers = ['Employee ID', 'Name', 'Department', 'Position', 'Basic Salary (KSh)', 'Allowances (KSh)', 'Deductions (KSh)', 'Net Pay (KSh)', 'Status'];
        const csvContent = [
            headers.join(','),
            ...data.map(employee => {
                const allowances = calculateAllowances(employee);
                const deductions = calculateDeductions(employee);
                const netPay = calculateNetPay(employee);
                
                return [
                    employee.employee_id,
                    `"${employee.name}"`,
                    employee.department,
                    `"${employee.position}"`,
                    employee.basic_salary,
                    allowances,
                    deductions.total,
                    netPay,
                    employee.status
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `payroll_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('financeTheme', newTheme);

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

    document.addEventListener('click', function() {
        profileBtn.setAttribute('aria-expanded', 'false');
        profileDropdown.classList.remove('show');
    });

    // Modal Functions
    addEmployeeBtn.addEventListener('click', function() {
        addEmployeeForm.reset();
        addEmployeeModal.classList.add('active');
    });

    modalClose.addEventListener('click', function() {
        addEmployeeModal.classList.remove('active');
    });

    cancelAddEmployee.addEventListener('click', function() {
        addEmployeeModal.classList.remove('active');
    });

    addEmployeeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(addEmployeeForm);
        const employeeData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/payroll/employees/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });

            if (response.ok) {
                await applyFilters();
                addEmployeeModal.classList.remove('active');
                alert('Employee added successfully!');
            } else {
                alert('Failed to add employee.');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('An error occurred while adding the employee.');
        }
    });

    // Close modals when clicking outside
    addEmployeeModal.addEventListener('click', function(e) {
        if (e.target === this) {
            addEmployeeModal.classList.remove('active');
        }
    });

    document.getElementById('payrollDetailsModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    document.getElementById('processPayrollModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Modal close buttons
    document.getElementById('detailsModalClose').addEventListener('click', function() {
        document.getElementById('payrollDetailsModal').classList.remove('active');
    });

    document.getElementById('processModalClose').addEventListener('click', function() {
        document.getElementById('processPayrollModal').classList.remove('active');
    });

    document.getElementById('cancelProcessPayroll').addEventListener('click', function() {
        document.getElementById('processPayrollModal').classList.remove('active');
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('financeTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
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