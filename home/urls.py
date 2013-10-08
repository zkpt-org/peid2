from django.conf.urls import patterns, url
from home import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    # url(r'^dials/$', views.dials),
    # url(r'^graph/$', views.graph)
)