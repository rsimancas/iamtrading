Ext.define('IAMTrading.model.POVendorsDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'POVDetailId',
    autoLoad: false,

    fields: [
    { name:'POVDetailId', type:'int', defaultValue: null },
    { name:'POVId', type:'int', defaultValue: null },
    { name:'POVDetailAmount', type:'float', defaultValue: null },
    { name:'POVDetailAmountNB', type:'float', defaultValue: null },
    { name:'POVDetailCurrencyRate', type:'float', defaultValue: null },
    { name:'POVDetailPaymentNumber', type:'string', useNull: true, defaultValue: null },
    { name:'POVDetailType', type:'string' },
    { name:'POVDetailCreatedBy', type:'string' },
    { name:'POVDetailCreatedDate', type:'date', defaultValue: null },
    { name:'POVDetailModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'POVDetailModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'POVDetailDate', type:'date', defaultValue: null },
    { name:'PayVendorId', type:'int', defaultValue: null },
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'POVendorsDetails',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'POVDetailId'
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