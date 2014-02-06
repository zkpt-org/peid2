from django.http import HttpResponse
from dateutil.relativedelta import relativedelta
from data.das import Das
import json, calendar, datetime, locale #, timedelta
import pandas as pd
#from collections import OrderedDict

def graph1(request):
    das = Das()
    
    params = {
        "service"       : "report", 
        "report"        : "summary",
        "reportingBasis": "ServiceDate",
        "eligibilityType":"[medical]",
        "reportingFrom" : request.GET["reportingFrom"],
        "reportingTo"   : request.GET["reportingTo"],
        "comparisonFrom": request.GET["comparisonFrom"],
        "comparisonTo"  : request.GET["comparisonTo"]}
    
    response = das.json_to_dict(request.session['pgt'], params)
    #if "comparison" not in response: return {"session":"expired"}
    comparison = response["comparison"][0]
    reporting  = response["reporting"][0]
    
    data = [
        {
            "Period"         : "Reporting",
            "Inpatient"      : round(reporting["Inpatient"] / reporting["memberMonths"]) if reporting["memberMonths"]!=0 else 0,
            "Outpatient"     : round(reporting["Outpatient"] / reporting["memberMonths"]) if reporting["memberMonths"]!=0 else 0,
            "Office Visit"   : round(reporting["Office"] / reporting["memberMonths"]) if reporting["memberMonths"]!=0 else 0,
            "Pharmacy Claims": round(reporting["totalPharmacyPaidAmount"] / reporting["memberMonths"]) if reporting["memberMonths"]!=0 else 0,
        },
        {
            "Period"         : "Comparison",
            "Inpatient"      : round(comparison["Inpatient"] / comparison["memberMonths"]) if comparison["memberMonths"]!=0 else 0,
            "Outpatient"     : round(comparison["Outpatient"] / comparison["memberMonths"]) if comparison["memberMonths"]!=0 else 0,
            "Office Visit"   : round(comparison["Office"] / comparison["memberMonths"]) if comparison["memberMonths"]!=0 else 0,
            "Pharmacy Claims": round(comparison["totalPharmacyPaidAmount"] / comparison["memberMonths"]) if comparison["memberMonths"]!=0 else 0,
        },
        #{
        #    "Period"         : "Benchmark",
        #    "Inpatient"      : round(reporting["Inpatient"]   / reporting["memberMonths"]) - 
        #                       round((reporting["Inpatient"]  / reporting["memberMonths"]) * 0.10)
        #                       if reporting["memberMonths"]!=0 else 0,
        #    "Outpatient"     : round(reporting["Outpatient"]  / reporting["memberMonths"]) - 
        #                       round((reporting["Outpatient"] / reporting["memberMonths"]) * 0.12)
        #                       if reporting["memberMonths"]!=0 else 0,
        #    "Office Visit"   : round(reporting["Office"]      / reporting["memberMonths"]) - 
        #                       round((reporting["Office"]     / reporting["memberMonths"]) * 0.2)
        #                       if reporting["memberMonths"]!=0 else 0,
        #    "Pharmacy Claims": round(reporting["totalPharmacyPaidAmount"]  / reporting["memberMonths"]) - 
        #                       round((reporting["totalPharmacyPaidAmount"] / reporting["memberMonths"]) * 0.15)
        #                       if reporting["memberMonths"]!=0 else 0
        #}
    ]
    
    return data

