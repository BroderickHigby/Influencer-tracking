from django.http import HttpResponse
from django.views.generic.base import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

import sys
import logging
import copy

from .tasks import TASK_FUNCTIONS

current_module = sys.modules[__name__]

class TaskView(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, *args, **kwargs):
		return super(TaskView, self).dispatch(*args, **kwargs)

def post_generator(function):
	def post(self, r):
		args = {}
		for key, value in r.POST.items():
			if isinstance(value, list):
				value = value[0]

			try:
				value = long(value)
			except:
				pass

			args[key] = value

		function(**args)
		return HttpResponse('success')
	return post

for task in TASK_FUNCTIONS:
	new_class = type(task.class_name, (TaskView,), {
		'post': post_generator(task.function),
	})

	setattr(current_module, task.class_name, new_class)
