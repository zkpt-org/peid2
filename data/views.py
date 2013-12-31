# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
#from django.contrib.csrf.middleware import csrf_exempt
from django.shortcuts import redirect
from django.conf import settings
from data.das import Das
from data.models import ProxyTicket
from django.core.mail import mail_admins
import os, json

# @login_required
def index(request):
    return render_to_response('data/index.html',{"status":"hav sum moar data."})

@login_required
def authenticate(request):
    das = Das()
    proxy_granting_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    request.session['pgt'] = proxy_granting_ticket
    return render_to_response('data/index.html',{"status":proxy_granting_ticket})
    
def proxy(request):
    mail_admins("proxy error", str(request.GET), fail_silently=False)
    if 'pgtIou' in request.GET and 'pgtId' in request.GET:
        ticket = ProxyTicket(ticket_iou=request.GET['pgtIou'], ticket_id=request.GET['pgtId'])
        ticket.save()
        return render_to_response('data/index.html',{"status":"OK"})
    else:
        mail_admins("proxy error", str(request.GET), fail_silently=False)
        return render_to_response('data/index.html',{"status":"MISSING DATA"})

#@login_required
def ticket(request):
    #query = {'ticket_iou':request.GET['iou']}
    #data = [pt.json() for pt in ProxyTicket.objects.filter(**query).order_by('id')]
    #return HttpResponse(json.dumps(data), content_type='application/json')
    
    #tickets = ProxyTicket.objects.filter(ticket_iou=request.GET['iou'])
    tickets = ProxyTicket.objects.latest('created')
    proxy_ticket = tickets.ticket_id if tickets else "Ticket not found."
    return render_to_response('data/index.html',{"status":proxy_ticket})
#ticket = csrf_exempt(ticket)

@login_required
def api(request):
    das = Das()
    params = request.GET.copy()
    data = das.api(request.session['pgt'], params)
    return render_to_response('data/index.html',{"status": data})