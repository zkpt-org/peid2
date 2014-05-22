# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'TopProcedures'
        db.create_table(u'data_topprocedures', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=128)),
            ('groupercode', self.gf('django.db.models.fields.CharField')(max_length=64)),
        ))
        db.send_create_signal(u'data', ['TopProcedures'])


    def backwards(self, orm):
        # Deleting model 'TopProcedures'
        db.delete_table(u'data_topprocedures')


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
            'groupercode': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        }
    }

    complete_apps = ['data']