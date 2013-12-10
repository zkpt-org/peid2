import urllib, pycurl, cStringIO
from BeautifulSoup import BeautifulSoup, BeautifulStoneSoup

class Das:
    def __init__(self):        
        self.HOST     = 'tind-lite.zakipoint.com'
        self.TICKETS  = 'https://login.zakipoint.com/cas/v1/tickets'
        self.SERVICE  = 'https://tind-lite.zakipoint.com/'
        self.PROXY    = 'https://tind-staging.herokuapp.com/data/'
        self.VALIDATE = 'https://login.deerwalk.com/cas/serviceValidate'
        self.API_URL  = 'https://das.deerwalk.com:8443'
        self.PT_URL   = 'https://login.deerwalk.com/cas/proxy'

    def auth(self, user, password):
        response = self.get_ticket_granting_ticket(user, password)
        
        soup = BeautifulSoup(response)
        tgt  = soup.body.form["action"]
        
        st  = self.get_service_ticket(tgt)
        pgt = self.validate_service(st)
        
        xml = BeautifulStoneSoup(str(pgt))
        pt  = self.get_proxy_ticket(xml.find('cas:proxygrantingticket').string)
        return pt
    
    def curl(self, url, p):
        response = cStringIO.StringIO()
        c = pycurl.Curl()
        c.setopt(c.URL, str(url))
        #c.setopt(c.SSL_VERIFYPEER , 0)
        c.setopt(c.POSTFIELDS, urllib.urlencode(p))
        c.setopt(c.WRITEFUNCTION, response.write)
        c.perform()
        c.close()
        return response.getvalue()
    
    def get_ticket_granting_ticket(self, user, password):
        p = {'username':user, 'password':password, 'hostUrl':self.HOST}
        return self.curl(self.TICKETS, p)
        
        #response = cStringIO.StringIO()
        #c = pycurl.Curl()
        #c.setopt(c.URL, 'https://login.zakipoint.com/cas/v1/tickets')
        #c.setopt(c.POSTFIELDS, urllib.urlencode(p))
        #c.setopt(c.WRITEFUNCTION, response.write)
        #c.perform()
        #c.close()
        #return response.getvalue()
                    
    def get_service_ticket(self, tgt):
        p = {"service":self.SERVICE}
        return self.curl(tgt, p)
        
        #response = cStringIO.StringIO()
        #c = pycurl.Curl()
        #c.setopt(c.URL, str(tgt))
        #c.setopt(c.SSL_VERIFYPEER , 0)
        #c.setopt(c.POSTFIELDS, urllib.urlencode(p))
        #c.setopt(c.WRITEFUNCTION, response.write)
        #c.perform()
        #c.close()
        #return response.getvalue()
        
    def validate_service(self, st):
        p = {"service":self.SERVICE, "ticket":st, "pgtUrl":self.PROXY}
        return self.curl(self.VALIDATE, p)
        
        #response = cStringIO.StringIO()
        #c = pycurl.Curl()
        #c.setopt(c.URL, self.VALIDATE)
        #c.setopt(c.POSTFIELDS, urllib.urlencode(p))
        #c.setopt(c.WRITEFUNCTION, response.write)
        #c.perform()
        #c.close()
        #return response.getvalue()
        
    def get_proxy_ticket(self, pgt):
        p = {'targetService':self.API_URL, 'pgt':pgt}
        return self.curl(self.PT_URL, p)
        
        response = cStringIO.StringIO()
        
        c = pycurl.Curl()
        c.setopt(c.URL, self.PT_URL)
        c.setopt(c.POSTFIELDS, urllib.urlencode(p))
        c.setopt(c.WRITEFUNCTION, response.write)
        c.perform()
        c.close()
        return response.getvalue()
        
    def api(self):
        pass
        