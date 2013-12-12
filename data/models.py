from django.db import models

# Create your models here.
class ProxyTicket(models.Model):
    ticket_iou = models.CharField(max_length=32)
    ticket_id  = models.CharField(max_length=32)
    created    = models.DateTimeField(auto_now_add=True)
    
    def json(self):
        from collections import OrderedDict
        return OrderedDict((
            ('id', self.id),
            ('ticket_iou', self.ticket_iou),
            ('ticket_id', self.ticket_id),
            ('created', self.created),
        ))