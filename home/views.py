from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
import json

@login_required #(redirect_field_name='login/')
def index(request):
    return render_to_response('home/index.html',{"page":"home", "user":request.user}, context_instance=RequestContext(request))