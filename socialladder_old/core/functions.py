import re
import logging
from fuzzywuzzy import fuzz
import requests

def unshort_url(url):
	""" If the url has been shortened, get the actual url """
	try:
		response = requests.head(url, allow_redirects=True)
		final_url = response.url
	except:
		final_url = url
	return final_url

MAX_COMPARATIVE_POINTS = 120.0
MAX_SCREEN_NAME_POINTS = 80.0
MAX_NAME_POINTS = 20.0
WEBSITE_URL_MATCH = 50
OTHER_URL_MATCH = 20

def compare_twitter_to_gplus(influencer, gplus_account):
	"""
	Compares the information of a Twitter account (the influencer) to the information of a Google Plus account
	and returns a metric (0.0 - 1.0) as to how well they match
	"""
	points = 0
	logging.info('--------------------------------------------------------')
	logging.info('Checking comparison: %s: %s'%(gplus_account['displayName'], gplus_account['url']))
	logging.info('--------------------------------------------------------')

	username_applied = False
	match = re.search(r'^(http|https)://plus.google.com/\+(?P<plus_username>.*)', gplus_account['url'])
	if match:
		gplus_username = match.group('plus_username')
		points += fuzz.ratio(influencer.screen_name, gplus_username) / 100. * MAX_SCREEN_NAME_POINTS
		logging.info('MATCH: username - %s'%fuzz.ratio(influencer.screen_name, gplus_username))
		username_applied = True

	name_ratio = fuzz.ratio(gplus_account['displayName'], influencer.name)
	points += name_ratio / 100. * MAX_NAME_POINTS
	logging.info('MATCH: name - %s'%fuzz.ratio(gplus_account['displayName'], influencer.name))

	url_applied = False
	for url in (gplus_account['urls'] or []):
		if url['label'] == 'Twitter':
			if not username_applied:
				logging.info('MATCH: twitter url')
				match = re.search(r'^(http|https)://www.twitter.com/(?P<twitter_username>.*)', url['value'])
				if match and influencer.screen_name.lower() == match.group('twitter_username').lower():
					points += 70
					username_applied = True

		elif not url_applied and url['value'] == influencer.url:
			points += WEBSITE_URL_MATCH if url['type'] == 'website' else OTHER_URL_MATCH
			logging.info('MATCH: website - %s'%(WEBSITE_URL_MATCH if url['type'] == 'website' else OTHER_URL_MATCH))
			url_applied = True

	logging.info('OUTCOME: %s'%(points/MAX_COMPARATIVE_POINTS))
	logging.info('--------------------------------------------------------')
	return points / MAX_COMPARATIVE_POINTS
