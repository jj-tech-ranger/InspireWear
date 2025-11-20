from django.db import models

class Campaign(models.Model):
    name = models.CharField(max_length=255)
    recipients = models.IntegerField()
    status = models.CharField(max_length=50)
    date = models.DateField(null=True, blank=True)
    open_rate = models.FloatField(null=True, blank=True)
    click_rate = models.FloatField(null=True, blank=True)
    type = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Template(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    preview_url = models.CharField(max_length=255)

    def __str__(self):
        return self.name
