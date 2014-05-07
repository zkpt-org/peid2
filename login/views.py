from django.shortcuts import render_to_response
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.contrib import auth
from data.das import Das

def index(request):
    return login(request)
    
def login(request):
    state = ""
    username = password = ''
        
    if request.POST:
        username = request.POST.get('username', '')
        password = request.POST.get('password', '')
        next     = request.POST.get('next', '/')

        user = auth.authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                auth.login(request, user)
                das = Das()
                proxy_granting_ticket = das.auth()
                if proxy_granting_ticket != '':
                    request.session['pgt'] = proxy_granting_ticket
                    request.session['jobQ'] = []
                    # state = "You're successfully logged in!"
                    return HttpResponseRedirect(next)
                else:
                    state = "There is a problem with the authentication system. Please try again in a few minutes."
            else:
                state = "Your account is not active, please contact the site administrator."
        else:
            state = "Your username or password was incorrect."

    return render_to_response('login/index.html',{'page':'login', 'state':state, 'username': username, "next":request.REQUEST.get('next')}, 
                              context_instance=RequestContext(request))
                              
def logout(request):
    auth.logout(request)
    state = "Logged out."
    return render_to_response('logout/index.html',{'page':'logout','state':state}, 
                              context_instance=RequestContext(request))