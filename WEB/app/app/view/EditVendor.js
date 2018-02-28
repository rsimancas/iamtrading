Ext.define('IAMTrading.view.EditVendor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.editvendorpanel',
    modal: true,
    width: 1280,
    minHeight: 800,
    layout: {
        type: 'absolute'
    },
    title: 'Vendor',
    closable: true,

    floating: true,
    callerForm: null,
    calledFromEditItem: false,
    currentRecord: null,

    requires: ['IAMTrading.view.PaySelectedPOV'],

    initComponent: function() {

        var me = this;

        var storePurchasesVendors = null,
            storePOVendorsDetails = null,
            storeFiles = null;

        var storeBrokers = new IAMTrading.store.Brokers({
            pageSize: 0
        }).load();

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items: [{
                xtype: 'tabpanel',
                columnWidth: 1,
                margin: '5 5 5 5',
                activeTab: 0,
                items: [
                    // Vendor Info
                    {
                        xtype: 'panel',
                        title: 'Vendor Information',
                        itemId: 'panelgeneral',
                        margin: '0 0 10 0',
                        layout: {
                            type: 'fit'
                        },
                        items: [{
                            xtype: 'fieldcontainer',
                            margin: '0 10 10 10',
                            layout: {
                                type: 'column'
                            },
                            items: [{
                                xtype: 'textfield',
                                columnWidth: 0.5,
                                name: 'VendorId',
                                fieldLabel: 'VendorId',
                                formBind: false,
                                readOnly: true
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Vendor Name',
                                columnWidth: 1,
                                name: 'VendorName',
                                allowBlank: false
                            }, {
                                xtype: 'textfield',
                                columnWidth: 0.50,
                                fieldLabel: 'Email',
                                name: 'VendorEmail',
                                vtype: 'email'
                            }, {
                                xtype: 'numericfield',
                                margin: '0 0 0 5',
                                columnWidth: 0.5,
                                name: 'VendorPctCommission',
                                labelAlign: 'top',
                                fieldLabel: 'Commission %',
                                fieldStyle: 'text-align: right;',
                                alwaysDecimals: true,
                                hideTrigger: true,
                                useThousandSeparator: true,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                thousandSeparator: ',',
                                selectOnFocus: true,
                            }, {
                                xtype: 'textfield',
                                columnWidth: 0.50,
                                fieldLabel: 'Phone',
                                name: 'VendorPhone',
                                vtype: 'phone'
                            }, {
                                xtype: 'textfield',
                                margin: '0 0 0 5',
                                columnWidth: 0.50,
                                fieldLabel: 'Zip',
                                name: 'VendorZip'
                            }, {
                                xtype: 'textfield',
                                columnWidth: 1,
                                fieldLabel: 'Contact',
                                name: 'VendorContact'
                            }, {
                                xtype: 'textfield',
                                columnWidth: 1,
                                fieldLabel: 'Address',
                                name: 'VendorAddress1'
                            }, {
                                margin: '5 0 0 0',
                                xtype: 'textfield',
                                columnWidth: 1,
                                name: 'VendorAddress2'
                            }, {
                                xtype: 'combo',
                                fieldLabel: 'Broker',
                                columnWidth: 1,
                                name: 'BrokerId',
                                fieldStyle: 'font-size: 11px;',
                                displayField: 'BrokerName',
                                valueField: 'BrokerId',
                                store: (storeBrokers) ? storeBrokers : null,
                                queryMode: 'local',
                                minChars: 2,
                                allowBlank: false,
                                forceSelection: true,
                                queryCaching: false,
                                listeners: {
                                    beforequery: function(record) {
                                        record.query = new RegExp(record.query, 'i');
                                        record.forceAll = true;
                                    }
                                }
                            }]
                        }]
                    },
                    // Account Payable
                    {
                        xtype: 'panel',
                        title: 'Account Payables',
                        itemId: 'panelPO',
                        margin: '0 0 10 0',
                        hidden: me.currentRecord.phantom,
                        layout: {
                            type: 'column'
                        },
                        items: [
                            // Totals
                            {
                                xtype: 'container',
                                columnWidth: 1,
                                layout: {
                                    type: 'hbox'
                                },
                                items: [{
                                    margin: '20 10 0 15',
                                    width: 120,
                                    xtype: 'checkbox',
                                    name: 'ShowOnlySelected',
                                    labelSeparator: '',
                                    hideLabel: true,
                                    boxLabel: 'Show only selected',
                                    listeners: {
                                        change: function(field, newValue, oldValue, eOpts) {
                                            var me = field.up('form');
                                            me.onSearchFieldChange();
                                        }
                                    }
                                }, {
                                    xtype: 'numericfield',
                                    width: 100,
                                    name: 'TotalBalance',
                                    labelAlign: 'top',
                                    fieldLabel: 'Total Balance $',
                                    fieldStyle: 'text-align: right; color: green; font-weight: bold',
                                    labelStyle: 'text-align: right;',
                                    alwaysDecimals: true,
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    thousandSeparator: ',',
                                    selectOnFocus: true,
                                    readOnly: true,
                                    editable: false
                                }, {
                                    margin: '20 10 0 15',
                                    width: 150,
                                    xtype: 'checkbox',
                                    name: 'ShowOnlyWithBalance',
                                    labelSeparator: '',
                                    hideLabel: true,
                                    boxLabel: 'Show only with Balance',
                                    listeners: {
                                        change: function(field, newValue, oldValue, eOpts) {
                                            var me = field.up('form');
                                            me.onSearchFieldChange();
                                        }
                                    }
                                }, {
                                    margin: '20 10 0 15',
                                    width: 150,
                                    xtype: 'checkbox',
                                    name: 'ShowOnlyCerradas',
                                    labelSeparator: '',
                                    hideLabel: true,
                                    boxLabel: 'Show only "Cerradas"',
                                    listeners: {
                                        change: function(field, newValue, oldValue, eOpts) {
                                            var me = field.up('form');
                                            me.onSearchFieldChange();
                                        }
                                    }
                                }]
                            },
                            // Grid Invoices
                            {
                                margin: '5 0 0 0',
                                columnWidth: 1,
                                xtype: 'gridpanel',
                                itemId: 'gridPOV',
                                viewConfig: {
                                    stripeRows: true
                                },
                                //title: 'Invoices',
                                store: storePurchasesVendors,
                                minHeight: 480,
                                //maxHeight: 480,
                                columns: [{
                                    xtype: 'checkcolumn',
                                    width: 30,
                                    dataIndex: 'x_Selected',
                                    columnHeaderCheckbox: true,
                                    store: storePurchasesVendors,
                                    sortable: false,
                                    hideable: false,
                                    menuDisabled: true,
                                    listeners: {
                                        checkchange: function(column, rowIndex, checked) {
                                            var grid = this.up('form').down('#gridPOV'),
                                                record = grid.store.getAt(rowIndex);

                                            record.getProxy().setSilentMode(true);
                                            record.save();
                                        }
                                    }
                                }, {
                                    xtype: 'rownumberer',
                                    width: 30
                                }, {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'POVType',
                                    text: 'Type',
                                    width: 40
                                }, {
                                    xtype: 'gridcolumn',
                                    width: 80,
                                    dataIndex: 'POVDate',
                                    text: 'Date',
                                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                                    align: 'center'
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'x_QHeaderReference',
                                    text: 'Reference #'
                                }, {
                                    xtype: 'gridcolumn',
                                    width: 80,
                                    dataIndex: 'POVPaymentNumber',
                                    text: 'Number #'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 70,
                                    dataIndex: 'POVCurrencyRate',
                                    text: 'Rate',
                                    align: 'right',
                                    format: '0,000.00'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 100,
                                    dataIndex: 'POVAmount',
                                    text: 'Amount',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'POVAmountNB',
                                    text: 'Amount/Bs.',
                                    align: 'right',
                                    renderer: Ext.util.Format.bsMoney
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 100,
                                    dataIndex: 'x_InvoiceVendorBalance',
                                    text: 'Balance/$.',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'x_InvoiceVendorBalanceNB',
                                    text: 'Balance/Bs.',
                                    align: 'right',
                                    renderer: Ext.util.Format.bsMoney
                                }],
                                tbar: [{
                                    xtype: 'displayfield',
                                    value: 'Invoices',
                                    fieldStyle: 'font-size: 14px; font-weight: bold;',
                                    width: '50%'
                                }, {
                                    xtype: 'searchfield',
                                    width: '25%',
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
                                    text: 'Pay Selected',
                                    itemId: 'payselected',
                                    handler: function() {
                                        var me = this.up('form');
                                        me.onPaySelectedClick();
                                    }
                                }],
                                //selModel: selModel,
                                selType: 'rowmodel',
                                bbar: new Ext.PagingToolbar({
                                    itemId: 'pagingtoolbar',
                                    store: storePurchasesVendors,
                                    displayInfo: true,
                                    displayMsg: 'Show {0} - {1} of {2}',
                                    emptyMsg: "No records to show",
                                    listeners: {
                                        change: function(pageTool, pageData, eOpts) {
                                            var me = this.up('form');
                                            me.RecalcTotals();
                                        }
                                    }
                                }),
                                listeners: {
                                    'selectionchange': function(view, records) {
                                        var me = this.up('form'),
                                            record = records[0];

                                        // console.log('369', record);
                                        if (record)
                                            me.onSelectionChangePOV(record);
                                        // //     me.down('#payselected').setDisabled(!records.length);
                                    }
                                }
                            },
                            // Grid Details
                            {
                                margin: '5 0 0 0',
                                columnWidth: 1,
                                xtype: 'gridpanel',
                                itemId: 'gridPOVDetail',
                                store: storePOVendorsDetails,
                                minHeight: 150,
                                maxHeight: 150,
                                columns: [{
                                    xtype: 'gridcolumn',
                                    dataIndex: 'POVDetailType',
                                    text: 'Type'
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 0.8,
                                    dataIndex: 'POVDetailDate',
                                    text: 'Date',
                                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                                    align: 'center'
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 0.8,
                                    dataIndex: 'POVDetailPaymentNumber',
                                    text: 'Number #'
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 0.8,
                                    dataIndex: 'POVDetailCurrencyRate',
                                    text: 'Cur. Rate',
                                    align: 'right',
                                    format: '0,000.00'
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 1.5,
                                    dataIndex: 'POVDetailAmount',
                                    text: 'Amount',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney,
                                    summaryType: 'sum'
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 2,
                                    dataIndex: 'POVDetailAmountNB',
                                    text: 'Amount/Bs.',
                                    align: 'right',
                                    renderer: Ext.util.Format.bsMoney,
                                    summaryType: 'sum'
                                }, {
                                    xtype: 'actioncolumn',
                                    width: 25,
                                    items: [{
                                        handler: me.onClickViewDetails,
                                        scope: me,
                                        iconCls: 'app-find',
                                        tooltip: 'view details'
                                    }]
                                }, {
                                    xtype: 'actioncolumn',
                                    width: 25,
                                    items: [{
                                        handler: me.onClickDeleteColumn,
                                        scope: me,
                                        iconCls: 'app-page-delete',
                                        tooltip: 'Delete'
                                    }]
                                }],
                                tbar: [{
                                    xtype: 'displayfield',
                                    itemId: 'displayfieldDetails',
                                    value: 'Details',
                                    fieldStyle: 'font-size: 14px; font-weight: bold;',
                                    width: '20%'
                                }, {
                                    xtype: 'component',
                                    flex: 1
                                }],
                                selType: 'rowmodel'
                            }
                        ]
                    }
                ]
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: 'Save Changes',
                    formBind: true,
                    listeners: {
                        click: {
                            fn: me.onSaveChanges,
                            scope: this
                        }
                    }
                }]
            }],
            listeners: {
                afterrender: {
                    fn: me.onShowWindow,
                    scope: me
                },
                close: {
                    fn: me.onCloseWindow,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onClickViewDetails: function(grid, rowIndex, colIndex) {
        var me = this,
            record = grid.store.getAt(rowIndex);

        me.getEl().mask('Please wait...');
        var storeFiles = new IAMTrading.store.Attachments().load({
            params: {
                PayVendorId: record.data.PayVendorId
            },
            callback: function(records, operation, success) {

                var storePayVendorDetails = new IAMTrading.store.PaymentVendorDetails().load({
                    params: {
                        page: 0,
                        limit: 0,
                        start: 0,
                        PayVendorId: record.data.PayVendorId
                    },
                    callback: function(records, operation, success) {

                        var storePaidInvoices = new IAMTrading.store.viewPaidDetails().load({
                            params: {
                                page: 0,
                                limit: 0,
                                start: 0,
                                PayVendorId: record.data.PayVendorId
                            },
                            callback: function(records, operation, success) {
                                var form = Ext.widget('showdocuments', {
                                    storeFiles: storeFiles,
                                    storePOVDetails: storePayVendorDetails,
                                    storeInvoices: storePaidInvoices
                                });
                                me.getEl().unmask();
                                form.show();
                            }
                        });
                    }
                });
            }
        });
    },

    onShowWindow: function() {
        var me = this;
        if (me.calledFromEditItem) {
            me.down('field[name=VendorName]').setValue(me.callerForm.down('field[name=VendorId]').getRawValue());
        }

        var grid = me.down('#gridPOV');

        if (!me.currentRecord.phantom) {
            var vendorId = me.currentRecord.data.VendorId;
            storePurchasesVendors = new IAMTrading.store.PurchaseOrdersVendors({
                pageSize: 16
            }).load({
                params: {
                    VendorId: vendorId,
                    ShowOnlyCerradas: true
                },
                callback: function() {
                    var init = true,
                        grid = me.down('#gridPOV');

                    grid.reconfigure(this);
                    grid.down('pagingtoolbar').bindStore(this);

                    var record = this.getAt(0);
                    me.onSelectionChangePOV(record);
                    me.RecalcTotals();
                }
            });

        }

        this.down('field[name=VendorName]').focus(true, 200);
    },

    onCloseWindow: function() {
        var me = this,
            record = me.currentRecord;

        me.callerForm.down('gridpanel').getStore().reload();

        if (!record.phantom) {
            Ext.Msg.wait('Wait', 'Clean last selections...');
            Ext.Ajax.request({
                method: 'GET',
                type: 'json',
                url: IAMTrading.GlobalSettings.webApiPath + 'CleanUserVendorSelections',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                params: {
                    VendorId: record.data.VendorId,
                    UserId: IAMTrading.GlobalSettings.getCurrentUserId()
                },
                success: function(rsp) {
                    Ext.Msg.hide();
                }
            });
        }
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

        //record.getProxy().setSilentMode(true);
        record.save({
            success: function(e) {
                var form = me.callerForm,
                    grid = form.down('#gridmain');

                if (!me.calledFromEditItem) {
                    if (!isPhantom) {
                        me.destroy();
                    } else {
                        var newRecord = Ext.create('IAMTrading.model.Vendors');
                        me.loadRecord(newRecord);
                        me.down('field[name=VendorName]').focus(true, 200);
                    }

                    if (grid) {
                        grid.store.reload();
                    }
                } else {
                    me.destroy();
                    //form.show();
                    var fieldVendor = form.down('field[name=VendorId]');
                    fieldVendor.setRawValue(record.data.VendorName);
                    fieldVendor.doRawQuery();
                    fieldVendor.focus(true, 200);

                }
                Ext.Msg.hide();
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

        if (!String.isNullOrEmpty(rawvalue) && field.value === null) {
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
                        field.setRawValue('');
                        field.focus(true, 200);
                    }
                }
            });
        }
    },

    onSearchFieldChange: function() {
        var me = this,
            vendorId = me.currentRecord.data.VendorId,
            field = me.down('#searchfield'),
            fieldValue = field.getRawValue(),
            isOnlySelected = me.down('field[name=ShowOnlySelected]').checked,
            showOnlyWithBalance = me.down('field[name=ShowOnlyWithBalance]').checked,
            showOnlyCerradas = me.down('field[name=ShowOnlyCerradas]').checked,
            grid = me.down('#gridPOV');

        grid.store.removeAll();

        if (!String.isNullOrEmpty(fieldValue)) {
            grid.store.loadPage(1, {
                params: {
                    VendorId: vendorId,
                    ShowOnlySelected: isOnlySelected,
                    ShowOnlyWithBalance: showOnlyWithBalance,
                    ShowOnlyCerradas: showOnlyCerradas,
                    query: fieldValue
                },
                callback: function() {
                    me.down('#pagingtoolbar').bindStore(this);
                    me.RecalcTotals();
                }
            });
        } else {
            grid.store.loadPage(1, {
                params: {
                    VendorId: vendorId,
                    ShowOnlySelected: isOnlySelected,
                    ShowOnlyWithBalance: showOnlyWithBalance,
                    ShowOnlyCerradas: showOnlyCerradas
                },
                callback: function() {
                    me.down('#pagingtoolbar').bindStore(this);
                }
            });
        }
    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        var grid = me.down('#gridPOVDetail');

        Ext.Msg.show({
            title: 'Delete',
            msg: 'Do you want to delete?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    //record.destroy();
                    me.reversePaid(record);
                }
            }
        });
    },

    onSelectionChangePOV: function(record) {
        var me = this;
        gridPOVDetail = me.down('#gridPOVDetail');

        if (record)
            me.down('#displayfieldDetails').setValue('Details of ' + record.data.POVPaymentNumber);

        var storePOVendorsDetails = new IAMTrading.store.POVendorsDetails().load({
            params: {
                POVId: record.data.POVId
            },
            callback: function() {
                gridPOVDetail.reconfigure(storePOVendorsDetails);
            }
        });
    },

    onClickActionColumnPOVDetail: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        this.up('panel').editingPlugin.startEdit(record, 1);
        this.up('panel').editingPlugin.editor.down('field[name=POVDetailDate]').focus(true, 200);
    },

    RecalcTotals: function() {
        var me = this,
            userLevel = IAMTrading.GlobalSettings.getCurrentUserLevel(),
            grid = me.down('#gridPOV'),
            store = grid.store;

        me.down('field[name=TotalBalance]').setValue(store.max('x_TotalBalance'));
    },

    saveDocument: function() {
        var me = this,
            documentType = me.down('field[name=x_DocTypeName]').getRawValue(),
            docTypeID = me.down('field[name=x_DocTypeName]').getValue(),
            currentUser = IAMTrading.GlobalSettings.getCurrentUserId();

        var formPost = new FormData(),
            values = me.currentRecord.data,
            files = me.getEl().down('input[type=file]').dom.files,
            file = (files.length > 0) ? files[files.length - 1] : null; //form.getContentEl().down('input[type=file]')

        // Read in the image file as a binary string.
        reader = new FileReader();

        reader.onloadend = function(e) {
            var dataUrl = e.target.result;

            //var copy = me.getEl().down('input[type=file]').dom.cloneNode(1);
            //formPost.append(copy);

            var b64 = dataUrl.split("base64;")[1];

            formPost.append("VendorId", values.VendorId);
            formPost.append("DocTypeID", docTypeID);
            formPost.append("CurrentUser", currentUser);
            formPost.append("FileName", documentType);
            formPost.append("PDFFile", file, documentType);

            var http = new XMLHttpRequest();

            // Uploading progress handler
            http.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentComplete = (e.loaded / e.total) * 100;
                    console.log(percentComplete.toFixed(0) + '%');
                }
            };

            // Response handler
            http.onreadystatechange = function(e) {
                if (this.readyState === 4) {
                    //console.log(e);
                    //alert(e.currentTarget.responseText);
                    me.down('#data-view').store.reload();
                    Ext.Msg.hide();
                }
            };

            // Error handler
            http.upload.onerror = function(e) {
                //console.log(e.currentTarget.responseText);
                alert(e);
                Ext.Msg.hide();
            };

            // Send form with file using XMLHttpRequest POST request
            http.open('POST', IAMTrading.GlobalSettings.webApiPath + 'attachdocument');

            http.send(formPost);
        };

        reader.readAsDataURL(file);

        me.down('#data-view').store.reload();
    },

    onDataViewDblClick: function(record) {
        window.open('../wa/getattach?id=' + record.data.x_AttachId);
    },

    onDeleteSelectedItems: function() {
        var me = this,
            dv = me.down('#data-view'),
            records = dv.getSelectionModel().selected.items;

        Ext.Array.each(records, function(record, index) {
            record.getProxy().setSilentMode(true);
            record.destroy();
        });

        dv.up('panel').setTitle('(0 items selected)');
    },

    onPaySelectedClick: function() {
        var me = this,
            vendorId = me.down('field[name=VendorId]').getValue(),
            vendorName = me.down('field[name=VendorName]').getValue();

        Ext.Msg.wait('Loading selected', 'Wait');

        var storeSelected = new IAMTrading.store.PurchaseOrdersVendors({
            pageSize: 0
        }).load({
            params: {
                page: 0,
                limit: 0,
                start: 0,
                VendorId: vendorId,
                ShowOnlySelected: true
            },
            callback: function(records, operation, success) {

                if (!success) {
                    Ext.Msg.hide();
                    return;
                }

                if (records.length === 0) {
                    Ext.Msg.alert('Warning', 'You must select at least one document');
                    return;
                }

                var callerForm = me;

                var form = new IAMTrading.view.PaySelectedPOV({
                    storePOV: storeSelected,
                    title: 'Payment - ' + vendorName,
                    callerForm: callerForm
                });

                form.center();
                form.show();
                Ext.Msg.hide();
            }
        });

    },

    reversePaid: function(record) {
        var me = this;

        me.getEl().mask('Reversing...');

        Ext.Ajax.request({
            method: 'POST',
            type: 'json',
            url: IAMTrading.GlobalSettings.webApiPath + 'ReversePaid',
            headers: {
                'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
            },
            params: {
                PayVendorId: record.data.PayVendorId,
                CurrentUser: IAMTrading.GlobalSettings.getCurrentUserId()
            },
            jsonData: [],
            success: function(rsp) {
                var data = Ext.JSON.decode(rsp.responseText),
                    gridHeader = me.down("#gridPOV"),
                    gridDetail = me.down("#gridPOVDetail"),
                    POVId = record.data.POVId;
                gridDetail.getStore().reload({
                    callback: function() {
                        gridHeader.getStore().reload({
                            callback: function() {
                                var selIndex = -1;
                                if (this.getCount() > 0) {
                                    selIndex = this.find("POVId", POVId);
                                    if (selIndex > -1)
                                        gridHeader.getSelectionModel().select(selIndex);
                                }
                                me.getEl().unmask();
                            }
                        });
                    }
                });

            }
        });
    }
});
