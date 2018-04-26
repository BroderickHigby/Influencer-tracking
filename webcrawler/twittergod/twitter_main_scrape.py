from selenium import webdriver
import json
import sys
sys.path.insert(0, '/home/ec2-user/sapie/backend/')
#sys.path.insert(0, '/Users/markkeane/Desktop/sapie/backend/')
import influencer
import uuid

driver = webdriver.Chrome('chromedriver')  # Optional argument, if not specified will search path.
driver2 = webdriver.Chrome('chromedriver')
search_terms = ['nba', 'mma']

for search_term in search_terms:
    base_url = 'https://twitter.com/search?q=' + search_term + '&src=typd&lang=en'
    print(base_url)
    driver.get(base_url)
    items = driver.find_elements_by_class_name("stream-item-header")
    for tweet in items:
        try:
            user_url = tweet.find_element_by_tag_name("a").get_attribute('href')
            #print(user_url)
            driver2.get(user_url)
            key_metrics_divs = driver2.find_element_by_class_name('ProfileNav-list')
            key_metrics = key_metrics_divs.find_elements_by_tag_name("a")
            key_attributes = []
            for key_metric in key_metrics:
                metric_value = key_metric.get_attribute('title')
                #print(metric_value)
                key_attributes.append(metric_value)
            profile_header = driver2.find_element_by_class_name('ProfileHeaderCard')
            description = profile_header.find_element_by_tag_name('p').text
            #print(description)

            screen_name = profile_header.find_element_by_tag_name('b').text
            #print(screen_name)

            #print('----')
            item = {}
            item['platform_base'] = "twitter"
            item['industry'] = search_term
            item['email'] = ''

            item["facebook"] = {}
            item["facebook"]["url"] = ''

            item["twitch"] = {}
            item["twitch"]["url"] = ''

            item['twitter'] = {}
            item['twitter']['url'] = user_url
            item['twitter']['description'] = description
            item['twitter']['favourites_count'] = key_attributes[3].split(' ')[0].replace(',', '')
            item['twitter']['followers_count'] = key_attributes[2].split(' ')[0].replace(',', '')
            item['twitter']['friends_count'] = ''
            item['twitter']['id_str'] = ''
            item['twitter']['screen_name'] = screen_name
            item['twitter']['twitter_tweet_count'] = key_attributes[0].split(' ')[0].replace(',', '')

            item['instagram'] = {}
            item['instagram']['url'] = ''
            item['instagram']['posts_count'] = ''
            item['instagram']['followers_count'] = ''
            item['instagram']['following_count'] = ''

            item['youtube'] = {}
            item['youtube']['kind'] = ''
            item['youtube']['etag'] = ''
            item['youtube']['id'] = ''
            item['youtube']['snippet'] = {}
            item['youtube']['brandingSettings'] = {}
            item['youtube']['contentDetails'] = {}
            item['youtube']['statistics'] = {}

            item['google_plus_url'] = ''
            print(json.dumps(item, sort_keys=True, indent=4))
            print('*******')
            influencer.Influencer.create(item, screen_name)
        except Exception as e:
            print(e)
            print('----')
    print(len(items))
    driver.quit()
    driver2.quit()
