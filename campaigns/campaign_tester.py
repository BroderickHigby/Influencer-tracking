import os
import sys
sys.path.insert(0, '/Users/markkeane/Desktop/projects/sapie/backend')
import influencer

sys.path.insert(0, '/Users/markkeane/Desktop/projects/sapie/backend/campaign')
import campaign

#influencer.Influencer.campaign_query('hair', 12, 'instagram')

c = campaign.Campaign("company_name", "company_id", "duration", ["hair", "technology"], "campaign_budget", "campaign_objective", "campaign_target_url", "influencer_target_size", "ad_copy")
