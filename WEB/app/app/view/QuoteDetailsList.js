Ext.define('IAMTrading.view.QuoteDetailsList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quotedetailslist',
    layout: {
        type: 'column'
    },
    bodyPadding: 10,
    title: 'Quote Detail',

    initComponent: function() {
        var me = this;

        var storeQuoteDetail = null;

        Ext.applyIf(me, {
            items: [
                // Grid Quote Details
                {
                    xtype: 'gridpanel',
                    itemId: 'gridQuoteDetails',
                    //title: 'Detail',
                    columnWidth: 1,
                    minHeight: 300,
                    maxHeight: (screen.height / 100) * 70,
                    margin: '0 5 5 0',
                    features: [{
                        ftype: 'summary'
                    }],
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
                        text: 'Vendor',
                        summaryType: 'count',
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return Ext.String.format('Total for {0} items', value, value !== 1 ? value : 0);
                        },
                    }, {
                        xtype: 'numbercolumn',
                        flex: 1,
                        dataIndex: 'QDetailQty',
                        text: 'Qty.',
                        align: 'right',
                        summaryType: 'sum'
                    }, {
                        xtype: 'numbercolumn',
                        flex: 1,
                        dataIndex: 'QDetailLineTotal',
                        text: 'Total Line',
                        align: 'right',
                        renderer: Ext.util.Format.usMoney,
                        summaryType: 'sum'
                    }, {
                        xtype: 'actioncolumn',
                        width: 25,
                        items: [{
                            iconCls: 'app-grid-edit',
                            tooltip: 'edit'
                        }],
                        listeners: {
                            click: {
                                fn: me.onClickEditDetails,
                                scope: me
                            }
                        }
                    }],
                    // Grid Detail Toolbar
                    tbar: [{
                        text: 'Back',
                        handler: function() {
                            var vp  = this.up('app_viewport');
                            var that = this.up('form');
                            var formQuotes = vp.down('QuotesList');
                            var panel = vp.down('app_ContentPanel');
                            var grid = formQuotes.down('#gridQuoteHeader');

                            formQuotes.down('#pagingtoolbar').doRefresh(function() {
                                formQuotes.down('field[name=TotalQuotes]').setValue(this.max('x_TotalInQuotes'));
                                formQuotes.down('field[name=CostQuotes]').setValue(this.max('x_CostInQuotes'));
                                this.lastOptions.callback = null;
                            });

                            panel.remove(that);

                            that.destroy();

                            formQuotes.show();
                            formQuotes.getEl().slideIn('l', {
                                easing: 'backOut',
                                duration: 1000
                            });

                        }
                    }, '-', {
                        xtype: 'searchfield',
                        width: '30%',
                        itemId: 'searchfield',
                        name: 'searchField',
                        listeners: {
                            'triggerclick': function(field) {
                                me.onSearchFieldDetailChange();
                            }
                        }
                    }, {
                        xtype: 'component',
                        flex: 1
                    }, {
                        itemId: 'addline',
                        xtype: 'button',
                        text: 'Add',
                        disabled: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                        tooltip: 'Add (Ins)',
                        handler: function() {
                            var me = this.up('form');

                            record = Ext.create('IAMTrading.model.QuoteDetails', {
                                QHeaderId: me.QHeaderId
                            });
                            var callerForm = this.up('form');

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var storeItems = new IAMTrading.store.Items().load({
                                params: {
                                    page: 1,
                                    start: 0,
                                    limit: 8
                                },
                                callback: function() {
                                    var form = new IAMTrading.view.EditQuoteDetail();
                                    form.down('field[name=ItemId]').bindStore(storeItems);
                                    form.loadRecord(record);
                                    form.center();
                                    form.callerForm = callerForm;
                                    form.show();
                                    vp.getEl().unmask();
                                }
                            });
                        }
                    }, {
                        itemId: 'deleteline',
                        text: 'Delete',
                        handler: function() {
                            var grid = this.up('gridpanel');
                            var sm = grid.getSelectionModel();

                            selection = sm.getSelection();

                            if (selection) {
                                selection[0].destroy({
                                    success: function() {
                                        grid.store.reload({
                                            callback: function() {
                                                sm.select(0);
                                            }
                                        });
                                    }
                                });
                            }
                        },
                        disabled: true
                    }],
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

    onClickEditDetails: function(view, rowIndex, colIndex, item, e, record) {
        var vp = this.up('app_viewport');

        vp.getEl().mask("Please Wait...");

        var callerForm = this.up('panel').down('form');

        var storeItems = new IAMTrading.store.Items().load({
            params: {
                id: record.data.ItemId,
                page: 1,
                start: 0,
                limit: 8
            },
            callback: function() {
                var form = new IAMTrading.view.EditQuoteDetail();
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

        if (IAMTrading.GlobalSettings.getCurrentUserLevel() > -1)
            me.down('#deleteline').setDisabled(!records.length);
    }
});
