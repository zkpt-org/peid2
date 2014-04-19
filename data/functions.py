def chronic(das, q):
    from collections import OrderedDict
    p = {
        "service"        :"report",
        "report"         :"chronicConditions",
        "reportingBasis" :"ServiceDate",
        "reportingFrom"  :q["reportingFrom"],
        "reportingTo"    :q["reportingTo"],
        "comparisonFrom" :q["comparisonFrom"], 
        "comparisonTo"   :q["comparisonTo"],
        "order"          : "Admits:desc",
    }
    r = das.response(p)
    conditions = OrderedDict()
    
    for i in sorted(r.data["reporting"]["Default"], key=lambda x: r.data["reporting"]["Default"][x]["withCondition"] 
        if x != "memberCount" and x != "memberMonths" else r.data["reporting"]["Default"][x], reverse=True): 
        if i != "memberCount" and i != "memberMonths":
            conditions.update({r.data["reporting"]["Default"][i]["name"] : r.data["reporting"]["Default"][i]["description"]})
    return conditions