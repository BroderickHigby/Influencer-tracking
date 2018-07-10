import csv
from selenium import webdriver
import boto3
import uuid
from selenium import webdriver
driver= webdriver.Chrome('/Users/mark/crunch_base_scraper/chromedriver')
#driver.get('http://www.crunchbase.com')

import os
es_host = os.environ.get('SAPIE_ELASTICSEARCH', 'localhost')
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError

es = Elasticsearch(hosts=[es_host])

def create(doc, _id=None, index_to_use=None):
    """Creates new influencer document"""
    if index_to_use == None:
        index = 'sapie_investors'
    else:
        index = index_to_use
    if _id == None:
        id_ = uuid.uuid4().hex
        doc['id'] = id_
    else:
        id_ = _id
        doc['id'] = _id

    res = es.index(
        index=index,
        doc_type='investor',
        body=doc,
        id=id_,
    )
    assert res['result'] == 'created' or res['result'] == 'updated'
    return doc

comprehend = boto3.client(service_name='comprehend', region_name='us-west-2')


csv_file = open('people.csv')
csv_file_reader = csv.reader(csv_file)
is_first = True

for row in csv_file_reader:
	if is_first == False:
		investor_twitter_url = row[7]
		if investor_twitter_url == '':
			continue
		print(row[2])
		print(row[3])
		print(investor_twitter_url)
		driver.get(investor_twitter_url)
		key_metrics_divs = driver.find_element_by_class_name('ProfileNav-list')
		key_metrics = key_metrics_divs.find_elements_by_tag_name("a")
		key_attributes = []
		for key_metric in key_metrics:
			metric_value = key_metric.get_attribute('title')
			print(metric_value)
			key_attributes.append(metric_value)
		profile_header = driver.find_element_by_class_name('ProfileHeaderCard')
		description = profile_header.find_element_by_tag_name('p').text
		print(description)

		screen_name = profile_header.find_element_by_tag_name('b').text
		print(screen_name)
		tweets_list = []
		all_text = description
		tweets = driver.find_elements_by_class_name('js-tweet-text-container')
		for tweet_made in tweets:
			tweet_text = tweet_made.find_element_by_tag_name('p').text
			print(tweet_text)
			tweets_list.append(tweet_text)
			all_text += " " + tweet_text

		#profile_pic_url = driver.find_element_by_class_name("ProfileAvatar-image ").find_element_by_tag_name('img').get_attribute('src')
		profile_pic_avator = driver.find_element_by_class_name("ProfileAvatar")
		profile_pic_url = profile_pic_avator.find_element_by_tag_name('img').get_attribute('src')
		entity_json = comprehend.detect_entities(Text=all_text, LanguageCode='en')
		print(entity_json)
		#start_topics_detection_job_result = comprehend.start_topics_detection_job()

		item = {}
		item['first_name'] = row[2]
		item['last_name'] = row[3]
		item['crunchbase_url'] = row[4]
		item['facebook_url'] = row[6]
		item['twitter_url'] = row[7]
		item['linkedin_url'] = row[8]
		item['location_city'] = row[9]
		item['location_region'] = row[10]
		item['title'] = row[12]
		item['organization'] = row[13]
		item['favourites_count'] = key_attributes[3].split(' ')[0].replace(',', '')
		item['followers_count'] = key_attributes[2].split(' ')[0].replace(',', '')
		item['twitter_tweet_count'] = key_attributes[0].split(' ')[0].replace(',', '')
		item['twitter_description'] = description
		item['twitter_screen_name'] = screen_name
		item['tweets_texts'] = tweets_list
		item['entities_detected'] = entity_json
		create(item, screen_name)
		print('---------')
	else:
		is_first = False

'''

driver = webdriver.Chrome('/Users/mark/crunch_base_scraper/chromedriver')


for row in csv_file_reader:
	if is_first == False:
		investor_search_url = 'https://www.google.com'
		driver.get(investor_search_url)
		break
	else:
		is_first = False
'''
