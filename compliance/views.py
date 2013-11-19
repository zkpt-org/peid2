from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
import json

@login_required
def index(request):
    return render_to_response('compliance/index.html',{"page":"compliance", "user":request.user, "loop":[i for i in range(5)]}, context_instance=RequestContext(request))