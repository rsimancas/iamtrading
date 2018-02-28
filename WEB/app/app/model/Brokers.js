Ext.define('IAMTrading.model.Brokers', {
    extend: 'Ext.data.Model',
    autoLoad: false,

    fields: [
    { name:'BrokerId', type:'int', defaultValue: null },
    { name:'BrokerName', type:'string' },
    { name:'BrokerRoyaltyPct', type:'float', useNull: true, defaultValue: null },
    { name:'BrokerCreated', type:'date', defaultValue: null },
    { name:'BrokerCreatedBy', type:'string', useNull: true, defaultValue: null },
    { name:'BrokerModified', type:'date', useNull: true, defaultValue: null },
    { name:'BrokerModifiedBy', type:'date', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Brokers',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'BrokerId'
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