Ext.define('IAMTrading.model.BankAccounts', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'AccountID',

    fields: [
        { name:'AccountID', type:'int', defaultValue: null },
        { name:'AccountNumber', type:'string' },
        { name:'AccountReference', type:'string', useNull: true, defaultValue: null },
        { name:'AccountID', type:'int', defaultValue: null },
        { name:'AccountCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
        { name:'AccountCreated', type:'date', defaultValue: null },
        { name:'AccountModifiedBy', type:'string', useNull: true, defaultValue: null },
        { name:'AccountModified', type:'date', useNull: true, defaultValue: null },
        { name:'BankID', type:'int', defaultValue: null },
        { name:'BankName', type:'string', useNull: true, defaultValue: null },
        { name:'BankAccount', type:'string', useNull: true, defaultValue: null },
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'BankAccounts',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'AccountID'
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