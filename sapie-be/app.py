import falcon

from influencer import InfluencerResource


api = falcon.API()
api.add_route('/influencer', InfluencerResource())
