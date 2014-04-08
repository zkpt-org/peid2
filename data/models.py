from django.db import models

class ProxyTicket(models.Model):
    ticket_iou = models.CharField(max_length=64)
    ticket_id  = models.CharField(max_length=64)
    created    = models.DateTimeField(auto_now_add=True)
    
    def json(self):
        from collections import OrderedDict
        return OrderedDict((
            ('id', self.id),
            ('ticket_iou', self.ticket_iou),
            ('ticket_id', self.ticket_id),
        ))
        
class Cohort(models.Model):
    cohort_id = models.CharField(max_length=64)
    traits    = models.TextField()
    
    def json(self):
        from collections import OrderedDict
        return OrderedDict((
            ('id', self.id),
            ('cohort_id', self.cohort_id),
            ('traits', self.traits),
        ))