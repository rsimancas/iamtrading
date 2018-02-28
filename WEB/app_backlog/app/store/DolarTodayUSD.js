Ext.define('IAMTrading.store.DolarTodayUSD', {
    extend: 'Ext.data.Store',
    alias: 'store.DolarTodayUSD',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.DolarTodayUSD'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.DolarTodayUSD',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: 'https://s3.amazonaws.com/dolartoday/data.json',
                useDefaultXhrHeader : false,
                withCredentials:true,
                method : 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Basic YX5iOmM='
                },
                reader: {
                    type: 'json',
                    root: 'USD',
                    totalProperty: 'total',
                    successProperty: 'success'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                },

                //clean up handlers
                afterRequest: function (request, success) {

                    if (request.action == 'read') {
                        me.readCallback(request);
                    }

                    else if (request.action == 'create') {
                        me.createCallback(request);
                    }

                    else if (request.action == 'update') {
                        me.updateCallback(request);
                    }

                    else if (request.action == 'destroy') {
                        me.deleteCallback(request);
                    }
                }
            },
            //After Albums fetched

            readCallback: function (request) {
                if (!request.operation.success)
                {
                    //...
                } else {
                    //console.log(request);
                }
            },

            //After A record/Album created

            createCallback: function (request) {
                if (!request.operation.success)
                {
                    //...
                }
            },

            //After Album updated

            updateCallback: function (request) {
                if (!request.operation.success)
                {
                    console.log(request);
                } else {
                    Ext.popupMsg.msg("Success","Saved Successfully");
                }
            },

            //After a record deleted

            deleteCallback: function (request) {
                if (!request.operation.success)
                {
                    //...
                }
            }
        }, cfg)]);
    }
});