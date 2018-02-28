Ext.define('IAMTrading.model.QuoteDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'QDetailId',
    autoLoad: false,

    fields: [
    { name:'QDetailId', type:'int', defaultValue: null },
    { name:'QHeaderId', type:'int', defaultValue: null },
    { name:'ItemId', type:'int', useNull: true, defaultValue: null },
    { name:'VendorId', type:'int', useNull:true, defaultValue: null },
    { name:'QDetailQty', type:'float', defaultValue: null },
    { name:'QDetailPrice', type:'float', defaultValue: null },
    { name:'QDetailLineTotal', type:'float', defaultValue: null },
    { name:'QDetailCost', type:'float', useNull: true, defaultValue: null },
    { name:'QDetailLineCost', type:'float', useNull: true, defaultValue: null },
    { name:'x_ItemName', type:'string'},
    { name:'x_VendorName', type:'string'},
    { name:'x_ItemGYCode', type:'string'},
    { name:'x_QHeaderDate', type:'date', useNull: true, defaultValue: null },
    { name:'x_QHeaderReference', type:'string' },
    { name:'x_QHeaderOC', type:'string', useNull: true, defaultValue: null },
    { name:'x_QHeaderOCDate', type:'date', defaultValue: null },
    { name:'x_QHeaderStatusInfo', type:'string', useNull: true, defaultValue: null },
    { name:'x_QHeaderEstimatedDate', type:'date', defaultValue: null },
    { name:'x_TotalInQuotes', type:'float'},
    { name:'x_StatusName', type:'string'},
    { name:'x_QHeaderComments', type:'string'}
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'QuoteDetails',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QDetailId'
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