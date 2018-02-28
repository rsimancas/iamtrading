Ext.define('IAMTrading.view.ItemsList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.itemslist',
    title: 'Items',

    requires: ['IAMTrading.view.EditItem'],

    initComponent: function() {
        var me = this;

        var storeItems = new IAMTrading.store.Items({
            pageSize: Math.round((screen.height * (70 / 100)) / 34)
        }).load();
        var storeVendors = null;

        Ext.applyIf(me, {
            items: [{
                xtype: 'gridpanel',
                itemId: 'gridmain',
                scrollable: true,
                columnWidth: 1,
                viewConfig: {
                    stripeRows: true
                },
                minHeight: screen.height * (70 / 100),
                maxHeight: screen.height * (70 / 100),
                forceFit: true,
                store: storeItems,
                columns: [{
                    xtype: 'numbercolumn',
                    sortable: true,
                    width: 60,
                    dataIndex: 'ItemId',
                    text: 'ID',
                    format: '000'
                }, {
                    xtype: 'gridcolumn',
                    flex: 1,
                    dataIndex: 'ItemGYCode',
                    text: 'GoodYear Code'
                }, {
                    xtype: 'gridcolumn',
                    flex: 3,
                    dataIndex: 'ItemName',
                    text: 'Name'
                }, {
                    xtype: 'gridcolumn',
                    flex: 3,
                    dataIndex: 'x_VendorName',
                    text: 'Vendor'
                }, {
                    xtype: 'numbercolumn',
                    flex: 1,
                    dataIndex: 'ItemPrice',
                    text: 'Price',
                    align: 'right',
                    renderer: Ext.util.Format.usMoney
                }, {
                    xtype: 'actioncolumn',
                    width: 30,
                    iconCls: 'app-grid-edit',
                    tooltip: 'edit',
                    listeners: {
                        click: {
                            fn: me.onClickEditLine,
                            scope: me
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
                }, {
                    itemId: 'addline',
                    xtype: 'button',
                    text: 'Add',
                    tooltip: 'Add (Ins)',
                    handler: function() {
                        var record = Ext.create('IAMTrading.model.Items');

                        var form = new IAMTrading.view.EditItem({
                            title: 'New Record',
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
                    store: storeItems,
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

    onClickEditLine: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;
        var callerForm = view.panel.up('form');
        var selectedRecord = null;

        if (!Ext.isObject(record)) {
            var grid = callerForm.down('#gridmain');
            var sm = grid.getSelectionModel();
            selectedRecord = sm.lastSelected;
        } else {
            selectedRecord = record;
        }

        callerForm.up('app_viewport').getEl().mask('Please wait...');

        var storeVendors = new IAMTrading.store.Vendors().load({
            params: {
                id: selectedRecord.data.VendorId
            },
            callback: function() {
                var form = new IAMTrading.view.EditItem({
                    currentRecord: selectedRecord
                });
                form.down('field[name=VendorId]').bindStore(storeVendors);
                form.loadRecord(selectedRecord);
                form.callerForm = callerForm;
                form.center();
                form.show();
                callerForm.up('app_viewport').getEl().unmask();

            }
        });
    }

});
