from __future__ import unicode_literals

import twitter
import tweepy

from google.appengine.api import memcache
from googleapiclient.discovery import build

from django.conf import settings

TWITTER_CACHED_COUNTER_KEY = 'twitter_api_counter-%s'

def get_twitter_api_key(queue=''):
	""" Uses the current cached counter value to get the next twitter api key in the ring """
	counter_key = TWITTER_CACHED_COUNTER_KEY%queue
	current_index = memcache.get(counter_key) or 0

	num_keys = len(settings.TWITTER_KEYS)
	next_index = current_index + 1

	if next_index < num_keys:
		memcache.set(counter_key, next_index)
	else:
		memcache.set(counter_key, 0)

	return settings.TWITTER_KEYS[current_index]

def get_twitter_api(queue=''):
	selected_keys = get_twitter_api_key(queue)
	api = twitter.Api(consumer_key=selected_keys['CONSUMER_KEY'],
			consumer_secret=selected_keys['CONSUMER_SECRET'],
			access_token_key=selected_keys['ACCESS_TOKEN_KEY'],
			access_token_secret=selected_keys['ACCESS_TOKEN_SECRET'],
			cache=None,
	)
	return api

def get_tweepy_api(queue=''):
	selected_keys = get_twitter_api_key(queue)
	auth = tweepy.OAuthHandler(selected_keys['CONSUMER_KEY'], selected_keys['CONSUMER_SECRET'])
	auth.set_access_token(selected_keys['ACCESS_TOKEN_KEY'], selected_keys['ACCESS_TOKEN_SECRET'])

	api = tweepy.API(auth)

	return api

def build_gplus_service(resource_type='people'):
	service = build('plus', 'v1', developerKey=settings.GOOGLE_API_KEY)

	if not hasattr(service, resource_type):
		raise ValueError('%s is an incorrect google plus resource type'%resource_type)

	service = getattr(service, resource_type)()
	return service
