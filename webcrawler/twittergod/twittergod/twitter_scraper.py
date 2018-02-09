import tweepy
from tweepy import OAuthHandler
import csv
import datetime
from constants import *

class TwitterScraper:
    def __init__(self):
        auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
        self.api = tweepy.API(auth)

        ofilePosts = open('TwitterData.csv', 'ab')
        self.writerPosts = csv.writer(ofilePosts, delimiter=',')

    def get_hot_topics():
        trends1 = api.trends_place(1)
        data = trends1[0]
        trends = data['trends']
        dynamic_trends = []
        dynamic_trends = [trend['name'] for trend in trends]
        return dynamic_trends

    def scrape_by_topics(self, topics = []):
        if len(topics) == 0:
            topics = get_hot_topics()
        for topic in topics:
            search_results = self.api.search(topic, rpp=SEARCH_NUMBER, count=SEARCH_NUMBER, wait_on_rate_limit=True)
            for item_returned in search_results:
                timeNow = datetime.datetime.utcnow()
                diff = timeNow - item_returned.created_at
                post_age_in_minutes = (diff.days * 24 * 60) + (diff.seconds/60)
                now = datetime.datetime.utcnow()
                self.writerPosts.writerow([item_returned.author.name.encode('utf-8'), topic, item_returned.created_at, post_age_in_minutes, item_returned.in_reply_to_user_id_str, item_returned.is_quote_status, item_returned.in_reply_to_screen_name, item_returned.in_reply_to_status_id, item_returned.in_reply_to_status_id_str, item_returned.user.profile_image_url.encode('utf-8'), item_returned.user.id, item_returned.user.id_str.encode('utf-8'), item_returned.user.followers_count, item_returned.user.has_extended_profile, item_returned.user.profile_text_color.encode('utf-8'), item_returned.contributors, item_returned.source_url.encode('utf-8'), item_returned.source.encode('utf-8'), item_returned.author.followers_count, item_returned.text.encode('utf-8'), item_returned.retweet_count, item_returned.favorite_count, item_returned.id, item_returned.id_str, item_returned.lang, now, item_returned.author.location.encode('utf-8'), item_returned.author.screen_name.encode('utf-8'), item_returned.author.description.encode('utf-8')])
