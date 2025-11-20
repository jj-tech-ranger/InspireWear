from django.db import models

class Activity(models.Model):
    time = models.DateTimeField()
    activity = models.CharField(max_length=255)
    location = models.CharField(max_length=100)
    staff = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)

    def __str__(self):
        return self.activity
