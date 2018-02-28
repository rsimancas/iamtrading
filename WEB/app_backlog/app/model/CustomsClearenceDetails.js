Ext.define('IAMTrading.model.CustomsClearenceDetails', {
    extend: 'Ext.data.Model',
    idProperty: 'CCDetailId',
    autoLoad: false,

    fields: [
        { name:'CCDetailId', type:'int', defaultValue: null },
        { name:'CClearenceId', type:'int', defaultValue: null },
        { name:'QDetailId', type:'int', defaultValue: null },
        { name:'CCDetailWeighFactor', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailFleteCCS', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailFleteMIA', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailOtherExpenses', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailAmountIDB', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailTariffPct', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailTariffAmount', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailTaxPct', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailTaxAmount', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailCustomsSrvPct', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailCustomsSrvAmount', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailGuarantee', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailProfitMargin', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailProfitAmount', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailCurrencyRate', type:'float', useNull: true, defaultValue: null },
        { name:'CCDetailLinePrice', type:'float', useNull: true, defaultValue: null },
        { name:'QDetailQty', type:'float', defaultValue: null },
        { name:'QDetailPrice', type:'float', defaultValue: null },
        { name:'QDetailLineTotal', type:'float', defaultValue: null },
        { name:'QDetailCost', type:'float', useNull: true, defaultValue: null },
        { name:'QDetailLineCost', type:'float', useNull: true, defaultValue: null },
        { name:'QHeaderId', type:'int', defaultValue: null },
        { name:'ItemName', type:'string' },
        { name:'ItemNum', type:'string', useNull: true, defaultValue: null },
        { name:'ItemGYCode', type:'string', useNull: true, defaultValue: null },
        { name:'ItemTariffPct', type:'float', useNull: true, defaultValue: null },
        { name:'ItemTariffCode', type:'string', useNull: true, defaultValue: null },
        { name:'ItemLength', type:'float', useNull: true, defaultValue: null },
        { name:'ItemHeight', type:'float', useNull: true, defaultValue: null },
        { name:'ItemWidth', type:'float', useNull: true, defaultValue: null },
        { name:'ItemVolume', type:'float', useNull: true, defaultValue: null },
        { name:'ItemWeight', type:'float', useNull: true, defaultValue: null },
        { name:'ItemNameSupplier', type:'string', useNull: true, defaultValue: null },
        { name:'ItemNumSupplier', type:'string', useNull: true, defaultValue: null }
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'CustomsClearenceDetails',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'CCDetailId'
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