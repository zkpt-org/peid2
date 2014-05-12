from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
from data.functions import conditions

@login_required
def index(request):

    das = Das(session=request.session)

    return render_to_response('providers/index.html',{"page":"providers", "user":request.user, "conditions" : conditions(das)},context_instance=RequestContext(request))
