# from django.db import models
from django.db import models

class TimeStampedModel(models.Model):
    """Abstract base class model that provides self.updating 'created' and 'modified' fields."""
    created  = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True
        
class ProcessedGraphData(TimeStampedModel):
    client     = models.CharField(max_length=64, default="ALL") 
    office     = models.CharField(max_length=64, default="ALL")
    level      = models.CharField(max_length=64, default="ALL")
    condition  = models.CharField(max_length=64, default="ALL")
    gender     = models.CharField(max_length=8,  default="ALL")
    age        = models.CharField(max_length=8,  default="ALL")
    start_date = models.CharField(max_length=10, default="")
    end_date   = models.CharField(max_length=10, default="")
    data       = models.TextField()
    
    def date(self, date_str):
        import datetime
        if len(date_str) == 10:
             return datetime.datetime.strptime(date_str, "%Y-%m-%d")
        elif len(date_str) > 10:
            return datetime.datetime.strptime(date_str, "%Y-%m-%d %H:%M")
    
    def json(self):
        #from collections import OrderedDict
        #return OrderedDict((data))
        return self.data
    
    class Meta:
        abstract = True