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

class TopProcedures(models.Model):
    description = models.CharField(max_length=128)
    grouper     = models.CharField(max_length=10)
    cost        = models.DecimalField(max_digits=20, decimal_places=2)
    count       = models.IntegerField()
    start_date  = models.CharField(max_length=10, default="")
    end_date    = models.CharField(max_length=10, default="")    
    
    def json(self):
        from collections import OrderedDict
        return OrderedDict((
            ('id', self.id),
            ('description', self.description),
            ('grouper', self.grouper),
            ('cost', self.cost),
            ('count', self.count),
            ('start_date', self.start_date),
            ('end_date', self.end_date)
        ))