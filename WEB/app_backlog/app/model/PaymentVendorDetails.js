Ext.define('IAMTrading.model.PaymentVendorDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'PayVendorDetailId',
    autoLoad: false,

    fields: [
    { name:'PayVendorDetailId', type:'int', defaultValue: null },
    { name:'PayVendorId', type:'int', defaultValue: null },
    { name:'PayModeID', type:'int', defaultValue: null },
    { name:'PayVendorDetailReference', type:'string', useNull:true, defaultValue: null },
    { name:'PayVendorDetailAmount', type:'float', defaultValue: null },
    { name:'PayVendorDetailAmountNB', type:'float', defaultValue: null },
    { name:'PayVendorDetailCurrencyRate', type:'float', defaultValue: null },
    { name:'PayVendorDetailDate', type:'date', useNull: true, defaultValue: null },
    { name:'PayVendorDetailComments', type:'string', useNull: true, defaultValue: null },
    { name:'x_PayModeDescription', type:'string', defaultValue: null },
    { name:'BankAccount', type:'string', defaultValue:null},
    { name:'AccountID', type:'int', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'PaymentVendorDetails',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'PayVendorDetailId'
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