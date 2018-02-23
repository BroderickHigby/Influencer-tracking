import uuid
import datetime
from datetime import timedelta
from target_demographic import target_demographic
from company import company

class Campaign:

	def __init__( self,company_name,start_date=None,campaign_length=30,end_date=None,product_tags=[],budget=0,objective=None,target_url=None,platforms=[], influencer_target_sizes=[], target_demographics=target_demographic.target_demographic, interest_tags =[], ad_copy=None):

		company = company(company_name) #generates company object
		self.campaignid = uuid.uuid4() #generates a campaignid
		self.campaign_length = campaign_length #length of client's marketing campaign
		self.product_tags = product_tags #tags associated with the product being sold
		self.target_demographic = target_demographic(1,2,3,4,5,6,7) #calls demographic class
		self.budget = budget #budget of client in US Dollars
		self.platforms  = platforms # YouTube,ig,etc.Should it be our job to figure out the platform??
		self.objective = objective #prioritize traffic or sales
		self.target_url = target_url #URL influencer will drive traffic to
		self.status = 'Seeking Influencers'
		self.results = []
		self.influencers_used = []
		self.contacted_influencers = []
		self.expected_results = None

		if start_date != None:
			self.end_date = self.start_date + timedelta(days=self.campaign_length) # a default campain length of thirty days if none is specified

	#updates the campaign start date and end date
	#once influencers are contacted and have accepted
	def confirm_campaign_dates(self,start_date,campaign_length=30):
		self.start_date = start_date
		self.end_date = start + campaign_length

	#use for updating campaign if client wants to extend
	def extend_campaign(self,campaign_extension):
		self.end_date += timedelta(days = campaign_extension)
		self.campaign_length += campaign_extension

	#changes campaign status to Active
	def start_campaign(self,influencers=[]):
		self.influencers = influencers # a list of influencers sapie found

		#generate endpoints for conversions.
		#contact influencers.
		#set up handling for influencer responses.

	#changes campaign status to Inactive
	def end_campaign(self):
		self.status = 'Inactive'
