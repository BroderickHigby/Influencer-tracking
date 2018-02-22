class YT_Model:
    def __init__(self, view_count, video_count, subscriber_count):
        subscribers_to_views = float(subscriber_count) / float(view_count)
        videos_to_views =  float(video_count) / float(view_count)

        if subscribers_to_views > 0.1:
            subscribers_to_views = 0.1
        if videos_to_views > 0.1:
            videos_to_views = 0.1
        subscribers_to_views = subscribers_to_views * 5
        videos_to_views = videos_to_views * 5

        subscribers_to_views = subscribers_to_views * 100
        videos_to_views = videos_to_views * 100

        score = subscribers_to_views + videos_to_views
        return score
