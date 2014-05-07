# from django.db import models
import json
from django.db import models
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

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
    relation   = models.CharField(max_length=64, default="ALL")
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
    
    def insert(self, params, data):
        self.client     = params["client"]
        self.office     = params["office"]	
        self.level      = params["level"]
        self.relation   = params["relation"]
        self.condition  = params["condition"]
        self.gender     = params["gender"]	
        self.age        = params["age"]
        self.start_date = params["reportingFrom"]
        self.end_date   = params["reportingTo"]
        self.data       = json.dumps(data)
        self.save()
    
    def find(self, params):
        try:
            data = self._default_manager.get(
                client     = params["client"],
                office     = params["office"],
                level      = params["level"],
                relation   = params["relation"],
                gender     = params["gender"],
                age        = params["age"],
                condition  = params["condition"],
                start_date = params["reportingFrom"],
                end_date   = params["reportingTo"]).data
        except MultipleObjectsReturned:
            data = self._default_manager.filter(
                client     = params["client"],
                office     = params["office"],
                level      = params["level"],
                relation   = params["relation"],
                gender     = params["gender"],
                age        = params["age"],
                condition  = params["condition"],
                start_date = params["reportingFrom"],
                end_date   = params["reportingTo"])[0].data
        return data
    
    def find_or_create(self, params, d):
        graph, created = self._default_manager.get_or_create(                
            client     = params["client"],
            office     = params["office"],
            level      = params["level"],
            relation   = params["relation"],
            gender     = params["gender"],
            age        = params["age"],
            condition  = params["condition"],
            start_date = params["reportingFrom"],
            end_date   = params["reportingTo"],
            data       = json.dumps(d))
        return graph
    
    class Meta:
        abstract = True