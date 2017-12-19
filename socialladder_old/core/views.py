from django.http import Http404, HttpResponse
from django.views.generic.base import View
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from google.appengine.ext import ndb
from google.appengine.ext import db

from google.appengine.api.logservice import logservice

import json
import re
from collections import OrderedDict
import whois

from core.baseviews import *
from core import models, functions, cache
import tasks

class Search(View):
	def get(self, r):
		return render(r, 'search.html', 'Search')


class Influencers(View):
	@method_decorator(csrf_exempt)
	def dispatch(self, *args, **kwargs):
		return super(Influencers, self).dispatch(*args, **kwargs)

	def get(self, r):
		return render(r, 'influencers.html', 'Influencers', {})

	def post(self, r):
		logservice.AUTOFLUSH_ENABLED = False

		try:
			influencer_ids = json.loads(r.POST['influencer_ids'])
		except:
			influencer_ids = []

		level = int(r.POST['level'])

		search_term = r.POST['search_term']

		influencers = cache.get_influencers(search_term, level, influencer_ids)

		#TEST
		if level > 1:
			return render(r, 'multitier-influencers.html', 'Multi Tier Influencers', {'follower_counts': influencers})

		logservice.flush()

		return HandlerResponse(True, influencers=influencers);


class Influencer(View):
	def get(self, r, influencer_urlkey):
		logservice.AUTOFLUSH_ENABLED = True
		influencer = ndb.Key(urlsafe=influencer_urlkey).get()
		gplus_info = ndb.Key(models.InfluencerGooglePlusInfo, influencer.key.id()).get()
		influencer.set_gplus_info(gplus_info)

		num_tweets, num_retweets, shared_domains = cache.get_influencer_tweet_info(influencer.key)

		#temporary get whois e-mails
		if influencer.whois_emails == [] and influencer.url:
			try:
				whois_data = whois.query(influencer.url)
				if whois_data != None and whois_data.emails:
					influencer.whois_emails = list(set([x for x in whois_data.emails if not 'buse' in x]))
					influencer.put()
			except:
				pass

		for domain, counts in shared_domains.items():
			shared_domains[domain]['total'] = sum([x for x in counts.values()])

		shared_domains = OrderedDict(sorted(shared_domains.items(), key=lambda t: t[1]['total'], reverse=True))

		datasets = []
		for sentiment in models.TWEET_SENTIMENT_CHOICES:
			dataset = {
				'label': sentiment.title(),
				'data': [y[sentiment] for x,y in shared_domains.items() if y['total'] > 1],
				'backgroundColor': models.TWEET_SENTIMENT_COLORS[sentiment],
				'borderColor': models.TWEET_SENTIMENT_COLORS[sentiment],
				'hoverBackgroundColor': models.TWEET_SENTIMENT_COLORS[sentiment],
				'hoverBorderColor': models.TWEET_SENTIMENT_COLORS[sentiment],
			}
			datasets.append(dataset)

		# create shared_domains graph data
		shared_domains_graph_data = {
			'type': 'bar',
			'data': {
				'labels': [x for x,y in shared_domains.items() if y['total'] > 1],
				'datasets': datasets,
			},
		}

		return render(r, 'influencer.html', None, {
			'influencer': influencer,
			'gplus_info': gplus_info,
			'num_tweets': num_tweets,
			'retweet_ratio': num_retweets * 100 / num_tweets if num_tweets > 0 else 0,
			'shared_domains': shared_domains,
			'shared_domains_graph_data': json.dumps(shared_domains_graph_data),
		})
