from django.conf.urls import url, include

from core import views

urlpatterns = [
	url(r'^influencer/(?P<influencer_urlkey>[-A-Za-z0-9_]+)/$', views.Influencer.as_view(), name='influencer'),
	url(r'^influencers/$', views.Influencers.as_view(), name='influencers'),
	url(r'^$', views.Search.as_view(), name='search'),
]
