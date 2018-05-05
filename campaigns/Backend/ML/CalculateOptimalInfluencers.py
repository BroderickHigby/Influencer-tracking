from '../ConfigBackend' import *

class CalculateOptimalInfluencers:

    def get_optimal_influencers(self):
        if use_random_influencers_for_campaign == True:
            return get_random_influencers(number_of_influencers_to_contact_per_campaign)
        #else:

    #def find_ideal_influencer_attributes(self, client_industries, budget):


    #def get_influencers_matching_ideal_attributes(self):

    def get_random_influencers(self, count):
