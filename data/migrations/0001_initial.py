# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'ProxyTicket'
        db.create_table(u'data_proxyticket', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('ticket_iou', self.gf('django.db.models.fields.CharField')(max_length=32)),
            ('ticket_id', self.gf('django.db.models.fields.CharField')(max_length=32)),
            ('created', self.gf('django.db.models.fields.DateTimeField')(auto_now_add=True, blank=True)),
        ))
        db.send_create_signal(u'data', ['ProxyTicket'])


    def backwards(self, orm):
        # Deleting model 'ProxyTicket'
        db.delete_table(u'data_proxyticket')


    models = {
        u'data.proxyticket': {
            'Meta': {'object_name': 'ProxyTicket'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ticket_id': ('django.db.models.fields.CharField', [], {'max_length': '32'}),
            'ticket_iou': ('django.db.models.fields.CharField', [], {'max_length': '32'})
        }
    }

    complete_apps = ['data']