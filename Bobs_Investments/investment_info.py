import requests
import json
import csv
import re
from selenium import webdriver

#my own API key for mattermark's API
matter_key = '2dfbebc0ef9b2e21fe824c68755216065cbd16e2b77d530da8cff93f9ad9461b'


# to implement later - get contact information of investors
'''
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
'''

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
    company_information['employees'] = data1['employees']
    company_information['total_funding'] = data1['total_funding']

    # find each company's investors
    company_funding = data1['funding']

    investors = []
    string_investors = ''
    first = True

    investor_ids = []
    for funding_record in company_funding:
        for id in funding_record['investor_ids']:
            if id not in investor_ids:
                investor_ids.append(id)

    '''
        for investor in return_investors(funding_record['investors']):
            if investor not in investors and investor != '':
                investors.append(investor)
                if not first:
                    string_investors += ', ' + investor
                else:
                    string_investors = investor
                    first = False
    company_information['investors'] = string_investors
    '''
    company_information['investor_ids'] = investor_ids
    return company_information

def get_investor_data(investor_id):
    response1=requests.get('https://api.mattermark.com/investors/'+str(investor_id)+'?key='+matter_key)
    data1 = response1.json()

    investor_info = {}
    investor_info['mattermarkid'] = data1['id']
    investor_info['name'] = data1['name']
    investor_info['Total Portfolio Size'] = data1['portfolio_size']

    investor_info['Top Industries'] = []
    for entry in data1['top_industries']:
        investor_info['Top Industries'].append(entry['industry_name'])

    investor_info['Exits'] = 0
    for entry in data1['portfolio_aggregates']['stages']:
        stage_entry = entry['name']
        if re.match('Exited',entry['name']):
            key = str(entry['name'])
            investor_info['Exits'] += int(entry['count'])

    return investor_info


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
max_employee_count = 0
for company_id in company_ids:
    company = get_company_data( str(company_id[0]) )

    if company['employees'] != None:
        if int(company['employees']) >= max_employee_count:
            max_employee_count= company['employees']
            max_company = company

# find similar companies to the one with the max funding
company_ids = []
company_ids.append(max_company['mattermarkid'])
response=requests.get('https://api.mattermark.com/companies/'+max_company['mattermarkid']+'/similar?key='+matter_key)
data = response.json()

for data_entry in data:
    if len(company_ids) < 15:
        company_ids.append(data_entry['id'])
    else:
        break

# match all the investors we found
all_investor_ids = {}
all_investors = []
for company_id in company_ids:
    company = get_company_data(company_id)

    for id in company['investor_ids']:
        if id not in all_investor_ids:
            new_investor = get_investor_data(id)
            new_investor['Invested In'] = [company['name']]
            all_investor_ids[id] = new_investor
            all_investors.append(new_investor)
        else:
            all_investor_ids[id]['Invested In'].append(company['name'])


data_to_write = []
data_to_write.append(['Investor Name','Total Portfolio Size','Industries','Total No. of Exits','Companies Invested In'])

for investor in all_investors:
    for k,v in investor.items():
        if type(v) is list:
            v = ','.join(v)

    data_to_write.append([v for k,v in investor.items() if k!='mattermarkid'])

file_name = search_term + "&similar_companies' Investor Information.csv"
with open(file_name,'w') as f:
    wtr = csv.writer(f,delimiter=',')
    wtr.writerows(data_to_write)
