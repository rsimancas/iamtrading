Ext.define('IAMTrading.model.PurchaseOrdersVendors', {
    extend: 'Ext.data.Model',
    idProperty: 'POVId',
    autoLoad: false,

    fields: [
    { name:'POVId', type:'int', defaultValue: null },
    { name:'QHeaderId', type:'int', defaultValue: null },
    { name:'VendorId', type:'int', useNull: true, defaultValue: null },
    { name:'POVType', type:'string' },
    { name:'POVAmount', type:'float', defaultValue: null },
    { name:'POVAmountNB', type:'float', defaultValue: null },
    { name:'POVDate', type:'date', defaultValue: null },
    { name:'POVCurrencyRate', type:'float', defaultValue: null },
    { name:'POVParentId', type:'int', useNull: true, defaultValue: null },
    { name:'POVPaymentNumber', type:'string', useNull: true, defaultValue: null },
    { name:'POVCreatedBy', type:'string', useNull: true, defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
    { name:'POVCreatedDate', type:'date', defaultValue: null },
    { name:'POVModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'POVModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'x_VendorName', type:'string', useNull: true, defaultValue: null },
    { name:'x_QHeaderReference', type:'string', useNull: true, defaultValue: null },
    { name:'x_InvoiceVendorBalance', type:'float', useNull: true, defaultValue: null },
    { name:'x_InvoiceVendorBalanceNB', type:'float', useNull: true, defaultValue: null },
    { name:'x_TotalBalance', type:'float', useNull: true, defaultValue: null },
    { name:'x_Selected', type:'boolean', defaultValue: false }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'PurchaseOrdersVendors',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'POVId'
        },
        writer: {
            writeAllFields: false
        },
        afterRequest: function (request, success) {
            var silentMode = this.getSilentMode();

            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Success","Saved Successfully!!!");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Success","Saved Successfully!!!");
                }
            }
            else if (request.action == 'destroy') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not Deleted");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Success","Deleted Successfully");
                }
            }

            this.setSilentMode(false);
        }
    },


});