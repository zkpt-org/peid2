# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'Graph2.relation'
        db.add_column(u'home_graph2', 'relation',
                      self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64),
                      keep_default=False)

        # Adding field 'Graph3.relation'
        db.add_column(u'home_graph3', 'relation',
                      self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64),
                      keep_default=False)

        # Adding field 'Graph1.relation'
        db.add_column(u'home_graph1', 'relation',
                      self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64),
                      keep_default=False)

        # Adding field 'Graph4.relation'
        db.add_column(u'home_graph4', 'relation',
                      self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'Graph2.relation'
        db.delete_column(u'home_graph2', 'relation')

        # Deleting field 'Graph3.relation'
        db.delete_column(u'home_graph3', 'relation')

        # Deleting field 'Graph1.relation'
        db.delete_column(u'home_graph1', 'relation')

        # Deleting field 'Graph4.relation'
        db.delete_column(u'home_graph4', 'relation')


    models = {
        u'home.graph1': {
            'Meta': {'object_name': 'Graph1'},
            'age': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            'client': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'condition': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            'end_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'office': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'relation': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        },
        u'home.graph2': {
            'Meta': {'object_name': 'Graph2'},
            'age': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            'client': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'condition': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            'end_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'office': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'relation': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        },
        u'home.graph3': {
            'Meta': {'object_name': 'Graph3'},
            'age': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            'client': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'condition': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            'end_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'office': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'relation': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        },
        u'home.graph4': {
            'Meta': {'object_name': 'Graph4'},
            'age': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            'client': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'condition': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            'end_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'office': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'relation': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        }
    }

    complete_apps = ['home']