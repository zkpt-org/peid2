from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
from data import queue
from tind.functions import conditions
from home import process
import json, calendar, datetime
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponseRedirect
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
        data = process.graph3_init()        
    else:
        data = {"session":"expired"}
        return HttpResponseRedirect("/login/")
        
    return render_to_response('home/index.html',{
                "page"       : "home", 
                "user"       : request.user, 
                "alerts"     : request.session['alerts'],
                "reporting"  : data["reporting"],
                "comparison" : data["comparison"],
                "conditions" : conditions(das)
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
            data = queue.send(process.graph1, (das, request.GET), timeout=600)
            # data = process.graph1(das, request)
            graph = Graph1(
                client     = request.GET["client"], 
                office     = request.GET["office"],	
                level      = request.GET["level"],
                relation   = request.GET["relation"], 
                condition  = request.GET["condition"], 
                gender     = request.GET["gender"],	
                age        = request.GET["age"], 
                start_date = request.GET["reportingFrom"],	
                end_date   = request.GET["reportingTo"], 
                data       = json.dumps(data))
            graph.save()
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)
    

@login_required
def graph2(request):    
    das = Das(session=request.session)
    try:
        data = Graph2.objects.get(
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
            data = queue.send(process.graph2, (das, request.GET), timeout=600)
            # data  = process.graph2(das, request.GET)
            graph = Graph2(
                client     = request.GET["client"], 
                office     = request.GET["office"],	
                level      = request.GET["level"],
                relation   = request.GET["relation"], 
                condition  = request.GET["condition"], 
                gender     = request.GET["gender"],	
                age        = request.GET["age"], 
                start_date = request.GET["reportingFrom"],	
                end_date   = request.GET["reportingTo"], 
                data       = json.dumps(data))
            graph.save()
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)
    
    

@login_required
def graph3(request):
    das = Das(session=request.session)
    try:
        data = Graph3.objects.get(
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
            data = queue.send(process.graph3, (das, request.GET), timeout=600)
            # data = process.graph3(das, request)
            
            graph = Graph3(
                client     = request.GET["client"], 
                office     = request.GET["office"],	
                level      = request.GET["level"],
                relation   = request.GET["relation"], 
                condition  = request.GET["condition"], 
                gender     = request.GET["gender"],	
                age        = request.GET["age"], 
                start_date = request.GET["reportingFrom"],	
                end_date   = request.GET["reportingTo"], 
                data       = json.dumps(data))
            graph.save()
        else:
            data = {"session":"expired"}    
        return HttpResponse(json.dumps(data))
    return HttpResponse(data)
    
@login_required
def graph4(request):
    das = Das(session=request.session)
    try:
        data = Graph4.objects.get(
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
            data = queue.send(process.graph4, (das, request.GET), timeout=600)
            # data = process.graph4(das, request)
            
            graph = Graph4(
                client     = request.GET["client"], 
                office     = request.GET["office"],	
                level      = request.GET["level"],
                relation   = request.GET["relation"],
                condition  = request.GET["condition"], 
                gender     = request.GET["gender"],	
                age        = request.GET["age"], 
                start_date = request.GET["reportingFrom"],	
                end_date   = request.GET["reportingTo"], 
                data       = data)
            graph.save()
        else:
            data = {"session":"expired"}    
    return HttpResponse(data)
