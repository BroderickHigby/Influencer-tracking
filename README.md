# Sapie Space

*Sapie Space helps businesses go viral through connecting them with influenceers in their industry.*


## How it works

The interface is a business-facing platform that connects businesses
to influencers. To see an investor's pitch that I did, you can go to
[this
link](https://docs.google.com/presentation/d/1cEplBy7avil1pP7XFVi694qOlSWiG58qNWfQ0KPgLx0/edit?usp=sharing)
(and request Google Drive access, if needed).


## Resources (currently)

* Django (python library)
* DynamoDB


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

Currently, we have influencer data manually uploaded to dynamodb, user authentication is a seperate Django Project (/core). 
1. Connect the data in dynamoDB with a search_interface (the one that I created in Django, is fine) 
2. Ensure that the User authentication is a 


## Future Updates

*January 1, 2018 Beta-Version:* A website with a search engine that connects to DynamoDB and allows the user's (businesses) to find targeted industry influencers. 

*Second Iteration:* Integrate IBM Watson to show on an indivdual's page for the search results


## Other Business-Development References

We use [Asana](https://app.asana.com/0/476028607034259/476028607034259) for task management, and
We use [Slack](www.slack.com) to communicate.


# Some Stories

These user stories should help identifying basics of the
application. Three Web pages should be enough to implement these
features. Story number 3 is really just about having a searchbox near
the top of Web pages. Searching and listing were separated in
different stories here just to reuse listing among two search types.


1. As a *sales team user* I want to *start searching for influencers* so that I have a base to start from
  - I should be able to start searching from home page or dashboard
  - I want to search just by providing one or few search terms

2. As a *sales team user* I want to *see influencer detail* so that I can be sure about my choice
  - I should be able to navigate back to previous page
  - I should be able to see influencer general info
  - I want to see influencer social media links

3. As a *sales team user* I want to *quickly ask for influencers search* so that searching is always on hand
  - I should be able to search from every pertinent screen
  - If search results are being listed, current term should appear

4. As a *sales team user* I want to *list influencers* so that I can compare available options
  - Influencers should be listed after some search result
  - At most 500 influencers should be shown
  - Only general info should be shown side-by-side


We still don't have defined above, a story for showing charts on
influencers details, shared domains or showing twitter statistics. To
avoid an overhead on defining such long user stories with all details
intrinsic to defining and splitting them properly, we should use
something lighter like proposed next.


## Personas and Stories

Instead of *sales team user*, lets use a name or persona. We can name
him Steve. Lets imagine he works for a t-shirts company and is
responsible for managing his company's social media presence. He
already knows how important influencers are and is familiar with our
system.

A little bit big, right, but we can define personas in a Wiki or
separate README file. The idea is that you understand who the persona
is and what he might need. After that, reading short stories like
these would be a breeze as we don't need even acceptance criteria
details.

1. Steve starts searching for influencers
2. Steve opens influencer details
3. Steve search for other influencers
4. Steve lists influencers

And that's it! You might think we don't specify all required details,
but that's the idea. Product Owners or Managers can always go and add
more stories as needed. The idea is not to block developers neither
those defining stories with a lot of details that will just get
everybody stuck.


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

## Directory Structure

- Legacy application can be found under `socialladder` directory
- There is a new Django project under `core` root directory, but not really functional yet
- Directory `sapie_dynamodb` contains DynamoDB data definition used to import CSV data
- Python requirements.txt should define some requirements for new Django app now
