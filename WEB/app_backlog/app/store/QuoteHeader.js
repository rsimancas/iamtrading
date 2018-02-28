Ext.define('IAMTrading.store.QuoteHeader', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteHeader',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.QuoteHeader'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.QuoteHeader',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: IAMTrading.GlobalSettings.webApiPath + 'QuoteHeader',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'QHeaderId'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
        }, cfg)]);
    }
});