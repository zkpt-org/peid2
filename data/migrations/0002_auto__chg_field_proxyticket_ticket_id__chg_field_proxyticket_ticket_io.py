# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):

        # Changing field 'ProxyTicket.ticket_id'
        db.alter_column(u'data_proxyticket', 'ticket_id', self.gf('django.db.models.fields.CharField')(max_length=64))

        # Changing field 'ProxyTicket.ticket_iou'
        db.alter_column(u'data_proxyticket', 'ticket_iou', self.gf('django.db.models.fields.CharField')(max_length=64))

    def backwards(self, orm):

        # Changing field 'ProxyTicket.ticket_id'
        db.alter_column(u'data_proxyticket', 'ticket_id', self.gf('django.db.models.fields.CharField')(max_length=32))

        # Changing field 'ProxyTicket.ticket_iou'
        db.alter_column(u'data_proxyticket', 'ticket_iou', self.gf('django.db.models.fields.CharField')(max_length=32))

    models = {
        u'data.proxyticket': {
            'Meta': {'object_name': 'ProxyTicket'},
            'created': ('django.db.models.fields.DateTimeField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'ticket_id': ('django.db.models.fields.CharField', [], {'max_length': '64'}),
            'ticket_iou': ('django.db.models.fields.CharField', [], {'max_length': '64'})
        }
    }

    complete_apps = ['data']