from rq import Queue
from worker import conn
import time, hashlib
from collections import OrderedDict
from django.http import QueryDict
# from django.contrib.sessions.backends.db import SessionStore

def send(func, args, session, timeout=600, priority='default'):
    if register(session, args):
        q = Queue(priority, connection=conn, default_timeout=600)      
        job = q.enqueue_call(func=func, args=args, timeout=timeout)
        while job.result is None:
            time.sleep(1)
        # if job.result: unregister(session, args)
        return job.result
    
def register(session, args):
    h = hashlib.md5()
    
    h.update(str(order(args)))
    
    pid  = h.hexdigest()
    jobs = session["jobQ"]
    
    if pid not in jobs:
        jobs.append(pid)
        session["jobQ"] = jobs
        session.save()
        print session["jobQ"]
        return True
    
    print "By-passing job", pid
    
    return False
        

def unregister(session, args):
    h = hashlib.md5()
    h.update(str(order(args)))
    
    pid  = h.hexdigest()
    jobs = session["jobQ"]
    
    if pid in jobs:
        jobs.remove(pid)
        session["jobQ"] = jobs
        session.save()
        print session["jobQ"]
        
def order(args):
    l = []
    for a in args:
        if isinstance(a, QueryDict):
            print [(key, val) for key, val in dict(a.iterlists()).items()]
            s = OrderedDict(sorted([(key, val) for key, val in dict(a.iterlists()).items()]))
        elif isinstance(a, dict):
            s = OrderedDict(sorted([(key, val) for key, val in a.items()]))
        else:
            s = a
        l.append(s)
    # print str(tuple(l))
    return tuple(l)

        