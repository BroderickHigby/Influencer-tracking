"""
Django settings for socialladder project.
"""

from djangoappengine.settings_base import *

import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SECRET_KEY = 'vr$$$aaf3ex#4x*t4cm738+^ai5-t-y=x6s^br845xg6+7ut3*'

DEBUG = True

ALLOWED_HOSTS = []

# Application definition

DEFAULT_APPS = (
	'django.contrib.admin',
	'django.contrib.auth',
	'django.contrib.contenttypes',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
)

FIRST_PARTY_APPS = (
		'core',
		'tasks',
)

THIRD_PARTY_APPS = (
		'djangotoolbox',
		'autoload',
		'dbindexer',
		'rest_framework',
		'django_extensions',
		'django',
		'djangoappengine',
		#'debug_toolbar',
)

INSTALLED_APPS = DEFAULT_APPS + FIRST_PARTY_APPS + THIRD_PARTY_APPS

MIDDLEWARE_CLASSES = [
	'google.appengine.ext.appstats.recording.AppStatsDjangoMiddleware',
	'google.appengine.ext.ndb.django_middleware.NdbDjangoMiddleware',
	#'debug_toolbar.middleware.DebugToolbarMiddleware',
	'autoload.middleware.AutoloadMiddleware',
	'django.middleware.common.CommonMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'urls'

TEMPLATE_CONTEXT_PROCESSORS = (
		"django.contrib.auth.context_processors.auth",
		"django.core.context_processors.debug",
		"django.core.context_processors.i18n",
		"django.core.context_processors.media",
		"django.core.context_processors.static",
		"django.core.context_processors.tz",
		'django.core.context_processors.request',
		"django.contrib.messages.context_processors.messages",
)

WSGI_APPLICATION = 'wsgi.application'

DATABASES = {
	'default': {
			'ENGINE': 'djangoappengine.db',
			'DEV_APPSERVER_OPTIONS': {
				'use_sqlite': True,
				'high_replication': True,
			},
	}
}

CACHES = {
	'default': {
		'BACKEND': 'core.backends.AppEngineMemcachedCache',
	}
}

# Internationalization

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'

DEBUG_TOOLBAR_PATCH_SETTINGS = False
INTERNAL_IPS = ('127.0.0.1', '45.56.3.210', '192.168.1.10')

### External API Keys ###

TWITTER_KEYS = [
	{
		"CONSUMER_KEY": "7MycB49L3ou3j9JmJsX5bNPH2",
		"CONSUMER_SECRET": "T7inkCuwA71c4ry1dTRzUWrjJEmiMthRb1CvPhy1gdi8WkHl0B",
		"ACCESS_TOKEN_KEY": "83511343-nfB4maaJRWo6WrMfVbQWSXuPePkNALz2qDzSkJsyd",
		"ACCESS_TOKEN_SECRET": "reyRM74oZSdSFj6CQWxTrzpNJLHYjVUa8QeiFNXqurgnJ",
	},
	{
		"CONSUMER_KEY": "qOMHvks7eFt6cNHTLqoxDOLrB",
		"CONSUMER_SECRET": "k5AdPfoHAE70QHCK6yYjxMJ50ri7yddExpP4PYd1xWTUOJV0O9",
		"ACCESS_TOKEN_KEY": "14049058-P4N3ZuDbKj6RKqmwfiG878KQzUaml1bM4EcYhFmQf",
		"ACCESS_TOKEN_SECRET": "8ia5HHmcwWC7RnoDAhkNAypagCbNy4qpoDKBSCA8G3VxE",
	}
]


FOLLOWERS_WONK_ACCESS_ID = 'member-MGI5NzY5YjAtYjM0Ni01NGNlLWJlZWUtMGJhNDM0MjE0MGVm'
FOLLOWERS_WONK_SECRET = 'bhg9zgpjnxgwpjcgns9ngnycfqaryoog'

SOCIAL_AUTHORITY_THRESHOLD = 50
TWEET_AUTHORITY_RATIO_THRESHOLD = .3

GOOGLE_API_KEY = 'AIzaSyBXonGAHXJ0K63GRTk-xsHTGJBX8qO9x68'

ML_KEY = "82e380661bd08f34d81eb16994cd2dd0bef0dfb6"
