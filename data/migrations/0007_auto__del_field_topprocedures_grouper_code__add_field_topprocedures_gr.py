# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'TopProcedures.grouper_code'
        db.delete_column(u'data_topprocedures', 'grouper_code')

        # Adding field 'TopProcedures.grouper'
        db.add_column(u'data_topprocedures', 'grouper',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10),
                      keep_default=False)

        # Adding field 'TopProcedures.cost'
        db.add_column(u'data_topprocedures', 'cost',
                      self.gf('django.db.models.fields.DecimalField')(default='0.00', max_digits=20, decimal_places=2),
                      keep_default=False)

        # Adding field 'TopProcedures.count'
        db.add_column(u'data_topprocedures', 'count',
                      self.gf('django.db.models.fields.IntegerField')(default=0),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'TopProcedures.grouper_code'
        db.add_column(u'data_topprocedures', 'grouper_code',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10),
                      keep_default=False)

        # Deleting field 'TopProcedures.grouper'
        db.delete_column(u'data_topprocedures', 'grouper')

        # Deleting field 'TopProcedures.cost'
        db.delete_column(u'data_topprocedures', 'cost')

        # Deleting field 'TopProcedures.count'
        db.delete_column(u'data_topprocedures', 'count')


    models = {
        u'data.cohort': {
            'Meta': {'object_name': 'Cohort'},
            'cohort_id': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'traits': ('django.db.models.fields.TextField', [], {})
        },
        u'data.proxyticket': {
            'Meta': {'object_name': 'ProxyTicket'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ticket_id': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'ticket_iou': ('django.db.models.fields.CharField', [], {'max_length': '64'})
        },
        u'data.topprocedures': {
            'Meta': {'object_name': 'TopProcedures'},
            'cost': ('django.db.models.fields.DecimalField', [], {'max_digits': '20', 'decimal_places': '2'}),
            'count': ('django.db.models.fields.IntegerField', [], {}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'end_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'grouper': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        }
    }

    complete_apps = ['data']