# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'SearchModelRelation'
        db.create_table(u'core_searchmodelrelation', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('search', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['core.Search'])),
            ('influencer', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['core.Influencer'])),
            ('level', self.gf('django.db.models.fields.IntegerField')(default=1)),
        ))
        db.send_create_signal(u'core', ['SearchModelRelation'])

        # Adding model 'Search'
        db.create_table(u'core_search', (
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('search_term', self.gf('django.db.models.fields.CharField')(max_length=255, primary_key=True)),
        ))
        db.send_create_signal(u'core', ['Search'])

        # Adding model 'Influencer'
        db.create_table(u'core_influencer', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('external_id', self.gf('django.db.models.fields.BigIntegerField')(unique=True)),
            ('handle', self.gf('django.db.models.fields.CharField')(unique=True, max_length=50)),
            ('social_authority', self.gf('django.db.models.fields.FloatField')(default=-1)),
            ('followers', self.gf('django.db.models.fields.IntegerField')(default=-1)),
            ('name', self.gf('django.db.models.fields.TextField')(default=u'')),
            ('description', self.gf('django.db.models.fields.TextField')(default=u'')),
            ('picture_url', self.gf('django.db.models.fields.URLField')(default=u'', max_length=200)),
            ('being_processed', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('url', self.gf('django.db.models.fields.TextField')(default=u'', null=True)),
            ('followers_ids', self.gf('jsonfield.fields.JSONField')(default=[], null=True)),
        ))
        db.send_create_signal(u'core', ['Influencer'])

        # Adding model 'Tweet'
        db.create_table(u'core_tweet', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('search', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'tweets', null=True, to=orm['core.Search'])),
            ('influencer', self.gf('django.db.models.fields.related.ForeignKey')(related_name=u'tweets', to=orm['core.Influencer'])),
            ('text', self.gf('django.db.models.fields.TextField')()),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')()),
            ('external_id', self.gf('django.db.models.fields.BigIntegerField')(unique=True)),
            ('retweet_count', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('is_retweet', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('original_urls', self.gf('jsonfield.fields.JSONField')(default=[])),
            ('unshorten_urls', self.gf('jsonfield.fields.JSONField')(default=[])),
            ('sentiment', self.gf('django.db.models.fields.CharField')(default=u'na', max_length=10)),
        ))
        db.send_create_signal(u'core', ['Tweet'])


    def backwards(self, orm):
        # Deleting model 'SearchModelRelation'
        db.delete_table(u'core_searchmodelrelation')

        # Deleting model 'Search'
        db.delete_table(u'core_search')

        # Deleting model 'Influencer'
        db.delete_table(u'core_influencer')

        # Deleting model 'Tweet'
        db.delete_table(u'core_tweet')


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
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'search_term': ('django.db.models.fields.CharField', [], {'max_length': '255', 'primary_key': 'True'})
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