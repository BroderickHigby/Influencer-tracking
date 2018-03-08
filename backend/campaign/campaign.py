import uuid
import datetime
from datetime import timedelta
from target_demographic import target_demographic
from company import company
from database import es
from elasticsearch.exceptions import NotFoundError
import os
import sys
sys.path.insert(0, '/Users/markkeane/Desktop/projects/sapie/backend')
from influencer import *
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
import imaplib

class Campaign:
	costs_per_post_by_influencer_size = {
		"tiny": 2.0,
		"small": 8.50,
		"medium": 32.0,
		"large": 300.0,
		"huge": 3000.0,
		"giant": 30000
	}
	index = 'campaigns'
	doc_type = 'campaign'


	def __init__(self, company_name, company_id, duration, brands_industries, campaign_budget, campaign_objective, campaign_target_url, influencer_target_size, ad_copy, hard_coded=True):
		#creates a campaign and gets the ball rollin..
		#company = company(company_name) #generates company object
		#campaignid = uuid.uuid4() #generates a campaignid
		#target_demographic = target_demographic(1,2,3,4,5,6,7) #calls demographic class
		#are_too_poor, number_of_ads, ads_per_day = self.are_they_too_poor(budget, influencer_target_size, duration)

		#if are_too_poor:
		if False:
			print("SORRY YOU ARE TOO POOR FOR THIS. INCREASE BUDGET OR DECREASE INFLUENCER TARGET SIZE.")
		else:
			if hard_coded == True:
				for industry in brands_industries:
					suitable_influencers = Influencer.campaign_query(industry, "target_size", "platform")
				self.send_initial_email_to_influencers()
				'''doc = {
						"company" : company,
						"product_tags": product_tags
						"start_date": start_date,
						"duration": duration,
						"ads_per_day": ads_per_day,
						"number_of_ads": number_of_ads,
						"target_demographic": target_demographic,
						"interest_tags": interest_tags,
						"budget": budget,
						"influencer_target_size": influencer_target_size,
						"platforms" : platforms,
						"objective": objective,
						"target_url": target_url,
						"status": 'Seeking Influencers',
						"results": [],
						"influencers_used": [],
						"contacted_influencers": [],
						"expected_results": None,
						"ad_copy": ad_copy
				}'''
				#self.create_db_entry(doc, campaignid)

			#get list of influencers to contact - use model (fake at first)
			#contact influencers and process replies and tell company when campaign began
			#set up urls for updating results


	#updates the campaign start date and end date
	#once influencers are contacted and have accepted
	def confirm_campaign_dates(self,start_date,duration=30):
		self.start_date = start_date
		self.end_date = start + duration

	#use for updating campaign if client wants to extend
	def extend_campaign(self,campaign_extension):
		self.end_date += timedelta(days = campaign_extension)
		self.duration += campaign_extension

	#changes campaign status to Active
	def start_campaign(self,influencers=[]):
		self.influencers = influencers # a list of influencers sapie found

		#generate endpoints for conversions.
		#contact influencers.
		#set up handling for influencer responses.

	#changes campaign status to Inactive
	def end_campaign(self):
		self.status = 'Inactive'

	'''def create_db_entry(self, doc, _id):
        """Creates new influencer document"""
        res = es.index(
            index=index,
            doc_type=doc_type,
            body=doc,
            id=_id
        )
        assert res['result'] == 'created' or res['result'] == 'updated'
        return doc'''

	def are_they_too_poor(self, budget, influencer_target_size, duration):
		number_of_ads = budget / costs_per_post_by_influencer_size[influencer_target_size]
		if number_of_ads < 1.00:
			are_too_poor = True
			ads_per_day = 0
		else:
			are_too_poor = False
			ads_per_day = int(float(duration) / float(number_of_ads))
		return are_too_poor, number_of_ads, ads_per_day

	def send_initial_email_to_influencers(self):
		print("SENDINGGG")
		fromaddr = "mkeane@ucsd.edu"
		toaddr = "mkeane@ucsd.edu"
		msg = MIMEMultipart()
		msg['From'] = fromaddr
		msg['To'] = toaddr
		msg['Subject'] = "SUBJECT OF THE MAIL"

		body = "YOUR MESSAGE HERE"
		msg.attach(MIMEText(body, 'plain'))

		server = smtplib.SMTP('smtp.gmail.com', 587)
		server.starttls()
		server.login(fromaddr, "PWORD!")
		text = msg.as_string()
		server.sendmail(fromaddr, toaddr, text)
		server.quit()

	def check_for_email_replies(self):
		mail = imaplib.IMAP4_SSL('imap.gmail.com')
		mail.login('myusername@gmail.com', 'mypassword')
		mail.list()
		# Out: list of "folders" aka labels in gmail.
		mail.select("inbox") # connect to inbox.

		result, data = mail.search(None, "ALL")

		ids = data[0] # data is a list.
		id_list = ids.split() # ids is a space separated string
		latest_email_id = id_list[-1] # get the latest

		result, data = mail.fetch(latest_email_id, "(RFC822)") # fetch the email body (RFC822) for the given ID

		raw_email = data[0][1] # here's the body, which is raw text of the whole email
		# including headers and alternate payloads
