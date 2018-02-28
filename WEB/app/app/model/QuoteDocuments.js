Ext.define('IAMTrading.model.QuoteDocuments', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'QDocID',

    fields: [
    { name:'QDocID', type:'int', defaultValue: null },
    { name:'QHeaderId', type:'int', defaultValue: null },
    { name:'DocTypeID', type:'int', defaultValue: null },
    { name:'QDocDesc', type:'string' },
    { name:'QDocCreatedBy', type:'string' },
    { name:'QDocCreatedDate', type:'date', defaultValue: null },
    { name:'QDocModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'QDocModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'x_DocTypeName', type:'string', useNull: true, defaultValue: null },
    { name:'x_AttachId', type:'int', defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url:'../wa/api/QuoteDocuments',
        headers: {
           'Authorization-Token': Ext.util.Cookies.get('IAM.AppAuth')
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QDocID'
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