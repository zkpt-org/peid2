# Create your views here.
# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required

@login_required
def index(request):
    # return HttpResponse("Hello World")
    return render_to_response('outcomes/index.html',{"page":"outcomes", "user":request.user}, context_instance=RequestContext(request))