Ext.define('IAMTrading.view.VendorQuotesList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.VendorQuotesList',
    title: 'Vendor\'s Quotes',

    initComponent: function() {
        var me = this,
            userLevel = IAMTrading.GlobalSettings.getCurrentUserLevel();

        var storeVendorQuotes = new IAMTrading.store.VendorQuotes();

        Ext.applyIf(me, {
            items: [{
                xtype: 'gridpanel',
                itemId: 'gridmain',
                autoScroll: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: 450,
                forceFit: true,
                store: storeVendorQuotes,
                columns: [{
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 100,
                    dataIndex: 'VendorQuoteId',
                    text: 'ID',
                    format: '000'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'VendorName',
                    text: 'Vendor'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'VendorQuoteReference',
                    text: 'Reference'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'VendorQuoteDate',
                    text: 'Quote Date',
                    renderer: Ext.util.Format.dateRenderer('d/m/Y')
                }, {
                    xtype: 'actioncolumn',
                    width: 25,
                    getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                        return 'xf040@FontAwesome'; },
                    tooltip: 'Edit',
                    listeners: {
                        click: function(view, rowIndex, colIndex, item, e, record) {
                            var me = this.up("form");
                            me.onClickEdit(record);
                        }
                    }
                }, {
                    xtype: 'actioncolumn',
                    width: 25,
                    getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                        return 'xf014@FontAwesome'; },
                    tooltip: 'Delete',
                    listeners: {
                        click: function(view, rowIndex, colIndex, item, e, record) {
                            var me = this.up("form");
                            me.onClickDelete(record);
                        }
                    }
                }],
                tbar: [{
                        xtype: 'searchfield',
                        width: '50%',
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
                    },
                    // Buttons on Grid Header
                    {
                        margin: '0 10 0 15',
                        columnWidth: 0.1,
                        xtype: 'button',
                        text: 'New Quote',
                        disabled: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4])),
                        handler: function() {
                            record = new IAMTrading.model.VendorQuotes();

                            var form = new IAMTrading.view.EditVendorQuote();
                            form.loadRecord(record);
                            form.center();
                            form.callerForm = this.up('form');
                            form.show();
                        }
                    }
                ],
                selType: 'rowmodel',
                bbar: new Ext.PagingToolbar({
                    itemId: 'pagingtoolbar',
                    store: storeVendorQuotes,
                    displayInfo: true,
                    displayMsg: 'Show {0} - {1} of {2}',
                    emptyMsg: "No records to show"
                })
            }],
            listeners: {
                render: {
                    fn: me.onRenderForm,
                    scope: me
                },
                afterrender: {
                    fn: me.registerKeyBindings,
                    scope: me
                },
            }

        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;

        var grid = me.down('#gridmain');

        if (grid.getSelectionModel().selected.length === 0) {
            grid.getSelectionModel().select(0);
        }
    },

    registerKeyBindings: function(view, options) {
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
                if (evt.keyCode === Ext.EventObject.INSERT) {
                    evt.stopEvent();
                    var btn = me.down('#addline');
                    //console.log(btn); //.click();
                    btn.fireHandler();
                }
            },
            this);

        me.down('#searchfield').focus(true, 300);
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
    },

    onClickEdit: function(record) {
        // ...
    },

    onClickDelete: function(record) {
        Ext.Msg.show({
            title: 'Delete',
            msg: 'Do you want to delete?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    record.destroy({
                        success: function() {}
                    });
                }
            }
        }).defaultButton = 2;
    }
});
