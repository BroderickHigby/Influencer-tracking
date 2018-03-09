import tweepy
from tweepy import OAuthHandler
import csv
import datetime
import time
import boto3
from constants import *

class TwitterScraper:
    def __init__(self):
        auth = OAuthHandler('N6LRGUIIoI7856wiZYwLlwCDr', 'qdfYwP3sJcNAhZv8a8ozAtKjJTLx0K5jMt3vr7tVkN4CVVLGhB')
        auth.set_access_token('2552416214-NqDLDfZCQ7h2GG1uzuzy7Py4MNRfDhl8WYghFMl', '6psI9jeWDQySdYl1uCoLKmFqWfdqB9pwIbZmS3XXleU5t')
        self.api = tweepy.API(auth)


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

    def get_user_info(self, username):
        try:
            user = self.api.get_user(username)
            return user.description, user.favourites_count, user.followers_count, user.friends_count, user.id_str, user.screen_name, user.location
        except:
            return '', '', '', '', '', ''
    def analyze_demographics_of_followers(self, username):
        following_usernames = TwitterScraper.get_followers_info(username, self.api)
        TwitterScraper.extract_followers_data(following_usernames)

    @staticmethod
    def get_followers_info(username, api):
        users = tweepy.Cursor(api.followers, screen_name=username).items()
        print(users)
        following_users = []
        while True:
            try:
                user = next(users)
            except tweepy.TweepError:
                time.sleep(60*15)
                user = next(users)
            except StopIteration:
                break
            #print ("@" + user.screen_name)
            following_users.append(user)
            if len(following_users) > 330:
                break
        return following_users

    @staticmethod
    def extract_followers_data(followers):
        print("in extract_followers_data")
        locations = {}
        cited_interests = {}
        languages = {}

        #analyze pictures(profile_image_url) for:
        #genders = {}
        #ages = {}

        comprehend = boto3.client(service_name='comprehend', region_name='us-west-2')

        for follower in followers:
            if follower.description != '':
                if follower.lang == 'en' or follower.lang == 'es':
                    key_phrases = comprehend.detect_key_phrases(Text=follower.description, LanguageCode=follower.lang)
                    for key_phrase in key_phrases['KeyPhrases']:
                        normalized_key_phrase = key_phrase['Text'].lower()
                        if normalized_key_phrase not in cited_interests:
                            cited_interests[normalized_key_phrase] = 1
                        else:
                            cited_interests[normalized_key_phrase] = cited_interests[normalized_key_phrase] + 1

            if follower.location not in locations:
                locations[follower.location] = 1
            else:
                locations[follower.location] = locations[follower.location] + 1

            if follower.lang not in languages:
                languages[follower.lang] = 1
            else:
                languages[follower.lang] = languages[follower.lang] + 1
        print('popular locations:')
        print(locations)
        print("\n")
        print('popular languages:')
        print(languages)
        print("\n")
        print('popular nouns:')
        cited_interests2 = {k: v for k, v in cited_interests.items() if v > 1}
        print(cited_interests2)
