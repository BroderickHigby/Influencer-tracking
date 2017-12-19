import pickle
from django.core.cache.backends.memcached import BaseMemcachedCache

from google.appengine.api import memcache

class AppEngineMemcachedCache(BaseMemcachedCache):
	"An implementation of a cache binding using google's app engine memcache lib (compatible with python-memcached)"
	def __init__(self, server, params):
		super(AppEngineMemcachedCache, self).__init__(server, params,
				library=memcache,
				value_not_found_exception=ValueError
		)

	@property
	def _cache(self):
		if getattr(self, '_client', None) is None:
			self._client = self._lib.Client(self._servers, pickleProtocol=pickle.HIGHEST_PROTOCOL)
		return self._client
