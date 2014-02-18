# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'Graph4.end'
        db.alter_column(u'home_graph4', 'end', self.gf('django.db.models.fields.CharField')(max_length=12))

        # Changing field 'Graph4.start'
        db.alter_column(u'home_graph4', 'start', self.gf('django.db.models.fields.CharField')(max_length=12))

    def backwards(self, orm):

        # Changing field 'Graph4.end'
        db.alter_column(u'home_graph4', 'end', self.gf('django.db.models.fields.CharField')(max_length=10))

        # Changing field 'Graph4.start'
        db.alter_column(u'home_graph4', 'start', self.gf('django.db.models.fields.CharField')(max_length=10))

    models = {
        u'home.graph4': {
            'Meta': {'object_name': 'Graph4'},
            'age': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            'client': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'condition': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            'end': ('django.db.models.fields.CharField', [], {'max_length': '12'}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'office': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'start': ('django.db.models.fields.CharField', [], {'max_length': '12'})
        }
    }

    complete_apps = ['home']