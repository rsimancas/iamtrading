Ext.define('IAMTrading.model.VendorQuotes', {
    extend: 'Ext.data.Model',
    idProperty: 'VendorQuoteId',
    autoLoad: false,

    fields: [
        { name: 'VendorQuoteId', type: 'int', defaultValue: null },
        { name: 'VendorId', type: 'int', useNull: true, defaultValue: null },
        { name: 'VendorQuoteDate', type: 'date', defaultValue: null },
        { name: 'VendorQuoteReference', type: 'string' },
        { name: 'CurrencyId', type: 'int', useNull: true, defaultValue: null },
        { name: 'VendorQuoteFolio', type: 'string' },
        { name: 'VendorName', type: 'string' },
        { name: 'CurrencyCode', type: 'string', useNull: true, defaultValue: null },
        { name: 'CountryName', type: 'string', useNull: true, defaultValue: null }
    ],

    proxy: {
        type: 'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'VendorQuotes',
        headers: {
            'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'VendorQuoteId'
        },
        afterRequest: function(request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            } else if (request.action == 'create') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Success", "Saved Successfully!!!");
                }
            } else if (request.action == 'update') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Success", "Saved Successfully!!!");
                }
            } else if (request.action == 'destroy') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not Deleted");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Success", "Deleted Successfully");
                }
            }
        }
    }
});
