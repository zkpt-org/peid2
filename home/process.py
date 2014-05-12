import datetime, calendar, json
from dateutil.relativedelta import relativedelta
import pandas as pd
import numpy as np
from data.functions import get_cohort
from models import *
from django.core.exceptions import ObjectDoesNotExist

def graph1(das, request):
    cohort = get_cohort(das, request)

    reporting_from  = request["reportingFrom"]
    reporting_to    = request["reportingTo"]
    
    comparison_from = request["comparisonFrom"]
    comparison_to   = request["comparisonTo"]
    
    params = {
        "service"         : "report", 
        "report"          : "summary",
        "reportingBasis"  : "ServiceDate",
        "eligibilityType" : "[medical]",
        "reportingFrom"   : reporting_from,
        "reportingTo"     : reporting_to,
        "comparisonFrom"  : comparison_from,
        "comparisonTo"    : comparison_to}
    
    if cohort is not None:
        params.update({"cohortId":cohort})
    
    response = das.to_dict(params)
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
    ]
    
    total0 = data[0]["Inpatient"]+ data[0]["Office Visit"]+ data[0]["Outpatient"]+ data[0]["Pharmacy Claims"]
    total1 = data[1]["Inpatient"]+ data[1]["Office Visit"]+ data[1]["Outpatient"]+ data[1]["Pharmacy Claims"]
    
    if total0 + total1 == 0:
        data = []
            
    Graph1().find_or_create(request, data)
    #     try:
    #         Graph1().find(request)    
    #     
    #     except ObjectDoesNotExist:
    #         Graph1().insert(request, data)
    
    return data

def graph2(das, request):
    cohort = get_cohort(das, request)

    reporting_from  = request["reportingFrom"]
    reporting_to    = request["reportingTo"]
    
    comparison_from = request["comparisonFrom"]
    comparison_to   = request["comparisonTo"]
    
    data = []
    
    start = datetime.date(*map(int, reporting_from.split("-")))
    end   = datetime.date(*map(int, reporting_to.split("-")))
    
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
        
        if cohort is not None:
            params.update({"cohortId":cohort})
        
        response = das.to_dict(params)
        comparison = response["comparison"][0]
        reporting  = response["reporting"][0]
        
        data.append({
            "month"  : 12 - d.month, #d.strftime("%B"),
            "date"   : d.strftime("%Y-%m-%d"),
            "total"     : round((reporting["totalPharmacyPaidAmount"]  + reporting["totalMedicalPaidAmount"])  / reporting["memberMonths"]) if reporting["memberMonths"]!=0 else 0,
            "benchmark" : round((comparison["totalPharmacyPaidAmount"] + comparison["totalMedicalPaidAmount"]) / comparison["memberMonths"])}) if comparison["memberMonths"]!=0 else 0
    
    try:
        Graph2().find(request)    
    
    except ObjectDoesNotExist:
        Graph2().insert(request, data)
    
    return data

