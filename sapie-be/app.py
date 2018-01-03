import falcon

from influencer import (
    InfluencerResource,
    InfluencerResourceList,
)


api = falcon.API()
api.add_route('/api/influencer/{influencer_id:uuid}', InfluencerResource())
api.add_route('/api/influencer', InfluencerResourceList())
