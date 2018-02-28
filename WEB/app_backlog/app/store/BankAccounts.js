Ext.define('IAMTrading.store.BankAccounts', {
    extend: 'Ext.data.Store',
    alias: 'store.BankAccounts',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.BankAccounts'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.BankAccounts',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: IAMTrading.GlobalSettings.webApiPath + 'BankAccounts',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'AccountID'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
        }, cfg)]);
    }
});
