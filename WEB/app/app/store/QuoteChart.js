Ext.define('IAMTrading.store.QuoteChart', {
    extend: 'Ext.data.Store',
    alias: 'store.QuoteChart',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.QuoteChart'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.QuoteChart',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: IAMTrading.GlobalSettings.webApiPath + 'QuoteChart',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
        }, cfg)]);
    }
});
