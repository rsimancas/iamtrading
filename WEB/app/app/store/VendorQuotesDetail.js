Ext.define('IAMTrading.store.VendorQuotesDetail', {
    extend: 'Ext.data.Store',
    alias: 'store.VendorQuotesDetail',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.VendorQuotesDetail'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.VendorQuotesDetail',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: IAMTrading.GlobalSettings.webApiPath + 'VendorQuotesDetail',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'VQDetailId'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },

                //clean up handlers
                afterRequest: function(request, success) {

                    if (request.action == 'read') {
                        me.readCallback(request);
                    } else if (request.action == 'create') {
                        me.createCallback(request);
                    } else if (request.action == 'update') {
                        me.updateCallback(request);
                    } else if (request.action == 'destroy') {
                        me.deleteCallback(request);
                    }
                }
            },
            //After Albums fetched
            readCallback: function(request) {
                if (!request.operation.success) {
                    //...
                } else {
                    //console.log(request);
                }
            },

            //After A record/Album created
            createCallback: function(request) {
                if (!request.operation.success) {
                    //...
                }
            },

            //After Album updated
            updateCallback: function(request) {
                if (!request.operation.success) {
                    console.log(request);
                } else {
                    Ext.popupMsg.msg("Success", "Saved Successfully");
                }
            },

            //After a record deleted
            deleteCallback: function(request) {
                if (!request.operation.success) {
                    //...
                }
            }
        }, cfg)]);
    }
});
