from selenium import webdriver
import json
import sys
#sys.path.insert(0, '/home/ec2-user/sapie/backend/')
sys.path.insert(0, '/Users/markkeane/Desktop/sapie/backend/')
import influencer
sys.path.insert(0, '/Users/markkeane/Desktop/sapie/webcrawler')
from nlp_description_parser import *
import re
from sys import getsizeof
import uuid
import requests

search_terms = ['Motorcycles'
                'Cars',
                'Trucks',
                'Skating',
                'models',
                'clothing',
                'startup',
                'entrepreneur',
                'socialmedia',
                'photography',
                'sports',
                'hardware',
                'realestate',
                'sandiego',
                'motivation',
                'home',
                'garden',
                'fitness',
                'health',
                'yoga',
                'bodybuilding',
                'nutrition',
                'mma',
                'pets',
                'beauty',
                'fashion',
                'makeup',
                'hair',
                'salon',
                'barber',
                'nails',
                'watches',
                'jewelry',
                'travel',
                'wanderlust',
                'suits',
                'tuxedo',
                'finance',
                'wealth',
                'cryptocurrency',
                'nature'
            ]

for search_term in search_terms:
    driver = webdriver.Chrome('/Users/markkeane/Desktop/sapie/webcrawler/twittergod/chromedriver')  # Optional argument, if not specified will search path.
    driver2 = webdriver.Chrome('/Users/markkeane/Desktop/sapie/webcrawler/twittergod/chromedriver')
    base_url = 'https://www.instagram.com/explore/tags/' + search_term +'/'
    print(search_term)
    print(base_url)
    driver.get(base_url)
    print('cat')
    posts = driver.find_elements_by_xpath("//a[@href]")#driver.find_elements_by_class_name("_mck9w _gvoze  _tn0ps")
    print('oink')
    for post in posts:
        try:
            if 'https://www.instagram.com/p/' in post.get_attribute("href"):
                post_url =  post.get_attribute("href")
                driver2.get(post_url)
                profile_url = driver2.find_element_by_class_name("_eeohz").find_element_by_tag_name("a").get_attribute('href')
                #print('fishnoise')
                #print(profile_url)
                driver2.get(profile_url)
                core_metrics = driver2.find_elements_by_class_name('_t98z6 ')
                c_mets = []
                for metric in core_metrics:
                   c_mets.append(metric.text)

                bio_div = driver2.find_element_by_class_name('_tb97a')
                #print(bio_div.getText())
                bio_text = bio_div.find_elements_by_xpath('.//span')[0].text
                #print(bio_text)
                #print(c_mets)
                #print('----')
                all_text = bio_text
                photo_caption_objects = driver2.find_elements_by_class_name('_4rbun')
                photo_captions = []
                for ii, photo_caption_object in enumerate(photo_caption_objects):
                    caption_text = photo_caption_object.find_element_by_tag_name('img').get_attribute('alt')
                    all_text += " " + caption_text
                    photo_captions.append(caption_text)
                #all_text = re.sub(r'[^\x00-\x7F]+', ' ', all_text)
                #all_text = all_text.encode('ascii')
                if sys.getsizeof(all_text) > 20000:
                    all_text = all_text[:len(all_text) // 2]
                print(sys.getsizeof(all_text))
                print("KHSFKSDFH")

                profile_pic_url = driver2.find_element_by_class_name('_rewi8').get_attribute('src')
                print(profile_pic_url)

                item = {}
                item['platform_base'] = "instagram"
                item['industry'] = search_term
                item['email'] = ''

                item["facebook"] = {}
                item["facebook"]["url"] = ''

                item["twitch"] = {}
                item["twitch"]["url"] = ''

                item['twitter'] = {}
                item['twitter']['url'] = ''
                item['twitter']['description'] = ''
                item['twitter']['favourites_count'] = ''
                item['twitter']['followers_count'] = ''
                item['twitter']['friends_count'] = ''
                item['twitter']['id_str'] = ''
                item['twitter']['screen_name'] = ''
                item['twitter']['twitter_tweet_count'] = ''

                item['instagram'] = {}
                item['instagram']['url'] = profile_url
                item['instagram']['posts_count'] = c_mets[0].split(' ')[0]
                item['instagram']['followers_count'] = c_mets[1].split(' ')[0]
                item['instagram']['following_count'] = c_mets[2].split(' ')[0]
                item['instagram']['bio'] = bio_text
                item['instagram']['photo_captions'] = photo_captions
                item['instagram']['profile_pic_url'] = profile_pic_url

                item['youtube'] = {}
                item['youtube']['kind'] = ''
                item['youtube']['etag'] = ''
                item['youtube']['id'] = ''
                item['youtube']['snippet'] = {}
                item['youtube']['brandingSettings'] = {}
                item['youtube']['contentDetails'] = {}
                item['youtube']['statistics'] = {}

                item['google_plus_url'] = ''


                dp = DescriptionParser(all_text)
                entity_json = dp.comprehend_entities()
                sm = dp.parse_entities_for_sm(entity_json)

                if 'email' in sm.keys():
                    item['email'] = sm['email']
                if 'fb' in sm.keys():
                    item['facebook']['url'] = sm['fb']
                if 'twitter' in sm.keys():
                    item['twitter']['url'] = sm['twitter']
                item['associated_websites'] = sm['associated_websites']
                item['locations'] = sm['locations']
                item['branded_products'] = sm['branded_products']
                item['events'] = sm['events']
                item['organizations'] = sm['organizations']
                item['ig_growth'] = []
                item['yt_growth'] = []

                #print(json.dumps(entity_json, sort_keys=True, indent=4))
                print(json.dumps(item, sort_keys=True, indent=4))
                print('*******')
                #r = requests.post('https://app.sapie.space/xapi/post_twitter_influencer', data = {'item': item, 'screen_name': screen_name})
                r = requests.post('http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5441/post_influencer', json={"item": item, "screen_name": profile_url})
                #influencer.Influencer.create(item, profile_url)
        except Exception as e:
            print(e)
            print('----')
    driver.quit()
    driver2.quit()
    del driver
    del driver2
