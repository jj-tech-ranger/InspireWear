from django.db import models
from products.models import Product

class Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant_name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, unique=True)
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    location = models.CharField(max_length=100)
    status = models.CharField(max_length=50)
    notes = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to='variants/', blank=True, null=True)

    def __str__(self):
        return self.variant_name
