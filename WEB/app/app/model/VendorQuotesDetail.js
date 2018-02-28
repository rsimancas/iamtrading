Ext.define('IAMTrading.model.VendorQuotesDetail', {
    extend: 'Ext.data.Model',
    idProperty: 'VQDetailId',
    autoLoad: false,

    fields: [
        { name: 'VQDetailId', type: 'int', defaultValue: null },
        { name: 'VendorQuoteId', type: 'int', defaultValue: null },
        { name: 'ItemId', type: 'int', defaultValue: null },
        { name: 'VQDetailCost', type: 'float', defaultValue: null },
        { name: 'VQDetailLineNumber', type: 'int', defaultValue: null },
        { name: 'ItemName', type: 'string' },
        { name: 'ItemNameSupplier', type: 'string', useNull: true, defaultValue: null },
        { name: 'ItemGYCode', type: 'string', useNull: true, defaultValue: null },
        { name: 'ItemNum', type: 'string', useNull: true, defaultValue: null },
        { name: 'ItemNumSupplier', type: 'string', useNull: true, defaultValue: null }
    ],

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
            messageProperty: 'message',
            idProperty: 'VQDetailId'
        },
        afterRequest: function(request, success) {
            var silentMode = this.getSilentMode();

            if (request.action == 'read') {
                //this.readCallback(request);
            } else if (request.action == 'create') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Success", "Saved Successfully!!!");
                }
            } else if (request.action == 'update') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Success", "Saved Successfully!!!");
                }
            } else if (request.action == 'destroy') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not Deleted");
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Success", "Deleted Successfully");
                }
            }

            this.setSilentMode(false);
        }
    }
});
