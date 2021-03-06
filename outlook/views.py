from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    return render_to_response('outlook/index.html',{"page":"outlook", "user":request.user}, context_instance=RequestContext(request))