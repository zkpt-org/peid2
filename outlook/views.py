from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
def index(request):
    return render_to_response('outlook/index.html',{"page":"outlook"}, context_instance=RequestContext(request))