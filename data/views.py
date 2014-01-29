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
#import simplejson as json

# @login_required
def index(request):
    return render_to_response('data/index.html',{"status":"can i haz sum moar data?"})

@login_required
def authenticate(request):
    das = Das()
    proxy_granting_ticket = das.auth(settings.DAS_USER, settings.DAS_PASS)
    request.session['pgt'] = proxy_granting_ticket
    return render_to_response('data/index.html',{"status":proxy_granting_ticket})
    

def proxy(request):
    if 'pgtIou' in request.GET and 'pgtId' in request.GET:
        ticket = ProxyTicket(ticket_iou=request.GET['pgtIou'], ticket_id=request.GET['pgtId'])
        ticket.save()
        #mail_admins("proxy success", str(request.GET), fail_silently=False)
    return render_to_response('data/index.html',{"status":"OK"})

@login_required
def api(request, service=None):
    das = Das()
    params = request.GET.copy()
    if service: params['service'] = service
    data = das.api(request.session['pgt'], params)
    return HttpResponse(data, content_type='application/json')
    #return HttpResponse(json.dumps(data, sort_keys=True, indent=4), content_type='application/json')
    #return render_to_response('data/index.html',{"status": data})

@login_required
def lastdate(request, format="Ymd"):
    das = Das()
    
    params = {
    "service"  : "search", 
    "table"    : "smc",
    "page"     : "1",
    "pageSize" : "1",
    "order"    : "paidDate:desc"
    }
    
    if 'pgt' in request.session:
        response = das.json_to_dict(request.session['pgt'], params)["result_sets"]["0"]
    else:
        return HttpResponse(json.dumps({"session":"expired"}))
    
    #if "paidDate" not in response:
    #    return HttpResponse(json.dumps({"session":"expired"}))
        
    #return HttpResponse(json.dumps(response["paidDate"]))
    return HttpResponse(response["paidDate"])
    
@login_required
def firstdate(request, format="Ymd"):
    das = Das()
    
    params = {
    "service"  : "search", 
    "table"    : "smc",
    "page"     : "1",
    "pageSize" : "1",
    "order"    : "paidDate:asc"
    }
    
    if 'pgt' in request.session:
        response = das.json_to_dict(request.session['pgt'], params)["result_sets"]["0"]
    else:
        return HttpResponse(json.dumps({"session":"expired"}))
    
    #if "paidDate" not in response:
    #    return HttpResponse(json.dumps({"session":"expired"}))
        
    #return HttpResponse(json.dumps({"date":response["paidDate"]}))
    return HttpResponse(response["paidDate"])