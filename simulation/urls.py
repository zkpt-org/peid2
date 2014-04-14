from django.conf.urls import patterns, url
from simulation import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
)