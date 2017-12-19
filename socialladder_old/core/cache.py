from django.core.cache import cache
from django.conf import settings

from google.appengine.ext import ndb

import re

from core import models
import tasks

C_INFLUENCER_TWEETINFO = 'influencer-tweetinfo-%s' # influencer_id
C_INFLUENCERS = 'influencers-%s-%s' # search_term, level

class InfluencerTweetInfo(object):
	def __init__(self):
		self.num_tweets = 0
		self.num_retweets = 0
		self.shared_domains = {}

	def __call__(self, influencer_key):
		cache_key = C_INFLUENCER_TWEETINFO%influencer_key.id()
		tweet_data = cache.get(cache_key)

		if not tweet_data:
			tweets = models.Tweet.query(models.Tweet.influencer==influencer_key).map(self.analyze_tweet)

			tweet_data = (self.num_tweets, self.num_retweets, self.shared_domains)

			cache.set(cache_key, tweet_data, 86400)

		return tweet_data

	@ndb.tasklet
	def analyze_tweet(self, tweet):
		self.num_tweets += 1

		if tweet.retweet_count > 0:
			self.num_retweets += 1

		if not tweet.sentiment:
			raise ndb.Return(tweet)

		for url in tweet.unshorten_urls:
			match = re.search(r':\/\/([a-zA-Z0-9\.]+)\/', url)
			if match:
				domain = match.groups()[0]

				if domain not in self.shared_domains:
					self.shared_domains[domain] = {'positive': 0, 'neutral': 0, 'negative': 0, 'na': 0}
				self.shared_domains[domain][tweet.sentiment] += 1

		# temporary unshort tweet urls
		#tasks.unshort_tweet_urls.start(tweet_urlkey = tweet.key.urlsafe())

		raise ndb.Return(tweet)

def get_influencer_tweet_info(influencer_key):
	""" Gets an influencer's tweet info along with the shared domains data """
	obj = InfluencerTweetInfo()
	return obj(influencer_key)

class Influencers(object):
	def __init__(self):
		self.follower_counts = {}

	def __call__(self, search_term, level, influencer_ids=[]):
		self.search_term = search_term

		cache_key = C_INFLUENCERS%(search_term, level)
		influencers = cache.get(cache_key)

		if not influencers:
			if level == 1:
				influencers = self.get_first_level_influencers(search_term)
			else:
				influencers = self.get_multi_level_influencers(search_term, influencer_ids)
				return self.follower_counts #TEST

			# Temporary get gplus information for results
			#from core.api_utils import get_twitter_api
			#for influencer in influencers:
			#	if influencer == None: continue
			#	if not influencer.num_tweets or influencer.num_followers == -1:
			#		api = get_twitter_api('user')
			#		user = api.GetUser(influencer.key.id())
			#		influencer.num_followers = user.followers_count
			#		influencer.num_tweets = user.statuses_count
			#		influencer.put()

			#># grab gplus info
			#>gplus_info = ndb.Key(models.InfluencerGooglePlusInfo, influencer.key.id()).get()
			#>if gplus_info == None:
			#>	tasks.find_gplus_account.start(influencer_urlkey = influencer.key.urlsafe())

			#># unshort url
			#>if '://t.co' in influencer.url:
			#>	influencer.url = functions.unshort_url(influencer.url)
			#>	influencer.put()

			influencers = [{
				'external_id': i.external_id,
				'screen_name': i.screen_name,
				'social_authority': '%.2f'%i.social_authority,
				'name': i.name,
				'picture_url': i.picture_url,
				'description': i.description,
				'urlkey': i.key.urlsafe(),
			} for i in influencers if i != None]

			cache.set(cache_key, influencers)

		return influencers

	def get_first_level_influencers(self, search_term):
		""" Returns influencers based solely on the search term and checks the tweets for relevancy """
		influencers = models.Influencer.query() \
				.filter(models.Influencer.tags == search_term) \
				.order(-models.Influencer.social_authority) \
				.map(self.check_tweets, limit=100)

		return influencers

	def get_multi_level_influencers(self, search_term, influencer_ids):
		"""
		First gets the followers of the influencers on the above level (specified by ``influencer_ids``)
		Uses the resulting counts to get influencers who are followers of 2 or more influencers of the above level
		"""
		influencer_keys = [ndb.Key('Influencer', x) for x in influencer_ids]

		#TEST
		influencer_keys = [
				ndb.Key('Influencer', 65119912), #xdadevelopers
				ndb.Key('Influencer', 50766916), #Androidhealdline
		]

		models.Follower.query(models.Follower.influencer.IN(influencer_keys)).map(self.count_followers, keys_only=True)

		#TODO influencers query
		return []

	@ndb.tasklet
	def count_followers(self, follower_key):
		""" Adds to the follower count. Doesn't return anything """
		ids = follower_key.id().split('-')
		follower_id = ids[1]

		if not follower_id in self.follower_counts:
			self.follower_counts[follower_id] = 1
		else:
			self.follower_counts[follower_id] += 1

		raise ndb.Return(None)

	@ndb.tasklet
	def check_tweets(self, influencer):
		""" Checks to make sure the influencer has mentioned the search term in the last 50 tweets """
		tweets = yield models.Tweet.query().filter(models.Tweet.influencer == influencer.key).order(-models.Tweet.created_at).fetch_async(limit=50)
		relevant_tweets = len([x for x in tweets if self.search_term.lower() in x.text.lower()])

		relevancy_ratio = float(len(tweets)) / relevant_tweets if relevant_tweets > 0 and len(tweets) >= 50 else 0.0

		if relevancy_ratio >= settings.TWEET_AUTHORITY_RATIO_THRESHOLD:
			raise ndb.Return(influencer)
		else:
			raise ndb.Return(None)

def get_influencers(search_term, level, influencer_ids=[]):
	cls = Influencers()
	return cls(search_term, level, influencer_ids)
