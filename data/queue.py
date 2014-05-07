from rq import Queue
from worker import conn
import time, hashlib
from collections import OrderedDict
from django.http import QueryDict
from data.das import Das
# from django.contrib.sessions.backends.db import SessionStore

def send(func, args, session, timeout=600, priority='default'):
    if register(session, func, args):
        q = Queue(priority, connection=conn, default_timeout=600)      
        job = q.enqueue_call(func=func, args=args, timeout=timeout)
        while job.result is None:
            time.sleep(1)
        if job.result: unregister(session, func, args)
        return job.result
    
def register(session, func, args):
    h = hashlib.md5()
    
    h.update(func.__name__ + str(order(args)))
    
    pid  = h.hexdigest()
    jobs = session["jobQ"]
    
    if pid not in jobs:
        jobs.append(pid)
        session["jobQ"] = jobs
        session.save()    
        print "adding job", pid
        print "jobs:", session["jobQ"]
        
        return True
    
    print "By-passing job", pid
    print "jobs:", session["jobQ"]
    
    return False
        

def unregister(session, func, args):
    h = hashlib.md5()
    h.update(func.__name__ + str(order(args)))
    
    pid  = h.hexdigest()
    jobs = session["jobQ"]
    
    if pid in jobs:
        jobs.remove(pid)
        session["jobQ"] = jobs
        session.save()
    
        print "deleting job", pid
        print "jobs:", session["jobQ"]
    
    
def order(args):
    l = []
    print args
    for a in args:
        if isinstance(a, QueryDict):
            s = OrderedDict(sorted([(key, val) for key, val in dict(a.iterlists()).items()]))
        elif isinstance(a, dict):
            s = OrderedDict(sorted([(key, val) for key, val in a.items()]))
        elif isinstance(a, Das):
            s = "DAS client instance"
        else:
            s = ""
        l.append(s)
    return tuple(sorted(l))

        