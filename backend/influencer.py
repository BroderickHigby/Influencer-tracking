"""Influencers models, resources and more"""

import uuid
from database import es
from elasticsearch.exceptions import NotFoundError
from falcon import HTTPNotFound
from nltk import wordnet as wn
from langdetect import detect
import nltk
nltk.download('wordnet')
from nltk.corpus import wordnet

MATCH_ALL = {"query": {"match_all": {}}}


class Influencer:
    '''Creates an influencer doc'''
    index = 'sapie_yt'
    doc_type = 'influencer'

    def __init__(self, doc=None):
        self.doc = doc

    @classmethod
    def create(cls, doc, _id=None, index_to_use=None):
        """Creates new influencer document"""
        if index_to_use == None:
            index = 'sapie_yt'
        else:
            index = index_to_use
        if _id == None:
            id_ = uuid.uuid4().hex
            doc['id'] = id_
        else:
            id_ = _id
            doc['id'] = _id

        res = es.index(
            index=index,
            doc_type=cls.doc_type,
            body=doc,
            id=id_,
        )
        assert res['result'] == 'created' or res['result'] == 'updated'
        return doc

    @classmethod
    def load(cls, id_):
        res = es.get(
            index=cls.index,
            doc_type=cls.doc_type,
            id=id_,
        )
        return res['_source']

    @classmethod
    def list(cls, limit=100):
        """Returns a list of influencers"""
        return cls.query(MATCH_ALL)

    @classmethod
    def remove(cls, id_to_delete):
        es.delete(index=cls.index, doc_type=cls.doc_type, id=id_to_delete)

    @classmethod
    def query(cls, query, search_location='', limit=100):
        if search_location == '':
            """Query for a list of influencers"""
            if isinstance(query, str):
                #actual_query = dict(
                #    size=10000,
                #    sort=["influencer_score"],
                #    query=dict(
                #        query_string=dict(
                #            query=query,
                #        ),
                #    ),
                #)
                if " " not in query:
                    actual_query = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "youtube.snippet.description":query,
                            }
                        }
                    }
                    actual_query2 = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "youtube.brandingSettings.channel.keywords":query,
                            }
                        }
                    }
                    actual_query3 = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "youtube.brandingSettings.channel.title":query,
                            }
                        }
                    }
                    actual_query4 = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "twitter.description":query,
                            }
                        }
                    }

                    actual_query5 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.bio": query,
                            }
                        }
                    }

                    actual_query6 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.photo_captions": query,
                            }
                        }
                    }

                    actual_query7 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.tweets_made": query,
                            }
                        }
                    }
                else:
                    actual_query = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "youtube.snippet.description":query,
                            }
                        }
                    }
                    actual_query2 = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "youtube.brandingSettings.channel.keywords":query,
                            }
                        }
                    }
                    actual_query3 = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "youtube.brandingSettings.channel.title":query,
                            }
                        }
                    }
                    actual_query4 = {
                        "size" : 200,
                        "query":{
                            "match_phrase":{
                                "twitter.description":query,
                            }
                        }
                    }

                    actual_query5 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.bio": query,
                            }
                        }
                    }

                    actual_query6 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.photo_captions": query,
                            }
                        }
                    }

                    actual_query7 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.tweets_made": query,
                            }
                        }
                    }
            elif query is None:
                actual_query = MATCH_ALL
            else:
                query['size'] = 10000
                actual_query = query

            try:
                res = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query),
                )

                res2 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query2),
                )

                res3 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query3),
                )

                res4 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query4),
                )

                res5 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query5),
                )

                res6 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query6),
                )

                res7 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query7),
                )
            except NotFoundError:
                results = []
            else:
                results = []


                # Search Scoring based on the result
                for doc in res['hits']['hits']:
                    results.append(doc['_source'])
                for doc in res2['hits']['hits']:
                    is_in = False
                    for already_added in results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        results.append(doc['_source'])

                for doc in res3['hits']['hits']:
                    is_in = False
                    for already_added in results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        results.append(doc['_source'])

                for doc in res4['hits']['hits']:
                    is_in = False
                    for already_added in results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        results.append(doc['_source'])


                for doc in res5['hits']['hits']:
                    is_in = False
                    for already_added in results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        results.append(doc['_source'])

                for doc in res6['hits']['hits']:
                    is_in = False
                    for already_added in results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        results.append(doc['_source'])

                for doc in res7['hits']['hits']:
                    is_in = False
                    for already_added in results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        results.append(doc['_source'])


                for gg in results:
                    if 'influencer_score' not in gg:
                        gg['influencer_score'] = 95.0
                    if gg['platform_base'] == 'instagram':
                        gg['instagram']['screen_name'] = gg['instagram']['url'].split('/')[len(gg['instagram']['url'].split('/')) - 1]
                #newlist = sorted(results, key=lambda k: k['influencer_score'], reverse=True)
                return results
        else:
            """Query for a list of influencers"""
            if isinstance(query, str):
                # actual_query = dict(
                #    size=10000,
                #    sort=["influencer_score"],
                #    query=dict(
                #        query_string=dict(
                #            query=query,
                #        ),
                #    ),
                # )
                if " " not in query:
                    actual_query1 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.snippet.description": query,
                            }
                        }
                    }

                    actual_query2 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.snippet.description": search_location,
                            }
                        }
                    }

                    actual_query3 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.keywords": query,
                            }
                        }
                    }

                    actual_query4 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.keywords": search_location,
                            }
                        }
                    }

                    actual_query5 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.title": query,
                            }
                        }
                    }

                    actual_query6 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.title": search_location,
                            }
                        }
                    }

                    actual_query7 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.description": query,
                            }
                        }
                    }

                    actual_query8 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.description": search_location,
                            }
                        }
                    }

                    actual_query9 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.bio": query,
                            }
                        }
                    }

                    actual_query10 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.bio": search_location,
                            }
                        }
                    }

                    actual_query11 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.photo_captions": query,
                            }
                        }
                    }

                    actual_query12 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.photo_captions": search_location,
                            }
                        }
                    }

                    actual_query13 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.tweets_made": query,
                            }
                        }
                    }

                    actual_query14 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.tweets_made": search_location,
                            }
                        }
                    }
                else:
                    actual_query1 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.snippet.description": query,
                            }
                        }
                    }

                    actual_query2 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.snippet.description": search_location,
                            }
                        }
                    }

                    actual_query3 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.keywords": query,
                            }
                        }
                    }

                    actual_query4 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.keywords": search_location,
                            }
                        }
                    }

                    actual_query5 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.title": query,
                            }
                        }
                    }

                    actual_query6 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "youtube.brandingSettings.channel.title": search_location,
                            }
                        }
                    }

                    actual_query7 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.description": query,
                            }
                        }
                    }

                    actual_query8 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.description": search_location,
                            }
                        }
                    }

                    actual_query9 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.bio": query,
                            }
                        }
                    }

                    actual_query10 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.bio": search_location,
                            }
                        }
                    }

                    actual_query11 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.photo_captions": query,
                            }
                        }
                    }

                    actual_query12 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "instagram.photo_captions": search_location,
                            }
                        }
                    }

                    actual_query13 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.tweets_made": query,
                            }
                        }
                    }

                    actual_query14 = {
                        "size": 200,
                        "query": {
                            "match_phrase": {
                                "twitter.tweets_made": search_location,
                            }
                        }
                    }
            elif query is None:
                actual_query = MATCH_ALL
            else:
                query['size'] = 10000
                actual_query = query

            try:
                res = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query1),
                )

                res2 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query2),
                )

                res3 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query3),
                )

                res4 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query4),
                )

                res5 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query5),
                )

                res6 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query6),
                )

                res7 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query7),
                )

                res8 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query8),
                )

                res9 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query9),
                )

                res10 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query10),
                )

                res11 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query11),
                )

                res12 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query12),
                )

                res13 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query13),
                )

                res14 = es.search(
                    index=cls.index,
                    doc_type=cls.doc_type,
                    body=dict(actual_query14),
                )
            except NotFoundError:
                results = []
            else:
                phrase_results = []

                # Search Scoring based on the result
                for doc in res['hits']['hits']:
                    phrase_results.append(doc['_source'])
                for doc in res2['hits']['hits']:
                    is_in = False
                    for already_added in phrase_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        phrase_results.append(doc['_source'])

                for doc in res3['hits']['hits']:
                    is_in = False
                    for already_added in phrase_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        phrase_results.append(doc['_source'])

                for doc in res4['hits']['hits']:
                    is_in = False
                    for already_added in phrase_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        phrase_results.append(doc['_source'])

                for doc in res5['hits']['hits']:
                    is_in = False
                    for already_added in phrase_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        phrase_results.append(doc['_source'])

                for doc in res6['hits']['hits']:
                    is_in = False
                    for already_added in phrase_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        phrase_results.append(doc['_source'])

                for doc in res7['hits']['hits']:
                    is_in = False
                    for already_added in phrase_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        phrase_results.append(doc['_source'])

                location_results = []

                # Search Scoring based on the result
                for doc in res8['hits']['hits']:
                    location_results.append(doc['_source'])
                for doc in res9['hits']['hits']:
                    is_in = False
                    for already_added in location_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        location_results.append(doc['_source'])

                for doc in res10['hits']['hits']:
                    is_in = False
                    for already_added in location_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        location_results.append(doc['_source'])

                for doc in res11['hits']['hits']:
                    is_in = False
                    for already_added in location_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        location_results.append(doc['_source'])

                for doc in res12['hits']['hits']:
                    is_in = False
                    for already_added in location_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        location_results.append(doc['_source'])

                for doc in res13['hits']['hits']:
                    is_in = False
                    for already_added in location_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        location_results.append(doc['_source'])

                for doc in res14['hits']['hits']:
                    is_in = False
                    for already_added in location_results:
                        if already_added['id'] == doc['_source']['id']:
                            is_in = True
                            break
                    if is_in == False:
                        location_results.append(doc['_source'])

                final_results = []
                for phrase_result in phrase_results:
                    for location_result in location_results:
                        if location_result['id'] == phrase_result['id']:
                            final_results.append(phrase_result)
                            break


                for gg in final_results:
                    if 'influencer_score' not in gg:
                        gg['influencer_score'] = 95.0
                    if gg['platform_base'] == 'instagram':
                        gg['instagram']['screen_name'] = gg['instagram']['url'].split('/')[
                            len(gg['instagram']['url'].split('/')) - 1]
                # newlist = sorted(results, key=lambda k: k['influencer_score'], reverse=True)
                return final_results

class InfluencerResource:

    def on_get(self, req, resp, influencer_id):
        """Handles listing of influencers"""
        try:
            res = Influencer.load(influencer_id.hex)
        except NotFoundError:
            raise HTTPNotFound()
        resp.media = res

    def on_put(self, req, resp, influencer_id):
        """Handles listing of influencers"""
        id_ = influencer_id.hex
        try:
            res = Influencer.load(id_)
        except NotFoundError:
            raise HTTPNotFound()
        doc = req.media
        doc['id'] = id_
        # TODO: implement resource wrapper and bring this to model class
        res = es.index(
            index='sapie',
            doc_type='influencer',
            id=id_,
            body=doc,
        )
        assert res['result'] == 'updated'
        resp.media = doc


class InfluencerResourceList:

    def on_get(self, req, resp):
        """Handles listing of influencers"""
        query = req.params.get('query', None)
        results = Influencer.query(query)
        sample = dict(results=results)
        resp.media = sample

    def on_post(self, req, resp):
        """Creates new influencer record"""
        doc = req.media
        created = Influencer.create(doc)
        resp.media = created
