from django.db import models

class Notification(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    module = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    priority = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    sender = models.CharField(max_length=100)
    recipient = models.CharField(max_length=100)

    def __str__(self):
        return self.title
