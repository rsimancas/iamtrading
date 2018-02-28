Ext.define('IAMTrading.model.Items', {
    extend: 'Ext.data.Model',
    idProperty: 'ItemId',
    autoLoad: false,

    fields: [
        { name:'ItemId', type:'int', defaultValue: null },
        { name:'VendorId', type:'int', useNull:true, defaultValue: null },
        { name:'ItemName', type:'string' },
        { name:'ItemNameSupplier', type:'string', useNull: true, defaultValue: null },
        { name:'ItemNum', type:'string', useNull: true, defaultValue: null },
        { name:'ItemNumSupplier', type:'string', useNull: true, defaultValue: null },
        { name:'ItemPrice', type:'float', defaultValue: null },
        { name:'ItemCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId()},
        { name:'ItemCreatedDate', type:'date', defaultValue: null },
        { name:'ItemModifiedBy', type:'string', useNull: true, defaultValue: null },
        { name:'ItemModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'ItemGYCode', type:'string' },
        { name:'ItemCost', type:'float', useNull: true, defaultValue: null },
        { name:'ItemWeight', type:'float', useNull: true, defaultValue: null },
        { name:'ItemVolume', type:'float', useNull: true, defaultValue: null },
        { name:'ItemWidth', type:'float', useNull: true, defaultValue: null },
        { name:'ItemHeight', type:'float', useNull: true, defaultValue: null },
        { name:'ItemLength', type:'float', useNull: true, defaultValue: null },
        { name:'x_VendorName', type:'string', useNull: true},
        { name:'ItemTariffPct', type:'float', useNull: true, defaultValue: null },
        { name:'ItemTariffCode', type:'string', useNull: true, defaultValue: null },
        { name:'ItemNalcoCode', type:'string', useNull: true, defaultValue: null },
        { name:'CustId', type:'int', useNull: true, defaultValue: null },
        { name:'PackId', type:'int', useNull: true, defaultValue: null },
        { name:'ItemNalcoType', type:'int', useNull: true, defaultValue: null }
    ],

    proxy: {
        type: 'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Items',
        headers: {
            'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'ItemId'
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