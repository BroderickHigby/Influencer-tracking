from ConfigBackend import *
import uuid

class Campaign:
    def __init__(self, goal, client_id, budget, client_notes, client_suggested_copy, ideal_influencers_contacted, responsive_influencers, conversions, target_url, duration):
        self.goal = goal_map[goal]
        self.budget = budget
        self.client_id = client_id
        self.client_notes = client_notes
        self.client_suggested_copy = client_suggested_copy
        self.ideal_influencers_contacted = ideal_influencers_contacted
        self.responsive_influencers = responsive_influencers
        self.conversions = conversions
        self.target_url = target_url
        self.duration = duration
        self.uuid = str(uuid.uuid4())