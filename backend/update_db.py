from database import es
import os
import sys
sys.path.insert(0, '/home/ec2-user/sapie/webcrawler/yougod/yougod')
from scrape_engine import *
import datetime
sys.path.insert(0, '/home/ec2-user/sapie/webcrawler/instagod/instagod')
from ig_scrape_engine import *
sys.path.insert(0, '/home/ec2-user/sapie/webcrawler/twittergod/twittergod')
from twitter_scraper import *
sys.path.insert(0, '/home/ec2-user/sapie/backend/')
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

    yt_statistics = channels_list_by_id_return('statistics', entry['_id'])
    new_yt_subs_count = yt_statistics['items'][0]['statistics']['subscriberCount']
    entry_source['yt_growth'].append(current_date + " " + str(new_yt_subs_count))

    if 'instagram' in entry_source and 'url' in entry_source['instagram']:
        ig_url = entry_source['instagram']['url']
        if ig_url != '':
            print("BARK BARK BARK BARK")
            ig_url_list = ig_url.split('/')
            ig_username = ig_url_list[len(ig_url_list) - 1]
            ig_scraper = ScrapeEngine()
            if ig_username == '':
                ig_username = ig_url_list[len(ig_url_list) - 2]
            ig_posts_count,ig_followers_count,ig_following_count = ig_scraper.get_account_metrics(ig_username)
            if ig_followers_count != '':
                entry_source['ig_growth'].append(current_date + " " + str(ig_followers_count))
        else:
            entry_source['ig_growth'].append(current_date + " " + str(0))
    else:
        entry_source['ig_growth'].append(current_date + " " + str(0))
    #print(followers_count)

    if 'twitter' in entry_source and 'url' in entry_source['twitter']:
        twitter_url = entry_source['twitter']['url']
        if twitter_url != '':
            twitter_url_list = twitter_url.split('/')
            twitter_username = twitter_url_list[len(twitter_url_list) - 1]
            twitter_scraper = TwitterScraper()
            twitter_description, twitter_favourites_count, twitter_followers_count, twitter_friends_count, twitter_id_str, twitter_screen_name = twitter_scraper.get_user_info(twitter_username)
            entry_source['twitter_growth'].append(current_date + " " + str(twitter_followers_count))
        else:
            entry_source['twitter_growth'].append(current_date + " " + str(0))
    else:
        entry_source['twitter_growth'].append(current_date + " " + str(0))
    #print(new_yt_subs_count)
    #print(ig_followers_count)
    #print(twitter_followers_count)
    influencer.Influencer.create(entry_source, entry_source['youtube']['id'])

    #print(new_yt_subs_count)
    print('-------')
