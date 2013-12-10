# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.conf import settings
from data.das import Das

# @login_required
def index(request):
    das = Das()
    proxy_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    return render_to_response('data/index.html',{"status":proxy_ticket + request})

def authenticate(request):
    das = Das()
    proxy_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    return render_to_response('data/index.html',{"status":proxy_ticket})
    
def api(request):
    pass