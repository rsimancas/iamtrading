Ext.define('IAMTrading.model.CustomsClearence', {
    extend: 'Ext.data.Model',
    idProperty: 'CClearenceId',
    autoLoad: false,

    fields: [
        { name:'CClearenceId', type:'int', defaultValue: null },
        { name:'QHeaderId', type:'int', defaultValue: null },
        { name:'CClearenceMode', type:'int', defaultValue: null},
        { name:'CClearenceDate', type:'date', defaultValue: null },
        { name:'CClearenceCurrencyRate', type:'float', useNull: true, defaultValue: null },
        { name:'CClearenceCurrencyCode', type:'string', useNull: true, defaultValue: null },
        { name:'CClearenceFactor', type:'float', useNull: true, defaultValue: null },
        { name:'CClearenceCreatedBy', type:'string' },
        { name:'CClearenceCreatedDate', type:'date', defaultValue: null },
        { name:'CClearenceModifiedBy', type:'string', useNull: true, defaultValue: null },
        { name:'CClearenceModifiedDate', type:'date', useNull: true, defaultValue: null },
        { name:'BrokerName', type:'string' },
        { name:'CustName', type:'string' },
        { name:'VendorName', type:'string', useNull: true, defaultValue: null },
        { name:'StatusId', type:'int', useNull: true, defaultValue: null },
        { name:'QHeaderDate', type:'date', useNull: true, defaultValue: null },
        { name:'QHeaderReference', type:'string' },
        { name:'QHeaderOC', type:'string', useNull: true, defaultValue: null },
        { name:'QHeaderStatusInfo', type:'string', useNull: true, defaultValue: null },
        { name:'QHeaderNumFianza', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'CustomsClearence',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CClearenceId'
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