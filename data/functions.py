import datetime, calendar
from dateutil.relativedelta import relativedelta

def lastdate(das):
    try:
        params = {
            "service"  : "search", 
            "table"    : "smc",
            "page"     : "1",
            "pageSize" : "1",
            "order"    : "paidDate:desc"}
        
        return das.to_dict(params)["result_sets"]["0"]["serviceDate"]
    
    except Exception,e:
        print str(e)+"\n"
        with open("../errors.log", "a+") as f: f.write(str(e)+"\n")

def timewindow(das):
    """Get the last date recorded in the dataset."""
    ld = lastdate(das)
    d  = datetime.datetime.strptime(ld, "%Y-%m-%d")
    """Set to last day of the month."""
    last = datetime.date(d.year, d.month, calendar.monthrange(d.year, d.month)[1])
    
    """Set reporting and comparison time windows."""
    reporting_to    = last.strftime("%Y-%m-%d")
    reporting_from  = (last-relativedelta(years=1)+relativedelta(days=1)).strftime("%Y-%m-%d") 
    comparison_from = (last-relativedelta(years=2)+relativedelta(days=1)).strftime("%Y-%m-%d")
    comparison_to   = (last-relativedelta(years=1)).strftime("%Y-%m-%d")
    
    return {"reportingFrom" : reporting_from, "reportingTo" : reporting_to, 
            "comparisonFrom" : comparison_from, "comparisonTo" : comparison_to}

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
