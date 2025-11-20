from django.db import models

class Transaction(models.Model):
    date = models.DateField()
    description = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=50) # 'income' or 'expense'
    status = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.description} - {self.amount}'
