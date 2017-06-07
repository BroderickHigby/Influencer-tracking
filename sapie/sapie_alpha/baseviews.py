from datetime import date
from django.template import loader
from django.http import HttpResponse

import json

date_handler = lambda obj: obj.strftime('%Y-%m-%d') if isinstance(obj, date) else None


def render(request, page, title, d={}):
    """
    Acts as a shortcut to rendering a page.
    RequestContext dep. in Django1.9, amended context.py
    """
    d['title'] = title
    template = loader.get_template(page)
    return HttpResponse(template.render(d, request))


def render_template(page, d={}, request=None):
    template = loader.get_template(page)
    if request:
        return template.render(request, d) # possibly (d, request)
    else:
        return template.render(d)


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
