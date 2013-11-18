class Das:

    def __init__(self):
        #import pycas
        import urllib2
        #username=ramesh.kumar%40zakipoint.com&password=Ramesh%23234&hostUrl=http%3A%2F%2Ftind.zakipoint.com
        CAS_SERVER  = "https://login.deerwalk.com/v1/tickets?username=ramesh.kumar@zakipoint.com&password=Ramesh#234"
        SERVICE_URL = "http://staging.zakipoint.com/data/"
        #status, id, cookie = pycas.login(CAS_SERVER, SERVICE_URL)
        
        status = urllib2.urlopen("https://login.deerwalk.com/v1/tickets?username=ramesh.kumar@zakipoint.com&password=Ramesh#234&hostUrl=http://tind.zakipoint.com")
        
        
        return status