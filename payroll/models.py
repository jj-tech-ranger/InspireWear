from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=255)
    employee_id = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    national_id = models.CharField(max_length=50)
    kra_pin = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    start_date = models.DateField()
    status = models.CharField(max_length=50)
    basic_salary = models.DecimalField(max_digits=10, decimal_places=2)
    housing_allowance = models.DecimalField(max_digits=10, decimal_places=2)
    transport_allowance = models.DecimalField(max_digits=10, decimal_places=2)
    medical_allowance = models.DecimalField(max_digits=10, decimal_places=2)
    bank_name = models.CharField(max_length=100)
    account_number = models.CharField(max_length=100)
    payroll_status = models.CharField(max_length=50)

    def __str__(self):
        return self.name
