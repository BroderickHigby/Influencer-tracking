from google.appengine.api import taskqueue

import logging

class AppEngineTask(object):
	def __unicode__(self):
		return self.function.__name__

	def __str__(self):
		return self.function.__name__

	def __init__(self, function, queue='default'):
		self.function = function
		self.queue = queue or 'default'

	def start(self, *args, **kwargs):
		taskqueue.add(
				url='/tasks/%s'%self.url,
				params=kwargs,
				queue_name=self.queue,
		) #TODO: Add name

	def cancel(self, *args, **kwargs):
		pass

	def __call__(self, *args, **kwargs):
		return self.function(*args, **kwargs)

	@property
	def url(self):
		""" Generates the task url based on the function name """
		return self.function.__name__.lower().replace('_','')

	@property
	def class_name(self):
		"""
		Generates a class name based on the function name
		Used for view generation
		"""
		return self.function.__name__.replace('_', ' ').title().replace(' ','')


def task(queue=None):
	"""
	Decorator for task functions.
	Returns an object that can either be called (run the function itself), or add the task to the queue
	"""
	def task_decorator(func):
		task = AppEngineTask(func, queue)
		return task
	return task_decorator

def unshort_url(self, url):
	""" If the url has been shortened, get the actual url """
	try:
		response = requests.head(url, allow_redirects=True)
		final_url = response.url
	except:
		final_url = url
	return final_url
