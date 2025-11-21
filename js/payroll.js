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
            await updateSummary();
            await applyFilters();
        } catch (error) {
            console.error('Error initializing page:', error);
        } finally {
            setTimeout(() => {
                morphOverlay.classList.remove('active');
            }, 1000);
        }
    }

    async function updateSummary() {
        try {
            const summary = await fetch('/api/payroll/summary/').then(res => res.json());
            document.getElementById('totalPayroll').textContent = formatCurrency(summary.total_payroll);
            document.getElementById('activeEmployees').textContent = summary.active_employees;
            document.getElementById('processedPayroll').textContent = formatCurrency(summary.processed_payroll);
            document.getElementById('pendingPayroll').textContent = formatCurrency(summary.pending_payroll);
        } catch (error) {
            console.error('Error updating summary:', error);
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

    // Apply filters and search
    async function applyFilters() {
        const params = new URLSearchParams({
            search: searchEmployees.value.toLowerCase(),
            department: filterDepartment.value,
            status: filterStatus.value,
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
            html += `
                <tr data-id="${employee.id}">
                    <td><input type="checkbox" class="employee-checkbox" data-id="${employee.id}"></td>
                    <td>
                        <div class="employee-info">
                            <div class="employee-avatar">${getInitials(employee.name)}</div>
                            <div class="employee-details">
                                <div class="employee-name">${employee.name}</div>
                                <div class="employee-id">${employee.employee_id}</div>
                            </div>
                        </div>
                    </td>
                    <td><span class="department-badge ${employee.department.toLowerCase()}">${employee.department}</span></td>
                    <td>${employee.position}</td>
                    <td class="salary-amount">KSh ${formatCurrency(employee.basic_salary)}</td>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td><span class="employee-status ${employee.status}">${employee.status.replace('_', ' ')}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="table-action-btn edit-btn" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="table-action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        payrollTableBody.innerHTML = html;
        attachTableEventListeners();
        updatePaginationInfo();
    }

    function attachTableEventListeners() {
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const employeeId = this.closest('tr').dataset.id;
                editEmployee(employeeId);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const employeeId = this.closest('tr').dataset.id;
                deleteEmployee(employeeId);
            });
        });
    }

    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
        document.getElementById('paginationInfo').textContent = `Showing ${currentPage} of ${totalPages} pages`;
    }

    async function editEmployee(employeeId) {
        try {
            const employee = await fetch(`/api/payroll/employees/${employeeId}/`).then(res => res.json());
            // Populate form
            addEmployeeForm.dataset.editId = employeeId;
            // ... populate all form fields
            addEmployeeModal.classList.add('active');
        } catch (error) {
            console.error('Error fetching employee for edit:', error);
        }
    }

    async function deleteEmployee(employeeId) {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await fetch(`/api/payroll/employees/${employeeId}/`, { method: 'DELETE' });
                await applyFilters();
                await updateSummary();
                alert('Employee deleted successfully.');
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    }

    // Modal Functions
    addEmployeeBtn.addEventListener('click', () => {
        addEmployeeForm.reset();
        delete addEmployeeForm.dataset.editId;
        addEmployeeModal.classList.add('active');
    });
    modalClose.addEventListener('click', () => addEmployeeModal.classList.remove('active'));
    cancelAddEmployee.addEventListener('click', () => addEmployeeModal.classList.remove('active'));

    addEmployeeForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const employeeId = this.dataset.editId;
        const method = employeeId ? 'PUT' : 'POST';
        const url = employeeId ? `/api/payroll/employees/${employeeId}/` : '/api/payroll/employees/';

        const formData = new FormData(addEmployeeForm);
        const employeeData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(employeeData),
            });
            if (!response.ok) throw new Error('Failed to save employee.');
            
            addEmployeeModal.classList.remove('active');
            await applyFilters();
            await updateSummary();
            alert(`Employee ${employeeId ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error('Error saving employee:', error);
            alert('Error saving employee.');
        }
    });

    // Event Listeners
    searchEmployees.addEventListener('input', applyFilters);
    filterDepartment.addEventListener('change', applyFilters);
    filterStatus.addEventListener('change', applyFilters);
    clearFilters.addEventListener('click', () => {
        searchEmployees.value = '';
        filterDepartment.value = '';
        filterStatus.value = '';
        applyFilters();
    });

    // Theme Toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('financeTheme', newTheme);
        const icon = this.querySelector('.theme-icon');
        icon.className = `theme-icon fas ${newTheme === 'light' ? 'fa-moon' : 'fa-sun'}`;
    });

    // Initial page load
    initPage();
});
