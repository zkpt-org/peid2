from django.conf.urls import patterns, url
from home import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^hide_alerts/', views.hide_alerts, name='hide_alerts'),
    url(r'^show_alerts/', views.show_alerts, name='show_alerts'),
    url(r'^graph1/$', views.graph1),
    url(r'^graph2/$', views.graph2),
)