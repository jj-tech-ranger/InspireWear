from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    contact_person = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    location = models.CharField(max_length=100)
    payment_terms = models.IntegerField()
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)
    join_date = models.DateField()
    last_order = models.DateField(null=True, blank=True)
    total_orders = models.IntegerField(default=0)
    rating = models.FloatField(null=True, blank=True)

    def __str__(self):
        return self.name
