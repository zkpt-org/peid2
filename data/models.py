from django.db import models

# Create your models here.
class ProxyTicket(models.Model):
    ticket_iou = models.CharField(max_length=32)
    ticket_id  = models.CharField(max_length=32)
    created    = models.DateTimeField(auto_now_add=True)
