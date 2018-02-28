Ext.define('IAMTrading.model.Customers', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'CustId',
    
    fields: [
    { name:'CustId', type:'int', defaultValue: null },
    { name:'CustName', type:'string' },
    { name:'CustCreated', type:'date', defaultValue: null },
    { name:'CustCreatedBy', type:'string', useNull: true, defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
    { name:'CustModified', type:'date', useNull: true, defaultValue: null },
    { name:'CustModifiedBy', type:'date', useNull: true, defaultValue: null },
    { name:'CustPctPP', type:'float', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Customers',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CustId'
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