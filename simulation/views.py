from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
import json

#@login_required
def index(request):
    return render_to_response('simulation/index.html',{"page":"simulation", "user":request.user}, context_instance=RequestContext(request))