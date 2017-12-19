def webapp_add_wsgi_middleware(app):
	from google.appengine.ext.appstats import recording
	app = recording.appstats_wsgi_middleware(app)
	return app

from lib import add_lib_path
add_lib_path()

appstats_SHELL_OK = True
