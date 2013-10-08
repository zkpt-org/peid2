from django.conf.urls import patterns, url
from outcomes import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index')
)