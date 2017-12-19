from django.template import RequestContext, Context, loader
from django.http import HttpResponse

import json
date_handler = lambda obj: obj.strftime('%Y-%m-%d') if isinstance(obj, date) else None

def render(request, page, title, d={}):
	"""
	Acts as a shortcut to rendering a page.
	"""
	d['title'] = title
	template = loader.get_template(page)
	context = RequestContext(request, d)
	return HttpResponse(template.render(context))

def render_template(page, d={}, request=None):
	template = loader.get_template(page)
	if request:
		return template.render(RequestContext(request, d))
	else:
		return template.render(Context(d))

def HandlerResponse(success, *args, **kwargs):
	"""
	Defines the format used for handler responses.
	Returns a json object
	"""
	toreturn = {}
	toreturn['success'] = success


	for key, value in kwargs.items():
		toreturn[key] = value

	if not toreturn['success'] and not 'error' in toreturn:
		raise ValueError('An error description must be supplied when reporting an error')

	return HttpResponse(json.dumps(toreturn, default=date_handler))
