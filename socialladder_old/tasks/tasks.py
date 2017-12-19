from google.appengine.ext import ndb
from googleapiclient.errors import HttpError

from monkeylearn import MonkeyLearn

from django.conf import settings
from django.core.cache import cache

import sys
import logging
from datetime import datetime

from core.models import Search, Influencer, Follower, FollowersCursor, Tweet, UserIDList, GooglePlusAccount, InfluencerGooglePlusInfo
from core.functions import unshort_url, compare_twitter_to_gplus
from .base import AppEngineTask, task
from core.api_utils import get_twitter_api, get_tweepy_api, build_gplus_service
from core.social_authority import FollowerWonk

@task()
def start_search(search_term):
	search_key = Search.get_or_insert(search_term)
	get_influencers_by_term.start(search_term=search_term)
	#get_influencers_through_tweets.start(search_term=search_term) # this isn't really effective...

@task('users-search')
def get_influencers_by_term(search_term):
	""" Searches twitter users using the search_term and starts the process to obtain their information """
	search = Search.get_or_insert(search_term)
	api = get_twitter_api('users-search')
	users = api.GetUsersSearch(search_term, page=search.users_search_page)
	influencers = []

	for user in users:
		influencer = Influencer(id=user.id)
		influencer.apply_twitter_data(user)
		influencer.tags.append(search_term)
		influencers.append(influencer)

	search.users_search_page += 1
	if len(users) < 20 or search.users_search_page > 50: # 50 is Twitter's hard limit (1,000 users)
		search.users_search_finished = True
	search.put()

	ndb.put_multi(influencers)
	for influencer in influencers:
		get_influencer_info.start(influencer_urlkey = influencer.key.urlsafe())

	if not search.users_search_finished and search.users_search_page < 20: # soft limit
		get_influencers_by_term.start(search_term=search_term)

@task('search')
def get_influencers_through_tweets(search_term):
	""" Searches tweets using the search term to get the submitters and starts the process to obtain their information"""
	api = get_twitter_api('search')
	max_id = None
	users = {}
	tweets = []

	for i in range(1): # initially had a range of 5, for a total of 500 tweets
		if max_id:
			tweets_result = api.GetSearch(search_term, count=100, result_type="mixed", max_id=max_id)
		else:
			tweets_result = api.GetSearch(search_term, count=100, result_type="mixed")

		max_id = tweets_result[-1].id

		for tweet in tweets_result:
			user = tweet.user
			if not user.id in tweets:
				users[user.id] = user

			tweet_entity = Tweet(id=tweet.id)
			tweet_entity.apply_twitter_data(tweet)
			tweets.append(tweet_entity)

	ndb.put_multi(tweets)

	influencers = []
	for user in users.values():
		influencer = Influencer(id=user.id)
		influencer.apply_twitter_data(user)
		influencer.tags.append(search_term)
		influencers.append(influencer)

	ndb.put_multi(influencers)

	for influencer in influencers:
		get_influencer_info.start(influencer_urlkey = influencer.key.urlsafe())

@task('followers')
def get_influencer_followers(influencer_urlkey): # called in get_influencer_info()
	api = get_twitter_api('followers')
	influencer_key = ndb.Key(urlsafe=influencer_urlkey)
	influencer_id = influencer_key.id()
	cursors = ndb.Key(FollowersCursor, influencer_id).get() or FollowersCursor(id=influencer_id)

	if cursors.next == 0:
		return

	next_cursor, prev_cursor, follower_ids = api.GetFollowerIDsPaged(influencer_id, count=5000, cursor=cursors.next)

	followers_to_put = []

	for follower_id in follower_ids:
		follower = Follower(id='%s-%s'%(influencer_id, follower_id), influencer=influencer_key, follower=ndb.Key(Influencer, follower_id))
		followers_to_put.append(follower)

	keys = ndb.put_multi(followers_to_put)

	cursors.next = next_cursor
	cursors.prev = prev_cursor
	cursors.put()

	### Create influencers from the ids ###

	#num_followers = len(follower_ids)
	#cur_follower_index = 0

	#while cur_follower_index < num_followers:
	#	ids = follower_ids[cur_follower_index:(cur_follower_index+100)]

	#	if len(ids) == 0:
	#		break

	#	idlist = UserIDList(ids=ids)
	#	idlist_key = idlist.put()
	#	create_influencers_from_ids.start(idlist_urlkey=idlist_key.urlsafe())

	#	cur_follower_index += 100

	#	for i in range(12): # 12 = users/show api limit per minute
	#		if cur_follower_index < num_followers:
	#			create_influencer_from_id.start(
	#					influencer_id = follower_ids[cur_follower_index]
	#			)
	#			cur_follower_index += 1

	if cursors.next != 0:
		get_influencer_followers(influencer_urlkey=influencer_urlkey)

