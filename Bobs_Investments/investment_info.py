import requests
import json
import csv
from selenium import webdriver

#my own API key for mattermark's API
matter_key = '6e5f5f2c9722021f2857f5b2d7a3564e00e209fc3455c7c20334c91e2447d7a7'
cbinsights_username = 'mmehtani@ucsd.edu'
cbinsights_password = 'Glock25!'
driver = webdriver.Chrome('/Users/mayankmehtani/Downloads/chromedriver')

def login_to_cbinsights():
    driver.get('https://app.cbinsights.com/login')
    email = driver.find_element_by_xpath("//input[@name='email']")
    password = driver.find_element_by_xpath("//input[@name='password']")
    email.send_keys(cbinsights_username)
    password.send_keys(cbinsights_password)
    login_button = driver.find_element_by_xpath("//button[contains(text(),'Login')]")
    login_button.click()

def return_investors(investors):
    investors = investors.replace(', ',',')
    return investors.split(',')

def get_company_data(company_id):
    response1=requests.get('https://api.mattermark.com/companies/'+str(company_id)+'?key='+matter_key)
    data1 = response1.json()

    # company info
    company_information = {}
    company_information['name'] = data1['name']
    company_information['mattermarkid'] = data1['id']

    if len(data1['stage']) == 1:
        company_information['stage'] = 'Series: ' + data1['stage']
    else:
        company_information['stage'] = data1['stage']
    company_information['location'] = data1['location']
    company_information['city'] = data1['city']
    company_information['country'] = data1['country']
    company_information['total_funding'] = data1['total_funding']

    # find each company's investors
    company_funding = data1['funding']
    investors = []
    string_investors = ''
    first = True

    for funding_record in company_funding:
        for investor in return_investors(funding_record['investors']):
            if investor not in investors and investor != '':
                investors.append(investor)
                if not first:
                    string_investors += ', ' + investor
                else:
                    string_investors = investor
                    first = False

    company_information['investors'] = string_investors
    return company_information


#Enter our own search term and pull data from there
search_term= input('What company would you like to search for: ') # search_ term is the company used
response=requests.get('https://api.mattermark.com/companies/?key='+matter_key+'&company_name='+search_term)
data = response.json()
company_data = data['companies']

# get their Ids
company_ids = []
for data_entry in company_data:
    company_ids.append([str(data_entry['id'])])


# Gather data on the company we want
max_company = None
max_funding = 0
for company_id in company_ids:
    company = get_company_data( str(company_id[0]) )

    if company['total_funding'] != None:
        if int(company['total_funding']) >= max_funding:
            max_funding = company['total_funding']
            max_company = company

print (max_company)
data_to_write = []
data_to_write.append(['Name','Stage','Location','City','Country','Total Funding','Investors'])
data_to_write.append([ v for k,v in max_company.items() if k != 'mattermarkid'])


# find similar companies to the one with the max funding
company_ids = []
response=requests.get('https://api.mattermark.com/companies/'+max_company['mattermarkid'] + '/similar?key='+matter_key)
data = response.json()

for data_entry in data:
    if len(company_ids) < 15:
        company_ids.append(data_entry['id'])
    else:
        break

for company_id in company_ids:
    company=get_company_data(company_id)
    data_to_write.append([v for k,v in company.items() if k!='mattermarkid'])


file_name = search_term + '&similar_companies.csv'

with open(file_name,'w') as f:
    wtr = csv.writer(f,delimiter=',')
    wtr.writerows(data_to_write)
