from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
from data import queue
from home import process
import json, calendar, datetime
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
#from django.views.decorators.cache import never_cache
#from collections import OrderedDict

#@never_cache
@login_required
def index(request):
    if 'alerts' not in request.session:
        request.session['alerts'] = "hide"
        request.session.modified = True
    
    das = Das(session=request.session)
    
    if 'pgt' in request.session:
        #data = process.graph3(das, request)
        data = process.graph3_init()
    else:
        data = {"session":"expired"}
        #data["reporting"]  = {}
        #data["comparison"] = {}
    #return HttpResponse(json.dumps(data))
    return render_to_response('home/index.html',{
                "page"       : "home", 
                "user"       : request.user, 
                "alerts"     : request.session['alerts'],
                "reporting"  : data["reporting"],
                "comparison" : data["comparison"]
           }, context_instance=RequestContext(request))

def hide_alerts(request):
    request.session['alerts'] = 'hide'
    request.session.modified = True
    return HttpResponse(request.session['alerts'])

def show_alerts(request):
    request.session['alerts'] = 'show'
    request.session.modified = True
    return HttpResponse(request.session['alerts'])

@login_required
def graph1(request):
    das = Das(session=request.session)
    try:
        data = Graph1.objects.get(
            client = request.GET["client"],
            office = request.GET["office"],
            level  = request.GET["level"],
            gender = request.GET["gender"],
            age    = request.GET["age"],
            condition  = request.GET["condition"],
            start_date = request.GET["reportingFrom"],
            end_date   = request.GET["reportingTo"]).data
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            data = process.graph1(das, request)
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)
    

@login_required
def graph2(request):
    #months = int(request.GET["months"])
    #data = process.graph2(request.GET, request.session)
    #data = queue.send(process.graph2, (request.GET, request.session), 600)
    das = Das(session=request.session)
    try:
        data = Graph2.objects.get(
            client = request.GET["client"],
            office = request.GET["office"],
            level  = request.GET["level"],
            gender = request.GET["gender"],
            age    = request.GET["age"],
            condition  = request.GET["condition"],
            start_date = request.GET["reportingFrom"],
            end_date   = request.GET["reportingTo"]).data
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            data = process.graph2(das, request)
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)
    
    

@login_required
def graph3(request):
    das = Das(session=request.session)
    if 'pgt' in request.session:
        data = process.graph3(das, request)
    else:
        data = {"session":"expired"}    
    return HttpResponse(json.dumps(data))
    
@login_required
def graph4(request):
    das = Das(session=request.session)
    try:
        data = Graph4.objects.get(
            client = request.GET["client"],
            office = request.GET["office"],
            level  = request.GET["level"],
            gender = request.GET["gender"],
            age    = request.GET["age"],
            condition  = request.GET["condition"],
            start_date = request.GET["reportingFrom"],
            end_date   = request.GET["reportingTo"]).data
    
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            data = process.graph4(das, request)
        else:
            data = {"session":"expired"}    
    return HttpResponse(data)
