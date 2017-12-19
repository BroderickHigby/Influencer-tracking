from django.conf.urls import patterns, include, url

from .tasks import TASK_FUNCTIONS
from . import views

urls = []

for task in TASK_FUNCTIONS:
	view = getattr(views, task.class_name)
	new_url = url(r'^%s'%task.url, view.as_view())
	urls.append(new_url)

urlpatterns = patterns('', *tuple(urls))
