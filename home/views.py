from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
from home import process
import json, calendar, datetime
#from datetime import datetime, timedelta, date
#from collections import OrderedDict


@login_required #(redirect_field_name='login/')
def index(request):
    if 'alerts' not in request.session:
        request.session['alerts'] = "show"
        request.session.modified = True

    if 'pgt' in request.session:
        data = process.graph3(request)
    else:
        data = {"session":"expired"}
        data["reporting"]  = {}
        data["comparison"] = {}
    #return HttpResponse(json.dumps(data))
    return render_to_response('home/index.html',{
                "page"       : "home", 
                "user"       : request.user, 
                "alerts"     : request.session['alerts'],
                "reporting"  : data["reporting"],
                "comparison" : data["comparison"]
           }, context_instance=RequestContext(request))

def hide_alerts(request):
    #     if not request.is_ajax() or not request.method=='POST':
    #         return HttpResponseNotAllowed(['POST'])
    request.session['alerts'] = 'hide'
    request.session.modified = True
    return HttpResponse(request.session['alerts'])

def show_alerts(request):
    #     if not request.is_ajax() or not request.method=='POST':
    #         return HttpResponseNotAllowed(['POST'])
    request.session['alerts'] = 'show'
    request.session.modified = True
    return HttpResponse(request.session['alerts'])

def graph1(request):
    #months = int(request.GET["months"])
    if 'pgt' in request.session:
        data = process.graph1(request)
    else:
        data = {"session":"expired"}
    return HttpResponse(json.dumps(data))

def graph2(request):
    #months = int(request.GET["months"])
    if 'pgt' in request.session:
        data = process.graph2(request)
    else:
        data = {"session":"expired"}    
    return HttpResponse(json.dumps(data))
