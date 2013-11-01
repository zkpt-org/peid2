from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

@login_required
def index(request):
    if 'alerts' not in request.session:
        request.session['alerts'] = "show"
    return render_to_response('home/index.html',{"page":"home","user":request.user, "alerts":request.session['alerts']}, context_instance=RequestContext(request))