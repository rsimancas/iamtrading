Ext.define('IAMTrading.store.Banks', {
    extend: 'Ext.data.Store',
    alias: 'store.Banks',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.Banks'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.Banks',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: IAMTrading.GlobalSettings.webApiPath + 'Banks',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'BankID'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
        }, cfg)]);
    }
});
