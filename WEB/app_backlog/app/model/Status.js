Ext.define('IAMTrading.model.Status', {
    extend: 'Ext.data.Model',
    idProperty: 'StatusId',
    autoLoad: false,

    fields: [
    { name:'StatusId', type:'int', defaultValue: null },
    { name:'StatusName', type:'string' },
    { name:'StatusOrder', type:'int', defaultValue: null },
    { name:'StatusCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId()},
    { name:'StatusCreatedDate', type:'date', defaultValue: null },
    { name:'StatusModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'StatusModifiedDate', type:'date', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Status',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'StatusId'
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