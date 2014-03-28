import urllib, pycurl, cStringIO, os
from BeautifulSoup import BeautifulSoup, BeautifulStoneSoup
from data.models import ProxyTicket
from django.http import QueryDict

class Das:
    def __init__(self):        
        #self.HOST     = 'tind-lite.zakipoint.com'
        #self.TICKETS  = 'https://login.deerwalk.com/cas/v1/tickets'
        #self.SERVICE  = 'https://tind-lite.zakipoint.com'
        
        self.HOST     = 'sdemo.makalu.deerwalk.com' #hack
        self.TICKETS  = 'https://login.deerwalk.com/cas/v1/tickets'#hack
        self.SERVICE  = 'https://sdemo.makalu.deerwalk.com'#hack
        
        #self.PROXY    = 'https://tind-staging.herokuapp.com/data/proxy/'
        self.PROXY    = 'https://proxy.zakipoint.com/'
        self.VALIDATE = 'https://login.deerwalk.com/cas/serviceValidate'
        self.API_URL  = 'https://das.deerwalk.com'
        self.PT_URL   = 'https://login.deerwalk.com/cas/proxy'
        
        self.CLIENT_ID   = '2000'
        #self.CLIENT_NAME = 'tind'
        self.CLIENT_NAME = 'sdemo'#hack
    
    def auth(self, user, password):
        response = self.get_ticket_granting_ticket(user, password)
        
        html = BeautifulSoup(response)
        tgt  = html.body.form["action"]
        
        st  = self.get_service_ticket(tgt)
        vld = self.validate_service(st)
        xml = BeautifulStoneSoup(vld)
        iou = xml.find('cas:proxygrantingticket').string if xml.find('cas:proxygrantingticket') else None
        pgt = self.get_proxy_granting_ticket(iou)
        
        return pgt
    
    def curl(self, url, p, peer=False):
        response = cStringIO.StringIO()
        c = pycurl.Curl()
        c.setopt(c.URL, str(url))
        if not peer: c.setopt(c.SSL_VERIFYPEER , 0)
        c.setopt(c.SSLVERSION, 3)
        c.setopt(c.POSTFIELDS, urllib.urlencode(p))
        c.setopt(c.WRITEFUNCTION, response.write)
        c.perform()
        c.close()
        return response.getvalue()
    
    def get_ticket_granting_ticket(self, user, password):
        p = {'username':user, 'password':password, 'hostUrl':self.HOST}
        return self.curl(self.TICKETS, p)
    
    def get_service_ticket(self, tgt):
        p = {"service":self.SERVICE}
        return self.curl(tgt, p)
    
    def validate_service(self, st):
        p = {"service":self.SERVICE, "ticket":st, "pgtUrl":self.PROXY}
        return self.curl(self.VALIDATE, p)
    
    def get_proxy_granting_ticket(self, iou):
        p = {"iou":iou}
        return self.curl('https://proxy.zakipoint.com/ticket/get/', p)
    
    def get_proxy_ticket(self, pgt):
        p = {'targetService':self.API_URL, 'pgt':pgt}
        rsp = self.curl(self.PT_URL, p)
        xml = BeautifulStoneSoup(rsp)
        pt = xml.find('cas:proxyticket').string if xml.find('cas:proxyticket') else None
        return str(pt)
    
    def api(self, pgt, p):
        
        params = dict(p.iterlists()) if isinstance(p, QueryDict) else p
        
        for k, v in params.iteritems(): 
            if isinstance(v, list): params[k] = str(v[0])
                
        if params['service'] == "search":
            url = self.API_URL + "/memberSearch/"
        elif params['service'] == "report":
            url = self.API_URL + "/esReport/"
        elif params['service'] == "create":
            url = self.API_URL + "/cohort/create/"
        elif params['service'] == "update":
            url = self.API_URL + "/cohort/update/"
        elif params['service'] == "delete":
            url = self.API_URL + "/cohort/delete/"
        elif params['service'] == "config":
            url = self.API_URL + "/config/"
        else:
            url = self.API_URL + "/memberSearch/"
        
        del params['service']
        
        params['ticket']     = self.get_proxy_ticket(pgt)
        params['clientName'] = self.CLIENT_NAME
        params['clientId']   = self.CLIENT_ID
                
        #return url + "?" + urllib.urlencode(params)
        return self.curl(url, params, peer=True)
    
    def json_to_dict(self, pgt, p):
        import json
        data = self.api(pgt, p)
        return json.loads(data)
    
    def api_call(self, pgt, p):       
        params = dict(p.iterlists()) if isinstance(p, QueryDict) else p
        
        for k, v in params.iteritems(): 
            if isinstance(v, list): params[k] = str(v[0])
                
        if params['service'] == "search":
            url = self.API_URL + "/memberSearch/"
        elif params['service'] == "report":
            url = self.API_URL + "/esReport/"
        elif params['service'] == "create":
            url = self.API_URL + "/cohort/create/"
        elif params['service'] == "update":
            url = self.API_URL + "/cohort/update/"
        elif params['service'] == "delete":
            url = self.API_URL + "/cohort/delete/"
        elif params['service'] == "config":
            url = self.API_URL + "/config/"
        else:
            url = self.API_URL + "/memberSearch/"
        
        del params['service']
        
        params['ticket']     = self.get_proxy_ticket(pgt)
        params['clientName'] = self.CLIENT_NAME
        params['clientId']   = self.CLIENT_ID
                
        return url + "?" + urllib.urlencode(params)