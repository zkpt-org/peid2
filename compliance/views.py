from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from models import *
import json

def index(request):
    return render_to_response('compliance/index.html',{"page":"compliance"}, context_instance=RequestContext(request))