def graph2(request):
    das = Das()
    data = []
    
    start = datetime.date(*map(int, request.GET["reportingFrom"].split("-")))
    end   = datetime.date(*map(int, request.GET["reportingTo"].split("-")))
    
    m = end-start
    
    start_month = start.month
    end_months  = (end.year-start.year) * 12 + end.month + 1
    
    months = end_months - start.month
    
    dates = [datetime.datetime(year=yr, month=mn, day=1) for (yr, mn) in (
         ((m - 1) / 12 + start.year, (m - 1) % 12 + 1) for m in range(start_month, end_months))]
    
    for d in dates:                 
        params = {
            "service"       : "report", 
            "report"        : "summary",
            "eligibilityType":"[medical]",
            "reportingBasis": "ServiceDate",
            "reportingFrom" : d.strftime("%Y-%m-%d"),
            "reportingTo"   : datetime.date(d.year, d.month, calendar.monthrange(d.year, d.month)[1]).strftime("%Y-%m-%d"),
            "comparisonFrom": (d - relativedelta(years=1)).strftime("%Y-%m-%d"),
            "comparisonTo"  : datetime.date(d.year-1, d.month, calendar.monthrange(d.year, d.month)[1]).strftime("%Y-%m-%d")}
        
        response = das.json_to_dict(request.session['pgt'], params)
        #if "comparison" not in response: return {"session":"expired"}
        comparison = response["comparison"][0]
        reporting  = response["reporting"][0]
        
        data.append({
            "month"  : 12 - d.month, #d.strftime("%B"),
            "date"   : d.strftime("%Y-%m-%d"),
            "total"     : round((reporting["totalPharmacyPaidAmount"]  + reporting["totalMedicalPaidAmount"])  / reporting["memberMonths"]),
            "benchmark" : round((comparison["totalPharmacyPaidAmount"] + comparison["totalMedicalPaidAmount"]) / comparison["memberMonths"])})
    
    return data

