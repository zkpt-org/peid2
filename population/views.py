from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from django.core.exceptions import ObjectDoesNotExist
from data.das import Das
from tind.functions import conditions
from population import process
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
        data = Graph1().find(request.GET)
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            data = process.graph1(das, request.GET)
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)

