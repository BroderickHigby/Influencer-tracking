import argparse
import csv

parser = argparse.ArgumentParser();
parser.add_argument("-f","--inputFile");
parser.add_argument("-g","--outputFile");
args = parser.parse_args();



outputFile = open(args.outputFile,'w')

result = []
industryResult = [];

industry = '';
prevIndustry = ''

industryStartIndex = 0
industryEndIndex = 0

youtubeSubs=0
twitterFollowers = 0
instagramFollowers = 0
youTubeMean = 0
twitterMean = 0
instagramMean = 0

initial = 0;
iteration = 0

with open(args.inputFile, newline='') as f:
    reader = csv.reader(f)
    data = list(reader);
    counter = 0;
    while counter < len(data):
        print (str(counter))
        row = data[counter]
        industry = row[2]
        if industry != prevIndustry:
            print(industry)
            print(prevIndustry)
            if initial == 0:
                prevIndustry = industry
                initial = 1
            else: #End of First Iteration, Calculate Industry Means
                if iteration == 0:
                    iteration = 1
                    industryEndIndex = counter
                    counter = industryStartIndex

                    industryCount = industryEndIndex - industryStartIndex
                    youtubeMean = youtubeSubs/industryCount
                    twitterMean = twitterFollowers/industryCount
                    instagramMean = instagramFollowers/industryCount

                elif iteration == 1: #End of Second iteration, clear variables and add the  first item of the next
                    iteration = 0
                    industryStartIndex = counter;

                    indResult = [];
                    youtubeSubs=0
                    twitterFollowers = 0
                    instagramFollowers = 0
                    YouTubeMean = 0
                    twitterMean = 0
                    instagramMean = 0
                    prevIndustry = industry;


                    try:
                        youtubeSubs += int(row[3])
                    except:
                        pass
                    try:
                        twitterFollowers += float(row[13])
                    except:
                        pass

                    try:
                        instagramFollowers += float(row[15])
                    except:
                        pass

        else:
            prevIndustry = industry
            print(youTubeMean)
            if iteration == 1:
                failed = 0
                try:
                    youtubeSd = (float(row[3])-youtubeMean)/youtubeMean
                except:
                    failed = 1
                    print('failed youtube')
                try:
                    twitterSd = (float(row[13]) - twitterMean)/twitterMean
                except:
                    failed = 1
                    print('failed twitter')
                try:
                    instaSd = (float(row[15]) - instagramMean)/instagramMean
                except:
                    print('failed Instagram')
                    failed = 1
                try:
                    influenceScore = (.5 * youtubeSd) + (.3 * instaSd) + (.2 * twitterSd)
                except:
                    influenceScore = 'Not Calculable'

                industryResult.append(row[1])

                if failed == 1:
                    industryResult.append('failed')
                else:
                    industryResult.append(influenceScore);
                industryResult.append(row[3])

                industryResult.append(row[13])
                industryResult.append(row[15])

                industryResult.append(row[2])
                result.append(industryResult)
                industryResult = []

            elif iteration == 0:
                try:
                    youtubeSubs += int(row[3])
                except:
                    pass
                try:
                    twitterFollowers += int(row[13])
                except:
                    pass
                try:
                    instagramFollowers += int(row[15])
                except:
                    pass
        counter +=1

for item in result:
    string = '{:30}'.format(str(item[0])) +   '{:40}'.format('Influnce Score: ' + str(item[1])) + '{:30}'.format('Subscribers: ' + str(item[2]))  + '{:20}'.format('Instragram: ' + str(item[3])) +  '{:20}'.format('Twitter: ' + str(item[4])) +  '{:10}'.format('Industry: ' + str(item[5]))
    print (string)
