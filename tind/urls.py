from django.conf.urls import patterns, include, url
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from tind import views

urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^$', views.index, name='index'),
    # url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', include('login.urls')),
    url(r'^home/', include('home.urls')),
    url(r'^outlook/', include('outlook.urls')),
    url(r'^outcomes/', include('outcomes.urls')),
    url(r'^compliance/', include('compliance.urls')),
    url(r'^projections/', include('projections.urls')),
)
urlpatterns += staticfiles_urlpatterns()