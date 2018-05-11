import requests
res = requests.post('http://ec2-34-209-86-220.us-west-2.compute.amazonaws.com:5441/postjson', json={"mytext":"lalala"})
