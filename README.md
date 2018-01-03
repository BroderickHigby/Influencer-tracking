# Sapie Space

*Sapie Space helps businesses go viral through connecting them with influenceers in their industry.*

## Quick Start

Make sure you have latest Docker and Docker Compose installed and run these commands from project root:

```console
$ echo COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml > .env
$ docker-compose build
$ docker-compose up
```

1. First line you will run only once to create local `.env` file indicating you are using dev environment.
2. Second line you'll run to build images every time dependencies get updated
3. This is one of many other ways to get Docker Compose running your selected environment.


## How it works

The interface is a business-facing platform that connects businesses
to influencers. To see an investor's pitch that I did, you can go to
[this
link](https://docs.google.com/presentation/d/1cEplBy7avil1pP7XFVi694qOlSWiG58qNWfQ0KPgLx0/edit?usp=sharing)
(and request Google Drive access, if needed).


## A brief history of Sapie Space

Jack Treseler is my colleague and the co-founder of Sapie
Space. Before we met, he had his brother-in-law programming the
interface. His brother-in-law became ill and could no longer commit
time to Sapie Space.

Jack and I met up in San Francisco, CA. I was excited about the idea
of Sapie Space. I went to start programming. Jack and I started
working together on Sapie Space in April 2017. James did a great job
with some of the programming on it(can be seen in "socialladder"
folder). However, he started running into issues with deploying to
Google App Engine (Google Cloud SDK). That's where he left off. When
he handed off the code to me, I worked to try to get new iterations of
it on GoogleAppEngine as well as expand the database, with no avail.

We migrated over to AWS, believing that we would have less of the
issues that we experienced with deploying on GoogleAppEngine. There
was a learning curve to using DynamoDB (the DDB django project for
uploading influencer data can be found in /sapie_dynamodb).


## Where we stand

Currently, we have influencer data manually uploaded to dynamodb, user
authentication is a seperate Django Project (/core).

1. Connect the data in dynamoDB with a search_interface (the one that
   I created in Django, is fine)

2. Ensure that the User authentication is a


### New development line

A decoupled front-end started being developed and can be found under
`sapie-fe`. The idea is to merge it with a REST API back-end under
`sapie-be`. We have also a docker compose environment defined that
should ease daily development and deployment.


## Future Updates

*January 1, 2018 Beta-Version:* A website with a search engine that
 connects to DynamoDB and allows the user's (businesses) to find
 targeted industry influencers.

*Second Iteration:* Integrate IBM Watson to show on an indivdual's
 page for the search results


## Other Business-Development References

We use
[Asana](https://app.asana.com/0/476028607034259/476028607034259) for
task management, and We use [Slack](www.slack.com) to communicate.


# Tech Tips

We are organizing the house, but if you are trying to run this, you
might try to look into these first.

- Python 2.7 might be required, but we are trying to migrate to 3.5
- Autoload requires magick++, easiest installed on a unix-based platform
- ImageMagick is required
- Use Homebrew or Macports for OSX
- brew install graphicsmagick boost-python
- pip install -r requirements.txt
- sudo apt-get install httperf libgraphicsmagick++-dev libboost-python-dev
