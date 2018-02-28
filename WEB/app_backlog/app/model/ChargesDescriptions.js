Ext.define('IAMTrading.model.ChargesDescriptions', {
    extend: 'Ext.data.Model',
    idProperty: 'ChargeDescId',
    autoLoad: false,

    fields: [
        { name:'ChargeDescId', type:'int', defaultValue: null },
        { name:'ChargeDescName', type:'string' },
        { name:'ChargeDefaultFactor', type:'float', useNull:true, defaultValue:null},
        { name:'CCategoryId', type:'int', defaultValue: null },
        { name:'ChargeDescCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
        { name:'ChargeDescCreatedDate', type:'date', defaultValue: new Date() },
        { name:'ChargeDescModifiedBy', type:'string', useNull: true, defaultValue: null },
        { name:'ChargeDescModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'CCategoryName', type:'string' }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'ChargesDescriptions',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'ChargeDescId'
        },
        writer: {
            writeAllFields: true
        },
        afterRequest: function (request, success) {
            var silentMode = this.getSilentMode();

            if (request.action == 'read') {
                //this.readCallback(request);
            }
            else if (request.action == 'create') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Success","Saved Successfully!!!");
                }
            }
            else if (request.action == 'update') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Success","Saved Successfully!!!");
                }
            }
            else if (request.action == 'destroy') {
                if (!request.operation.success)
                {
                    Ext.popupMsg.msg("Warning", "Record was not Deleted");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if(!silentMode)
                    Ext.popupMsg.msg("Success","Deleted Successfully");
                }
            }

            this.setSilentMode(false);
        }
    },


});