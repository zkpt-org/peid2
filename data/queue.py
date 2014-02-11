from rq import Queue
from worker import conn
import time

def send(func, args, timeout=600):
    q = Queue(connection=conn, default_timeout=600)
    job = q.enqueue_call(func=func, args=args, timeout=timeout)
    while job.result is None:
        time.sleep(1)
    return job.result