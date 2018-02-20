import os
import sys
sys.path.insert(0, '/Users/markkeane/Desktop/sapie/backend')
import influencer
import requests
import json

base_url = "https://www.googleapis.com/youtube/v3"
api_key = "AIzaSyDhbjoj6RQNvYgOulCZSJS6ARk9LxaVJxY"



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
    print(data)
    for item in data['items']:
        item['platform'] = "youtube"
        item['industry'] = q
        influencer.Influencer.create(item, item['id'])



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
