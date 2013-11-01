from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
import json

@login_required #(redirect_field_name='login/')
def index(request):
    if not request.session['alerts']:
        request.session['alerts'] = "show"
    return render_to_response('home/index.html',{"page":"home", "user":request.user, "alerts":request.session['alerts']}, context_instance=RequestContext(request))

def hide_alerts(request):
    #     if not request.is_ajax() or not request.method=='POST':
    #         return HttpResponseNotAllowed(['POST'])

    request.session['alerts'] = 'hide'
    return HttpResponse(request.session['alerts'])

def show_alerts(request):
    #     if not request.is_ajax() or not request.method=='POST':
    #         return HttpResponseNotAllowed(['POST'])

    request.session['alerts'] = 'show'
    return HttpResponse(request.session['alerts'])
    