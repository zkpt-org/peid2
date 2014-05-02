# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Graph1'
        db.create_table(u'population_graph1', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('client', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('office', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('level', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('relation', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('condition', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('gender', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('age', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('start_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('end_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'population', ['Graph1'])

        # Adding model 'Graph2'
        db.create_table(u'population_graph2', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('client', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('office', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('level', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('relation', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('condition', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('gender', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('age', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('start_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('end_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'population', ['Graph2'])

        # Adding model 'Graph3'
        db.create_table(u'population_graph3', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('client', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('office', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('level', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('relation', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('condition', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('gender', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('age', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('start_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('end_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'population', ['Graph3'])

        # Adding model 'Graph4'
        db.create_table(u'population_graph4', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
            ('modified', self.gf('django.db.models.fields.DateTimeField')(auto_now=True, blank=True)),
            ('client', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('office', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('level', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('relation', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('condition', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=64)),
            ('gender', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('age', self.gf('django.db.models.fields.CharField')(default='ALL', max_length=8)),
            ('start_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('end_date', self.gf('django.db.models.fields.CharField')(default='', max_length=10)),
            ('data', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'population', ['Graph4'])


    def backwards(self, orm):
        # Deleting model 'Graph1'
        db.delete_table(u'population_graph1')

        # Deleting model 'Graph2'
        db.delete_table(u'population_graph2')

        # Deleting model 'Graph3'
        db.delete_table(u'population_graph3')

        # Deleting model 'Graph4'
        db.delete_table(u'population_graph4')


    models = {
        u'population.graph1': {
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
        u'population.graph2': {
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
        u'population.graph3': {
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
        u'population.graph4': {
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

    complete_apps = ['population']