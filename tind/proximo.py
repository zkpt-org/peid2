import os
import urllib2, urllib

if os.environ.get('PROXIMO_URL', '') != '':
  proxy  = urllib2.ProxyHandler({'http': os.environ.get('PROXIMO_URL', '')})
  auth   = urllib2.HTTPBasicAuthHandler()
  opener = urllib2.build_opener(proxy, auth, urllib2.HTTPHandler)
  urllib2.install_opener(opener)

conn = urllib2.urlopen('http://api.someservice.com/endpoint')
resp = make_response(conn.read())