import os
import sys
sys.path.insert(0, '/Users/mark/Desktop/sapie/backend/')
import influencer
import requests
import json
base_url = "https://www.googleapis.com/youtube/v3"
api_key = "AIzaSyDhbjoj6RQNvYgOulCZSJS6ARk9LxaVJxY"
import re
from bs4 import BeautifulSoup
sys.path.insert(0, '/Users/mark/Desktop/sapie/webcrawler/instagod/instagod')
from ig_scrape_engine import *
sys.path.insert(0, '/Users/mark/Desktop/sapie/webcrawler/twittergod/twittergod')
from twitter_scraper import *
import pprint
pp = pprint.PrettyPrinter(indent=4)
def print_response(response):
    for ii in response:
        print(ii)
        print('---------')

# Build a resource based on a list of properties given as key-value pairs.
# Leave properties with empty values out of the inserted resource.
def build_resource(properties):
  resource = {}
  for p in properties:
    # Given a key like "snippet.title", split into "snippet" and "title", where
    # "snippet" will be an object and "title" will be a property in that object.
    prop_array = p.split('.')
    ref = resource
    for pa in range(0, len(prop_array)):
      is_array = False
      key = prop_array[pa]

      # For properties that have array values, convert a name like
      # "snippet.tags[]" to snippet.tags, and set a flag to handle
      # the value as an array.
      if key[-2:] == '[]':
        key = key[0:len(key)-2:]
        is_array = True

      if pa == (len(prop_array) - 1):
        # Leave properties without values out of inserted resource.
        if properties[p]:
          if is_array:
            ref[key] = properties[p].split(',')
          else:
            ref[key] = properties[p]
      elif key not in ref:
        # For example, the property is "snippet.title", but the resource does
        # not yet have a "snippet" object. Create the snippet object here.
        # Setting "ref = ref[key]" means that in the next time through the
        # "for pa in range ..." loop, we will be setting a property in the
        # resource's "snippet" object.
        ref[key] = {}
        ref = ref[key]
      else:
        # For example, the property is "snippet.description", and the resource
        # already has a "snippet" object.
        ref = ref[key]
  return resource

# Remove keyword arguments that are not set
def remove_empty_kwargs(**kwargs):
  good_kwargs = {}
  if kwargs is not None:
    for key, value in kwargs.items():
      if value:
        good_kwargs[key] = value
  return good_kwargs


def search_list_by_keyword(part, maxResults, q):
  query_url = base_url + "/search?part=snippet&maxResults=25&q=" + q + "&key=" + api_key
  r = requests.get(query_url)
  data = json.loads(r.text)
  print('8888888')
  explore_returned_items(data['items'], q)


def channels_list_by_id(q, part, id):
    query_url = base_url + "/channels?part=" + part + "&id=" + id + "&type=channel&key=" + api_key
    r = requests.get(query_url)
    data = json.loads(r.text)
    print("99999")
    #try:
    if 'items' in data:
        for item in data['items']:
            try:
                desc = str(item['snippet']['description'])
                match = re.search(r'[\w\.-]+@[\w\.-]+', desc)
                if match != None:
                    found_email = match.group(0)
                else:
                    found_email = ''
            except:
                found_email = ''

            facebook_url, twitter_url, instagram_url, google_plus_url, twitter_description, twitter_favourites_count, twitter_followers_count, twitter_friends_count, twitter_id_str, twitter_screen_name, ig_posts_count, ig_followers_count, ig_following_count = pull_social_media_links(item['snippet']['title'])
            item['platform_base'] = "youtube"
            item['industry'] = q
            item['email'] = found_email

            if 'localizations' in item:
                item.pop('localizations', None)

            item["facebook"] = {}
            item["facebook"]["url"] = facebook_url
            #item["facebook"] = json.dumps({"url" : facebook_url})
            #item["facebook"]["url"] = facebook_url

            item['twitter'] = {}
            item['twitter']['url'] = twitter_url
            item['twitter']['description'] = twitter_description
            item['twitter']['favourites_count'] = twitter_favourites_count
            item['twitter']['followers_count'] = twitter_followers_count
            item['twitter']['friends_count'] = twitter_friends_count
            item['twitter']['id_str'] = twitter_id_str
            item['twitter']['screen_name'] = twitter_screen_name

            item['instagram'] = {}
            item['instagram']['url'] = instagram_url
            item['instagram']['posts_count'] = ig_posts_count
            item['instagram']['followers_count'] = ig_followers_count
            item['instagram']['following_count'] = ig_following_count

            item['youtube'] = {}
            item['youtube']['kind'] = item['kind']
            item.pop('kind', None)
            item['youtube']['etag'] = item['etag']
            item.pop('etag', None)
            item['youtube']['id'] = item['id']
            item.pop('id', None)
            item['youtube']['snippet'] = item['snippet']
            item.pop('snippet', None)
            item['youtube']['brandingSettings'] = item['brandingSettings']
            item.pop('brandingSettings', None)
            item['youtube']['contentDetails'] = item['contentDetails']
            item.pop('contentDetails', None)
            item['youtube']['statistics'] = item['statistics']
            item.pop('statistics', None)

            item['google_plus_url'] = google_plus_url
            print('696969')
            #print(item)
            pp.pprint(item)

            base_influencer_score = 75
            youtube_component = float(item['youtube']['statistics']['subscriberCount']) / 10000000.0
            if youtube_component > 1.00:
                youtube_component = 1.00
            youtube_component = youtube_component * 5.0
            score = float(base_influencer_score) + youtube_component
            if item['email'] != '':
                score += 5.00
            if item['google_plus_url'] != '':
                score += 5.00
            if item["facebook"]["url"] != '':
                score += 5.00
            if item['instagram']['url'] != '':
                score += 5.00
            if item['twitter']['url'] != '':
                score += 5.00
            item['influencer_score'] = score
            print("OMG")
            print(score)
            influencer.Influencer.create(item, item['youtube']['id'])
    #except:
        #print("some error")

