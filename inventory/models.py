from django.db import models

class Item(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    size = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    stock = models.IntegerField()
    reorder_level = models.IntegerField()
    value = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
