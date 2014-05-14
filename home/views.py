from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
from data import queue
from data.functions import conditions
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
    try:
        data = Graph1().find(request.GET)
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            das = Das(session=request.session)
            # data = queue.send(process.graph1, (das, request.GET), request.session, priority="high")
            data = process.graph1(das, request.GET)
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))
                
    return HttpResponse(data)

@login_required
def graph2(request):
    try:
        data = Graph2().find(request.GET)
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            das  = Das(session=request.session)
            data = queue.send(process.graph2, (das, request.GET), request.session)
            # data = process.graph2(das, request.GET)
        else:
            data = {"session":"expired"}
        return HttpResponse(json.dumps(data))

    return HttpResponse(data)

@login_required
def graph3(request):
    try:
        data = Graph3().find(request.GET)
            
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            das = Das(session=request.session)
            # data = queue.send(process.graph3, (das, request.GET), request.session, priority="high")
            data = process.graph3(das, request.GET)
        else:
            data = {"session":"expired"}    
        return HttpResponse(json.dumps(data))
    
    return HttpResponse(data)
    
@login_required
def graph4(request):
    try:
        data = Graph4().find(request.GET)
    
    except ObjectDoesNotExist:
        if 'pgt' in request.session:
            das  = Das(session=request.session)
            data = queue.send(process.graph4, (das, request.GET), request.session, priority="low")
        else:
            data = {"session":"expired"}
    
    return HttpResponse(data)
