Ext.define('IAMTrading.model.QuoteHeader', {
    extend: 'Ext.data.Model',
    idProperty: 'QHeaderId',
    autoLoad: false,

    fields: [
    { name:'QHeaderId', type:'int', defaultValue: null },
    { name:'StatusId', type:'int', useNull: true, defaultValue: null },
    { name:'QHeaderDate', type:'date', useNull: true, defaultValue: null },
    { name:'QHeaderReference', type:'string' },
    { name:'QHeaderOC', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderOCDate', type:'date', defaultValue: null },
    { name:'QHeaderStatusInfo', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderEstimatedDate', type:'date', defaultValue: null },
    { name:'QHeaderCreatedBy', type:'string', defaultValue: IAMTrading.GlobalSettings.getCurrentUserId() },
    { name:'QHeaderCreatedDate', type:'date', defaultValue: null },
    { name:'QHeaderModifiedBy', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderComments', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderModifiedDate', type:'date', useNull: true, defaultValue: null },
    { name:'QHeaderCurrencyRate', type:'float', useNull: true, defaultValue: null },
    { name:'QHeaderVolumeWeight', type:'float', useNull: true, defaultValue: null },
    { name:'QHeaderCubicFeet', type:'float', useNull: true, defaultValue: null },
    { name:'QHeaderCost', type:'float', useNull: true, defaultValue: null },
    { name:'QHeaderTotal', type:'float', useNull: true, defaultValue: null },
    { name:'QHeaderGYComments', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderPOComments', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderCostComments', type:'string', useNull: true, defaultValue: null },
    { name:'QHeaderNumFianza', type:'string', useNull: true, defaultValue: null },
    { name:'VendorId', type:'int', useNull: true, defaultValue: null },
	{ name:'QHeaderCurrencyNA', type:'boolean',  defaultValue: false },
    { name:'x_TotalInQuotes', type:'float'},
    { name:'x_TotalBSInQuotes', type:'float'},
    { name:'x_StatusName', type:'string'},
    { name:'x_CostInQuotes', type:'float'},
    { name:'x_BrokerName', type:'string'},
    { name:'BrokerId', type:'int', useNull: true, defaultValue: null },
    { name:'x_VendorName', type:'string'},
    { name:'x_Profit', type:'float'},
    { name:'x_ProfitPct', type:'float'},
    { name:'x_ProfitInQuotes', type:'float'},
    { name:'CustId', type:'int', useNull: true, defaultValue: null },
    { name:'x_CustName', type:'string'},
    { name:'x_VolumeWeightInQuotes', type:'float'},
    { name:'x_CubicFeetInQuotes', type:'float'},
    { name:'x_ExchangeVariation', type:'float'},
    { name:'x_ExchangeVariationInQuotes', type:'float'},
    { name:'x_DateOrderReceived', type:'date', useNull: true, defaultValue: null },
    { name:'x_Selected', type:'boolean', defaultValue: false },
    { name:'x_PORate', type:'float'},
    { name:'x_PBRate', type:'float'},
    { name:'x_DateApproved', type:'int', useNull: true, defaultValue: null },
    { name:'x_DaysAvg', type:'int', useNull: true, defaultValue: null },
    { name:'x_DolarIAM', type:'float'},
    { name:'x_ExchVarHistory', type:'float'},
    { name:'x_TotalPorAprobacion', type:'float'},
    { name:'x_CountPorAprobacion', type:'int'},
    { name:'x_Total', type:'float'},
    { name:'x_Cost', type:'float'},
    { name:'x_InternalCharges', type:'float'},
    { name:'x_ICInQuotes', type:'float'},
    { name:'x_InvoiceBalance', type:'float'},
    { name:'x_GrandInvoiceBalance', type:'float'},
    { name:'x_PaidDate', type:'date', useNull: true, defaultValue: null },
    { name:'x_Paid', type:'float'},
    { name:'x_GrandPaid', type:'float'},
    { name:'x_Condition', type:'string'},
    { name:'x_GrandPOBalance', type:'float'},
    { name:'POBalance', type:'float'},
    { name:'InvoiceDate', type:'date', useNull: true, defaultValue: null },
    { name:'x_TotalBS', type:'float'}
    ],

    proxy:{
        type:'rest',
        url: IAMTrading.GlobalSettings.webApiPath + 'QuoteHeader',
        headers: {
           'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
        },
        reader:{
            type:'json',
            root:'data',
            totalProperty: 'total',
            successProperty: 'success',
            messageProperty: 'message',
            idProperty: 'QHeaderId'
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