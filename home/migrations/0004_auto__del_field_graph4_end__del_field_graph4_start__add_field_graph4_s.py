# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'Graph4.end'
        db.delete_column(u'home_graph4', 'end')

        # Deleting field 'Graph4.start'
        db.delete_column(u'home_graph4', 'start')

        # Adding field 'Graph4.start_date'
        db.add_column(u'home_graph4', 'start_date',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10),
                      keep_default=False)

        # Adding field 'Graph4.end_date'
        db.add_column(u'home_graph4', 'end_date',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10),
                      keep_default=False)

        # db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN client SET DEFAULT 'ALL'")
        # db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN office SET DEFAULT 'ALL'")
        # db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN level SET DEFAULT 'ALL'")
        # db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN condition SET DEFAULT 'ALL'")
        # db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN gender SET DEFAULT 'ALL'")
        # db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN age SET DEFAULT 'ALL'")
        
    def backwards(self, orm):
        # Adding field 'Graph4.end'
        db.add_column(u'home_graph4', 'end',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=12),
                      keep_default=False)

        # Adding field 'Graph4.start'
        db.add_column(u'home_graph4', 'start',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=12),
                      keep_default=False)

        # Deleting field 'Graph4.start_date'
        db.delete_column(u'home_graph4', 'start_date')

        # Deleting field 'Graph4.end_date'
        db.delete_column(u'home_graph4', 'end_date')
        

    models = {
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
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        }
    }

    complete_apps = ['home']