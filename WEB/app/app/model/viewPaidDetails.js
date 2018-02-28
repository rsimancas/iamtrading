Ext.define('IAMTrading.model.viewPaidDetails', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'DetailId',

    fields: [
        { name:'DetailId', type:'int', defaultValue: null },
        { name:'DetailAmount', type:'float', defaultValue: null },
        { name:'DetailAmountNB', type:'float', defaultValue: null },
        { name:'InvoiceNum', type:'string', useNull: true, defaultValue: null },
        { name:'InvoiceAmount', type:'float', defaultValue: null },
        { name:'InvoiceAmountNB', type:'float', defaultValue: null },
        { name:'POVId', type:'int', defaultValue: null },
        { name:'QHeaderId', type:'int', defaultValue: null },
        { name:'QHeaderReference', type:'string' },
        { name:'PayVendorId', type:'int', defaultValue: null },
        { name:'CustName', type:'string' },
        { name:'VendorName', type:'string' },
        { name:'DetailCurrencyRate', type:'float', defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'viewPaidDetails',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'DetailId'
        },
        afterRequest: function (request, success) {
            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Success","Saved Successfully!!!");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Success","Saved Successfully!!!");
                }
            }
            else if (request.action == 'destroy') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not Deleted");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    Ext.popupMsg.msg("Success","Deleted Successfully");
                }
            }
        }
    },


});