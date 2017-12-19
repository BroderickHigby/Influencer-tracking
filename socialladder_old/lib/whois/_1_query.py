import time
import sys
import os
import requests

PYTHON_VERSION = sys.version_info[0]
CACHE = {}
CACHE_MAX_AGE = 60*60*48	# 48h

try:
	import json

except:
	import simplejson as json


def do_query(dl, force=0, cache_file=None, slow_down=0, ignore_returncode=0):
	text = _do_whois_query(dl, ignore_returncode)
	return text

def _do_whois_query(dl, ignore_returncode):
	domain = '.'.join(dl)
	r = requests.get('http://freakinghax.net/whois.php?domain='+domain)
	return r.text
