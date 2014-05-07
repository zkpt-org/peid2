from rq import Queue
from worker import conn
import time
import hashlib
from django.contrib.sessions.backends.db import SessionStore

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
    h.update(str(args))
    
    pid  = h.hexdigest()
    jobs = session["jobQ"]
    
    if pid not in jobs:
        jobs.append(pid)
        session["jobQ"] = jobs
        session.save()
        print session["jobQ"]
        return True
    return False
        

def unregister(session, args):
    h = hashlib.md5()
    h.update(str(args))
    
    pid  = h.hexdigest()
    jobs = session["jobQ"]
    
    if pid in jobs:
        jobs.remove(pid)
        session["jobQ"] = jobs
        session.save()
        print session["jobQ"]

        