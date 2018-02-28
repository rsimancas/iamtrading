Ext.define('IAMTrading.model.Vendors', {
    extend: 'Ext.data.Model',
    idProperty: 'VendorId',
    autoLoad: false,

    fields: [
    { name:'VendorId', type:'int', useNull:true, defaultValue: null },
    { name:'VendorName', type:'string', useNull: true, defaultValue: null },
    { name:'VendorCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
    { name:'VendorCreatedDate', type:'date', defaultValue: null },
    { name:'VendorModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'VendorModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'VendorContact', type:'string', useNull: true, defaultValue: null },
    { name:'VendorAddress1', type:'string', useNull: true, defaultValue: null },
    { name:'VendorAddress2', type:'string', useNull: true, defaultValue: null },
    { name:'VendorPhone', type:'string', useNull: true, defaultValue: null },
    { name:'VendorEmail', type:'string', useNull: true, defaultValue: null },
    { name:'VendorWebsite', type:'string', useNull: true, defaultValue: null },
    { name:'VendorZip', type:'string', useNull: true, defaultValue: null },
    { name:'VendorPctCommission', type:'float', useNull: true, defaultValue: null },
    { name:'x_VendorBalance', type:'float', useNull: true, defaultValue: null },
    { name:'x_GrandTotalBalance', type:'float', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'Vendors',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'VendorId'
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