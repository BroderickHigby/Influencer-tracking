from google.appengine.ext import ndb

from dateutil import parser
import pytz
import requests
from datetime import datetime

from core.functions import unshort_url
from tags import TAGS

class Search(ndb.Model):
	def __unicode__(self):
		return self.term

	term = ndb.StringProperty()
	users_search_page = ndb.IntegerProperty(default=1)
	users_search_finished = ndb.BooleanProperty(default=False)

	@classmethod
	def get_or_insert(cls, key_name, parent=None, app=None, namespace=None, context_options=None, **constructor_args):
		constructor_args['term'] = key_name
		return super(Search, cls).get_or_insert(key_name, parent=None, app=None, namespace=None, context_options=None, **constructor_args)

class Influencer(ndb.Model):
	external_id = ndb.IntegerProperty(required=True)
	screen_name = ndb.StringProperty()
	social_authority = ndb.FloatProperty()
	num_followers = ndb.IntegerProperty()
	num_tweets = ndb.IntegerProperty()
	name = ndb.StringProperty()
	description = ndb.TextProperty()
	picture_url = ndb.StringProperty()
	being_processed = ndb.BooleanProperty(default=False)
	url = ndb.TextProperty()
	tags = ndb.StringProperty(repeated=True)

	whois_emails = ndb.StringProperty(repeated=True)

	created_on = ndb.DateTimeProperty(auto_now_add=True)
	updated_on = ndb.DateTimeProperty(auto_now=True)

	def set_gplus_info(self, gplus_info):
		self._gplus_info = gplus_info

	@property
	def gplus_info(self):
		if not hasattr(self, '_gplus_info'):
			self._gplus_info = ndb.Key('InfluencerGooglePlusInfo', self.key.id()).get()
		return self._gplus_info

	def emails(self):
		"""
		Aggregates the e-mails from various sources / fields to one list
		The more reliable sources should be appended first
		"""

		emails = []

		if self.gplus_info:
			emails.extend([x['value'] for x in self.gplus_info.emails])

		if self.whois_emails:
			emails.extend(self.whois_emails)

		return emails

	@property
	def social_media_urls(self):
		""" Return a list of the urls that represent social media accounts """
		sm_urls = []
		twitter_applied = False

		for url in self.gplus_info.urls:
			if url['label'] in GPLUS_SOCIAL_MEDIA_URL_LABELS:
				sm_urls.append( (url['label'], url['value']) )

			if url['label'] == 'Twitter':
				twitter_applied = True

		if not twitter_applied:
			sm_urls.append( ('Twitter', 'https://twitter.com/%s'%self.screen_name) )

		sm_urls.append( ('GooglePlus', self.gplus_info.profile_url) )

		sm_urls.sort(cmp=lambda x,y: cmp(x[0], y[0]))

		return sm_urls

	def generate_tags(self):
		"""
		Creates a list of tags based on the influencer's data
		Right now it simply searches for specific key words in various fields
		"""
		fields_to_check = [
				'description',
		]

		for field in fields_to_check:
			for tag in TAGS:
				if tag in getattr(self, field).lower() and not tag in self.tags:
					self.tags.append(tag)

	def apply_twitter_data(self, user):
		""" Applies the user dict information gained from the Twitter APIs """
		self.external_id = user.id
		self.picture_url = user.profile_image_url.replace("_normal.", ".")
		self.name = user.name
		self.description = user.description
		self.url = unshort_url(user.url)
		self.screen_name = user.screen_name
		self.num_followers = user.followers_count
		self.num_tweets = user.statuses_count

class GooglePlusAccount(ndb.Model):
	data = ndb.JsonProperty(default={})

	def __getitem__(self, idx):
		try:
			return self.data[idx]
		except KeyError:
			return None

GPLUS_NAME_FIELDS = [('familyName', 'last_name'), ('formatted', 'formatted_name'), ('givenName', 'first_name'), ('middleName', 'middle_name')]

