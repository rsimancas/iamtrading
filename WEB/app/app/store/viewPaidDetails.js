Ext.define('IAMTrading.store.viewPaidDetails', {
    extend: 'Ext.data.Store',
    alias: 'store.viewPaidDetails',
    autoLoad: false,
    pageSize: 16,

    requires: [
        'IAMTrading.model.viewPaidDetails'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'IAMTrading.model.viewPaidDetails',
            remoteSort: true,
            proxy: {
                type: 'rest',
                url: IAMTrading.GlobalSettings.webApiPath + 'viewPaidDetails',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                reader: {
                    type: 'json',
                    root: 'data',
                    totalProperty: 'total',
                    successProperty: 'success',
                    idProperty: 'DetailId'
                },
                writer: {
                    type: 'json',
                    writeAllFields: true
                }
            }
        }, cfg)]);
    }
});
