
class influencer_score():
    def __init__(self, influencer):
        self.influencer = influencer

    def get_score():
        if self.influencer['youtube']['statistics']['videoCount'] != "0":
            yt_views_metric = float(self.influencer['youtube']['statistics']['viewCount']) / float(self.influencer['youtube']['statistics']['videoCount'])
            yt_subs_metric = float(self.influencer['youtube']['statistics']['subscriberCount']) / float(self.influencer['youtube']['statistics']['videoCount'])
        else:
            yt_views_metric = float(self.influencer['youtube']['statistics']['viewCount']) / 10000.00
            yt_subs_metric = float(self.influencer['youtube']['statistics']['subscriberCount']) / 10000.00

        if yt_views_metric > 100000:
            yt_views_metric = 100000
        if yt_subs_metric > 6000:
            yt_subs_metric = 6000

        yt_views_score_component = (yt_views_metric / 100000) * 50.00
        yt_subs_score_component = (yt_subs_metric / 6000) * 50.00

        score = yt_subs_score_component + yt_views_score_component
        return score
