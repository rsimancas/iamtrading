Ext.define('IAMTrading.model.GeneralCharges', {
    extend: 'Ext.data.Model',
    idProperty: 'GChargeId',
    autoLoad: false,

    fields: [
        { name:'GChargeId', type:'int', defaultValue: null },
        { name:'ChargeDescId', type:'int', defaultValue: null },
        { name:'QHeaderId', type:'int', defaultValue: null },
        { name:'GChargeFactor', type:'float', useNull: true, defaultValue: null },
        { name:'GChargeAmount', type:'float', useNull: true, defaultValue: null },
        { name:'GChargeCurrencyCode', type:'string', useNull: true, defaultValue: null },
        { name:'GChargeCurrencyRate', type:'float', useNull: true, defaultValue: null },
        { name:'GChargeCreatedBy', type:'string' },
        { name:'GChargeCreatedDate', type:'date', defaultValue: null },
        { name:'GChargeModifiedBy', type:'string', useNull: true, defaultValue: null },
        { name:'GChargeModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'ChargeDescName', type:'string' }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'GeneralCharges',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'GChargeId'
        },
        writer: {
            writeAllFields: false
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