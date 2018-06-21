import csv

youtubeHigh = 0
youtubeLow = 0

instagramHigh = 0
instagramLow = 0

twitterHigh = 0
twitterLow = 0


with open('sample.csv', newline='') as f:
    reader = csv.reader(f)
    for row in reader:

        youtubeInfluence = 0
        instagramInfluence = 0
        twitterInfluence = 0

        name = row[0]

        subscribers = int(row[1])
        videoCount = int(row[2])
        youtubeComments = int(row[3])
        thumbsUp = int(row[4])
        thumbsDown = int(row[5])
        views = int(row[6])
        youtubeTime = int(row[7])

        instagramFollowers = int(row[8])
        instagramPosts = int(row[9])
        instagramLikes = int(row[10])
        instagramComments = int(row[11])
        instagramTime = int(row[12])

        twitterFollowers = int(row[13])
        twitterTweets = int(row[14])
        twitterLikes = int(row[15])
        twitterReplies = int(row[16])
        twitterRetweets = int(row[17])
        twitterUserReplies = int(row[18])
        twitterTime = int(row[19])


        #Youtube Algorithm
        avgViews = int(views)/10
        youtubeEngagement = avgViews * ((youtubeComments/10 + thumbsUp+thumbsDown)/views)
        youtubeInfluence = (youtubeEngagement*(thumbsUp/thumbsDown))/youtubeTime
        youtubeInfluence = (youtubeInfluence * 100 / 400)
        youtubeInfluence = round(youtubeInfluence, 2)

        if youtubeInfluence > youtubeHigh:
            youtubeHigh = youtubeInfluence
        elif youtubeInfluence < youtubeLow:
            youtubeLow = youtubeInfluence

        #Instagram Algorith
        instagramEngagement = (instagramLikes+instagramComments)/50
        instagramInfluence = instagramEngagement/instagramTime
        instagramInfluence = instagramInfluence * 100/400
        instagramInfluence = round(instagramInfluence, 2)

        if instagramInfluence > instagramHigh:
            instagramHigh = instagramInfluence
        elif instagramInfluence < instagramLow:
            instagramLow = instagramInfluence
        #twitterAlgorithm
        twitterEngagement = (twitterLikes - twitterReplies+ 2*twitterRetweets)/200
        twitterInfluence = 100*(twitterEngagement * (twitterUserReplies))/twitterTime
        twitterInfluence = twitterInfluence * 100/400
        twitterInfluence = round(twitterInfluence,2)

        if twitterInfluence > twitterHigh:
            twitterHigh = twitterInfluence
        elif twitterInfluence < twitterLow:
            twitterLow = twitterInfluence


        string = '{:20}'.format(str(name)) +   '{:30}'.format('Subscribers: ' + str(subscribers)) + '{:40}'.format('Youtube Score: ' + str(youtubeInfluence))  + '{:40}'.format('Instragram Score: ' + str(instagramInfluence)) +  '{:40}'.format('Twitter Influence: ' + str(twitterInfluence))
        print (string)

print(youtubeHigh)
print(youtubeLow)
print(instagramHigh)
print(instagramLow)
print(twitterHigh)
print(twitterLow)
