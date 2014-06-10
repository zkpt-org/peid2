from collections import OrderedDict
from data.functions import get_cohort, shiftdate
from collections import OrderedDict
from models import *
from data.models import *
import pandas as pd
import json
# from django.utils.encoding import smart_str

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
    
    Graph1().find_or_create(request, data)
    
    return data    

def graph2(das, request):
    proc  = []
    top20 = TopProcedures.objects.filter(start_date=shiftdate(request.dict()['reportingFrom'], years=2), end_date=request.dict()['reportingTo']).values('grouper')
    
    for num in range(0,3):
        _from = shiftdate(request.dict()['reportingFrom'], years=num)
        _to   = shiftdate(request.dict()['reportingTo'], years=num)
        proc.append(top_procedures(das, request, _from, _to, top20))
    
    data = []
        
    for period in reversed(proc):
        for p in period:
            row = OrderedDict()
            row.update({"treatment" : p})
            # print smart_str(period[p]['dates'])
            # period[p]['dates'] = smart_str(period[p]['dates']).decode("utf-8", "replace")
            row.update(period[p])
            data.append(row)
    
    Graph2().find_or_create(request, data)
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
    
def top_procedures(das, request, _from, _to, top20):    
    cohort = get_cohort(das, request)
    
    p = {
    "service":"search",
    "table":"smc",
    "pageSize":"1000",
    "fields":"[procedureSubGrouperDescription1,paidAmount]",
    #"phiCSDate":_from,
    #"phiCEDate":_to,
    "query":"{'and':[{'serviceDate.gte':'" + _from + "'},{'serviceDate.lte':'" + _to + "'},{'procedureSubGrouper.eq':'[" + ",".join([t['grouper'] for t in top20]) + "]'}]}"
    }
    if cohort is not None:
        p.update({"cohortId":cohort})
    
    r  = das.all(p)
    df = r.dataframe()
    
    count = df.groupby('procedureSubGrouperDescription1')['procedureSubGrouperDescription1'].count()
    count = count.reset_index()
    
    paid = df.groupby('procedureSubGrouperDescription1')['paidAmount'].sum()
    paid = paid.reset_index()
    
    merge = count.merge(paid, on="procedureSubGrouperDescription1")
    
    procedures = pd.DataFrame(merge)
    procedures.columns=['description','count','paid']
    procs = procedures.sort(['paid'], ascending=False).reset_index() # Sorting by paid
    del procs['index']
    
    totalc = procs['count'].sum()
    totalp = procs['paid'].sum()
    top    = procs[0:20]
    
    response = OrderedDict()
    
    for i in range(0,20): 
        response.update({
            top.iloc[i]['description'] : {
                "count" : "{0:.2f}".format((top.iloc[i]['count']*1.0 / totalc)*100),
                "cost%" : "{0:.2f}".format((top.iloc[i]['paid']*1.0  / totalp)*100),
                "cost$" : "{0:,.2f}".format(top.iloc[i]['paid']),
                "totalcost" : "{0:,.2f}".format(round(totalp,2)),
                "dates" : _from + " " + u"\u2013" + " " + _to
            }
        })
    
    return response