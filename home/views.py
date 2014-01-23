from django.http import HttpResponse, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
import json
from datetime import datetime, timedelta
#from collections import OrderedDict


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
        
    if "comparison" not in response:
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
            "Inpatient"      : round(reporting["Inpatient"] / reporting["members"] / months) - round((reporting["Inpatient"] / reporting["members"] / months) * 0.10),
            "Outpatient"     : round(reporting["Outpatient"] / reporting["members"] / months) - round((reporting["Outpatient"] / reporting["members"] / months) * 0.12),
            "Office Visit"   : round(reporting["Office"] / reporting["members"] / months) - round((reporting["Office"] / reporting["members"] / months) * 0.2),
            "Pharmacy Claims": round(reporting["totalPharmacyPaidAmount"] / reporting["members"] / months) - round((reporting["totalPharmacyPaidAmount"] / reporting["members"] / months) * 0.15)
        }
    ]
    
    return HttpResponse(json.dumps(data))

    