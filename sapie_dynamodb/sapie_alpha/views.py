import csv
import os
# import operator
# from django.conf import settings
# from django.db.models import Q
from django.shortcuts import render
# from django.utils.six.moves import range
# from django.http import StreamingHttpResponse
from django.db import models
from . import search
from .baseviews import *
from django.views.generic.base import View


class Search(View):
    # 1. Users will search for one of the CSV files
    # 2. The search bar takes input from the user
    # 3. The array of csv files is crawled
    # 4. A CSV file is returned to the user in full
    # Searches the CSV files
    def get(self, r):
        return render(r, 'search.html', 'Search')

    # seo = 'influencer_data/seo.csv'
    marketing = "influencer_data/marketing.csv"
    leadership = "influencer_data/leadership.csv"

    # csv_files = [seo, marketing, leadership]
    # iterate, find, display csv
    # search = input("search..")
    search = "test"
    if "seo" in search:
        with open('/Users/brody/sapiespace/sapie/sapie_alpha/influencer_data/seo.csv', 'rU') as csvfile:
            target_doc = csv.reader(csvfile, delimiter=' ', quotechar='|')
            for row in target_doc:
                print(', '.join(row))

        print("SEO File")
    elif "marketing" in search:
        open(marketing)
    elif "leadership" in search:
        open(leadership)
    else:
        print("search returned no results")



# class Echo(object):
#     """An object that implements just the write method of the file-like interface"""
#     def write(self, value):
#         """Write the value by returning it, instead of storing it in a buffer."""
#         return value
#
#     def influencer_streaming_csv_view(request):
#         """A value that streams a large CSV file."""
#         # Generate a sequence of rows. The range is based on the maximum number of
#         # rows that can be handled by a single sheet in most spreadsheet applications.
#         rows = (["Row {}".format(idx), str(idx)] for idx in range(65536))
#         pseudo_buffer = Echo()
#         reader = csv.reader(pseudo_buffer)
#         response = StreamingHttpResponse((reader.readrow(row) for row in rows),
#                                          content_type="text/csv")
#         response = StreamingHttpResponse((reader.readrow(row) for row in rows),
#                                          content_type="text/csv")
#         response['Content-Disposition'] = 'attachment; filename="influencer_data/1471493335.csv"'
#         return response
