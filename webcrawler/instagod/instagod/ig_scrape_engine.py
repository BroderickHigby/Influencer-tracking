import sys
from bs4 import BeautifulSoup
import requests
import requests.exceptions
#from urllib.parse import urlsplit
from collections import deque
import re
import json
import pprint
import logging.config
#from PIL import Image
from io import BytesIO
from constants import *
import time
from selenium import webdriver as wd
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
#from google.cloud import vision
#from google.cloud.vision import types
import sys
sys.path.insert(0, '/home/ec2-user/sapie/backend')
import industry_tags
import influencer
import pprint

class ScrapeEngine:
    def __init__(self):
        default_attr = dict(username='', usernames=[], filename=None,
                            login_user=None, login_pass=None, login_only=False,
                            destination='./', retain_username=False, interactive=False,
                            quiet=False, maximum=0, media_metadata=False, latest=False,
                            latest_stamps=False,
                            media_types=['image', 'video', 'story-image', 'story-video'],
                            tag=False, location=False, search_location=False, comments=False,
                            verbose=0, include_location=False, filter=None)

        self.quit = False
        self.session = requests.Session()
        self.session.headers = {'user-agent': CHROME_WIN_UA}
        self.logger = ScrapeEngine.get_logger(level=logging.DEBUG, verbose=default_attr.get('verbose'))

    def get_json(self, *args, **kwargs):
        """Retrieve text from url. Return text as string or None if no data present """
        resp = self.safe_get(*args, **kwargs)
        #print('-------')
        #pp = pprint.PrettyPrinter(indent=4)
        #print(type(resp.json()))
        #pp.pprint(resp)
        #print(resp.json())
        #print('$$$$$$$$$$$$$$$$')
        #print(resp)
        if resp is not None:
            return resp.json()

    def safe_get(self, *args, **kwargs):
        # out of the box solution
        # session.mount('https://', HTTPAdapter(max_retries=...))
        # only covers failed DNS lookups, socket connections and connection timeouts
        # It doesnt work when server terminate connection while response is downloaded
        retry = 0
        retry_delay = RETRY_DELAY
        while True:
            if self.quit:
                return
            try:
                response = self.session.get(timeout=CONNECT_TIMEOUT, *args, **kwargs)
                if response.status_code == 404:
                    return
                response.raise_for_status()
                content_length = response.headers.get('Content-Length')
                if content_length is None or len(response.content) != int(content_length):
                    #if content_length is None we repeat anyway to get size and be confident
                    raise PartialContentException('Partial response')
                return response
            except (KeyboardInterrupt):
                raise
            except: #(requests.exceptions.RequestException, PartialContentException) as e:
                print("some error yo with partial content")
                '''if 'url' in kwargs:
                    url = kwargs['url']
                elif len(args) > 0:
                    url = args[0]
                if retry < MAX_RETRIES:
                    #self.logger.warning('Retry after exception {0} on {1}'.format(repr(e), url))
                    self.sleep(retry_delay)
                    retry_delay = min( 2 * retry_delay, MAX_RETRY_DELAY )
                    retry = retry + 1
                    continue
                else:
                    keep_trying = self._retry_prompt(url, repr(e))
                    if keep_trying == True:
                        retry = 0
                        continue
                    elif keep_trying == False:
                        return
                raise'''

    def get_user_from_username(self, username):
        """Fetches the user's metadata."""
        print(username.split("\n")[0])
        url = USER_URL.format(username.split("\n")[0])

        resp = self.get_json(url)
        if resp is not None:
            user = resp['user']
            if user and user['is_private'] and user['media']['count'] > 0 and not user['media']['nodes']:
                self.logger.error('User {0} is private'.format(username))
            return user
        else:
            self.logger.error('Error getting user details for {0}. Please verify that the user exists.'.format(username))

    def find_username_w_profile_pic_and_location_clue(self, location, profile_pics):
        """Fetches location metadata."""
        num_of_users_to_find = len(profile_pics)

        is_first_page = True
        run_again = True
        run_count = 0
        end_cursor = ""
        users_to_return = []
        while(run_again and run_count < MAX_PAGES_IN_SEARCH):
            if is_first_page:
                location_url = TAGS_URL.format(location)
                is_first_page = False
            else:
                location_url = TAGS_URL.format(location) + '&max_id=' + end_cursor

            print(location_url)
            resp = self.get_json(location_url)
            if resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['has_next_page'] == False:
                run_again = False
            print(resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info'])
            end_cursor = resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['end_cursor']

            for ig_post in resp['graphql']['hashtag']['edge_hashtag_to_media']['edges']:
                image_shortcode = ig_post['node']['shortcode']
                image_url_with_username = IMAGE_WITH_USERNAME_URL.format(image_shortcode)
                #print(image_url_with_username)
                resp2 = self.get_json(image_url_with_username)

                #print(resp2['graphql']['shortcode_media']['owner']['profile_pic_url'])
                random_users_profile_response = requests.get(resp2['graphql']['shortcode_media']['owner']['profile_pic_url'])
                try:
                    im1 = Image.open(BytesIO(random_users_profile_response.content))
                    for index1, profile_pic in enumerate(profile_pics):
                        im2 = Image.open(profile_pic)
                        if list(im1.getdata()) == list(im2.getdata()):
                            print("Identical")
                            #should look up user and return like the above function does
                            url_user = USER_URL.format(resp2['graphql']['shortcode_media']['owner']['username'])
                            user = self.get_json(url_user)
                            users_to_return.append((profile_pic, user['user'], location))
                            profile_pics.pop(index1)
                            if len(users_to_return) == num_of_users_to_find:
                                return users_to_return
                            #return (profile_pic, user, location)
                        else:
                            #print("Different")
                            #print(profile_pic)
                            continue
                except:
                    print("error reading or comparing profile pics.")
            run_count = run_count + 1
        return users_to_return


    def scrape_email_of_user (self,username):
        r = requests.get(USER_URL.format(username))
        info = json.loads(r.text)
        words_info  = info['user']['biography'].split()
        external_url_info = info['user']['external_url']

        for word in words_info:
            if re.match('[^@]+@[^@]+\.[^@]+',word):
                return word

        if external_url_info != None:
            external_url = external_url_info.split()

            for word in external_url:
                if re.math('[^@]+@[^@]+\.[^@]+',word):
                    return word


    def scrape_followers_of_username(self, username):
        options = wd.ChromeOptions()
        driver = wd.Chrome("/Users/mark/Desktop/instagod/chromedriver")

        ScrapeEngine.selenium_login(driver)
        follower_list = ScrapeEngine.selenium_get_followers_list(driver, username)

        json_users = []
        for follower_username in follower_list:
            json_users.append(self.get_user_from_username(follower_username))
        return json_users

    def scrape_following_of_username(self, username):
        options = wd.ChromeOptions()
        driver = wd.Chrome("/Users/mark/Desktop/instagod/chromedriver")

        ScrapeEngine.selenium_login(driver)
        following_list = ScrapeEngine.selenium_get_following_list(driver, username)

        json_users = []
        for following_username in following_list:
            json_users.append(self.get_user_from_username(following_username))
        return json_users

    def get_mac_daddies_of_theme_or_location(self, location, themes):
        if location != []:
            is_first_page = True
            run_again = True
            run_count = 0
            end_cursor = ""
            users_to_return = []
            while(run_again and run_count < MAX_PAGES_IN_SEARCH):
                if is_first_page:
                    location_url = TAGS_URL.format(location)
                    is_first_page = False
                else:
                    print(end_cursor)
                    #location_url = TAGS_URL.format(location) + '&' + end_cursor
                    location_url = TAGS_URL.format(location) + '&max_id=' + end_cursor

                print(location_url)
                resp = self.get_json(location_url)
                if resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['has_next_page'] == False:
                    run_again = False
                print(resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info'])
                end_cursor = resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['end_cursor']

                for ig_post in resp['graphql']['hashtag']['edge_hashtag_to_media']['edges']:
                    image_shortcode = ig_post['node']['shortcode']
                    image_url_with_username = IMAGE_WITH_USERNAME_URL.format(image_shortcode)
                    resp2 = self.get_json(image_url_with_username)
                    print(resp2)
                    print("-----")
    def find_influencers_by_industry(self):
        print("IN FIND INFLUENCERS BY INDUSTRY")
        for key, value in industry_tags.industry_search_terms.items():
            for search_term in value:
                is_first_page = True
                run_again = True
                run_count = 0
                end_cursor = ""
                users_to_return = []
                print(search_term)
                search_term = search_term.replace(" ", "")
                while(run_again and run_count < MAX_PAGES_IN_SEARCH):
                    if is_first_page:
                        location_url = TAGS_URL.format(search_term)
                        is_first_page = False
                    else:
                        print(end_cursor)
                        #location_url = TAGS_URL.format(location) + '&' + end_cursor
                        location_url = TAGS_URL.format(search_term) + '&max_id=' + end_cursor

                    resp = self.get_json(location_url)
                    if resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['has_next_page'] == False:
                        run_again = False
                    #print(resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info'])
                    end_cursor = resp['graphql']['hashtag']['edge_hashtag_to_media']['page_info']['end_cursor']

                    for ig_post in resp['graphql']['hashtag']['edge_hashtag_to_media']['edges']:
                        image_shortcode = ig_post['node']['shortcode']
                        image_url_with_username = IMAGE_WITH_USERNAME_URL.format(image_shortcode)
                        resp2 = self.get_json(image_url_with_username)
                        (post_count, followers_count, following_count) = self.get_account_metrics(resp2['graphql']['shortcode_media']['owner']['username'])

                        user_data = {}
                        try:
                            user_data['caption'] = resp2['graphql']['shortcode_media']['edge_media_to_caption']['edges'][0]['node']['text']
                        except:
                            user_data['caption'] = ""
                        user_data['is_ad'] = resp2['graphql']['shortcode_media']['is_ad']
                        user_data['location'] = resp2['graphql']['shortcode_media']['location']
                        user_data['is_video'] = resp2['graphql']['shortcode_media']['is_video']
                        user_data['owner_name'] = resp2['graphql']['shortcode_media']['owner']['full_name']
                        user_data['owner_id'] = resp2['graphql']['shortcode_media']['owner']['id']
                        user_data['is_private'] = resp2['graphql']['shortcode_media']['owner']['is_private']
                        user_data['is_verified'] = resp2['graphql']['shortcode_media']['owner']['is_verified']
                        user_data['username'] = resp2['graphql']['shortcode_media']['owner']['username']
                        user_data['taken_at_timestamp'] = resp2['graphql']['shortcode_media']['taken_at_timestamp']
                        user_data['platform'] = "instagram"
                        user_data['industry'] = search_term
                        user_data['post_count'] = post_count
                        user_data['followers_count'] = followers_count
                        user_data['following_count'] = following_count
                        print("^$^$^$^$^")
                        print(user_data)
                        influencer.Influencer.create(user_data, user_data['owner_id'], 'sapie_ig')


    def get_account_metrics(self, username):

        html = requests.get("https://www.instagram.com/{0}/".format(username)) # input URL here
        soup = BeautifulSoup(html.text, 'lxml')

        data = soup.find_all('meta', attrs={'property':'og:description'})
        try:
            text = data[0].get('content').split()

            user = '%s %s %s' % (text[-3], text[-2], text[-1])
            followers_count = text[0]
            following_count = text[2]
            posts_count = text[4]

            print('User:', user)
            print('Followers:', followers_count)
            print('Following:', following_count)
            print('Posts:', posts_count)

            return posts_count,followers_count,following_count
        except:
            print("get_account_metrics failed")
            return "","",""

    def rate_influencer(self, username, location, theme):
        options = wd.ChromeOptions()
        driver = wd.Chrome("/Users/mark/Desktop/instagod/chromedriver")
        print("Logging into IG with selenium....")
        ScrapeEngine.selenium_login(driver)
        print("Scraping follower usernames with selenium....")

        followers_usernames = ScrapeEngine.selenium_get_followers_list(driver, username)
        total_followers = len(followers_usernames)
        followers_in_location = 0
        followers_with_theme_interest = 0
        followers_in_location_with_theme_interest = 0
        private_followers = 0
        print("Followers to explore: " + str(total_followers))
        for index, follower_username in enumerate(followers_usernames):
            print(index)
            follower_json = self.get_user_from_username(follower_username)
            had_location_match = False
            had_theme_match = False
            if follower_json['biography'] != None:
                had_location_match = ScrapeEngine.check_for_meaning_match(location, follower_json['biography'])
                had_theme_match = ScrapeEngine.check_for_meaning_match(theme, follower_json['biography'])
            if had_location_match == False or had_theme_match == False:
                if follower_json['is_private'] == False:
                    user_pics = follower_json['media']['nodes']
                    pics_checked = 0
                    for pic in user_pics:
                        if 'caption' in pic:
                            had_location_match = ScrapeEngine.check_for_meaning_match(location, pic['caption'])
                            had_theme_match = ScrapeEngine.check_for_meaning_match(theme, pic['caption'])
                            if had_location_match == True and had_theme_match == True:
                                break
                        else:
                            cccc = 1
                        if pic['is_video'] == False and pics_checked <= MAX_NUMBER_OF_USERS_PICS_TO_CHECK:
                            image_labels = ScrapeEngine.detect_labels_uri(pic['display_src'])
                            had_theme_match = ScrapeEngine.check_for_meaning_match(location, image_labels)
                            if had_location_match == True and had_theme_match == True:
                                break
                            pics_checked += 1
                        #Check for caption, location and google image tags.

            if follower_json['is_private'] == True:
                private_followers += 1
            if had_theme_match == True:
                followers_with_theme_interest += 1
            if had_location_match == True:
                followers_in_location += 1
            if had_theme_match == True and had_location_match == True:
                followers_in_location_with_theme_interest += 1

        print("number of followers: " + str(total_followers))
        print("number private: " + str(private_followers))
        print("Followers in location:" + str(followers_in_location))
        print("Followers with them:" + str(followers_with_theme_interest))
        print("Followers in location with theme interest: " + str(followers_in_location_with_theme_interest))

    @staticmethod
    def detect_labels_uri(uri):
        """Detects labels in the file located in Google Cloud Storage or on the
        Web."""
        client = vision.ImageAnnotatorClient()
        image = types.Image()
        image.source.image_uri = uri

        response = client.label_detection(image=image)
        labels = response.label_annotations
        labels_string = ""
        for label in labels:
            labels_string = labels_string + label.description + " "
        return labels_string

    @staticmethod
    def selenium_login(driver):
        username = "markie1706"   # Your username
        password = "HowNowZz45!"   # Your password

        # Load page
        driver.get("https://www.instagram.com/accounts/login/")
        # Login
        driver.find_element_by_xpath("//div/input[@name='username']").send_keys(username)
        driver.find_element_by_xpath("//div/input[@name='password']").send_keys(password)
        driver.find_element_by_xpath("//span/button").click()
        time.sleep(5)
        #driver.find_element_by_xpath("/html/body/div[4]/div/div[2]/div/div/div[2]").click()


    @staticmethod
    def selenium_get_followers_list(driver, account):
        # Load account page
        driver.get("https://www.instagram.com/{0}/".format(account))
        # Click the 'Follower(s)' link
        driver.find_element_by_partial_link_text("follower").click()
        time.sleep(5)
        SCROLL_PAUSE = 0.5  # Pause to allow loading of content
        driver.execute_script("followersbox = document.getElementsByClassName('_gs38e')[0];")
        last_height = driver.execute_script("return followersbox.scrollHeight;")

        # We need to scroll the followers modal to ensure that all followers are loaded
        while True:
            driver.execute_script("followersbox.scrollTo(0, followersbox.scrollHeight);")
            # Wait for page to load
            time.sleep(SCROLL_PAUSE)
            # Calculate new scrollHeight and compare with the previous
            new_height = driver.execute_script("return followersbox.scrollHeight;")
            if new_height == last_height:
                break
            last_height = new_height

        # Finally, scrape the followers
        followers_elems = driver.find_elements_by_class_name("_2nunc")
        followers = [e.text for e in followers_elems]  # List of followers (username, full name, follow text)
        return followers


    @staticmethod
    def selenium_get_following_list(driver, account):
        # Load account page
        driver.get("https://www.instagram.com/{0}/".format(account))
        # Click the 'Follower(s)' link
        driver.find_element_by_partial_link_text("following").click()
        time.sleep(1)
        SCROLL_PAUSE = 0.5  # Pause to allow loading of content
        driver.execute_script("followersbox = document.getElementsByClassName('_gs38e')[0];")
        last_height = driver.execute_script("return followersbox.scrollHeight;")

        # We need to scroll the followers modal to ensure that all followers are loaded
        while True:
            driver.execute_script("followersbox.scrollTo(0, followersbox.scrollHeight);")
            # Wait for page to load
            time.sleep(SCROLL_PAUSE)
            # Calculate new scrollHeight and compare with the previous
            new_height = driver.execute_script("return followersbox.scrollHeight;")
            if new_height == last_height:
                break
            last_height = new_height

        # Finally, scrape the followers
        following_elems = driver.find_elements_by_class_name("_2nunc")
        following= [e.text for e in following_elems]  # List of followers (username, full name, follow text)
        return following


    @staticmethod
    def get_logger(level=logging.DEBUG, verbose=0):
        """Returns a logger."""
        logger = logging.getLogger(__name__)

        fh = logging.FileHandler('instagram-scraper.log', 'w')
        fh.setFormatter(logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s'))
        fh.setLevel(level)
        logger.addHandler(fh)

        sh = logging.StreamHandler(sys.stdout)
        sh.setFormatter(logging.Formatter('%(levelname)s: %(message)s'))
        sh_lvls = [logging.ERROR, logging.WARNING, logging.INFO]
        sh.setLevel(sh_lvls[verbose])
        logger.addHandler(sh)

        logger.setLevel(level)

        return logger

    @staticmethod
    def find_contact_info_at_site(website_url):
        # a queue of urls to be crawled
        new_urls = deque([website_url])

        # a set of urls that we have already crawled
        processed_urls = set()

        # a set of crawled emails
        emails = []

        # process urls one by one until we exhaust the queue
        while len(new_urls):
            # move next url from the queue to the set of processed urls
            url = new_urls.popleft()
            processed_urls.add(url)

            # extract base url to resolve relative links
            parts = urlsplit(url)
            base_url = "{0.scheme}://{0.netloc}".format(parts)
            path = url[:url.rfind('/')+1] if '/' in parts.path else url

            # get url's content
            print("Processing %s" % url)
            try:
                response = requests.get(url)
            except (requests.exceptions.MissingSchema, requests.exceptions.ConnectionError):
                # ignore pages with errors
                continue

            # extract all email addresses and add them into the resulting set
            new_emails = set(re.findall(r"[a-z0-9\.\-+_]+@[a-z0-9\.\-+_]+\.[a-z]+", response.text, re.I))
            emails.append(new_emails)

            #---------------------------------
            #Following recursively looks through all links to pages on page and following pages for emails - overkill rn
            # create a beutiful soup for the html document
            #soup = BeautifulSoup(response.text)

            # find and process all the anchors in the document
            #for anchor in soup.find_all("a"):
                # extract link url from the anchor
            #    link = anchor.attrs["href"] if "href" in anchor.attrs else ''
                # resolve relative links
            #    if link.startswith('/'):
            #        link = base_url + link
            #    elif not link.startswith('http'):
            #        link = path + link
                # add the new url to the queue if it was not enqueued nor processed yet
            #    if not link in new_urls and not link in processed_urls:
            #        new_urls.append(link)
            #---------------------------------
        #-----------------------------
        #Different approach to the one above
        #look for email or phone on current page.
        #if can't find just look for about or contact links and click there and do the same look.
        #datay = requests.get(url=website_url)
        #binary = datay.content
        #outputy = json.loads(binary)

        return emails

    @staticmethod
    def check_for_meaning_match(hot_word, text_to_explore):
        if hot_word == "san diego":
            if "san diego" in text_to_explore.lower() or "sandiego" in text_to_explore.lower() or "SD" in text_to_explore:
                return True
            else:
                return False
        elif hot_word == "los angeles":
            if "los angeles" in text_to_explore.lower() or "losangeles" in text_to_explore.lower() or "LA" in text_to_explore:
                return True
            else:
                return False
        elif hot_word == "new york":
            if "new york" in text_to_explore.lower() or "newyork" in text_to_explore.lower() or "the big apple" in text_to_explore.lower():
                return True
            else:
                return False
        elif hot_word == "skating":
            if "skating" in text_to_explore.lower() or "skate" in text_to_explore.lower() or "skateboarding" in text_to_explore.lower():
                return True
            else:
                return False
        elif hot_word == "gym":
            if "gym" in text_to_explore.lower() or "weights" in text_to_explore.lower() or "muscles" in text_to_explore.lower() or "bodypump" in text_to_explore.lower() or "weightlifting" in text_to_explore.lower() or "weightlifter" in text_to_explore.lower() or "exercise" in text_to_explore.lower():
                return True
            else:
                return False
