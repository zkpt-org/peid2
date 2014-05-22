# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Deleting field 'TopProcedures.groupercode'
        db.delete_column(u'data_topprocedures', 'groupercode')

        # Adding field 'TopProcedures.grouper_code'
        db.add_column(u'data_topprocedures', 'grouper_code',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=64),
                      keep_default=False)

        # Adding field 'TopProcedures.start_date'
        db.add_column(u'data_topprocedures', 'start_date',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10),
                      keep_default=False)

        # Adding field 'TopProcedures.end_date'
        db.add_column(u'data_topprocedures', 'end_date',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=10),
                      keep_default=False)


    def backwards(self, orm):
        # Adding field 'TopProcedures.groupercode'
        db.add_column(u'data_topprocedures', 'groupercode',
                      self.gf('django.db.models.fields.CharField')(default='', max_length=64),
                      keep_default=False)

        # Deleting field 'TopProcedures.grouper_code'
        db.delete_column(u'data_topprocedures', 'grouper_code')

        # Deleting field 'TopProcedures.start_date'
        db.delete_column(u'data_topprocedures', 'start_date')

        # Deleting field 'TopProcedures.end_date'
        db.delete_column(u'data_topprocedures', 'end_date')


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
            'description': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'end_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'}),
            'grouper_code': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        }
    }

    complete_apps = ['data']