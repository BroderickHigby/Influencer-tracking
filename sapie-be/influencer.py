"""Influencers models, resources and more"""

import uuid
from database import es


MATCH_ALL = {"query": {"match_all": {}}}


class Influencer:

    doc_type = 'influencer'

    def __init__(self, doc=None):
        self.doc = doc

    @classmethod
    def create(cls, doc):
        """Creates new influencer document"""
        id_ = uuid.uuid4().hex
        doc['id'] = id_
        res = es.index(index='sapie', doc_type=cls.doc_type, body=doc, id=id_)
        assert res['result'] == 'created'
        return doc

    @classmethod
    def list(cls, limit=100):
        """Returns a list of influencers"""
        res = es.search(
            index='sapie',
            doc_type=cls.doc_type,
            body=MATCH_ALL,
        )
        results = []
        for doc in res['hits']['hits']:
            results.append(doc['_source'])
        return results


class InfluencerResource:

    def on_get(self, req, resp):
        """Handles listing of influencers"""
        results = Influencer.list()
        sample = dict(results=results)
        resp.media = sample

    def on_post(self, req, resp):
        """Creates new influencer record"""
        doc = req.media
        created = Influencer.create(doc)
        resp.media = created
