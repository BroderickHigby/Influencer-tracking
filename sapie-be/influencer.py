"""Influencers models, resources and more."""
import random


class Influencer:

    @classmethod
    def list(cls, limit=100):
        """Returns a list of influencers"""
        results = []
        for i in range(limit):
            influencer = dict(
                industry=random.choice(['android', 'seo', 'iphone', 'mobile']),
                socialauthority=random.randint(7, 100),
                followers=random.randint(100, 100000),
                url='http://example.com/influencer/{0}'.format(i),
            )
            results.append(influencer)
        return results


class InfluencerResource:

    def on_get(self, req, resp):
        """Handles listing of influencers"""
        results = Influencer.list()
        sample = dict(results=results)
        resp.media = sample
