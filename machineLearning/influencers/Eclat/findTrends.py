f=open('eclatOutput.txt','r')

cnt = 0;
for line in f:
    line = line.split()
    for item in line:
        item = item.split(':')
        if int(item[len(item)-1][1]) > mostRecurrent
