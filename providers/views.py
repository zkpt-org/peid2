from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *

@login_required
def index(request):
    return render_to_response('providers/index.html',{"page":"providers", "user":request.user},context_instance=RequestContext(request))
