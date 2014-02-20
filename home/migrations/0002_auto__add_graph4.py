# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Graph4'
        db.create_table(u'home_graph4', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('client', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('office', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('level', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('condition', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('gender', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('age', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('start', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('end', self.gf('django.db.models.fields.CharField')(max_length=10)),
            ('data', self.gf('django.db.models.fields.TextField')()),
        ))
                
        db.send_create_signal(u'home', ['Graph4'])
        
        db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN client SET DEFAULT 'ALL'")
        db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN office SET DEFAULT 'ALL'")
        db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN level SET DEFAULT 'ALL'")
        db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN condition SET DEFAULT 'ALL'")
        db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN gender SET DEFAULT 'ALL'")
        db.execute("ALTER TABLE tind.home_graph4 ALTER COLUMN age SET DEFAULT 'ALL'")

    def backwards(self, orm):
        # Deleting model 'Graph4'
        db.delete_table(u'home_graph4')


    models = {
        u'home.graph4': {
            'Meta': {'object_name': 'Graph4'},
            'age': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            'client': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'condition': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'data': ('django.db.models.fields.TextField', [], {}),
            'end': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            'gender': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '8'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'level': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'modified': ('django.db.models.fields.DateTimeField', [], {'auto_now': 'True', 'blank': 'True'}),
            'office': ('django.db.models.fields.CharField', [], {'default': "'ALL'", 'max_length': '64'}),
            'start': ('django.db.models.fields.CharField', [], {'max_length': '10'})
        }
    }

    complete_apps = ['home']