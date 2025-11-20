from django.db import models
from customers.models import Customer

class LoyaltyMember(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    tier = models.CharField(max_length=50, default='silver')
    last_activity = models.DateField(auto_now=True)

    def __str__(self):
        return f'{self.customer.first_name} {self.customer.last_name} - {self.points} points'

class Reward(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    points = models.IntegerField()
    category = models.CharField(max_length=50)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='rewards/', blank=True, null=True)

    def __str__(self):
        return self.name
