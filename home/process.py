from django.http import HttpResponse
from data.das import Das
import json, calendar, datetime
#from collections import OrderedDict

def graph1(request):
    das = Das()
    
    params = {
    "service"       : "report", 
    "report"        : "summary",
    "reportingBasis": "ServiceDate",
    "reportingFrom" : request.GET["reportingFrom"],
    "reportingTo"   : request.GET["reportingTo"],
    "comparisonFrom": request.GET["comparisonFrom"],
    "comparisonTo"  : request.GET["comparisonTo"]
    }
    
    #if 'pgt' in request.session:
    response = das.json_to_dict(request.session['pgt'], params)
    #else: return {"session":"expired"}
        
    if "comparison" not in response: return {"session":"expired"}
    
    comparison = response["comparison"][0]
    reporting  = response["reporting"][0]
    
    data = [
        {
            "Period"         : "Reporting",
            "Inpatient"      : round(reporting["Inpatient"] / reporting["memberMonths"] ),  #reporting["members"] / months),
            "Outpatient"     : round(reporting["Outpatient"] / reporting["memberMonths"] ), #reporting["members"] / months),
            "Office Visit"   : round(reporting["Office"] / reporting["memberMonths"] ),     #reporting["members"] / months),
            "Pharmacy Claims": round(reporting["totalPharmacyPaidAmount"] / reporting["memberMonths"] ), #reporting["members"] / months)
        },
        {
            "Period"         : "Comparison",
            "Inpatient"      : round(comparison["Inpatient"] / comparison["memberMonths"] ),  #comparison["members"] / months),
            "Outpatient"     : round(comparison["Outpatient"] / comparison["memberMonths"] ), #comparison["members"] / months),
            "Office Visit"   : round(comparison["Office"] / comparison["memberMonths"] ),     #comparison["members"] / months),
            "Pharmacy Claims": round(comparison["totalPharmacyPaidAmount"] / comparison["memberMonths"] ), #comparison["members"] /months)
        },
        {
            "Period"         : "Benchmark",
            "Inpatient"      : round(reporting["Inpatient"]   / reporting["memberMonths"]) - 
                               round((reporting["Inpatient"]  / reporting["memberMonths"]) * 0.10),
            "Outpatient"     : round(reporting["Outpatient"]  / reporting["memberMonths"]) - 
                               round((reporting["Outpatient"] / reporting["memberMonths"]) * 0.12),
            "Office Visit"   : round(reporting["Office"]      / reporting["memberMonths"]) - 
                               round((reporting["Office"]     / reporting["memberMonths"]) * 0.2),
            "Pharmacy Claims": round(reporting["totalPharmacyPaidAmount"]  / reporting["memberMonths"]) - 
                               round((reporting["totalPharmacyPaidAmount"] / reporting["memberMonths"]) * 0.15)
        }
    ]
    
    return data

def graph2(request):
    das = Das()
    data = []

    start = datetime.date(*map(int, request.GET["reportingFrom"].split("-")))
    end   = datetime.date(*map(int, request.GET["reportingTo"].split("-")))
    
    m = end-start
    
    start_month = start.month
    end_months  = (end.year-start.year)*12 + end.month+1
    
    months = end_months - start.month
    
    dates = [datetime.datetime(year=yr, month=mn, day=1) for (yr, mn) in (
         ((m - 1) / 12 + start.year, (m - 1) % 12 + 1) for m in range(start_month, end_months)
     )]
    
    for d in dates:
                 
        params = {
        "service"       : "report", 
        "report"        : "summary",
        "reportingBasis": "ServiceDate",
        "reportingFrom" : d.strftime("%Y-%m-%d"),
        "reportingTo"   : datetime.date(d.year, d.month, calendar.monthrange(d.year, d.month)[1]).strftime("%Y-%m-%d"),
        "comparisonFrom": request.GET["comparisonFrom"],
        "comparisonTo"  : request.GET["comparisonTo"]
        }
        
        #if 'pgt' in request.session:
        response = das.json_to_dict(request.session['pgt'], params)
        #else: return {"session":"expired"}
            
        if "comparison" not in response: return {"session":"expired"}
        
        comparison = response["comparison"][0]
        reporting  = response["reporting"][0]
        
        data.append({
            "Period" : "Reporting",
            "month"  : 12 - d.month, #d.strftime("%B"),
            "date"   : d.strftime("%Y-%m-%d"),
            #"total"  : round((reporting["totalPharmacyPaidAmount"] + reporting["totalMedicalPaidAmount"]) / reporting["members"] / months),
            "total" : round((reporting["totalPharmacyPaidAmount"] + reporting["totalMedicalPaidAmount"]) / reporting["memberMonths"])
        })
        
    return data