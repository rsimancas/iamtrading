Ext.define('IAMTrading.view.VendorsList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.vendorslist',
    title: 'Vendors',
    requires: ['IAMTrading.view.EditVendor'],

    initComponent: function() {
        var me = this;

        var storeVendors = new IAMTrading.store.Vendors({
            pageSize: Math.round((screen.height * (60 / 100)) / 32)
        }).load({
            callback: function() {
                me.RecalcTotals();
            }
        });

        Ext.applyIf(me, {
            items: [
                // Totals
                {
                    xtype: 'container',
                    columnWidth: 1,
                    layout: {
                        type: 'hbox'
                    },
                    items: [{
                        margin: '10 0 0 10',
                        width: 220,
                        xtype: 'checkbox',
                        name: 'ShowOnlyWithBalance',
                        labelSeparator: '',
                        hideLabel: true,
                        boxLabel: 'Show only with balance',
                        listeners: {
                            change: function(field, newValue, oldValue, eOpts) {
                                var me = field.up('form'),
                                    grid = me.down('gridpanel');

                                me.onSearchFieldChange();
                            }
                        }
                    }, {
                        xtype: 'component',
                        flex: 1
                    }, {
                        margin: '10 25 0 0',
                        xtype: 'numericfield',
                        width: 200,
                        name: 'x_GrandTotalBalance',
                        labelAlign: 'left',
                        labelWidth: 80,
                        fieldLabel: 'Total Balance $',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        //labelStyle: 'text-align: right;',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false
                    }]
                }, {
                    xtype: 'gridpanel',
                    itemId: 'gridmain',
                    scrollable: true,
                    columnWidth: 1,
                    viewConfig: {
                        stripeRows: true
                    },
                    minHeight: screen.height * (60 / 100),
                    maxHeight: screen.height * (60 / 100),
                    forceFit: true,
                    store: storeVendors,
                    columns: [{
                        xtype: 'numbercolumn',
                        sortable: true,
                        width: 80,
                        dataIndex: 'VendorId',
                        text: 'ID',
                        format: '000'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'VendorName',
                        text: 'Name'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'VendorPhone',
                        text: 'Phone'
                    }, {
                        xtype: 'gridcolumn',
                        flex: 1,
                        dataIndex: 'VendorContact',
                        text: 'Contact'
                    }, {
                        xtype: 'numbercolumn',
                        width: 80,
                        dataIndex: 'x_VendorBalance',
                        text: 'Balance',
                        align: 'right',
                        renderer: function(value, metaData, record) {
                                if (value < 0) {
                                    metaData.style = "color:red;";
                                    return Ext.util.Format.usMoney(value);
                                } else {
                                    return Ext.util.Format.usMoney(value);
                                }
                            }
                            //hidden: (userLevel === -1)
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        items: [{
                            handler: me.onClickEditLine,
                            iconCls: 'app-grid-edit',
                            tooltip: 'Edit'
                        }]
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
                    }, {
                        itemId: 'addline',
                        xtype: 'button',
                        text: 'Add',
                        tooltip: 'Add (Ins)',
                        handler: function() {
                            var record = Ext.create('IAMTrading.model.Vendors');

                            var form = new IAMTrading.view.EditVendor({
                                title: 'New Vendor',
                                currentRecord: record
                            });
                            form.loadRecord(record);
                            form.center();
                            form.callerForm = this.up('form');
                            form.show();
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
                    selType: 'rowmodel',
                    bbar: new Ext.PagingToolbar({
                        itemId: 'pagingtoolbar',
                        store: storeVendors,
                        displayInfo: true,
                        displayMsg: 'Show {0} - {1} of {2}',
                        emptyMsg: "No records to show"
                    }),
                    listeners: {
                        selectionchange: function(view, records) {
                            this.down('#deleteline').setDisabled(!records.length);
                        },
                        validateedit: function(e) {
                            var myTargetRow = 6;

                            if (e.rowIdx == myTargetRow) {
                                e.cancel = true;
                                e.record.data[e.field] = e.value;
                            }
                        }
                    }
                }
            ],
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
        var me = this,
            field = me.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = me.down('#gridmain'),
            onlyWithBalance = me.down('field[name=ShowOnlyWithBalance]').getValue();

        grid.store.removeAll();

        if (!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {
                params: {
                    query: fieldValue,
                    onlyWithBalance: onlyWithBalance
                },
                callback: function() {
                    me.down('#pagingtoolbar').bindStore(this);
                    me.RecalcTotals();
                }
            });
        } else {
            grid.store.loadPage(1, {
                params: {
                    onlyWithBalance: onlyWithBalance
                },
                callback: function() {
                    me.down('#pagingtoolbar').bindStore(this);
                    me.RecalcTotals();
                }
            });
        }
    },

    onClickEditLine: function(view, rowIndex, colIndex, item, e, record) {
        var callerForm = view.panel.up('form');
        var selectedRecord = null;

        if (!Ext.isObject(record)) {
            var grid = callerForm.down('#gridmain');
            var sm = grid.getSelectionModel();
            selectedRecord = sm.lastSelected;
        } else {
            selectedRecord = record;
        }

        var vp = this.up('app_viewport');

        vp.getEl().mask("Please Wait...");

        var storeVendors = new IAMTrading.store.Vendors().load({
            params: {
                id: selectedRecord.data.VendorId
            },
            callback: function() {
                var editRecord = this.getAt(0);
                var form = new IAMTrading.view.EditVendor({
                    title: record.data.VendorName,
                    currentRecord: editRecord,
                    callerForm: callerForm
                });
                form.loadRecord(editRecord);
                form.center();
                form.show();
                vp.getEl().unmask();
            }
        });
    },

    RecalcTotals: function(fromChecked) {
        var me = this,
            userLevel = IAMTrading.GlobalSettings.getCurrentUserLevel(),
            grid = me.down('#gridmain'),
            store = grid.store;

        me.down('field[name=x_GrandTotalBalance]').setValue(store.max('x_GrandTotalBalance'));
    }

});