@task()
def get_social_authority(influencer, save=True):
	if isinstance(influencer, basestring):
		influencer = ndb.Key(urlsafe=influencer).get()

	if influencer.social_authority and influencer.social_authority >= 0:
		return

	fwonk = FollowerWonk()
	influencer.social_authority = float(fwonk.social_authority(influencer.screen_name))

	if save:
		influencer.put()

@task()
def get_influencer_info(influencer_urlkey, recursive='True'):
	"""
	Performs the following tasks:

	* Gets the social authority metric using the FollowerWonk API
	* Gets the influencer's followers, and if recursive is true, starts this function to get their information
	* Starts the processes to get the influencer's tweets
	"""
	lock_id = '{0}-lock-{1}'.format('get_influencer_info', influencer_urlkey)
	acquire_lock = lambda: cache.add(lock_id, 'true')
	release_lock = lambda: cache.delete(lock_id)

	if not acquire_lock():
		return

	influencer = ndb.Key(urlsafe=influencer_urlkey).get()

	get_social_authority(influencer, save=False)

	influencer.generate_tags()
	influencer.put()
	release_lock()

	if recursive == 'True':
		get_influencer_followers.start(influencer_urlkey=influencer.key.urlsafe())
		get_influencer_tweets.start(influencer_urlkey=influencer.key.urlsafe())

@task('gplus')
def find_gplus_account(influencer_urlkey):
	""" Attempts to link a Google Plus account to gain various information """
	influencer = ndb.Key(urlsafe=influencer_urlkey).get()

	plus_accounts = []
	logging.info("### Finding gplus account ###")

	# First, try to get the g+ account with the same username
	try:
		plus_data = build_gplus_service().get(userId='+%s'%influencer.screen_name).execute()
		plus_account = GooglePlusAccount(id=plus_data['id'], data=plus_data)
		plus_account.put()
		plus_accounts.append(plus_account)
		logging.info('Found account with screen name: %s'%influencer.screen_name)
	except HttpError as e:
		if e.resp['status'] == '404':
			pass
		else:
			raise

	# Next, try to get the g+ account where the id matches the twitter name
	if len(plus_accounts) == 0:
		try:
			plus_data = build_gplus_service().get(userId='+%s'%influencer.name).execute()
			plus_account = GooglePlusAccount(id=plus_data['id'], data=plus_data)
			plus_account.put()
			plus_accounts.append(plus_account)
			logging.info('Found account with name: %s'%influencer.name)
		except HttpError as e:
			if e.resp['status'] == '404':
				pass
			else:
				raise

	# If neither of the above worked, use the g+ api to get lists of potential matches
	if len(plus_accounts) == 0:
		logging.info('### Finding additional accounts ###')
		partial_plus_accounts = {} # key: gplus_id, value: gplus_account_data_dict
		result = build_gplus_service().search(query=influencer.screen_name).execute()
		for account in result['items']:
			if not account['id'] in plus_accounts:
				partial_plus_accounts[account['id']] = account

		result = build_gplus_service().search(query=influencer.name).execute()
		for account in result['items']:
			if not account['id'] in plus_accounts:
				partial_plus_accounts[account['id']] = account

		# Take our list of partial user information and for each one either get the previously saved entity, or create a new one
		account_keys = [ndb.Key(GooglePlusAccount, x) for x in partial_plus_accounts.keys()]

		saved_accounts = [x for x in ndb.get_multi(account_keys) if x != None]
		saved_account_ids = [x.key.id() for x in saved_accounts]

		new_accounts = []
		for account_id in [x for x in partial_plus_accounts.keys() if x not in saved_account_ids]:
			account_data = build_gplus_service().get(userId=account_id).execute()
			account = GooglePlusAccount(id=account_id, data=account_data)
			new_accounts.append(account)

		ndb.put_multi(new_accounts)

		plus_accounts = saved_accounts + new_accounts

	# Now take our list of GooglePlusAccounts and compare it with the influencer's twitter data,
	# organize it into a list of tuples containing the gplus account and the score for matching.
	logging.info('### Getting comparisons ###')
	account_scores = []
	for account in plus_accounts:
		score = compare_twitter_to_gplus(influencer, account)
		account_scores.append( (score, account) )
	account_scores.sort(cmp=lambda x,y: cmp(y[0], x[0]))

	logging.info('------------------------------------------------------------------------------------')
	logging.info('Accounts for consideration:')
	for score, account in account_scores:
		logging.info('------------------------------------------------------------------------------------')
		logging.info('%.2f: %s\t\t\t%s'%(score, account['displayName'], account['url']))

	# Finally, save the best fitting info
	if len(account_scores) > 0:
		#TODO: Check to see if this account has already been used by another influencer
		plus_info = InfluencerGooglePlusInfo(id=influencer.key.id())
		plus_info.apply_gplus_account(account_scores[0][1])
		plus_info.similar_gplus_accounts = [y.key for x, y in account_scores[1:]]
		plus_info.put()

