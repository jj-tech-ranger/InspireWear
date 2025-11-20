from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    assignee = models.CharField(max_length=255)
    priority = models.CharField(max_length=50)
    due_date = models.DateField()
    status = models.CharField(max_length=50)
    progress = models.IntegerField(default=0)
    tags = models.CharField(max_length=255, blank=True, null=True)
    created_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.title
