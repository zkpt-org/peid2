def graph1(das, request):
    reporting_from  = request["reportingFrom"]
    reporting_to    = request["reportingTo"]
    
    comparison_from = request["comparisonFrom"]
    comparison_to   = request["comparisonTo"]
    
    td = population.top_diseases(das, request)
    top5 = td.items()[0:5]

    data = [
        {"condition" : top5[0][0], "population" : top5[0][1]["withCondition"], "intersection" : {"Diabetes":203, "High Blood Pressure":247, "Metabolic Syndrome":132}},
        {"condition" : top5[1][0], "population" : top5[1][1]["withCondition"], "intersection" : {"High Cholesterol":247, "Diabetes":153, "Metabolic Syndrome":88}},
        {"condition" : top5[2][0], "population" : top5[2][1]["withCondition"], "intersection" : {"High Cholesterol":203, "High Blood Pressure":153, "Metabolic Syndrome":95}},
        {"condition" : top5[3][0], "population" : top5[3][1]["withCondition"], "intersection" : {"Diabetes":95, "High Blood Pressure":88, "High Cholesterol":132}},
        {"condition" : top5[4][0], "population" : top5[4][1]["withCondition"], "intersection" : {"High Cholesterol":98, "High Blood Pressure":38,"Metabolic Syndrome":35 }}
    ]
    return data    

def top_diseases(das, request):
    from collections import OrderedDict
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
    r = das.response(p)
    conditions = OrderedDict()
    
    for i in sorted(r.data["reporting"]["Default"], key=lambda x: r.data["reporting"]["Default"][x]["withCondition"] 
        if x != "memberCount" and x != "memberMonths" else r.data["reporting"]["Default"][x], reverse=True): 
        if i != "memberCount" and i != "memberMonths":
            conditions.update({r.data["reporting"]["Default"][i]["description"] : r.data["reporting"]["Default"][i]})
    return conditions