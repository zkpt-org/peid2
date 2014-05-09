from collections import OrderedDict
from data.functions import get_cohort
from collections import OrderedDict

def graph1(das, request):
    reporting_from  = request["reportingFrom"]
    reporting_to    = request["reportingTo"]
    
    comparison_from = request["comparisonFrom"]
    comparison_to   = request["comparisonTo"]
    
    td = top_diseases(das, request)
        
    top10 = td.items()[0:10] if request['condition'] == "ALL" else td.items()[1:11]
    
    data = []    
    for n, i in enumerate(top10):
        if top10[n][1]["withCondition"] >= 1:
            disease = {}
            disease["condition"]  = top10[n][0]
            disease["population"] = top10[n][1]["withCondition"]
            
            disease["details"] = OrderedDict()
            disease["details"]["Cost"]             = "$ " + str("{0:,.2f}".format(round(top10[n][1]["cost"], 2)))
            disease["details"]["Office Visits"]    = top10[n][1]["Office Visits"]
            disease["details"]["ER Visits"]        = top10[n][1]["ER Visits"]
            disease["details"]["Admits"]           = top10[n][1]["Admits"]
            disease["details"]["30 Day Re-admits"] = top10[n][1]["30 Day Re-Admit"]
            
            data.append(disease)
    
    return data    

def top_diseases(das, request):    
    cohort = get_cohort(das, request)
        
    p = {
    "service"        : "report",
    "report"         : "chronicConditions",
    "reportingBasis" : "ServiceDate",
    "reportingFrom"  : request["reportingFrom"],
    "reportingTo"    : request["reportingTo"],
    "comparisonFrom" : request["comparisonFrom"], 
    "comparisonTo"   : request["comparisonTo"],
    "order"          : "Admits:desc",
    }
    
    if cohort is not None:
        p.update({"cohortId":cohort})
    
    r = das.response(p)
    conditions = OrderedDict()
    
    for i in sorted(r.data["reporting"]["Default"], key=lambda x: r.data["reporting"]["Default"][x]["withCondition"] 
        if x != "memberCount" and x != "memberMonths" else r.data["reporting"]["Default"][x], reverse=True): 
        if i != "memberCount" and i != "memberMonths":
            conditions.update({r.data["reporting"]["Default"][i]["description"] : r.data["reporting"]["Default"][i]})
    return conditions