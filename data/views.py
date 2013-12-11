# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.files import File
from data.das import Das
import os

# @login_required
def index(request):
    #das = Das()
    #proxy_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    return render_to_response('data/index.html',{"status":"hello world :-)"})

def authenticate(request):
    das = Das()
    proxy_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    return render_to_response('data/index.html',{"status":proxy_ticket})
    
def api(request):
    pass
    
    
def proxy(request):
    #path = default_storage.save('/public/tmp/proxy.ticket', ContentFile(str(request)))
    #dump = default_storage.open(path).read()
    part = 'public/tmp/proxy.ticket'
    full = os.path.join(os.path.dirname(__file__), 'tind/'+part)
    
    with open(full, 'w+') as f:
        ticket = File(f)
        ticket.write(str(request.GET))
    ticket.closed
    f.closed
    
    return render_to_response('data/index.html',{"status":part})
