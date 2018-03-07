from database import es
import os
import sys
sys.path.insert(0, '/Users/mark/Desktop/sapie/webcrawler/yougod/yougod')
import scrape_engine
import datetime
sys.path.insert(0, '/Users/mark/Desktop/sapie/webcrawler/instagod/instagod')
from ig_scrape_engine import *
sys.path.insert(0, '/Users/mark/Desktop/sapie/webcrawler/twittergod/twittergod')
from twitter_scraper import *
sys.path.insert(0, '/Users/mark/Desktop/sapie/backend/')
import influencer

doc = {
    'size' : 10000,
    'query': {
        'match_all' : {}
    }
}
res = es.search(index="sapie_yt", doc_type='influencer', body=doc,scroll='1m')
scroll = res['_scroll_id']
res2 = es.scroll(scroll_id = scroll, scroll = '1m')

current_date = datetime.date.today().strftime("%B %d, %Y")

for entry in res['hits']['hits']:
    entry_source = entry['_source']

    if 'ig_growth' not in entry_source:
        entry_source['ig_growth'] = []
    if 'yt_growth' not in entry_source:
        entry_source['yt_growth'] = []
    if 'twitter_growth' not in entry_source:
        entry_source['twitter_growth'] = []

    yt_statistics = scrape_engine.channels_list_by_id_return('statistics', entry['_id'])
    new_yt_subs_count = yt_statistics['items'][0]['statistics']['subscriberCount']
    entry_source['yt_growth'].append({'time_of': current_date, 'sub_count': new_yt_subs_count})


    ig_url = entry_source['instagram']['url']
    ig_url_list = ig_url.split('/')
    ig_username = ig_url_list[len(ig_url_list) - 1]
    ig_scraper = ScrapeEngine()
    ig_posts_count,ig_followers_count,ig_following_count = ig_scraper.get_account_metrics(ig_username)
    entry_source['ig_growth'].append({'time_of': current_date, 'sub_count': ig_followers_count})
    #print(followers_count)


    twitter_url = entry_source['twitter']['url']
    twitter_url_list = twitter_url.split('/')
    twitter_username = twitter_url_list[len(twitter_url_list) - 1]
    twitter_scraper = TwitterScraper()
    twitter_description, twitter_favourites_count, twitter_followers_count, twitter_friends_count, twitter_id_str, twitter_screen_name = twitter_scraper.get_user_info(twitter_username)
    entry_source['ig_growth'].append({'time_of': current_date, 'sub_count': twitter_followers_count})
    print(followers_count)
    influencer.Influencer.create(entry_source, item['youtube']['id'])

    #print(new_yt_subs_count)
    print('-------')
