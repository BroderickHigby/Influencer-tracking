from elasticsearch import Elasticsearch
es = Elasticsearch()
from ConfigBackend import *
import datetime

class DatabaseInterface:
    @staticmethod
    def write_client_to_db(client):
        db = PyMySQL.connect("localhost", "testuser", "test123", client_db_name)
        cursor = db.cursor()
        # Prepare SQL query to INSERT a record into the database.
        sql_insert = "INSERT INTO %s(CLIENT_ID, INDUSTRIES, CONTACT_EMAIL, CONTACT_PHONE) VALUES (%s, %s, %s, %s)" % (client_db_name, client.client_id, '$$'.join(client.industries), client.contact_email, client.contact_phone)
        try:
            # Execute the SQL command
            cursor.execute(sql_insert)
            # Commit your changes in the database
            db.commit()
        except:
            # Rollback in case there is any error
            db.rollback()
        # disconnect from server
        db.close()

    @staticmethod
    def write_campaign_to_db(goal, optimal_influencers, campaign_id):
        campaign_doc  = {}
        campaign_doc['goal'] = goal
        campaign_doc['influencers'] = optimal_influencers
        campaign_doc['conversions'] = []
        #print(campaign_doc)
        print(campaign_doc['influencers'][0]['twitter']['favourites_count'])
        res = es.index(
            index=es_campaign_index,
            doc_type=es_campaign_doc_type,
            body=campaign_doc,
            id=campaign_id,
        )
        assert res['result'] == 'created' or res['result'] == 'updated'
        return campaign_id

    @staticmethod
    def get_campaign_results_for_client_id(client_id):
        get_campaign_query = {
            "size": max_campaigns_to_return,
            "query": {
                "match": {
                    "goal.client_id": client_id,
                }
            }
        }

        res = es.search(
            index=es_campaign_index,
            doc_type=es_campaign_doc_type,
            body=dict(get_campaign_query),
        )
        results = []
        for doc in res['hits']['hits']:
            results.append(doc['_source'])
        return results



    @staticmethod
    def get_random_influencers(count):
        es_query = {
            "size": count,
            "query": {
                "function_score": {
                    "functions": [
                        {
                            "random_score": {
                                "seed": "1477072619038"
                            }
                        }
                    ]
                }
            }
        }

        res = es.search(
            index=es_index,
            doc_type=es_doc_type,
            body=dict(es_query),
        )

        results = []
        for doc in res['hits']['hits']:
            results.append(doc['_source'])
        return results

    @staticmethod
    def get_target_url(client_id, campaign_id):
        get_target_url_query = {
            "size": 1,
            "query": {
                "match": {
                    "goal.client_id": client_id,
                    '_id': campaign_id
                }
            }
        }

        res = es.search(
            index=es_campaign_index,
            doc_type=es_campaign_doc_type,
            body=dict(get_target_url_query),
        )
        return res['hits']['hits'][0]['goal']['target_url']


    @staticmethod
    def add_conversion_event(campaign_id, influencer_id):
        #https: // stackoverflow.com / questions / 34728715 / append - to - an - existing - elasticsearch - array - field - using - python?utm_medium = organic & utm_source = google_rich_qa & utm_campaign = google_rich_qa
        es.update(
            index=es_campaign_index,
            doc_type=es_campaign_doc_type,
            id=campaign_id,
            body={"script": "ctx._source.conversions += new_conversion",
                "params": {
                    "new_conversion": {
                        "timestamp": datetime.datetime.now().strftime("%I:%M%p | %B %d, %Y"),
                        "influencer_id": influencer_id
                    }
                }

            }
        )
