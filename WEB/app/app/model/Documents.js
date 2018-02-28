Ext.define('IAMTrading.model.Documents', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'DocID',

    fields: [
    { name:'DocID', type:'int', defaultValue: null },
    { name:'QHeaderId', type:'int', useNull: true, defaultValue: null },
    { name:'VendorId', type:'int', useNull: true, defaultValue: null },
    { name:'DocTypeID', type:'int', useNull: true, defaultValue: null },
    { name:'DocDesc', type:'string' },
    { name:'DocCreatedBy', type:'string' },
    { name:'DocCreatedDate', type:'date', defaultValue: null },
    { name:'DocModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'DocModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'VendorId', type:'int', useNull: true, defaultValue: null },
    { name:'VendorQuoteId', type:'int', useNull: true, defaultValue: null },
    { name:'x_DocTypeName', type:'string', useNull: true, defaultValue: null },
    { name:'x_AttachId', type:'int', defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Documents',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'DocID'
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
    }
});