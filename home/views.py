from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
import json
from datetime import datetime, timedelta

@login_required #(redirect_field_name='login/')
def index(request):
    if 'alerts' not in request.session:
        request.session['alerts'] = "show"
        request.session.modified = True
    return render_to_response('home/index.html',{"page":"home", "user":request.user, "alerts":request.session['alerts']}, context_instance=RequestContext(request))

def hide_alerts(request):
    #     if not request.is_ajax() or not request.method=='POST':
    #         return HttpResponseNotAllowed(['POST'])
    request.session['alerts'] = 'hide'
    request.session.modified = True
    return HttpResponse(request.session['alerts'])

def show_alerts(request):
    #     if not request.is_ajax() or not request.method=='POST':
    #         return HttpResponseNotAllowed(['POST'])
    request.session['alerts'] = 'show'
    request.session.modified = True
    return HttpResponse(request.session['alerts'])

def graph1(request):
    das = Das()
    
    months = int(request.GET["months"])
    
    params = {
        "service"       : "report", 
        "report"        : "summary",
        "reportingBasis": "ServiceDate",
        "reportingFrom" : request.GET["reportingFrom"],
        "reportingTo"   : request.GET["reportingTo"],
        "comparisonFrom": request.GET["comparisonFrom"],
        "comparisonTo"  : request.GET["comparisonTo"]
        }
    
    if 'pgt' in request.session:
        response = das.json_to_dict(request.session['pgt'], params)
    else:
        return HttpResponse(json.dumps({"session":"expired"}))
    
    comparison = response["comparison"][0]
    reporting  = response["reporting"][0]
    
    data = [
        {
            "Period"         : "Reporting",
            "Inpatient"      : round(reporting["Inpatient"] / reporting["members"] / months),
            "Outpatient"     : round(reporting["Outpatient"] / reporting["members"] / months),
            "Office Visit"   : round(reporting["Office"] / reporting["members"] / months),
            "Pharmacy Claims": round(reporting["totalPharmacyPaidAmount"] / reporting["members"] / months)
        },
        {
            "Period"         : "Comparison",
            "Inpatient"      : round(comparison["Inpatient"] / comparison["members"] / months),
            "Outpatient"     : round(comparison["Outpatient"] / comparison["members"] / months),
            "Office Visit"   : round(comparison["Office"] / comparison["members"] / months),
            "Pharmacy Claims": round(comparison["totalPharmacyPaidAmount"] / comparison["members"] /months)
        },
        {
            "Period"         : "Benchmark",
            "Inpatient"      : 90,
            "Outpatient"     : 160,
            "Office Visit"   : 60,
            "Pharmacy Claims": 50
        }
    ]
    
    return HttpResponse(json.dumps(data))

    