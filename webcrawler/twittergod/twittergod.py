import sys
import os

root_path = os.path.abspath('.')
sys.path.append(root_path + '/' + 'twittergod')

from twitter_scraper import *
twitter_voyager = TwitterScraper()
#twitter_voyager.scrape_by_topics(topics=["superbowl", "america"])
twitter_voyager.get_user_info('realDonaldTrump')
