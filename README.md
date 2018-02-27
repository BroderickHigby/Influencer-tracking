# Sapie Space

Sapie Space helps businesses go viral using machine learning to connect them with influencers in their industry.*


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

Then you just have to point your browser to http://localhost:8080/ to
see it running. You can also access API endpoints directly like
http://localhost:8080/api/influencer


### Sample Fake Data

If you want to create sample fake data you might look at `sapie-be/sample.py` or run the following from project root:

```
$ docker-compose run --rm backend python sample.py
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

Jack Treseler is my colleague and the co-founder of Sapie
Space. As an employee at Square, he found it difficult to make connections with influencers, see how 
influential they actually are, as well as if they were a good fit for the company. 
Jack and Brody have been working to make Sapie Space a reaity since April 2017.

## Where we stand

Currently, we have influencer data manually searched through AWS ElasticSearch.
Our next big step is to create the web crawler.

1. Connect the front-end to our ElasticSearch interface. 

2. Connect Stripe. The payment platform

3. Develop the Web Crawler.


### New development line

A decoupled front-end started being developed and can be found under
`sapie-fe`. The idea is to merge it with a REST API back-end under
`sapie-be`. We have also a docker compose environment defined that
should ease daily development and deployment.


## Future Updates

*January 15, 2018 Beta-Version:* A website with a search engine that
 connects to ElasticSearch and allows the user's (businesses) to find
 targeted influencers.

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

Make you run also have run the following commands in the correponding directory to install all python and js dependencies:

in root:  pip install -r requirements.txt

in sapie/be: pip install -r requirements.txt

in sapie/fe: npm install
