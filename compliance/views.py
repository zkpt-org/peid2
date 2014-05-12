from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from models import *
from data.das import Das
from data.functions import conditions
import json

@login_required
def index(request):

    das = Das(session=request.session)
    
    return render_to_response('compliance/index.html',{"page":"compliance", "user":request.user, "loop":[i for i in range(5)], "conditions" : conditions(das)}, context_instance=RequestContext(request))