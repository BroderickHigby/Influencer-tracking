from elasticsearch import Elasticsearch
import sys
sys.path.append('..')
from ConfigBackend import *

es = Elasticsearch()


class DatabaseInterface:
    @staticmethod
    def write_new_physical_campaign(campaign, campaign_id, created_at):
        campaign['created_at'] = created_at
        campaign['signed_influencers'] = []
        campaign['pings'] = []
        res = es.index(
            index=es_campaign_index,
            doc_type=es_campaign_doc_type,
            body=campaign,
            id=campaign_id,
        )
        assert res['result'] == 'created' or res['result'] == 'updated'
        return campaign_id
