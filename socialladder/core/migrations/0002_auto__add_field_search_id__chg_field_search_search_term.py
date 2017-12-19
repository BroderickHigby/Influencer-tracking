# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Search.id'
        db.add_column(u'core_search', u'id',
                      self.gf('django.db.models.fields.AutoField')(default=1, primary_key=True),
                      keep_default=False)


        # Changing field 'Search.search_term'
        db.alter_column(u'core_search', 'search_term', self.gf('django.db.models.fields.CharField')(unique=True, max_length=255))

    def backwards(self, orm):
        # Deleting field 'Search.id'
        db.delete_column(u'core_search', u'id')


        # Changing field 'Search.search_term'
        db.alter_column(u'core_search', 'search_term', self.gf('django.db.models.fields.CharField')(max_length=255, primary_key=True))

    models = {
        u'core.influencer': {
            'Meta': {'object_name': 'Influencer'},
            'being_processed': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'description': ('django.db.models.fields.TextField', [], {'default': "u''"}),
            'external_id': ('django.db.models.fields.BigIntegerField', [], {'unique': 'True'}),
            'followers': ('django.db.models.fields.IntegerField', [], {'default': '-1'}),
            'followers_ids': ('jsonfield.fields.JSONField', [], {'default': '[]', 'null': 'True'}),
            'handle': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '50'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'name': ('django.db.models.fields.TextField', [], {'default': "u''"}),
            'picture_url': ('django.db.models.fields.URLField', [], {'default': "u''", 'max_length': '200'}),
            'searches': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['core.Search']", 'through': u"orm['core.SearchModelRelation']", 'symmetrical': 'False'}),
            'social_authority': ('django.db.models.fields.FloatField', [], {'default': '-1'}),
            'url': ('django.db.models.fields.TextField', [], {'default': "u''", 'null': 'True'})
        },
        u'core.search': {
            'Meta': {'object_name': 'Search'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'search_term': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '255'})
        },
        u'core.searchmodelrelation': {
            'Meta': {'object_name': 'SearchModelRelation'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'influencer': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['core.Influencer']"}),
            'level': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            'search': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['core.Search']"})
        },
        u'core.tweet': {
            'Meta': {'object_name': 'Tweet'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {}),
            'external_id': ('django.db.models.fields.BigIntegerField', [], {'unique': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'influencer': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'tweets'", 'to': u"orm['core.Influencer']"}),
            'is_retweet': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'original_urls': ('jsonfield.fields.JSONField', [], {'default': '[]'}),
            'retweet_count': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'search': ('django.db.models.fields.related.ForeignKey', [], {'related_name': "u'tweets'", 'null': 'True', 'to': u"orm['core.Search']"}),
            'sentiment': ('django.db.models.fields.CharField', [], {'default': "u'na'", 'max_length': '10'}),
            'text': ('django.db.models.fields.TextField', [], {}),
            'unshorten_urls': ('jsonfield.fields.JSONField', [], {'default': '[]'})
        }
    }

    complete_apps = ['core']