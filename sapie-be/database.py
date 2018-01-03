import conf
from elasticsearch import Elasticsearch


es = Elasticsearch(hosts=[conf.es_host])
