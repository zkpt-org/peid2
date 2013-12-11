from django.db import models

# Create your models here.
class ProxyTicket(models.Model):
    proxy_ticket_iou = models.CharField(max_length=32)
    proxy_ticket_id  = models.CharField(max_length=32)
    created = models.DateTimeField(auto_now_add=True)
