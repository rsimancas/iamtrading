Ext.define('IAMTrading.model.Sequences', {
    extend: 'Ext.data.Model',
    idProperty: 'SeqId',
    autoLoad: false,

    fields: [
    { name:'SeqId', type:'int', defaultValue: null },
    { name:'SeqName', type:'string' },
    { name:'SeqValue', type:'int', defaultValue: null },
    { name:'SeqPrefix', type:'string', useNull: true, defaultValue: null },
    { name:'SeqCreatedDate', type:'date', defaultValue: null },
    { name:'SeqCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
    { name:'SeqModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'SeqModifiedBy', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Sequences',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'SeqId'
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