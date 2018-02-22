import requests
from bs4 import BeautifulSoup
import urllib
import re
import json
import pdb
from selenium import webdriver

'''
html = requests.get('https://www.instagram.com/cristiano') # input URL here
soup = BeautifulSoup(html.text, 'lxml') # parses the page's html text
data = soup.find_all('meta', attrs = {'property':'og:description'}) 
text = data[0].get('content').split() 
user = '%s %s %s' % (text[-3], text[-2], text[-1])
followers = text[0]
following = text[2]
print('User:', user)
print('Followers:', followers)
print('Following:', following)

# this prints out the no. of likes of the user's media on their first screen
print ('\n' + user + ' Activity from recent photos')
script_tag = soup.find('script',text = re.compile('window\._sharedData'))
shared_data = script_tag.string.partition('=')[-1].strip(' ;')
result = json.loads((shared_data)) # turns shared_data into json form

photos = {}
all_nodes = len(result['entry_data']['ProfilePage'][0]['user']['media']['nodes'])
for i in range(0,all_nodes):
	likes = str(result['entry_data']['ProfilePage'][0]['user']['media']['nodes'][i]['likes']['count'])
	comments = str(result['entry_data']['ProfilePage'][0]['user']['media']['nodes'][i]['comments']['count'])
	print (likes + ' likes ' + comments + ' comments')
	photos[i] =  result['entry_data']['ProfilePage'][0]['user']['media']['nodes'][i]['code']

print (photos)
'''


driver = webdriver.Chrome('/Users/mayankmehtani/Downloads/chromedriver')
driver.get('https://www.instagram.com/accounts/login')
dom = driver.find_element_by_xpath("//*")#input[@placeholder='Email']")
username = dom.find_element_by_name('username')
password = dom.find_element_by_name('password')
login_button = driver.find_element_by_xpath('//*[@id="react-root"]/section/main/div/article/div/div[1]/div/form/span/button')
username.clear()
password.clear()
username.send_keys('may.2772')
password.send_keys('portable')
login_button.click()



# search = driver.find_elements_by_class_name('_avvq0 _o716c')
# search.click()