def graph3(das, request):
    cohort = get_cohort(das, request)

    reporting_from  = request["reportingFrom"]
    reporting_to    = request["reportingTo"]
    
    comparison_from = request["comparisonFrom"]
    comparison_to   = request["comparisonTo"]
    
    """Set locale."""
    try:
        import locale
        locale.setlocale(locale.LC_ALL, 'en_US.utf8')
    except Exception:
        try:
            locale.setlocale(locale.LC_ALL, 'en_US.UTF-8')
        except Exception as e:
            messages.error(request, 'An error occurred: {0}'.format(e))
    try:
        """Get data from summary table."""
        params = {
            "service"       : "report", 
            "report"        : "summary",
            "reportingBasis": "ServiceDate",
            "eligibilityType":"[medical]",
            "reportingFrom" : reporting_from,
            "reportingTo"   : reporting_to,
            "comparisonFrom": comparison_from,
            "comparisonTo"  : comparison_to}
        
        if cohort is not None:
            params.update({"cohortId":cohort})
        
        response = das.to_dict(params)
        
    except Exception, e:
        response = None
        print str(e)+"\n"
        with open("../errors.log", "a+") as f: f.write(str(e)+"\n")
    
    if response:    
        comparison = response["comparison"][0]
        reporting  = response["reporting"][0]
                
        """Calculate the number of claims for reporting Period."""
        claims = count_claims(das, reporting_from, reporting_to, cohort)
        """Calculate the number of claimants for Reporting Period."""
        claimants = count_claimants(das, reporting_from, reporting_to, cohort)
        
        """Calculate the number of claims Comparison Period."""
        claims2 = count_claims(das, comparison_from, comparison_to, cohort)
        """Calculate the number of claimants for Reporting Period."""
        claimants2 = count_claimants(das, comparison_from, comparison_to, cohort)
        
        """Calculate the number of ER visits for Reporting Period."""
        er_visit = count_er_visits(das, reporting_from, reporting_to, cohort)
        """Calculate the number of ER visits for Comparison Period."""
        er_visit2 = count_er_visits(das, comparison_from, comparison_to, cohort)
        
        data = {
            "reporting":{
                "employees" : locale.format("%d", reporting["subscribers"], grouping=True),
                "members"   : locale.format("%d", reporting["members"], grouping=True),
                "totalcost" : "$" + locale.format("%d", reporting["totalMedicalPaidAmount"] + reporting["totalPharmacyPaidAmount"], grouping=True),
                "claims"    : locale.format("%d", claims, grouping=True),
                "claimants" : locale.format("%d", claimants, grouping=True),
                "avg_claims": int(round(claims / reporting["members"])) if reporting["members"]!=0 else 0,
                "er_visits" : locale.format("%d", er_visit, grouping=True),
                "avg_claim_cost": "$" + str(int(round((reporting["totalMedicalPaidAmount"] + reporting["totalPharmacyPaidAmount"]) / claims))) if claims != 0 else 0
            },
            "comparison":{
                "employees" : locale.format("%d", comparison["subscribers"], grouping=True),
                "members"   : locale.format("%d", comparison["members"], grouping=True),
                "totalcost" : "$" + locale.format("%d", comparison["totalMedicalPaidAmount"] + comparison["totalPharmacyPaidAmount"], grouping=True),
                "claims"    : locale.format("%d", claims2, grouping=True),
                "claimants" : locale.format("%d", claimants2, grouping=True),
                "avg_claims": int(round(claims2 / comparison["members"])) if comparison["members"]!=0 else 0,
                "er_visits" : locale.format("%d", er_visit2, grouping=True),
                "avg_claim_cost": "$" + str(int(round((comparison["totalMedicalPaidAmount"] + comparison["totalPharmacyPaidAmount"]) / claims2))) if claims2 != 0 else 0
            }
        }
        
    try:
        Graph3().find(request)    
    
    except ObjectDoesNotExist:
        Graph3().insert(request, data)
        
    return data

def graph3_init():
    data = {
        "reporting":{
            "employees" : "",
            "members"   : "",
            "totalcost" : "",
            "claims"    : "",
            "claimants" : "",
            "avg_claims": "",
            "er_visits" : "",
            "avg_claim_cost": ""
        },
        "comparison":{
            "employees" : "",
            "members"   : "",
            "totalcost" : "",
            "claims"    : "",
            "claimants" : "",
            "avg_claims": "",
            "er_visits" : "",
            "avg_claim_cost": ""
        }
    }
    return data

def graph4(das, request):
    cohort = get_cohort(das, request)

    reporting_from  = request["reportingFrom"]
    reporting_to    = request["reportingTo"]
    
    comparison_from = request["comparisonFrom"]
    comparison_to   = request["comparisonTo"]
    
    total_claims = count_claims(das, reporting_from, reporting_to, cohort)
    
    if total_claims <= 10000:
        data = cumulativeF1(das, reporting_from, reporting_to, cohort)
    else:
        data = cumulativeF2(das, reporting_from, reporting_to, cohort, total_claims)
    
    try:
        Graph4().find(request)    
    
    except ObjectDoesNotExist:
        Graph4().insert(request, data)
    
    return json.dumps(data)

