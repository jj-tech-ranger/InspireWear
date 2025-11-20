from django.db import models

class Customer(models.Model):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    location = models.CharField(max_length=100)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    last_purchase = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, default='active')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
