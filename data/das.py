import urllib, pycurl, cStringIO, os
from BeautifulSoup import BeautifulSoup, BeautifulStoneSoup
from data.models import ProxyTicket

class Das:
    def __init__(self):        
        self.HOST     = 'tind-lite.zakipoint.com'
        self.TICKETS  = 'https://login.zakipoint.com/cas/v1/tickets'
        self.SERVICE  = 'https://tind-lite.zakipoint.com'
        self.PROXY    = 'https://tind-staging.herokuapp.com/data/proxy'
        self.VALIDATE = 'https://login.deerwalk.com/cas/serviceValidate'
        self.API_URL  = 'https://das.deerwalk.com:8443'
        self.PT_URL   = 'https://login.deerwalk.com/cas/proxy'
        self.TICKET   = 'https://tind-staging.herokuapp.com/data/ticket/'

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
        #p = {"iou":iou}
        #ticket = self.curl(self.TICKET, p)
        if iou:
           ticket = ProxyTicket.objects.filter(ticket_iou=iou)[0].ticket_id
        else:
           ticket = ProxyTicket.objects.latest('created').ticket_id
        return ticket

    def get_proxy_ticket(self, pgt):
        p = {'targetService':self.API_URL, 'pgt':pgt}
        rsp = self.curl(self.PT_URL, p)
        xml = BeautifulStoneSoup(rsp)
        pt = xml.find('cas:proxyticket').string if xml.find('cas:proxyticket') else None
        return str(pt)

    def api(self, pgt, params):
        service = params['service']
        
        if service is "search":
            url = self.API_URL + "/memberSearch"
        elif service is "report":
            url = self.API_URL + "/esReport"
        elif service is "create":
            url = self.API_URL + "/cohort/create"
        elif service is "update":
            url = self.API_URL + "/cohort/update"
        elif service is "delete":
            url = self.API_URL + "/cohort/delete"
        elif service is "config":
            url = self.API_URL + "/config"
        else:
            url = self.API_URL + "/memberSearch"
        
        params['ticket'] = self.get_proxy_ticket(pgt)
        params['clientName'] = 'tind'
        del params['service']
        
        #return self.curl(url, params, peer=False)
        #return self.get_proxy_ticket(pgt)
        return params
        