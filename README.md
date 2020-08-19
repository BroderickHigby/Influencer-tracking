# Sapie Space
Sapie Space's mission is to connect businesses to social media influencers using machine learning.

## Quick Start
### Please create a branch of the repo
#### Make sure you have the latest version of python 3 downloaded
```console
# First, clone the repo to a desired folder
$ git clone https://github.com/sapie-space/sapie.git

# Now, we are going to install npm dependancies
$ cd ~.../sapie/frontend
$ npm install

# Next, we need to point search requires to our localhost
$ cd .../sapie/frontend/src/page
$ atom Search.js

# Around line 670, there is a line that says axios.post('https://ec2.../run_query')
# Change the URL ('https://ec2../run_query') to ('http://127.0.0.1:5000/run_query')
# Note: this is the default FLASK url and may differ if you've changed the default


# Now we are going to install the backend requirements
$ cd ~../sapie/backend
$ pip3 install -r requirements.txt
$ cd ~../sapie/backend
$ atom be_rest_api.py

# In this file, we will need to comment out this line : sys.path.insert(0, '/home/ec2-user/sapie/webcrawler/yougod/yougod/')
# Next, scroll to the bottom and in if __name__ == "__main__", comment out the try-catch run block and simply
# uncomment app.run(debug=True)


# Next, run the backend in cd .../sapie/backend
$ python3 be_rest_api.py

# Lastly, run the frontend. Open a new terminal window and navigate to /sapie/frontend
$ npm start


## Quick Start (with ENV and Docker)
Make sure you have latest Docker and Docker Compose installed. Download elasticsearch and run these commands from project root:

```console
# create a virtualenv in your parent directory if you need one to install requirements (Windows/MacOSx)
$ virtualenv your_environment_name
$ source /bin/activate/your_environment_name

# you will run echo only once to create local `.env` file indicating you are using dev environment.
$ echo COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml > .env

# run to build images every time dependencies get updated
$ docker-compose build

# This is one of many other ways to get Docker Compose running your selected environment.
$ docker-compose up

# Starting ES: 
# elasticsearch is likely stored in your parent directory. Go back to that, enter 
$ ./elasticsearch 
# and then type:
$ ./bin/elasticsearch
# in root:
$ pip3 install -r new_requirements.txt

# in sapie/backend
$ python3 be_rest_api.py

# in sapie/fe:
$ npm install
$ npm start
```

Then you just have to point your browser to http://localhost:3000/ to
see it running. You can also access API endpoints directly like
http://localhost:3000/api/influencer


To connect to the SapieSpace EC2 Instance on AWS:
change directories into the Sapie space project on your local machine 
```$cd /sapie-space```
Your key must not be publicly viewable for SSH to work. Use this command if needed:
```chmod 400 sapiekeypair.pem```
Connect to your instance using its Public DNS
Here's our specific instance name: ec2-34-209-86-220.us-west-2.compute.amazonaws.com
Here's how we'll connect to the EC2 instance:
```ssh -i "sapiekeypair.pem" ec2-user@ec2-34-209-86-220.us-west-2.compute.amazonaws.com```

Please note that in most cases the username above will be correct, check AWS EC2 or ask Brody to see if the default AMI username changed. 


```
### Known Issues
You might have trouble pulling ElasticSearch official images. You can try it manually just in case:

```console
$ docker pull docker.elastic.co/elasticsearch/elasticsearch:6.1.1
```
If you're on an encrypted network (such as an institution's network), you may have trouble connecting to AWS.
You'll have to create a VM in AWS. Speak with Brody more about that.

```console
$ ssh -A -i sapie-dev.pem ubuntu@18.218.86.249
```
## How it works

The interface is a business-facing platform that allows businesses to connect with
influencers. To see an investor's pitch that I did, you can go to
[this
link](https://docs.google.com/presentation/d/1cEplBy7avil1pP7XFVi694qOlSWiG58qNWfQ0KPgLx0/edit?usp=sharing)
(and request Google Drive access, if needed).


## A brief history of Sapie Space
Jack Treseler and Brody are the co-founders of Sapie Space. Brody was working at Google and Jack was
an employee at Square. Jack came up with the idea when  he found it difficult to make connections with influencers, see how 
influential they actually are, as well as if they were a good fit for the company. 
Jack and Brody have been working to make Sapie Space a reaity since April 2017.


### New development line

A decoupled front-end started being developed and can be found under
`frontend`. The idea is to merge it with a REST API back-end under
`backend`. We have also a docker compose environment defined that
should ease daily development and deployment.


## Future Updates

- Create a stepladder of social influencer
- The ad campaign

## Other Business-Development References

We use
[Asana](https://app.asana.com/0/476028607034259/476028607034259) for
task management, and We use [Slack](www.slack.com) to communicate.


# Tech Tips

We are organizing the house, but if you are trying to run this, you
might try to look into these first.

- Python 3.6 required
- Use Homebrew or Macports for OSX
- brew install graphicsmagick boost-python
- pip3 install -r new_requirements.txt
- sudo apt-get install httperf libgraphicsmagick++-dev libboost-python-dev

Make you run also have run the following commands in the correponding directory to install all python and js dependencies:


