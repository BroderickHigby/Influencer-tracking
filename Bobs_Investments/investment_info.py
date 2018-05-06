import requests
import json

def return_investors(investors):
    investors = investors.replace(', ',',')
    print (investors)
    return investors.split(',')



#my own API key for mattermark's API
matter_key = '4b542b0e2d26cb603bc2560a0ca0f3222b8b7d893d3b8dd0cde0b3af95adb7f3'


#Enter our own search term and pull data from there
search_term= input('What company would you like to search for: ')
response=requests.get('https://api.mattermark.com/companies/?key='+matter_key+'&company_name='+search_term)
data = response.json()
company_data = data['companies']

#get their Ids
company_ids = []
for data_entry in company_data:
    company_ids.append([str(data_entry['id'])])


#Gather data on each company
for id in company_ids:
    response1=requests.get('https://api.mattermark.com/companies/'+str(id[0])+'?key='+matter_key)
    data1 = response1.json()

    #company info
    company_information = {}
    company_information['id'] = data1['id']
    company_information['Website'] = data1['website']
    company_information['location'] = data1['location']
    company_information['city'] = data1['city']
    company_information['state'] = data1['state']
    company_information['country'] = data1['country']
    company_information['name'] = data1['name']
    company_information['total_funding'] = data1['total_funding']

    #find each company's investors
    data1_funding = data1['funding']
    all_investors = []
    for i in range(0,len(data1_funding)):
        series_investors = data1_funding[i]['investors']
        series_investors = return_investors(series_investors)
        
        for entry in series_investors:
            if entry not in all_investors:
                all_investors.append(entry)
        
    company_information['all_investors'] = all_investors                
    

