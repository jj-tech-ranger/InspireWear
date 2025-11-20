from django.db import models
from customers.models import Customer
from products.models import Product

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_date = models.DateField()
    expected_delivery = models.DateField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    priority = models.CharField(max_length=50)
    status = models.CharField(max_length=50)

    def __str__(self):
        return f'Order {self.id} for {self.customer}'

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()

    def __str__(self):
        return f'{self.quantity} of {self.product.name}'
