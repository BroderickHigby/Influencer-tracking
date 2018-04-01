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
            #actual_query = dict(
            #    size=10000,
            #    sort=["influencer_score"],
            #    query=dict(
            #        query_string=dict(
            #            query=query,
            #        ),
            #    ),
            #)
            actual_query = dict(
                query=dict(
                    match=dict(
                        youtube.snippet.description=query,
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


            # Search Scoring based on the result
            for doc in res['hits']['hits']:
                score = 0
                if len( str( query ).split() ) < 2:

                    if 'description' in doc['_source']['youtube']['brandingSettings']['channel']:
                        if ( query.lower() ) in \
                        (doc['_source']['youtube']['brandingSettings']['channel']['description']).split():
                            score += 3

                    double_count = False # a check to not count the query in the title and its keywords
                    if 'title' in doc['_source']['youtube']['brandingSettings']['channel']:
                        if ( query.lower() ) in \
                        (doc['_source']['youtube']['brandingSettings']['channel']['title']).lower():
                            score += 10
                            double_count = True

                    
                    if not double_count:
                        if 'keywords' in doc['_source']['youtube']['brandingSettings']['channel']:
                            if ( word.lower() ) in \
                            (doc['_source']['youtube']['brandingSettings']['channel']['keywords']):
                                score += 10
                # multiword queries
                else:
                    
                    for word in ( query.split() ) :
                        if 'description' in doc['_source']['youtube']['brandingSettings']['channel']:
                            if ( word.lower() ) in \
                            (doc['_source']['youtube']['brandingSettings']['channel']['description']).split():
                                score += 2
   
                        double_count = False # a check to NOT count the query in the title and its keywords
                        if 'title' in doc['_source']['youtube']['brandingSettings']['channel']:
                            if ( word.lower() ) in \
                            (doc['_source']['youtube']['brandingSettings']['channel']['title']).lower():
                                score += 5
                                double_count = True

                        if not double_count:
                            if 'keywords' in doc['_source']['youtube']['brandingSettings']['channel']:
                                if ( word.lower() ) in \
                                 (doc['_source']['youtube']['brandingSettings']['channel']['keywords']):
                                    score += 5

                doc['_source']['search_score'] = score
                results.append(doc['_source'])
                
                # Ranking the results based on synonyms of the query
                synonyms = []

                # getting all synonyms from wordnet
                for word in (str(query)).split():
                    for syn in wordnet.synsets(word):
                        for l in syn.lemmas():
                            synonyms.append(l.name())
                
                for ss in synonyms:
                    #actual_query = dict(
                    #    size=10000,
                    #    sort=["influencer_score"],
                    #    query=dict(
                    #        query_string=dict(
                    #            query=ss,
                    #        ),
                    #    ),
                    #)
                    actual_query = dict(
                        query=dict(
                            match=dict(
                                 youtube.snippet.description=ss,
                            ),
                        ),
                    )
                    
                    
                    res = es.search(
                        index=cls.index,
                        doc_type=cls.doc_type,
                        body=dict(actual_query),
                    )
                    
                    # Ranking the synonym matches (e.g. movies and films)
                    for doc in res['hits']['hits']:
                        score = 0
                        if 'description' in doc['_source']['youtube']['brandingSettings']['channel']:
                            if (str(ss)).lower() in \
                            (doc['_source']['youtube']['brandingSettings']['channel']['description']).split() :
                                if len( query.split() ) < 2:
                                    score += 3
                                else:
                                    score += 1
                                    
                        
                        # a check to not count the query in the title and its keyword
                        double_count = False
                            
                        if 'title' in doc['_source']['youtube']['brandingSettings']['channel']:
                            if (str(ss)).lower() in \
                            (doc['_source']['youtube']['brandingSettings']['channel']['title']).lower():
                                if len( query.split() ) < 2:
                                    score += 5
                                else:
                                    score += 3
                                double_count = True

                            if not double_count:
                                if 'keywords' in doc['_source']['youtube']['brandingSettings']['channel']:
                                    if ss in  \
                                    (doc['_source']['youtube']['brandingSettings']['channel']['keywords']):
                                        if len ( query.split() ) < 2:
                                            score += 5
                                        else:
                                            score += 3
                                    
                        
                        # "recheck later if code is redundant" - Mayank
                        check = False # check if channel was returned in an earlier query
                        for entry in results:
                            if doc['_source']['youtube']['brandingSettings']['channel']['title'] \
                             == entry['youtube']['brandingSettings']['channel']['title']:
                                entry['search_score'] += score
                                check = True
                                break
                        
                        if check == False:
                            is_duplicate = False
                            for rr in results:
                                if rr['id'] == doc['_id']:
                                    is_duplicate = True
                                    break
                            
                            if is_duplicate == False:
                                doc['_source']['search_score'] = score
                                results.append(doc['_source'])


                # return those users you have one of the following:
                # Email, instagram, twitter
                newResults = []
                for entry in results:
                    # check if they have emails
                    email_check = False
                    if 'email' in entry:
                        if entry['email'] != '': 
                            newResults.append(entry)
                            email_check = True
            
                    # check if they have an ig
                    ig_check = False
                    if email_check == False:
                        if 'instagram' in entry:
                            if entry['instagram']['url'] != '':
                                newResults.append(entry)
                                ig_check = True

                    # twitter check
                    if (ig_check == False) and (email_check == False):
                        if 'twitter' in entry:
                            if entry['twitter']['url'] != '':
                                newResults.append(entry)

                # newList = sorted(results, key=lambda k: k['search_score'], reverse=True) 
                influenceList = sorted(newResults, key=lambda k: k['search_score'], reverse=True)
                return influenceList # return emailList for only results with emails


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
