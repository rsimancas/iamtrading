Ext.define('IAMTrading.view.PaySelectedPOV', {
    extend: 'Ext.form.Panel',
    alias: 'widget.payselectedpov',
    modal: true,
    width: 1388,
    layout: {
        type: 'column'
    },
    title: 'Payment',
    closable: true,
    floating: true,
    callerForm: null,
    calledFromEditItem: false,
    currentRecord: null,

    initComponent: function() {

        var me = this;

        var rowEditing = me.loadPluginEditing();

        var storePaymentModes = new IAMTrading.store.PaymentModes({
            pageSize: 0
        }).load();

        var storeBankAccounts = new IAMTrading.store.BankAccounts({
            pageSize: 0
        }).load();

        var storePayVendorDetails = new IAMTrading.store.PaymentVendorDetails({
            autoLoad: false
        });

        var storeFiles = new IAMTrading.store.Attachments().load({
            params: {
                CurrentUser: IAMTrading.GlobalSettings.getCurrentUserId(),
                Dirty: true
            }
        });

        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{caption}">',
            '<div class="thumb"><img src="{x_AttachSrc}" title="{AttachName}"></div>',
            '<span class="x-editable">{AttachName}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        );

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'none',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items: [
                // Left Panel
                {
                    xtype: 'container',
                    columnWidth: 0.8,
                    items: [
                        // Invoices
                        {
                            xtype: 'fieldset',
                            title: 'Invoices to Pay',
                            columnWidth: 1,
                            margin: '0 10 10 10',
                            padding: '10 10 0 10',
                            layout: {
                                type: 'column'
                            },
                            items: [{
                                columnWidth: 1,
                                xtype: 'gridpanel',
                                itemId: 'gridPOV',
                                scrollable: true,
                                store: me.storePOV,
                                viewConfig: {
                                    stripeRows: true
                                },
                                minHeight: 350,
                                maxHeight: 350,
                                features: [{
                                    ftype: 'summary'
                                }],
                                columns: [{
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
                                    renderer: Ext.util.Format.bsMoney,
                                    summaryType: 'count',
                                    summaryRenderer: function(value, summaryData, dataIndex) {
                                        return Ext.String.format('Totals', value, value !== 1 ? value : 0);
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 100,
                                    dataIndex: 'x_InvoiceVendorBalance',
                                    text: 'Balance/$.',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney,
                                    summaryType: 'sum',
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'x_InvoiceVendorBalance',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        decimalPrecision: 2,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;',
                                        selectOnFocus: true
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'x_InvoiceVendorBalanceNB',
                                    text: 'Balance/Bs.',
                                    align: 'right',
                                    renderer: Ext.util.Format.bsMoney,
                                    summaryType: 'sum'
                                }],
                                selType: 'cellmodel',
                                plugins: [
                                    Ext.create('Ext.grid.plugin.CellEditing', {
                                        clicksToEdit: 1,
                                        listeners: {
                                            validateedit: function(editor, e) {
                                                if (e.value > e.record.data[e.field]) {
                                                    e.cancel = true;
                                                    //e.record.data[e.field] = e.value;
                                                    Ext.Msg.alert("Warning", "input value can't be greater than balance");
                                                } else {
                                                    e.record.data.x_InvoiceVendorBalanceNB = e.value * e.record.data.POVCurrencyRate;
                                                }
                                            }
                                        }
                                    })
                                ],
                            }]
                        },
                        // Payment Modes
                        {
                            xtype: 'fieldset',
                            title: 'Payment Method',
                            columnWidth: 1,
                            margin: '0 10 10 10',
                            padding: '10 10 0 10',
                            layout: {
                                type: 'column'
                            },
                            items: [{
                                columnWidth: 1,
                                xtype: 'gridpanel',
                                itemId: 'gridPayment',
                                minHeight: 250,
                                //title: 'Roles',
                                features: [{
                                    ftype: 'summary'
                                }],
                                store: storePayVendorDetails,
                                columns: [{
                                    xtype: 'gridcolumn',
                                    dataIndex: 'x_PayModeDescription',
                                    width: 120,
                                    text: 'Method',
                                    editor: {
                                        xtype: 'combo',
                                        displayField: 'PayModeDescription',
                                        valueField: 'PayModeID',
                                        name: 'PayModeID',
                                        queryMode: 'local',
                                        typeAhead: true,
                                        minChars: 2,
                                        allowBlank: false,
                                        forceSelection: true,
                                        emptyText: 'choose',
                                        msgTarget: 'none',
                                        autoSelect: true,
                                        selectOnFocus: true,
                                        store: storePaymentModes,
                                        beforequery: function(record) {
                                            record.query = new RegExp(record.query, 'i');
                                            record.forceAll = true;
                                        }
                                    }
                                }, {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'BankAccount',
                                    flex: 2,
                                    text: 'Bank/Account',
                                    editor: {
                                        xtype: 'combo',
                                        displayField: 'BankAccount',
                                        valueField: 'AccountID',
                                        name: 'AccountID',
                                        queryMode: 'local',
                                        typeAhead: true,
                                        minChars: 2,
                                        allowBlank: true,
                                        forceSelection: true,
                                        emptyText: 'choose',
                                        msgTarget: 'none',
                                        autoSelect: true,
                                        selectOnFocus: true,
                                        matchFieldWidth: false,
                                        listConfig: {
                                            loadingText: 'Loading...',
                                            width: 300
                                        },
                                        store: storeBankAccounts,
                                        beforequery: function(record) {
                                            record.query = new RegExp(record.query, 'i');
                                            record.forceAll = true;
                                        }
                                    }
                                }, {
                                    xtype: 'gridcolumn',
                                     width: 100,
                                    dataIndex: 'PayVendorDetailDate',
                                    text: 'Date',
                                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                                    align: 'center',
                                    editor: {
                                        xtype: 'datefield',
                                        name: 'PayVendorDetailDate',
                                        allowBlank: false,
                                        format: 'd/m/Y',
                                        msgTarget: 'none',
                                        listeners: {
                                            change: function(field, newValue, oldValue, eOpts) {
                                                var me = field.up('form'),
                                                    fieldRate = me.down('field[name=PayVendorDetailCurrencyRate]');

                                                if (newValue !== oldValue) {
                                                    Ext.Msg.wait('Wait', 'Loading Rate of Date');
                                                    Ext.Ajax.request({
                                                        method: 'GET',
                                                        type: 'json',
                                                        headers: {
                                                            'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                                                        },
                                                        params: {
                                                            dateTo: newValue
                                                        },
                                                        url: IAMTrading.GlobalSettings.webApiPath + 'GetRateOfDate',
                                                        success: function(rsp) {
                                                            var data = Ext.JSON.decode(rsp.responseText),
                                                                rate = (data) ? data.data : fieldRate.getValue();

                                                            fieldRate.setValue(rate);
                                                            Ext.Msg.hide();
                                                        },
                                                        failure: function() {
                                                            Ext.Msg.hide();
                                                        }
                                                    });
                                                }
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 2,
                                    dataIndex: 'PayVendorDetailComments',
                                    text: 'Comments',
                                    editor: {
                                        xtype: 'textfield',
                                        name: 'PayVendorDetailComments',
                                        msgTarget: 'none',
                                        allowBlank: true
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 100,
                                    dataIndex: 'PayVendorDetailCurrencyRate',
                                    text: 'Cur. Rate',
                                    align: 'right',
                                    format: '0,000.00',
                                    summaryType: 'count',
                                    summaryRenderer: function(value, summaryData, dataIndex) {
                                        return Ext.String.format('Totals', value, value !== 1 ? value : 0);
                                    },
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'PayVendorDetailCurrencyRate',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        //currencySymbol:'$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        msgTarget: 'none',
                                        fieldStyle: 'text-align: right;',
                                        listeners: {
                                            blur: function(field) {
                                                var form = field.up('panel');
                                                form.onFieldChange();
                                            },
                                            change: function(field, newValue, oldValue, eOpts) {
                                                if (document.activeElement.name !== field.name) return;

                                                var form = field.up('form'),
                                                    amount = form.down('field[name=PayVendorDetailAmount]').getValue();

                                                field.next().next().setValue(newValue * amount);
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'PayVendorDetailAmount',
                                    text: 'Amount',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney,
                                    summaryType: 'sum',
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'PayVendorDetailAmount',
                                        hideTrigger: true,
                                        msgTarget: 'none',
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: '$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;',
                                        selectOnFocus: true,
                                        listeners: {
                                            blur: function(field) {
                                                var form = field.up('panel');
                                                form.onFieldChange();
                                            },
                                            change: function(field, newValue, oldValue, eOpts) {
                                                if (document.activeElement.name !== field.name) return;

                                                var form = field.up('form'),
                                                    tasa = form.down('field[name=PayVendorDetailCurrencyRate]').getValue();

                                                field.next().setValue(newValue * tasa);
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'PayVendorDetailAmountNB',
                                    text: 'Amount/Bs.',
                                    align: 'right',
                                    msgTarget: 'none',
                                    renderer: Ext.util.Format.bsMoney,
                                    summaryType: 'sum',
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'PayVendorDetailAmountNB',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: 'Bs.',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;',
                                        selectOnFocus: true,
                                        listeners: {
                                            blur: function(field) {
                                                var form = field.up('panel');
                                                form.onFieldChange();
                                            },
                                            change: function(field, newValue, oldValue, eOpts) {
                                                if (document.activeElement.name !== field.name) return;

                                                var form = field.up('form'),
                                                    fieldAmount = form.down('field[name=PayVendorDetailAmount]'),
                                                    tasa = form.down('field[name=PayVendorDetailCurrencyRate]').getValue();

                                                fieldAmount.setValue(Math.round(newValue / tasa, 2));
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'actioncolumn',
                                    width: 35,
                                    items: [{
                                        handler: me.onClickActionColumnPOV,
                                        iconCls: 'app-grid-edit',
                                        //iconCls: 'x-form-search-trigger',
                                        tooltip: 'Edit'
                                    }]
                                }],
                                tbar: [{
                                    xtype: 'component',
                                    flex: 1
                                }, {
                                    text: 'Add',
                                    itemId: 'addline',
                                    handler: function() {
                                            var me = this.up('panel').up('panel');
                                            rowEditing.cancelEdit();

                                            var grid = this.up('gridpanel'),
                                                currencyRate = Ext.getCmp('app_viewport').down('#dolartoday').getValue(),
                                                count = grid.store.getCount();

                                            // Create a model instance
                                            var r = Ext.create('IAMTrading.model.PaymentVendorDetails', {
                                                PayVendorDetailCurrencyRate: currencyRate,
                                                PayVendorDetailAmount: 0,
                                                PayVendorDetailAmountNB: 0
                                            });

                                            grid.store.insert(count, r);
                                            rowEditing.startEdit(r, 0);
                                            rowEditing.editor.down('field[name=PayModeID]').focus(true, 200);
                                        } //,
                                        //disabled:true
                                }, {
                                    itemId: 'removeline',
                                    text: 'Delete',
                                    handler: function() {
                                        var grid = this.up('gridpanel');
                                        var sm = grid.getSelectionModel();

                                        rowEditing.cancelEdit();

                                        selection = sm.getSelection();

                                        if (selection) {
                                            grid.store.remove(selection[0]);
                                        }
                                    },
                                    disabled: true
                                }],
                                selType: 'rowmodel',
                                plugins: [rowEditing],
                                listeners: {
                                    'selectionchange': function(view, records) {
                                        this.down('#removeline').setDisabled(!records.length);
                                    }
                                }
                            }]
                        }
                    ]
                },
                // Right Panel
                {
                    xtype: 'container',
                    margin: '0 5 0 5',
                    columnWidth: 0.2,
                    items: [{
                        xtype: 'fieldset',
                        title: 'Documents',
                        items: [{
                            margin: '10 5 10 0',
                            xtype: 'container',
                            columnWidth: 1,
                            layout: 'hbox',
                            items: [{
                                xtype: 'component',
                                flex: 0.8
                            }, {
                                margin: '0 0 5 5',
                                xtype: 'filefield',
                                name: 'image',
                                buttonOnly: true,
                                labelWidth: 50,
                                allowBlank: true,
                                anchor: '100%',
                                buttonText: 'Attach...',
                                listeners: {
                                    afterrender: function(cmp) {
                                        cmp.fileInputEl.set({
                                            accept: 'application/pdf;',
                                            capture: ''
                                        });
                                    },
                                    change: function(field, value, eOpts) {
                                        var me = this.up('form');
                                        if (field.regex.test(value))
                                            me.saveFile();
                                    }
                                },
                                regex: (/.(pdf)$/i),
                                regexText: 'Only pdf files allowed for upload',
                                msgTarget: 'side'
                            }, {
                                margin: '0 0 0 5',
                                xtype: 'button',
                                itemId: 'btnDelete',
                                text: 'Delete Selected',
                                disabled: true,
                                handler: function() {
                                    var me = this.up('form');
                                    Ext.Msg.show({
                                        title: 'Delete',
                                        msg: 'Do you want to delete the selected items?',
                                        buttons: Ext.Msg.YESNO,
                                        icon: Ext.Msg.QUESTION,
                                        fn: function(btn) {
                                            if (btn === "yes") {
                                                me.onDeleteSelectedItems();
                                            }
                                        }
                                    });
                                }
                            }]
                        }, {
                            cls: 'data-view',
                            collapsible: false,
                            columnWidth: 1,
                            title: '(0 items selected)',
                            items: [
                                Ext.create('Ext.view.View', {
                                    itemId: 'data-view',
                                    store: storeFiles,
                                    tpl: imageTpl,
                                    multiSelect: true,
                                    height: 435,
                                    minHeight: 435,
                                    trackOver: true,
                                    overItemCls: 'x-item-over',
                                    itemSelector: 'div.thumb-wrap',
                                    emptyText: 'No items to display',
                                    plugins: [
                                        Ext.create('Ext.ux.DataView.DragSelector', {}),
                                        Ext.create('Ext.ux.DataView.LabelEditor', {
                                            dataIndex: 'AttachName',
                                            listeners: {
                                                saved: function(record) {
                                                    Ext.Msg.wait('Saving Record...', 'Wait');
                                                    record.getProxy().setSilentMode(true);
                                                    record.save({
                                                        success: function(record, operation) {
                                                            Ext.Msg.hide();
                                                        },
                                                        failure: function(record, operation) {
                                                            Ext.Msg.hide();
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    ],
                                    prepareData: function(data) {
                                        Ext.apply(data, {
                                            shortName: Ext.util.Format.ellipsis(data.caption, 15),
                                            sizeString: Ext.util.Format.fileSize(data.size),
                                            dateString: Ext.util.Format.date(data.lastmod, "m/d/Y g:i a")
                                        });
                                        return data;
                                    },
                                    listeners: {
                                        selectionchange: function(dv, nodes) {
                                            var l = nodes.length,
                                                s = l !== 1 ? 's' : '',
                                                btnDelete = this.up('form').down('#btnDelete');

                                            btnDelete.setDisabled(l === 0);

                                            this.up('panel').setTitle('(' + l + ' item' + s + ' selected)');
                                        },
                                        itemdblclick: function(dv, record, item, index, e, eOpts) {
                                            var me = this.up('form');
                                            me.onDataViewDblClick(record);
                                        }
                                    }
                                })
                            ]
                        }]
                    }]
                }
            ],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [{
                    xtype: 'component',
                    flex: 1
                }, {
                    xtype: 'button',
                    text: 'Complete Payment',
                    formBind: false,
                    listeners: {
                        click: {
                            fn: me.onSaveChanges,
                            scope: this
                        }
                    }
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

    onShowWindow: function() {},

    loadPluginEditing: function() {
        return new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            listeners: {
                beforeedit: {
                    delay: 100,
                    fn: function(item, e) {
                        this.getEditor().onFieldChange();
                    }
                },
                cancelEdit: {
                    fn: function(rowEditing, context) {
                        var grid = this.editor.up("gridpanel");
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (context.record.phantom) {
                            grid.store.remove(context.record);
                        }
                    }
                },
                edit: {
                    fn: function(editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom,
                            payMode =  this.editor.down('field[name=PayModeID]').getRawValue(),
                            factor = -1;

                        if(payMode === "DEBIT NOTE") factor = 1;

                        record.set('PayVendorDetailAmount', Math.abs(record.data.PayVendorDetailAmount) * factor);
                        record.set('PayVendorDetailAmountNB', Math.abs(record.data.PayVendorDetailAmountNB) * factor);
                        record.set('x_PayModeDescription', this.editor.down('field[name=PayModeID]').getRawValue());
                        record.set('BankAccount', this.editor.down('field[name=AccountID]').getRawValue());
                        record.phantom = false;
                    }
                }
            }
        });
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            curRec = me.callerForm.currentRecord;

        var dataToSend = {
            POVList: [],
            PaidDetail: [],
            Files: []
        };

        if (!me.checkBalance(dataToSend)) return;

        Ext.Msg.wait('Please wait....', 'Wait');

        Ext.Ajax.request({
            method: 'POST',
            type: 'json',
            url: IAMTrading.GlobalSettings.webApiPath + 'PaySelected',
            headers: {
                'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
            },
            params: {
                VendorId: curRec.data.VendorId,
                CurrentUser: IAMTrading.GlobalSettings.getCurrentUserId()
            },
            jsonData: dataToSend,
            success: function(rsp) {
                var data = Ext.JSON.decode(rsp.responseText),
                    grid = me.callerForm.down("#gridPOV");
                grid.getStore().reload({
                    callback: function() {
                        grid.getSelectionModel().select(0);
                        Ext.Msg.hide();
                        me.destroy();
                    }
                });
            }
        });
    },

    checkBalance: function(dataToSend) {
        var me = this,
            gridPOV = me.down('#gridPOV'),
            gridPayment = me.down('#gridPayment');

        var totalToPaid = parseFloat(gridPOV.store.sum('x_InvoiceVendorBalance').toFixed(2)),
            totalPayment = parseFloat(gridPayment.store.sum('PayVendorDetailAmount').toFixed(2));

        totalPayment = Math.abs(totalPayment) * -1;
        totalToPaid = Math.abs(totalToPaid);

        if ((totalToPaid + totalPayment) !== 0) {
            Ext.Msg.alert("Warning", "The paid and balance must be equal");
            return false;
        }

        var curRate = 0;

        Ext.each(gridPayment.store.data.items, function(item) {
            dataToSend.PaidDetail.push(item.data);
            curRate = item.data.PayVendorDetailCurrencyRate;
        });

        Ext.each(gridPOV.store.data.items, function(item) {
            item.data.x_InvoiceVendorBalanceNB = item.data.x_InvoiceVendorBalance * curRate;
            dataToSend.POVList.push(item.data);
        });

        Ext.each(me.down('#data-view').store.data.items, function(item) {
            dataToSend.Files.push(item.data);
        });

        return true;
    },

    saveFile: function() {
        var me = this,
            currentUser = IAMTrading.GlobalSettings.getCurrentUserId();

        var formPost = new FormData(),
            files = me.getEl().down('input[type=file]').dom.files,
            file = (files.length > 0) ? files[files.length - 1] : null;

        // Read in the image file as a binary string.
        reader = new FileReader();

        me.getEl().mask('Please wait...');

        reader.onloadend = function(e) {
            var dataUrl = e.target.result;

            formPost.append("Dirty", true);
            formPost.append("CurrentUser", currentUser);
            formPost.append("File", file, file.name);

            var http = new XMLHttpRequest();

            // Uploading progress handler
            http.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentComplete = (e.loaded / e.total) * 100;
                    //console.log(percentComplete.toFixed(0) + '%');
                    me.getEl().mask('Completed ' + percentComplete.toFixed(0) + '%');
                }
            };

            // Response handler
            http.onreadystatechange = function(e) {
                if (this.readyState === 4) {
                    //console.log(e);
                    //alert(e.currentTarget.responseText);
                    me.down('#data-view').store.reload();
                    me.getEl().unmask();
                }
            };

            // Error handler
            http.upload.onerror = function(e) {
                //console.log(e.currentTarget.responseText);
                alert(e);
                Ext.Msg.hide();
            };

            // Send form with file using XMLHttpRequest POST request
            http.open('POST', IAMTrading.GlobalSettings.webApiPath + 'attach');

            http.send(formPost);
        };

        reader.readAsDataURL(file);

        me.down('#data-view').store.reload();
    },

    onDataViewDblClick: function(record) {
        window.open('../wa/getattach?id=' + record.data.AttachId, '_blank', false);
    },

    onDeleteSelectedItems: function() {
        var me = this,
            dv = me.down('#data-view'),
            records = dv.getSelectionModel().selected.items;

        for (var i = records.length; i > 0; i--) {
            var record = records[i - 1];
            record.getProxy().setSilentMode(true);
            record.destroy();
        }

        dv.up('panel').setTitle('(0 items selected)');
    }
});