def count_claims(das, _from, _to, cohort):
    params = {
        "service"  : "search", 
        "table"    : "smc",
        "page"     : "1",
        "pageSize" : "0",
        "query"    : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'},{'paidAmount.gt':'0'}]}"}
    
    if cohort is not None:
       params.update({"cohortId":cohort})
    
    response = das.to_dict(params)
    return response["summary"]["totalCounts"]

def count_claimants(das, _from, _to, cohort):
    params = {
    "service"     : "search",
    "table"       : "ms",
    "page"        : "1",
    "pageSize"    : "0",
    "query"       : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'},{'paidAmount.gt':'0'}]}",
    "fields"      : "[memberId]",
    "report"      : "viewMemberSearch",
    "recordTypes" : "smc"}
    
    if cohort is not None:
       params.update({"cohortId":cohort})
    
    response = das.to_dict(params)["summary"]["totalCounts"]
    return response

def count_er_visits(das, _from, _to, cohort):
    params = {
        "service"  : "search", 
        "table"    : "smc",
        "page"     : "1",
        "pageSize" : "0",
        "query"    : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'},{'erVisit.gt':0}]}"}
    
    if cohort is not None:
       params.update({"cohortId":cohort})
    
    return das.to_dict(params)["summary"]["totalCounts"]

def cumulativeF1(das, _from, _to, cohort):
    params  = {
    "service"  : "search", 
    "table"    : "smc",
    "pageSize" : 100,
    "order"    : "paidAmount:desc",
    "query"    : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'},{'paidAmount.gt':'0'}]}",
    "fields"   : "[paidAmount]",
    }
    if cohort is not None:
        params.update({"cohortId":cohort})
    
    response = das.all(params)
    df = response.dataframe()
    
    if df.empty:
        return []
    
    df = df.sort(['paidAmount'], ascending=[0])
    total = len(df.paidAmount)
    
    size = total / 99 if total % 100 > 0 else total / 100
    cost = 0
    i0 = 0
    i1 = size
    results = []
    
    if total < 100:
        return [] #"No Data
    else:
        for percent in range(1, 101):
            claims = df.paidAmount[i0:i1]
            """A try-catch block to catch a numpy bug."""
            try:
                cost += np.asscalar(claims.sum())
            except Exception as e:
                cost += claims.sum()
            results.append({"claims" : percent, "cost" : cost})
            i0 = i0 + size
            i1 = i1 + size
        for row in results:
            row["cost"] = round(row["cost"]/cost*100, 2)
    return results

def cumulativeF2(das, _from, _to, cohort, total_claims):
    psize = total_claims / 99 if total_claims % 100 > 0 else total_claims / 100
    pages = 100
    total = 0
    results = []
        
    for p in range(1, pages+1):
        cumul = cumulativeF2Sub(das, _from, _to, cohort, p, psize)
    
        if cumul:
            cailms = pd.DataFrame(cumul)[['paidAmount']]
            total += np.asscalar(cailms.sum())
            results.append({"claims" : p, "cost" : total})
        else:
            return [] #"No Data
    
    for row in results:
        row["cost"] = round(row["cost"]/total*100, 2)
    
    return results

def cumulativeF2Sub(das, _from, _to, cohort, page, psize):
    results = []
    
    params  = {
    "service"  : "search", 
    "table"    : "smc",
    "page"     : str(page),
    "pageSize" : str(psize),
    "order"    : "paidAmount:desc",
    "query"    : "{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'},{'paidAmount.gt':'0'}]}",
    "fields"   : "[paidAmount]",
    }
    if cohort is not None:
        params.update({"cohortId":cohort})
    
    response = das.to_dict(params)["result_sets"]
    results += [response[row] for row in response]
    return results
