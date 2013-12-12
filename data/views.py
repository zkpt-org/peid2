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
from data.models import ProxyTicket
import os, json

# @login_required
def index(request):
    return render_to_response('data/index.html',{"status":"hello world :-)"})

def authenticate(request):
    das = Das()
    proxy_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    return render_to_response('data/index.html',{"status":proxy_ticket})
    
def proxy(request):
    ticket = ProxyTicket(ticket_iou=request.GET['pgtIou'], ticket_id=request.GET['pgtId'])
    ticket.save()
    return render_to_response('data/index.html',{"status":"OK"})

def ticket(request):
    #data = [pt.json() for pt in ProxyTicket.objects.filter(**query).order_by('id')]
    data = [pt.json() for pt in ProxyTicket.objects.order_by('id')]
    
    return HttpResponse(json.dumps(data), content_type='application/json')
    
def api(request):
    pass