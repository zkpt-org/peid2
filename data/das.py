class Das:

    def __init__(self):
        import pycas
        CAS_SERVER  = "https://login.deerwalk.com/v1/tickets?username=ramesh.kumar@zakipoint.com&password=Ramesh#234"
        SERVICE_URL = "http://staging.zakipoint.com/data/"
        status, id, cookie = pycas.login(CAS_SERVER, SERVICE_URL)
        return status