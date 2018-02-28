Ext.define('IAMTrading.view.HistorySearchList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.historysearchlist',
    layout: {
        type: 'column'
    },
    bodyPadding: 10,

    requires: [
        'IAMTrading.view.HistoryDetail',
    ],

    title: 'History Search',

    initComponent: function() {
        var me = this;

        var storeQuoteDetail = new IAMTrading.store.QuoteDetails({
            pageSize: Math.round(((screen.height / 100) * 75) / 35)
        }).load();

        Ext.applyIf(me, {
            items: [
                // Grid Quote Details
                {
                    xtype: 'gridpanel',
                    itemId: 'gridmain',
                    store: storeQuoteDetail,
                    columnWidth: 1,
                    minHeight: (screen.height / 100) * 70,
                    maxHeight: (screen.height / 100) * 70,
                    margin: '0 5 5 0',
                    columns: [{
                        xtype: 'rownumberer',
                        width: 30
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'x_ItemGYCode',
                        text: 'GY Code'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 4,
                        dataIndex: 'x_ItemName',
                        text: 'Item'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 3,
                        dataIndex: 'x_VendorName',
                        text: 'Vendor'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'x_QHeaderDate',
                        text: 'Quote Date',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'x_QHeaderReference',
                        text: 'Reference'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'x_QHeaderOC',
                        text: 'Num. Order'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'x_StatusName',
                        text: 'Quote Status'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'x_QHeaderStatusInfo',
                        text: 'Sta. Info'
                    }, {
                        xtype: 'numbercolumn',
                        flex: 1,
                        dataIndex: 'QDetailQty',
                        text: 'Qty.',
                        align: 'right'
                    }, {
                        xtype: 'numbercolumn',
                        flex: 1,
                        dataIndex: 'QDetailPrice',
                        text: 'Unit Price',
                        align: 'right',
                        renderer: Ext.util.Format.usMoney
                    }, {
                        xtype: 'numbercolumn',
                        flex: 1,
                        dataIndex: 'QDetailLineTotal',
                        text: 'Total Line',
                        align: 'right',
                        renderer: Ext.util.Format.usMoney
                    }, {
                        xtype: 'actioncolumn',
                        width: 25,
                        items: [{
                            iconCls: 'app-find',
                            tooltip: 'view details'
                        }],
                        listeners: {
                            click: {
                                fn: me.onClickViewDetails,
                                scope: me
                            }
                        }
                    }],
                    // Grid Detail Toolbar
                    tbar: [{
                        xtype: 'searchfield',
                        width: '30%',
                        itemId: 'searchfield',
                        name: 'searchField',
                        listeners: {
                            'triggerclick': function(field) {
                                me.onSearchFieldChange();
                            }
                        }
                    }, {
                        xtype: 'component',
                        flex: 1
                    }],
                    selType: 'rowmodel',
                    bbar: new Ext.PagingToolbar({
                        itemId: 'pagingtoolbar',
                        store: storeQuoteDetail,
                        displayInfo: true,
                        displayMsg: 'Show {0} - {1} of {2}',
                        emptyMsg: "No records to show"
                    }),
                    // Grid Quotes Details Listeners
                    listeners: {
                        selectionchange: {
                            fn: me.onSelectChangeDetail,
                            scope: me
                        },
                        celldblclick: {
                            fn: me.onClickEditCustomerQuote,
                            scope: me
                        }
                    }
                }
            ],
            // Form Listeners
            listeners: {
                render: {
                    fn: me.onRenderForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        //var me = this;
        //var field = me.down('#searchfield').focus(true, 200);
    },

    onClickViewDetails: function(view, rowIndex, colIndex, item, e, record) {
        var vp = view.panel.up('app_viewport');

        vp.getEl().mask("Please Wait...");

        var callerForm = view.panel.up('form');

        var storeItems = new IAMTrading.store.Items().load({
            params: {
                id: record.data.ItemId,
                page: 1,
                start: 0,
                limit: 8
            },
            callback: function() {
                var form = new IAMTrading.view.HistoryDetail();
                form.down('field[name=ItemId]').bindStore(storeItems);
                form.loadRecord(record);
                form.center();
                form.callerForm = callerForm;
                form.show();
                vp.getEl().unmask();
            }
        });
    },

    onSelectChangeDetail: function(model, records) {
        var me = this;
        me.down('#deleteline').setDisabled(!records.length);
    },

    onSearchFieldChange: function() {
        var form = this,
            field = form.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = form.down('#gridmain');

        grid.store.removeAll();

        if (!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {
                params: {
                    query: fieldValue
                },
                callback: function() {
                    form.down('#pagingtoolbar').bindStore(this);
                }
            });
        } else {
            grid.store.loadPage(1, {
                callback: function() {
                    form.down('#pagingtoolbar').bindStore(this);
                }
            });
        }
    }
});
