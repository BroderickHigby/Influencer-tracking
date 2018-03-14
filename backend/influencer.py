"""Influencers models, resources and more"""

import uuid
from database import es
from elasticsearch.exceptions import NotFoundError
from falcon import HTTPNotFound
from nltk import wordnet as wn

MATCH_ALL = {"query": {"match_all": {}}}


class Influencer:

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
    def query(cls, query, limit=100):
        """Query for a list of influencers"""
        if isinstance(query, str):
            actual_query = dict(
                size=10000,
                sort=["influencer_score"],
                query=dict(
                    query_string=dict(
                        query=query,
                    ),
                ),
            )
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
        except NotFoundError:
            results = []
        else:
            results = []

            # search scoring
            for doc in res['hits']['hits']:
                score = 0
                if 'description' in doc['_source']['youtube']['brandingSettings']['channel']:
                    if query in (doc['_source']['youtube']['brandingSettings']['channel']['description']).split() :
                        score += 5

                double_count = False
                if 'title' in doc['_source']['youtube']['brandingSettings']['channel']:
                    if query in (doc['_source']['youtube']['brandingSettings']['channel']['title']).lower():
                        score += 10
                        double_count = True
                 
                if not double_count:
                    if 'keywords' in doc['_source']['youtube']['brandingSettings']['channel']:
                        if query in  (doc['_source']['youtube']['brandingSettings']['channel']['keywords']):
                            print ('i went here')
                            score += 10

                
                print (str(doc['_source']['youtube']['brandingSettings']['channel']['title']) + ' ' + str(score))
                doc['_source']['search_score'] = score
                results.append(doc['_source'])

        newlist = sorted(results, key=lambda k: k['search_score'], reverse=True)
        
        finalList = []
        for gg in newlist:
            if gg['youtube']['brandingSettings']['channel']['country'] == 'US':
                finalList.append(gg)
        
        return finalList


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
