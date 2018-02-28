Ext.define('IAMTrading.model.PurchaseOrders', {
    extend: 'Ext.data.Model',
    idProperty: 'POrderId',
    autoLoad: false,

    fields: [
    { name:'POrderId', type:'int', defaultValue: null },
    { name:'QHeaderId', type:'int', defaultValue: null },
    { name:'POrderType', type:'string', useNull: true, defaultValue: null },
    { name:'POrderAmount', type:'float', defaultValue: null },
    { name:'POrderAmountNB', type:'float', defaultValue: null },
    { name:'POrderDate', type:'date', defaultValue: null },
    { name:'POrderCurrencyRate', type:'float', defaultValue: null },
    { name:'POrderParentId', type:'int', useNull: true, defaultValue: null },
    { name:'POrderPaymentNumber', type:'string', useNull: true, defaultValue: null },
    { name:'POrderCreatedBy', type:'string' },
    { name:'POrderCreatedDate', type:'date', defaultValue: null },
    { name:'POrderModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'POrderModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'POrderManagerChecked', type:'boolean', useNull: true, defaultValue: null },
    { name:'POrderPctPP', type:'float', useNull: true, defaultValue: null}
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'PurchaseOrders',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'POrderId'
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