import uuid
import datetime
from datetime import timedelta
from target_demographic import target_demographic
from company import company
from database import es
from elasticsearch.exceptions import NotFoundError

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

	def __init__( self,company_name,start_date=None,duration=30,end_date=None,product_tags=[],budget=0,objective=None,target_url=None,platforms=[], influencer_target_size, target_demographics=target_demographic.target_demographic, interest_tags =[], ad_copy=None):
		#creates a campaign and gets the ball rollin..
		company = company(company_name) #generates company object
		campaignid = uuid.uuid4() #generates a campaignid
		target_demographic = target_demographic(1,2,3,4,5,6,7) #calls demographic class
		are_too_poor, number_of_ads, ads_per_day = self.are_they_too_poor(budget, influencer_target_size, duration)

		if are_too_poor:
			print("SORRY YOU ARE TOO POOR FOR THIS. INCREASE BUDGET OR DECREASE INFLUENCER TARGET SIZE.")
		else:
			doc = {
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
			}
			self.create_db_entry(doc, campaignid)

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

	def create_db_entry(self, doc, _id):
        """Creates new influencer document"""
        res = es.index(
            index=index,
            doc_type=doc_type,
            body=doc,
            id=_id
        )
        assert res['result'] == 'created' or res['result'] == 'updated'
        return doc

	def are_they_too_poor(self, budget, influencer_target_size, duration):
		number_of_ads = budget / costs_per_post_by_influencer_size[influencer_target_size]
		if number_of_ads < 1.00:
			are_too_poor = True
			ads_per_day = 0
		else:
			are_too_poor = False
			ads_per_day = int(float(duration) / float(number_of_ads))
		return are_too_poor, number_of_ads, ads_per_day
