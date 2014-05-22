# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'TopProcedures.grouper_code'
        db.alter_column(u'data_topprocedures', 'grouper_code', self.gf('django.db.models.fields.CharField')(max_length=10))

    def backwards(self, orm):

        # Changing field 'TopProcedures.grouper_code'
        db.alter_column(u'data_topprocedures', 'grouper_code', self.gf('django.db.models.fields.CharField')(max_length=64))

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
            'grouper_code': ('django.db.models.fields.CharField', [], {'max_length': '10'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'start_date': ('django.db.models.fields.CharField', [], {'default': "''", 'max_length': '10'})
        }
    }

    complete_apps = ['data']