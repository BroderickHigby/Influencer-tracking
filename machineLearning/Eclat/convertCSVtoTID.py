import csv
eclatInput = open('eclatInputv2.txt','w')
categories = ['ChannelID:', 'ChannelTitle', 'Industry:', 'Subscribers:', 'VideoCount:', 'ViewCount:', 'HasEmail:', 'HasInstagram:', 'HasFacebook:', 'HasTwitter:', 'HasWebsite:', 'HasTwitch:', 'HasGooglePlus:', 'TwitterFavorites:', 'TwitterFollowers:', 'InstaPosts:', 'InstaFollowers:', 'InstaFollowing:', 'Awwtits', 'DamnwhatHappened', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
def convert_base(n):
    base = 10
    while True:
        floor = n // base
        if floor < 10:
            return str(floor) + 'x' + str(base)
        else:
            base = base * 10

with open('influencers.csv', newline='') as f:
    reader = csv.reader(f)
    rowcount=0;
    for row in reader:
        result=[]
        if rowcount != 0:
            colCount=0;
            for x in range (2, 18):
                if x>5 and x <13:
                    pass
                else:
                    if row[x]=='':
                        pass
                    else:
                        try:
                            row[x]= int(row[x])
                            if(row[x]==0):
                                pass
                            elif row[x] > 1:
                                row[x]=convert_base(row[x])
                                row[x]=str(row[x])
                                result.append(categories[x]+row[x])
                            else:
                                row[x]=str(row[x])
                                result.append(categories[x]+row[x])
                        except:
                            result.append(categories[x]+row[x])
                colCount+=1
            string = '16'
            for x in result:
                print (result)
                string = string +' ' +str(x);
            string = (string+'\n')
            eclatInput.write(string);
            print(string)
        rowcount+=1;
    eclatInput.close()
