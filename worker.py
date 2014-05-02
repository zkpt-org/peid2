import os
import redis
from rq import Worker, Queue, Connection

os.environ['DJANGO_SETTINGS_MODULE'] = 'tind.settings'

listen = ['high', 'default', 'low']

redis_url = os.getenv('REDISTOGO_URL', 'redis://localhost:6379')
if not redis_url:
    raise RuntimeError('Set up Redis To Go first.')

conn = redis.from_url(redis_url)

if __name__ == '__main__':
    with Connection(conn):
        worker = Worker(map(Queue, listen))
        worker.work()