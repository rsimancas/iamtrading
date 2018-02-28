Ext.define('IAMTrading.controller.Home', {
    extend: 'Ext.app.Controller',

    models: [

    ],

    stores: [
        'Attachments',
        'Brokers',
        'Banks',
        'BankAccounts',
        'CurrencyRates',
        'Customers',
        'Documents',
        'DocumentTypes',
        'DolarTodayUSD',
        'PaymentModes',
        'Items',
        'PaymentVendorDetails',
        'POVendorsDetails',
        'PurchaseOrders',
        'PurchaseOrdersVendors',
        'QuoteDetails',
        'QuoteHeader',
        'Sequences',
        'Status',
        'Users',
        'Vendors',
        'Images',
        'viewPaidDetails',
        'QuoteChart',
        'Roles',
        'VendorQuotes',
        'VendorQuotesDetail'
    ],

    views: [
        'EditVendorQuote',
        'VendorQuotesList',
        'BanksList',
        'BankAccountsList',
        'ShowDocuments',
        'QuotesList',
        'ItemsList',
        'VendorsList',
        'SequencesList',
        'StatusList',
        'HistorySearchList',
        'BrokersList',
        'CustomersList',
        'CurrencyRatesList',
        'DocumentTypesList',
        'PaymentModesList',
        'EditQuoteHeader',
        'EditQuoteDetail',
        'QuoteDetailsList',
        'RolesList',
        'common.ContentPanel',
        'common.MainHeader'
    ],

    init: function(application) {
        var auth = IAMTrading.GlobalSettings.tokenAuth;

        if (!auth || auth === null) {
            window.onbeforeunload = null;
            location.href = '#logon';
            return;
        }

        var askBeforeOut = function() {
            return 'Do you want to out?';
        };

        window.onbeforeunload = askBeforeOut;

        // this.control({
        //     'importacionlist gridview': {
        //         expandbody: this.onExpandRow,
        //         collapsebody: this.onCollapseRow
        //     }
        // });
    }

    // onExpandRow: function(node, record, eNode) {
    //     var store = new IAMTrading.store.Movimientos({autoLoad: false});
    //     store.add(record);

    //     console.log(store);

    //     //var status = new CBH.model.sales.FileList(record.data).Status().load();

    //     var element = Ext.get(eNode).down('.ux-row-expander-box');

    //     var grid = Ext.create('Ext.grid.Panel', {
    //         cls: 'custom-grid',
    //         store: store,
    //         hideHeaders: false,
    //         border: false,
    //         minHeight: 120,
    //         margin: '0 0 0 20',
    //         viewConfig: {
    //             stripeRow: true
    //         },
    //         columns: [
    //         {
    //             xtype: 'rownumberer'
    //         },
    //         {
    //             xtype: 'gridcolumn',
    //             sortable: true,
    //             dataIndex: 'MovFechaLlegada',
    //             text: 'Llegada',
    //             renderer: Ext.util.Format.dateRenderer('d/m/Y')
    //         },
    //         {
    //             xtype: 'gridcolumn',
    //             dataIndex: 'x_Ciudad',
    //             text: 'Destino'
    //         }
    //         ]
    //     });

    //     Ext.apply(grid, this.expandable);
    //     grid.on('itemclick', function(view) {
    //         this.getView().getSelectionModel().deselectAll();
    //     });

    //     element.swallowEvent(['click', 'mousedown', 'mouseup', 'dblclick'], true);
    //     grid.render(element);
    // },

    // onCollapseRow: function(node, record, eNode) {
    //     Ext.get(eNode).down('.ux-row-expander-box').down('div').destroy();
    // }
});
