# Create your views here.
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from data.das import Das

@login_required
def index(request):
    status = Das()
    return render_to_response('data/index.html',{"status":status})