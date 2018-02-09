import csv
import re
from email.utils import parseaddr
from scrape_engine import *
import os.path
import threading, time
import datetime

class IGVoyager:
    def __init__(self):
        self.scrape_engine = ScrapeEngine()
        if os.path.isfile('ig_users.csv') == False:
            with open('ig_users.csv', 'a') as igDatabase:
                igDatabaseWriter = csv.writer(igDatabase)
                igDatabaseWriter.writerows([["username", "bio", "bio_url", "followed_by_count", "follows_count", "full_name", "user_id", "is_private", "is_verified", "profile_pic", "connected_fb_page", "phone_number", "email"]])
    #can lookup by profile pic(use other parameters as clues if provided), themes/topics of account, location, who they follow, who follows them
    #In lookup profiles we examine first we check if it is a random exploration or not. If it is search and store user info randomly
    #If is_random_exploration is false we use the filters that generally allow us to narrow down the search first. They are ordered as such:
    # 1)user_names
    # 2)they_follow / follows_them
    # 3)locations
    # 4)themes
    # 5) profile_pics
    def lookup_profiles(self, query_type, is_random_exploration, profile_pics=[], themes=[], locations=[], they_follow=[], follows_them=[], usernames=[]):
        if is_random_exploration:
            x=1
        else:
            if query_type == QueryType.FIND_PROFILE_PICS_IN_LOCATION:
                if locations != [] and profile_pics != []:
                    print("Provided:")
                    print("Locations & ProfilePics.")
                    print("Finding user(s) usernames that match given profile pics, using locations as clues.")
                    for location in locations:
                        user_info = self.scrape_engine.find_username_w_profile_pic_and_location_clue(location, profile_pics)
                        if len(user_info) == 0:
                            print("Looking for " + profile_pic + " the search passed max number of pages set to: " + str(MAX_PAGES_IN_SEARCH))
                        else:
                            for user_tuple in user_info:
                                try:
                                    user = user_tuple[1]
                                    self.write_user_to_db(user, query_type)
                                except:
                                    print("Error writing user")
                        #found alll users, no need to check next location. Probably want to check to make sure no users returned are duplicates and that we didnt write duplicates to db.
                        if len(user_info) == len(profile_pics):
                            break
                else:
                    print("INPUT ERROR. Location(s) OR profile pic(s) not provided.")

            elif query_type == QueryType.FIND_MACDADDIES_OF_THEME_IN_LOCATION:
                if themes != [] and locations != []:
                    #Parameters: Location(s) & Theme(s)
                    #Idea is to find MacDaddies in the region for a given theme and return/scrape these users.
                    for location in locations:
                        self.scrape_engine.get_mac_daddies_of_theme_or_location(location, themes)
                else:
                    print("INPUT ERROR. Location(s) OR theme(s) not provided.")
            elif query_type == QueryType.FIND_USERS_WHO_FOLLOW:
                if follows_them != []:
                    #Provided: They follow
                    print('Provided:')
                    print('A username or usernames.')
                    print('Finding and storing users that follow the specificed user(s).')
                    for user_they_follow in follows_them:
                        users = self.scrape_engine.scrape_followers_of_username(user_they_follow)
                        for user in users:
                            self.write_user_to_db(user, query_type)
                else:
                    print("INPUT ERROR. Follows them not provided.")
            elif query_type == QueryType.FIND_WHO_USER_FOLLOWS:
                if they_follow != []:
                    #Provided: They follow
                    print('Provided:')
                    print('A username or usernames.')
                    print('Finding and storing users that are followed by the specificed user(s).')
                    for user_they_follow in they_follow:
                        users = self.scrape_engine.scrape_following_of_username(user_they_follow)
                        for user in users:
                            self.write_user_to_db(user, query_type)
                else:
                    print("INPUT ERROR. They follow not provided.")

            elif query_type == QueryType.FIND_BY_USERNAME:
                if usernames != []:
                    print('Provided:')
                    print('A username or usernames.')
                    print('Finding and scraping users with these usernames.')
                    for username in usernames:
                        user = self.scrape_engine.get_user_from_username(username)
                        if not user:
                            print(username + " was not there")
                            continue
                        else:
                            print(username + " was there")
                            self.write_user_to_db(user, query_type)
                else:
                    print("INPUT ERROR. Usernames not provided.")
            elif query_type == QueryType.RATE_INFLUENCER:
                if usernames != [] and locations != [] and themes != []:
                    print('Provided:')
                    print('A username, a location, and a theme.')
                    print('Ranking the username according to their audience concentration in theme/location.')
                    for username in usernames:
                        print(username)
                        self.scrape_engine.rate_influencer(username, locations[0], themes[0])
                else:
                    print("INPUT ERROR. Username or location or theme not provided.")

    def write_user_to_db(self, user, query_type):
        with open('ig_users.csv', 'a') as igDatabase:
            #check for email/phone number in bio.
            contact_email = []
            #print (user)
            try:
                for word in user['biography'].split():
                    if "@" in word and "." in word and word[0] != "@":
                        contact_email.append(word)
            except:
                print("error parsing email")

            r_phone = re.compile(r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})')
            if user['biography'] != None:
                contact_phone = r_phone.findall(user['biography'])
            else:
                contact_phone = []

            #if no email or phone in bio, check for external_url and search that page.
            if contact_email == '' and user['external_url'] != None:
                contact_email = ScrapeEngine.find_contact_info_at_site(user['external_url'])

            #Add:
            #   -location/locations of photos
            #   -themes in photos
            current_datetime = str(datetime.datetime.now())
            igDatabaseWriter = csv.writer(igDatabase)
            igDatabaseWriter.writerows([[user['username'], user['biography'], user['external_url'], user['followed_by']['count'], user['follows']['count'], user['full_name'], user['id'], user['is_private'], user['is_verified'], user['profile_pic_url'], user['connected_fb_page'], contact_phone, contact_email, current_datetime, str(query_type)]])
