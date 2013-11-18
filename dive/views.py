# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

@login_required #(redirect_field_name='login/')
def index(request):
    return render_to_response('dive/index.html',{}, context_instance=RequestContext(request))

@login_required
def box(request):
    return render_to_response('dive/box.html',{"user":request.user}, context_instance=RequestContext(request))
    
@login_required
def age(request):
    return render_to_response('dive/age.html',{"user":request.user}, context_instance=RequestContext(request))