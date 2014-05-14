import datetime, calendar, copy, json
from dateutil.relativedelta import relativedelta
from collections import OrderedDict
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned

def lastdate(das):
    params = {
        "service"  : "search", 
        "table"    : "smc",
        "page"     : "1",
        "pageSize" : "1",
        "order"    : "paidDate:desc"}
    r = das.to_dict(params)
    
    if "result_sets" not in r:
        now = datetime.datetime.now()
        return now.strftime('%Y-%m-%d')
    return r["result_sets"]["0"]["serviceDate"]

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
    if r.data:
        for i in sorted(r.data["reporting"]["Default"], key=lambda x: r.data["reporting"]["Default"][x]["withCondition"] 
            if x != "memberCount" and x != "memberMonths" else r.data["reporting"]["Default"][x], reverse=True): 
            if i != "memberCount" and i != "memberMonths":
                conditions.update({r.data["reporting"]["Default"][i]["name"] : r.data["reporting"]["Default"][i]["description"]})
    return conditions

def conditions(das, session=None):
    tw   = timewindow(das)
    if session and 'conditions' in session:
        cond = session['conditions']
    else:
        cond = chronic(das, tw)
        session['conditions'] = cond
        session.save()
    return cond

def format_query(q):
    query = ""
    for key, val in q.items():
        if val != "ALL":
            if key == "client":
                if val == "ABC corporation":
                    client_id = '01'
                if val == "XYZ private ltd":
                    client_id = '02'
                query += "{'groupId.eq':'"+client_id+"'},"
            elif key == "office":
                pass
            elif key == "level":
                pass
            elif key == "gender":
                query += "{'memberGender.eq':'"+val[0]+"'},"
            elif key == "age":
                if val != "70+":
                    val.split('-')[0]
                    query += "{'memberAge.gte':'"+val.split('-')[0]+"'},{'memberAge.lte':'"+val.split('-')[1]+"'},"
                else:
                    query += "{'memberAge.gte':'"+val[:2]+"'},"
            elif key == "condition":
                query += "{'qmMeasure.eq':'"+val+"'},"
            elif key == "relation":
                query += "{'relationshipId.eq':'"+val[0]+"'},"
    return query

def get_cohort(das, q):
    from data.models import Cohort
    traits = copy.deepcopy(q)
    #del traits["start_date"], traits["end_date"]
    if "reportingFrom" in traits: del traits["reportingFrom"]
    if "reportingTo" in traits: del traits["reportingTo"]
    if "comparisonFrom" in traits: del traits["comparisonFrom"]
    if "comparisonTo" in traits: del traits["comparisonTo"]
       
    if all(v == 'ALL' for v in traits.values()):
        return None
    
    for key, val in traits.items():
        if val == 'ALL':
            del traits[key]
    
    cond = chronic(das,q)
    
    for k1, v1 in traits.items():
        for k2, v2 in cond.items():
            if v1 == v2:
                traits[k1] = k2 
    
    o = OrderedDict(sorted([(key, val) for key, val in traits.items()]))
    t = json.dumps(o)
    
    try:
        cohort = Cohort.objects.get(traits=t).cohort_id
    except ObjectDoesNotExist:
        q2 = q.dict()
        if 'condition' in traits:
            q2['condition'] = traits['condition']
        query  = format_query(q2)
        cohort = das.cohort(query=query).id
        Cohort(cohort_id=cohort, traits=t).save()
    except MultipleObjectsReturned:
        cohort = Cohort.objects.filter(traits=t)[0].cohort_id
        for c in Cohort.objects.filter(traits=t)[1:]:
            das.cohort(id=c.cohort_id).delete()
            Cohort.objects.filter(cohort_id=c.cohort_id).delete()
        
    return cohort