def pull_social_media_links(username):
    url = 'https://www.youtube.com/user/' + username + '/about'
    html = requests.get(url)
    soup = BeautifulSoup(html.text, 'lxml')
    facebook_url = ''
    twitter_url = ''
    instagram_url = ''
    google_plus_url = ''
    for a in soup.find_all('a', href=True):
        #print ("Found the URL:", a['href'])
        if 'facebook' in a['href'] and '/redirect?' not in a['href']:
            facebook_url = a['href']
        elif 'twitter' in a['href'] and '/redirect?' not in a['href']:
            twitter_url = a['href']
        elif 'instagram' in a['href'] and '/redirect?' not in a['href']:
            instagram_url = a['href']
        elif 'plus.google.com' in a['href'] and 'youtube' not in a['href']:
            google_plus_url = a['href']
    for link in soup.find_all('link', href=True):
        #print ("Found the URL:", link['href'])
        if 'plus.google.com' in a['href'] and 'youtube' not in a['href']:
            google_plus_url = a['href']
            break
    print(facebook_url)
    print(twitter_url)
    print(instagram_url)
    print(google_plus_url)
    twitter_username = twitter_url.split('/')
    twitter_username = twitter_username[len(twitter_username) - 1]

    twitter_description = ''
    twitter_favourites_count = ''
    twitter_followers_count = ''
    twitter_friends_count = ''
    twitter_id_str = ''
    twitter_screen_name = ''
    if twitter_username != '':
        twitter_description, twitter_favourites_count, twitter_followers_count, twitter_friends_count, twitter_id_str, twitter_screen_name = explore_twitter(twitter_username)

    ig_username = instagram_url.split('/')
    if len(ig_username) > 2:
        ig_username = ig_username[3]
    else:
        ig_username = ''
    ig_posts_count = ''
    ig_followers_count = ''
    ig_following_count = ''
    if ig_username != '':
        ig_posts_count, ig_followers_count, ig_following_count = explore_ig(ig_username)
    return facebook_url, twitter_url, instagram_url, google_plus_url, twitter_description, twitter_favourites_count, twitter_followers_count, twitter_friends_count, twitter_id_str, twitter_screen_name, ig_posts_count, ig_followers_count, ig_following_count

def explore_ig(username):
    ig_scraper = ScrapeEngine()
    print(username)
    posts_count,followers_count,following_count = ig_scraper.get_account_metrics(username)
    return posts_count,followers_count,following_count
def explore_twitter(username):
    twitter_scraper = TwitterScraper()
    description, favourites_count, followers_count, friends_count, id_str, screen_name = twitter_scraper.get_user_info(username)
    return description, favourites_count, followers_count, friends_count, id_str, screen_name

def explore_returned_items(returned_items, q):
    for returned_item in returned_items:
        returned_type = returned_item['id']['kind']

        if returned_type == 'youtube#channel':
            channels_list_by_id(q=q, part='snippet,contentDetails,statistics,topicDetails,brandingSettings,invideoPromotion,contentOwnerDetails,localizations',
                id=returned_item['id']['channelId'])
        elif returned_type == 'youtube#video':
            channel_of_video_title = returned_item['snippet']['channelTitle']
            channel_of_video_id = returned_item['snippet']['channelId']
            channels_list_by_id(q=q, part='snippet,contentDetails,statistics,topicDetails,brandingSettings,invideoPromotion,contentOwnerDetails,localizations', id=channel_of_video_id)
