#!/usr/local/bin/python2.7
from __future__ import division
import re
import random
import sys
import time
from time import strptime   
import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait as wait
import httplib

# grab the url as the first command line argument
channel = sys.argv[1]


vidNumber = 11;
urlList = [];
#Scraped Data
viewCount = 0;
comments = 0;
upThumbs = 0;
downThumbs = 0;
date1 =0;
date2 = 0;

# SETUP
url = "https://www.youtube.com/user/" + channel + "/videos";
driver = webdriver.Chrome('/home/bsuwirjo/programming/sapie/machineLearning/youtubeScraper/chromedriver')
driver.set_window_size(1200, 800)
driver.maximize_window()
driver.get(url)
print("https://www.youtube.com/channel/" + channel + "/videos")
results = driver.find_elements_by_xpath("//a[@id='thumbnail']")

#iterate through all the elements
counter = 1;
while counter < vidNumber:
    url = results[counter].get_attribute('href');
    urlList.append(url);
    counter +=1;

counter = 0;
while counter <len(urlList):
    driver.get(urlList[counter])
    time.sleep(random.randint(500,1000)/1000)
    #print "-------------------------------"
    print "Video: " + str(counter+1)

    while len(driver.find_elements_by_class_name("view-count")) == 0:
        time.sleep(.01)
    if counter == 0:
        result = driver.find_elements_by_class_name("date")
        date = str(result[0].text)
        date = date.split(" ")
        newDate = str(strptime(date[2],'%b').tm_mon) + "/" + date[3].replace(',', '') + "/" + date[4]
        date1 = time.mktime(datetime.datetime.strptime(newDate, "%m/%d/%Y").timetuple())
        print "Date1: " + str(date1);
    elif counter == 9:
        result = driver.find_elements_by_class_name("date")
        date = str(result[0].text)
        date = date.split(" ")
        newDate = str(strptime(date[2],'%b').tm_mon) + "/" + date[3].replace(',', '') + "/" + date[4]
        date2 = time.mktime(datetime.datetime.strptime(newDate, "%m/%d/%Y").timetuple())
        print "Date2: " + str(date2);

    #VIEW COUNT
    result = driver.find_elements_by_class_name("view-count")
    viewCount += int(re.sub('[^0-9]','', str(result[0].text)))
    print str(result[0].text);

    #Comments
    while len(driver.find_elements_by_class_name("count-text")) == 0:
        time.sleep(.1)
    result = driver.find_elements_by_class_name("count-text")
    comments += int(re.sub('[^0-9]','', str(result[0].text)))
    print str(result[0].text);

    #Thumbs Up
    result = driver.find_elements_by_class_name("ytd-toggle-button-renderer")
    try:
        upThumbs += int(re.sub('[^0-9]','', str(result[3].get_attribute("aria-label"))))
    except:
        pass
    print str(result[3].get_attribute("aria-label"));    

    #Thumbs Up
    result = driver.find_elements_by_class_name("ytd-toggle-button-renderer")
    try:
        downThumbs += int(re.sub('[^0-9]','', str(result[7].get_attribute("aria-label"))))
    except:
        pass
    print str(result[7].get_attribute("aria-label"));
    print "-------------------------------"

    counter+=1;


youtubeTime = (date1 - date2)/60/60/24
avgViews = float(viewCount)/10
youtubeEngagement = ((comments + upThumbs+downThumbs)/10 * avgViews)
youtubeInfluence = (youtubeEngagement*(upThumbs/(upThumbs + downThumbs)))/youtubeTime

youtubeInfluence = (youtubeInfluence * 10000000000 / 50000000000)

print "USER DATA:"
print "Total Views: " +str(viewCount)
print "Comments: " + str(comments)
print "Thumbs Up: " + str(upThumbs)
print "Thumbs Down: " + str(downThumbs)
print "Time Elapsed: " + str(youtubeTime)
print "Percent Engagement: " + str(upThumbs/(upThumbs + downThumbs))
print "Days Passed: " + str(youtubeTime) +'\n'



print "Influence Score is :" + str(youtubeInfluence);

driver.close()
