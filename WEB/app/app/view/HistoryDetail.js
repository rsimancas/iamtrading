Ext.define('IAMTrading.view.HistoryDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.historydetail',
    modal: true,
    width: 700,
    layout: {
        type: 'absolute'
    },
    title: 'History Detail',
    closable: true,
    floating: true,
    callerForm: "",

    initComponent: function() {

        var me = this;

        var storeVendors = null;
        var storeItems = null;

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items: [{
                xtype: 'fieldcontainer',
                margin: '0 10 10 10',
                layout: {
                    type: 'column'
                },
                items: [{
                    xtype: 'textfield',
                    columnWidth: 0.25,
                    fieldLabel: 'Reference',
                    name: 'x_QHeaderReference',
                    allowBlank: false,
                    readOnly: true
                }, {
                    xtype: 'datefield',
                    margin: '0 0 0 5',
                    columnWidth: 0.25,
                    fieldLabel: 'Quote Date',
                    name: 'x_QHeaderDate',
                    allowBlank: false,
                    format: 'd/m/Y',
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    margin: '0 0 0 5',
                    columnWidth: 0.25,
                    fieldLabel: 'Num Order',
                    name: 'x_QHeaderOC',
                    readOnly: true
                }, {
                    xtype: 'datefield',
                    margin: '0 0 0 5',
                    columnWidth: 0.25,
                    fieldLabel: 'Date Order',
                    name: 'x_QHeaderOCDate',
                    format: 'd/m/Y',
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    columnWidth: 0.5,
                    fieldLabel: 'Status Info',
                    name: 'x_QHeaderStatusInfo',
                    readOnly: true
                }, {
                    xtype: 'datefield',
                    margin: '0 0 0 5',
                    columnWidth: 0.5,
                    fieldLabel: 'Estimated Date',
                    name: 'x_QHeaderEstimatedDate',
                    format: 'd/m/Y',
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    columnWidth: 1,
                    fieldLabel: 'Status',
                    name: 'x_StatusName',
                    readOnly: true
                }, {
                    xtype: 'textareafield',
                    columnWidth: 1,
                    fieldLabel: 'Comments',
                    name: 'x_QHeaderComments',
                    readOnly: true
                }, {
                    xtype: 'combo',
                    itemId: 'ItemId',
                    name: 'ItemId',
                    fieldLabel: 'Item',
                    columnWidth: 1,
                    valueField: 'ItemId',
                    displayField: 'ItemName',
                    store: storeItems,
                    pageSize: 12,
                    queryMode: 'remote',
                    minChars: 2,
                    allowBlank: false,
                    forceSelection: false,
                    selectOnFocus: true,
                    triggerAction: '',
                    queryBy: 'ItemName,VendorName,ItemGYCode',
                    queryCaching: false, // set false to let show new item created
                    enableKeyEvents: true,
                    emptyText: 'Choose Item',
                    tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item" >',
                        'GY Code: {ItemGYCode}<br/>',
                        'Name: {ItemName}<br/>',
                        'Vendor: {x_VendorName}',
                        '</div>',
                        '</tpl>'),
                    matchFieldWidth: true,
                    readOnly: true
                }, {
                    xtype: 'textfield',
                    name: 'x_VendorName',
                    fieldLabel: 'Vendor',
                    columnWidth: 1,
                    readOnly: true
                }, {
                    xtype: 'numericfield',
                    columnWidth: 0.2,
                    name: 'QDetailQty',
                    itemId: 'QDetailQty',
                    fieldLabel: 'Quantity',
                    fieldStyle: 'text-align: right;',
                    minValue: 1,
                    hideTrigger: false,
                    useThousandSeparator: true,
                    decimalPrecision: 0,
                    alwaysDisplayDecimals: true,
                    allowNegative: false,
                    alwaysDecimals: false,
                    thousandSeparator: ',',
                    selectOnFocus: true,
                    readOnly: true
                }, {
                    xtype: 'numericfield',
                    margin: '0 0 0 5',
                    columnWidth: 0.4,
                    name: 'QDetailPrice',
                    itemId: 'QDetailPrice',
                    hideTrigger: true,
                    useThousandSeparator: true,
                    //decimalPrecision: 5,
                    alwaysDisplayDecimals: true,
                    allowNegative: false,
                    currencySymbol: '$',
                    alwaysDecimals: true,
                    thousandSeparator: ',',
                    fieldLabel: 'Per Unit Price',
                    labelAlign: 'top',
                    fieldStyle: 'text-align: right;',
                    allowBlank: false,
                    selectOnFocus: true,
                    readOnly: true
                }, {
                    xtype: 'numericfield',
                    columnWidth: 0.4,
                    margin: '0 0 0 5',
                    name: 'QDetailLineTotal',
                    itemId: 'QDetailLineTotal',
                    hideTrigger: true,
                    useThousandSeparator: true,
                    //decimalPrecision: 5,
                    alwaysDisplayDecimals: true,
                    allowNegative: false,
                    currencySymbol: '$',
                    alwaysDecimals: true,
                    thousandSeparator: ',',
                    fieldLabel: 'Line Total',
                    labelAlign: 'top',
                    fieldStyle: 'text-align: right;',
                    allowBlank: false,
                    readOnly: true
                }]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'component',
                    flex: 1
                }]
            }],
            listeners: {
                show: {
                    fn: me.onShowWindow,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onItemBlur: function(field) {
        var me = this,
            rawvalue = field.getRawValue(),
            records = field.displayTplData;

        if (records && records.length > 0) {
            me.down('field[name=QDetailPrice]').setValue(records[0].ItemPrice);
            me.down('field[name=x_VendorName]').setValue(records[0].x_VendorName);
            me.down('field[name=VendorId]').setValue(records[0].VendorId);
        }

        if (!String.isNullOrEmpty(rawvalue) && field.value === null) {
            Ext.Msg.show({
                title: 'Question',
                msg: 'The item doesn\'t exists, Do you want to add to database?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(e) {
                    if (e === "yes") {
                        me.addItem(rawvalue);
                    } else {
                        field.setValue(null);
                        field.setRawValue('');
                        field.focus(true, 200);
                    }
                }
            });
        }
    },

    onShowWindow: function() {
        this.down('field[name=ItemId]').focus(true, 200);
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validation", "Check data for valid input!!!");
            return;
        }

        form.updateRecord();

        record = form.getRecord();

        var isPhantom = record.phantom;

        Ext.Msg.wait('Saving Record...', 'Wait');

        record.save({
            success: function(e) {
                Ext.Msg.hide();
                var form = me.callerForm,
                    grid = form.down('#gridQuoteDetails');

                if (!isPhantom) {
                    me.destroy();
                } else {
                    var newRecord = Ext.create('IAMTrading.model.QuoteDetails', {
                        QHeaderId: record.data.QHeaderId
                    });
                    me.loadRecord(newRecord);
                    me.down('field[name=ItemId]').focus(true, 200);
                }

                if (grid) {
                    grid.store.reload();
                }
            },
            failure: function() {
                Ext.Msg.hide();
            }
        });
    },

    onVendorBlur: function(field, The, eOpts) {
        if (field.readOnly) return;

        var me = field.up('panel'),
            rawvalue = field.getRawValue();

        if (field && field.valueModels !== null) {
            var filterVendor = new Ext.util.Filter({
                property: 'VendorId',
                value: field.value
            });
            var storeItems = new IAMTrading.store.Items().load({
                params: {
                    page: 1,
                    start: 0,
                    limit: 8
                },
                filters: [filterVendor],
                callback: function() {
                    field.next().bindStore(storeItems);
                    field.next().filters = filterVendor;
                }
            });
        } else if (rawvalue !== null && rawvalue !== '') {
            Ext.Msg.show({
                title: 'Question',
                msg: 'The vendor doesn\'t exists, Do you want to add to database?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(e) {
                    if (e === "yes") {
                        me.addVendor(rawvalue);
                    } else {
                        field.setValue(null);
                        field.focus(true, 200);
                    }
                }
            });
        }
    },

    addItem: function(rawvalue) {
        var me = this,
            record = Ext.create('IAMTrading.model.Items', {
                ItemName: rawvalue
            });

        var formItem = new IAMTrading.view.EditItem({
            title: 'New Item',
            calledFromQuotes: true
        });
        formItem.loadRecord(record);
        //form.center();
        formItem.callerForm = me;
        formItem.show();
        formItem.setX(me.getX() + 15);
        formItem.setY(me.getY() + 15);
        //me.hide();
    }
});
