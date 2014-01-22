from django.conf.urls import patterns, url
from data import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^auth/', views.authenticate),
    url(r'^proxy/', views.proxy),
    url(r'^api/(?P<service>.*)/', views.api),
    url(r'^api/(?P<service>.*)', views.api),
    url(r'^api/', views.api),
)