# from django.db import models
# from google.google_appengine.google.appengine.ext import ndb
#
#
# class Search(ndb.Model):
#     def __unicode__(self):
#         return self.term
#
#     term = ndb.StringProperty()
#     users_search_page = ndb.IntegerProperty(default=1)
#     users_search_finished = ndb.BooleanProperty(default=False)
#
#     @classmethod
#     def get_or_insert(cls, key_name, parent=None, app=None, namespace=None, context_options=None, **constructor_args):
#         constructor_args['term'] = key_name
#         return super(Search, cls).get_or_insert(key_name, parent=None, app=None, namespace=None, context_options=None,
#                                                 **constructor_args)
