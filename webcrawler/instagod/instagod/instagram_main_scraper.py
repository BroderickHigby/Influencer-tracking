from selenium import webdriver
import json
import sys
#sys.path.insert(0, '/home/ec2-user/sapie/backend/')
sys.path.insert(0, '/Users/markkeane/Desktop/sapie/backend/')
import influencer
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
                #r = requests.post('https://app.sapie.space/xapi/post_twitter_influencer', data = {'item': item, 'screen_name': screen_name})
                influencer.Influencer.create(item, profile_url)
        except Exception as e:
            print(e)
            print('----')
    driver.quit()
    driver2.quit()
    del driver
    del driver2
