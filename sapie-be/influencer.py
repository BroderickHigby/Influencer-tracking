"""Influencers models, resources and more"""

import uuid
from database import es


MATCH_ALL = {"query": {"match_all": {}}}


class Influencer:

    index = 'sapie'
    doc_type = 'influencer'

    def __init__(self, doc=None):
        self.doc = doc

    @classmethod
    def create(cls, doc):
        """Creates new influencer document"""
        id_ = uuid.uuid4().hex
        doc['id'] = id_
        res = es.index(
            index=cls.index,
            doc_type=cls.doc_type,
            body=doc,
            id=id_,
        )
        assert res['result'] == 'created'
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
    def query(cls, query, limit=100):
        """Query for a list of influencers"""
        if isinstance(query, str):
            actual_query = dict(
                query=dict(
                    query_string=dict(
                        query=query,
                    ),
                ),
            )
        elif query is None:
            actual_query = MATCH_ALL
        else:
            actual_query = query
        res = es.search(
            index=cls.index,
            doc_type=cls.doc_type,
            body=dict(actual_query),
        )
        results = []
        for doc in res['hits']['hits']:
            results.append(doc['_source'])
        return results


class InfluencerResource:

    def on_get(self, req, resp, influencer_id):
        """Handles listing of influencers"""
        res = Influencer.load(influencer_id.hex)
        resp.media = res

    def on_put(self, req, resp, influencer_id):
        """Handles listing of influencers"""
        id_ = influencer_id.hex
        res = Influencer.load(id_)
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