def graph3(request):
    try:
        import locale
        locale.setlocale(locale.LC_ALL, 'en_US.utf8')
    except Exception:
        try:
            locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
        except Exception as e:
            messages.error(request, 'An error occurred: {0}'.format(e))
    
    das = Das()
    ticket = request.session['pgt']
    
    """Get the last date recorded in the dataset."""
    params = {
        "service"  : "search", 
        "table"    : "smc",
        "page"     : "1",
        "pageSize" : "1",
        "order"    : "paidDate:desc"}
    try:
        lastdate = das.json_to_dict(request.session['pgt'], params)["result_sets"]["0"]["serviceDate"]
        d = datetime.datetime.strptime(lastdate, "%Y-%m-%d")
        last = datetime.date(d.year, d.month, calendar.monthrange(d.year, d.month)[1])
        
        """Get data from summary table."""
        reporting_to    = last.strftime("%Y-%m-%d")
        reporting_from  = (last-relativedelta(years=1)+relativedelta(days=1)).strftime("%Y-%m-%d") 
        comparison_from = (last-relativedelta(years=2)+relativedelta(days=1)).strftime("%Y-%m-%d")
        comparison_to   = (last-relativedelta(years=1)).strftime("%Y-%m-%d")
            
        params = {
            "service"       : "report", 
            "report"        : "summary",
            "reportingBasis": "ServiceDate",
            "eligibilityType":"[medical]",
            "reportingFrom" : reporting_from,
            "reportingTo"   : reporting_to,
            "comparisonFrom": comparison_from,
            "comparisonTo"  : comparison_to}
        
        response = das.json_to_dict(ticket, params)
    
    except:
        response = None
    
    if response:    
        comparison = response["comparison"][0]
        reporting  = response["reporting"][0]
        
        """Calculate the number of claims for reporting Period."""
        claims = count_claims(reporting_from, reporting_to, ticket, das)        
        """Calculate the number of claimants for Reporting Period."""
        claimants = count_claimants(claims, reporting_from, reporting_to, ticket, das)
        
        """Calculate the number of claims Comparison Period."""
        claims2 = count_claims(comparison_from, comparison_to, ticket, das)
        """Calculate the number of claimants for Reporting Period."""
        claimants2 = count_claimants(claims, comparison_from, comparison_to, ticket, das)
        
        """Calculate the number of ER visits for Reporting Period."""
        params = {
            "service"  : "search", 
            "table"    : "smc",
            "page"     : "1",
            "pageSize" : "0",
            "query"    : "{'and':[{'serviceDate.gte':'" + reporting_from + "'},{'serviceDate.lte':'" + reporting_to + "'},{'erVisit.gt':0}]}"}
        
        response = das.json_to_dict(ticket, params)
        er_visit = response["summary"]["totalCounts"]
        
        """Calculate the number of ER visits for Comparison Period."""
        params = {
            "service"  : "search", 
            "table"    : "smc",
            "page"     : "1",
            "pageSize" : "0",
            "query"    : "{'and':[{'serviceDate.gte':'" + comparison_from + "'},{'serviceDate.lte':'" + comparison_to + "'},{'erVisit.gt':0}]}"}
        
        response = das.json_to_dict(ticket, params)
        er_visit2 = response["summary"]["totalCounts"]
        
        data = {
            "reporting":{
                "employees" : locale.format("%d", reporting["subscribers"], grouping=True),
                "members"   : locale.format("%d", reporting["members"], grouping=True),
                "totalcost" : locale.format("%d", reporting["totalMedicalPaidAmount"] + reporting["totalPharmacyPaidAmount"], grouping=True),
                "claims"    : locale.format("%d", claims, grouping=True),
                "claimants" : locale.format("%d", claimants, grouping=True),
                "avg_claims": int(round(claims / reporting["members"])),
                "er_visits" : locale.format("%d", er_visit, grouping=True),
                "avg_claim_cost": int(round((reporting["totalMedicalPaidAmount"] + reporting["totalPharmacyPaidAmount"]) / claims))
            },
            "comparison":{
                "employees" : locale.format("%d", comparison["subscribers"], grouping=True),
                "members"   : locale.format("%d", comparison["members"], grouping=True),
                "totalcost" : locale.format("%d", comparison["totalMedicalPaidAmount"] + comparison["totalPharmacyPaidAmount"], grouping=True),
                "claims"    : locale.format("%d", claims2, grouping=True),
                "claimants" : locale.format("%d", claimants2, grouping=True),
                "avg_claims": int(round(claims2 / comparison["members"])),
                "er_visits" : locale.format("%d", er_visit2, grouping=True),
                "avg_claim_cost": int(round((comparison["totalMedicalPaidAmount"] + comparison["totalPharmacyPaidAmount"]) / claims))
            }
        }
    
    else:
        data = {
            "reporting":{
                "employees" : 0,
                "members"   : 0,
                "totalcost" : 0,
                "claims"    : 0,
                "avg_claims": 0,
                "er_visits" : 0,
                "avg_claim_cost": 0
            },
            "comparison":{
                "employees" : 0,
                "members"   : 0,
                "totalcost" : 0,
                "claims"    : 0,
                "avg_claims": 0,
                "er_visits" : 0,
                "avg_claim_cost": 0
            }
        }
    
    return data

def count_claims(_from, _to, ticket, das):
    params = {
        "service"  : "search", 
        "table"    : "smc",
        "page"     : "1",
        "pageSize" : "0",
        "query"    : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'}]}"}
        
    response = das.json_to_dict(ticket, params)
    return response["summary"]["totalCounts"]

def count_claimants(total, _from, _to, ticket, das):
    psize = 100
    mod   = total%psize
    pages = (total/psize) + 1 if mod == 1 else (total/psize) + 2
    results = []
    
    for i in range(1, 2):
       params = {
       "service"  : "search", 
       "table"    : "smc",
       "page"     : str(i),
       "pageSize" : str(psize),
       "query"    : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'}]}",
       "fields"   : "[memberId]"}
        
       response = das.json_to_dict(ticket, params)["result_sets"]
       results += [response[row] for row in response]
    
    ac = pd.DataFrame(results)[['memberId']]
    # ddup = ac.drop_duplicates()
    claimants = ac.memberId.nunique()
    return claimants
