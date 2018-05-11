import sys
sys.path.append('..')
from ConfigBackend import *
from DatabaseInterface import *


class CalculateOptimalInfluencers:
    @staticmethod
    def get_optimal_influencers(goals=None):
        if use_random_influencers_for_campaign == True:
            return DatabaseInterface.get_random_influencers(number_of_influencers_to_contact_per_campaign)
        #else:

    #def find_ideal_influencer_attributes(self, client_industries, budget):


    #def get_influencers_matching_ideal_attributes(self):