@task('timelines')
def get_influencer_tweets(influencer_urlkey, iteration=1):
	"""
	Gets the most recent 200 tweets for an influencer,
	and classifies them and starts the task to unshorten their urls
	"""
	influencer_key = ndb.Key(urlsafe=influencer_urlkey)
	api = get_twitter_api('timelines')
	max_tweet = Tweet.query(Tweet.influencer == influencer_key).order(-Tweet.external_id).get()
	since_id = max_tweet.external_id if max_tweet else None

	timeline = api.GetUserTimeline(influencer_key.id(), count=200, since_id=since_id)
	if not timeline:
		return

	tweets = []
	for tweet in timeline:
		tweet_entity = Tweet(id=tweet.id)
		tweet_entity.apply_twitter_data(tweet)
		tweets.append(tweet_entity)

	# Classify with MonkeyLearn
	ml = MonkeyLearn(settings.ML_KEY)
	res = ml.classifiers.classify("cl_qkjxv9Ly", [tweet.text for tweet in tweets])

	for index, result in enumerate(res.result):
		tweets[index].sentiment = result[0]['label']
		tweets[index].sentiment_probability = result[0]['probability']

	ndb.put_multi(tweets)

	for tweet in tweets:
		unshort_tweet_urls.start(tweet_urlkey=tweet.key.urlsafe())

@task('user')
def create_influencer_from_id(influencer_id, recursive='False'):
	influencer = Influencer(id=influencer_id)
	api = get_twitter_api('user')
	twitter_user = api.GetUser(influencer_id)
	influencer.apply_twitter_data(twitter_user)

	if recursive == 'False':
		get_social_authority(influencer)
		influencer.generate_tags()
	else:
		influencer.put()
		get_influencer_info.start(influencer_urlkey=influencer.key.urlsafe(), recursive=recursive)

@task('users')
def create_influencers_from_ids(idlist_urlkey, recursive='False'):
	id_list_key = ndb.Key(urlsafe=idlist_urlkey)
	id_list_entity = id_list_key.get()

	api = get_tweepy_api('users')
	users = api.lookup_users(id_list_entity.ids)
	influencers = []

	for user in users:
		influencer = Influencer(id=user.id)
		influencer.apply_twitter_data(user)
		influencers.append(influencer)

	if recursive == 'False':
		for influencer in influencers:
			get_social_authority(influencer, save=False)
			influencer.generate_tags()
		ndb.put_multi(influencers)

	else: # recursive == 'True'
		ndb.put_multi(influencers)
		for influencer in influencers:
			get_influencer_info.start(influencer_urlkey=influencer.key.urlsafe(), recursive=recursive)

	id_list_key.delete()

@task()
def unshort_tweet_urls(tweet_urlkey):
	tweet = ndb.Key(urlsafe=tweet_urlkey).get()

	#if not tweet.unshorten_urls:
	unshorten_urls = []
	for url in tweet.original_urls:
		unshorten_urls.append(unshort_url(url))
	tweet.unshorten_urls = unshorten_urls
	tweet.put()

TASK_FUNCTIONS = []
current_module = sys.modules[__name__]
for function in current_module.__dict__.values():
	try:
		task = function
		_ = task.function.__name__ # For some reason this is required, or weird things happen...
		if isinstance(task, AppEngineTask):
			TASK_FUNCTIONS.append(task)
	except:
		pass
