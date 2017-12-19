"""sapie URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls import include, url
from django.contrib import admin
from . import views
from . import search


urlpatterns = [
     # url(r'^$', views.Echo.influencer_streaming_csv_view, name='influence'),
     # url(r'^write/', views.Echo.write, name='write'),
     # url(r'^search/', views.Search, name='search'),
     url(r'^$', views.Search.as_view(), name='search'),
]
