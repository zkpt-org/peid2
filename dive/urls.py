from django.conf.urls import patterns, url
from dive import views

urlpatterns = patterns('',
    url(r'^$', views.index),
    # url(r'^box/', views.index),
    # url(r'^age/', views.age),
    # url(r'^dials/$', views.dials),
    # url(r'^graph/$', views.graph)
)