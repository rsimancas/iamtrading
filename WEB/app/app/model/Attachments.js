Ext.define('IAMTrading.model.Attachments', {
    extend: 'Ext.data.Model',
    autoLoad: false,
    idProperty: 'AttachId',

    fields: [
        { name: 'AttachId', type: 'int', defaultValue: null },
        { name: 'AttachName', type: 'string' },
        { name: 'AttachContentType', type: 'string' },
        { name: 'AttachFilePath', type: 'string', useNull: true, defaultValue: null },
        { name: 'AttachData', type: 'varbinary', useNull: true, defaultValue: null },
        { name: 'QHeaderId', type: 'int', useNull: true, defaultValue: null },
        { name: 'ItemId', type: 'int', useNull: true, defaultValue: null },
        { name: 'DocID', type: 'int', useNull: true, defaultValue: null },
        { name: 'VendorId', type: 'int', useNull: true, defaultValue: null },
        { name: 'VendorQuoteId', type: 'int', useNull: true, defaultValue: null },
        { name: 'AttachDirty', type: 'boolean', useNull: true, defaultValue: null },
        { name: 'AttachCreated', type: 'date', defaultValue: null },
        { name: 'AttachCreatedBy', type: 'string', useNull: true, defaultValue: null },
        { name: 'PayVendorId', type: 'int', useNull: true, defaultValue: null }, {
            name: 'x_AttachSrc',
            type: 'string',
            convert: function(val, row) {
                return (row.data.AttachContentType.indexOf("pdf") === -1) ? "../wa/GetAttach?id=" + row.data.AttachId : "images/pdf-icon.png";
            }
        }
    ],

    proxy: {
        type: 'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Attachments',
        headers: {
            'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader: {
            type: 'json',
            root: 'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'AttachId'
        },
        writer: {
            writeAllFields: false
        },
        afterRequest: function(request, success) {
            var silentMode = this.getSilentMode();

            if (request.action == 'read') {
                //this.readCallback(request);
            } else if (request.action == 'create') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Success", "Saved Successfully!!!");
                }
            } else if (request.action == 'update') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not saved!!!");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Success", "Saved Successfully!!!");
                }
            } else if (request.action == 'destroy') {
                if (!request.operation.success) {
                    Ext.popupMsg.msg("Warning", "Record was not Deleted");
                    //Ext.global.console.warn(request.proxy.reader.jsonData.message);
                } else {
                    if (!silentMode)
                        Ext.popupMsg.msg("Success", "Deleted Successfully");
                }
            }

            this.setSilentMode(false);
        }
    }
});
