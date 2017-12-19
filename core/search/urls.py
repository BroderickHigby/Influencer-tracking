from django.conf.urls import include, url
from django.contrib import admin
# Add this import
from django.contrib.auth import views


urlpatterns = [
    url(r'^search/?$', 'views.search_view', name='search'),
    url(r'^influencers/?$', 'views')
    url(r'^influencer/(?P<influencer_urlkey>[-A-Za-z0-9_]+)/$', views.Influencer.as_view(), name='influencer'),
    url(r'^influencers/$', views.Influencers.as_view(), name='influencers'),
    url(r'^$', views.Search.as_view(), name='search'),
]
