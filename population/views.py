from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from django.core.exceptions import ObjectDoesNotExist
from data.das import Das
from tind.functions import conditions
import json

@login_required
def index(request):
    das = Das(session=request.session)
    
    return render_to_response('population/index.html',{
                "page":"population",
                "user":request.user, 
                "conditions" : conditions(das)
            }, context_instance=RequestContext(request))

@login_required            
def graph1(request):
    das = Das(session=request.session)
    try:
        data = Graph1.objects.get(
            client     = request.GET["client"],
            office     = request.GET["office"],
            level      = request.GET["level"],
            relation   = request.GET["relation"],
            gender     = request.GET["gender"],
            age        = request.GET["age"],
            condition  = request.GET["condition"],
            start_date = request.GET["reportingFrom"],
            end_date   = request.GET["reportingTo"]).data
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            data = process.graph1(das, request)
            #             graph = Graph1(
            #                 client     = request.GET["client"], 
            #                 office     = request.GET["office"],	
            #                 level      = request.GET["level"],
            #                 relation   = request.GET["relation"], 
            #                 condition  = request.GET["condition"], 
            #                 gender     = request.GET["gender"],	
            #                 age        = request.GET["age"], 
            #                 start_date = request.GET["reportingFrom"],	
            #                 end_date   = request.GET["reportingTo"], 
            #                 data       = json.dumps(data))
            #             graph.save()
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)

