# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Cohort'
        db.create_table(u'data_cohort', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('cohort_id', self.gf('django.db.models.fields.CharField')(max_length=64)),
            ('traits', self.gf('django.db.models.fields.TextField')()),
        ))
        db.send_create_signal(u'data', ['Cohort'])


    def backwards(self, orm):
        # Deleting model 'Cohort'
        db.delete_table(u'data_cohort')


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
        }
    }

    complete_apps = ['data']