GPLUS_SOCIAL_MEDIA_URL_LABELS = [
		'Twitter',
		'Facebook',
		'Instagram',
		'YouTube',
		'Pinterest',
		'LinkedIn',
		'Vine',
		'Tumblr',
]

class InfluencerGooglePlusInfo(ndb.Model):
	google_plus_id = ndb.StringProperty() # id
	display_name = ndb.StringProperty()
	profile_url = ndb.StringProperty()
	first_name = ndb.StringProperty() # givenName
	last_name = ndb.StringProperty() # familyName
	middle_name = ndb.StringProperty()
	formatted_name = ndb.StringProperty()
	birthday = ndb.DateProperty()
	about = ndb.TextProperty() # aboutMe
	tagline = ndb.StringProperty()
	occupation = ndb.StringProperty()
	skills = ndb.StringProperty()
	emails = ndb.JsonProperty(default=[])
	urls = ndb.JsonProperty(default=[])
	organizations = ndb.JsonProperty(default=[])
	profile_image_url = ndb.StringProperty()

	updated_on = ndb.DateTimeProperty(auto_now=True)
	gplus_account_applied = ndb.KeyProperty(kind=GooglePlusAccount)
	similar_gplus_accounts = ndb.KeyProperty(kind=GooglePlusAccount, repeated=True)

	def apply_gplus_account(self, account):
		""" Takes a GooglePlusAccount entity and applies the information """
		self.google_plus_id = account['id']
		self.profile_url = account['url']
		self.display_name = account['displayName']
		self.about = account['aboutMe']
		self.tagline = account['tagline']
		self.occupation = account['occupation']
		self.skills = account['skills']

		if account['name'] != None:
			names = account['name']
			for account_field, field in GPLUS_NAME_FIELDS:
				if account_field in names:
					setattr(self, field, names[account_field])

		if account['birthday']:
			self.birthday = datetime.strptime(account['birthday'], '%Y-%m-%d').date()

		try:
			self.profile_image_url = account['image']['url']
		except:
			pass

		self.urls = account['urls'] or []
		self.organizations = account['organizations'] or []
		self.emails = account['emails'] or []

		self.gplus_account_applied = account.key

TWEET_SENTIMENT_CHOICES = [
		'negative',
		'neutral',
		'positive',
		'na',
]

TWEET_SENTIMENT_COLORS = {
		'negative': '#ff2200',
		'neutral': '#ffa600',
		'positive': '#1aff00',
		'na': '#a8a8a8',
}

class FollowersCursor(ndb.Model):
	next = ndb.IntegerProperty(default=-1)
	prev = ndb.IntegerProperty()

class Follower(ndb.Model):
	influencer = ndb.KeyProperty(kind=Influencer)
	follower = ndb.KeyProperty(kind=Influencer)

class Tweet(ndb.Model):
	external_id = ndb.IntegerProperty(required=True)
	influencer = ndb.KeyProperty(kind=Influencer)
	text = ndb.TextProperty()
	created_at = ndb.DateTimeProperty()
	retweet_count = ndb.IntegerProperty(default=0)
	is_retweet = ndb.BooleanProperty(default=False)
	original_urls = ndb.StringProperty(repeated=True)
	unshorten_urls = ndb.StringProperty(repeated=True)
	sentiment = ndb.StringProperty(choices=TWEET_SENTIMENT_CHOICES)
	sentiment_probability = ndb.FloatProperty()

	created_on = ndb.DateTimeProperty(auto_now_add=True)
	updated_on = ndb.DateTimeProperty(auto_now=True)

	def apply_twitter_data(self, tweet):
		self.external_id = tweet.id
		self.created_at = parser.parse(tweet.created_at).replace(tzinfo=None)
		self.influencer = ndb.Key(Influencer, tweet.user.id)
		self.original_urls = [tw.expanded_url for tw in tweet.urls]
		self.text = tweet.text
		self.is_retweet = tweet.retweeted

class UserIDList(ndb.Model):
	ids = ndb.IntegerProperty(repeated=True)
