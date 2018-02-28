Ext.define('IAMTrading.view.ShowDocuments', {
    extend: 'Ext.form.Panel',
    alias: 'widget.showdocuments',
    modal: true,
    width: 1280,
    minHeight: 650,
    /*layout: {
        type: 'absolute'
    },*/
    layout: 'column',
    title: 'Vendor',
    closable: true,

    floating: true,
    callerForm: "",
    calledFromEditItem: false,
    currentRecord: null,
    storeFiles: null,
    storePOVDetails: null,
    storeInvoices: null,

    initComponent: function() {

        var me = this;

        var storeFiles = me.storeFiles,
            storePOVDetails = me.storePOVDetails,
            storeInvoices = me.storeInvoices;

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
                labelWidth: 60,
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items: [
                // Left Panel
                {
                    xtype: 'container',
                    margin: '0 10 0 0',
                    columnWidth: 0.85,
                    items: [
                        // Payment Methods
                        {
                            xtype: 'fieldset',
                            title: 'Payment Method(s)',
                            columnWidth: 1,
                            margin: '0 5 10 10',
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
                                store: storePOVDetails,
                                columns: [{
                                    xtype: 'gridcolumn',
                                    dataIndex: 'x_PayModeDescription',
                                    width: 70,
                                    text: 'Method'
                                }, {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'BankAccount',
                                    flex: 1,
                                    text: 'Bank/Account'
                                }, {
                                    xtype: 'gridcolumn',
                                     width: 80,
                                    dataIndex: 'PayVendorDetailDate',
                                    text: 'Date',
                                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                                    align: 'center'
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'PayVendorDetailComments',
                                    text: 'Comments'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 80,
                                    dataIndex: 'PayVendorDetailCurrencyRate',
                                    text: 'Cur. Rate',
                                    align: 'right',
                                    format: '0,000.00',
                                    summaryType: 'count',
                                    summaryRenderer: function(value, summaryData, dataIndex) {
                                        return Ext.String.format('Totals', value, value !== 1 ? value : 0);
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 100,
                                    dataIndex: 'PayVendorDetailAmount',
                                    text: 'Amount',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney,
                                    summaryType: 'sum'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 100,
                                    dataIndex: 'PayVendorDetailAmountNB',
                                    text: 'Amount/Bs.',
                                    align: 'right',
                                    renderer: Ext.util.Format.bsMoney,
                                    summaryType: 'sum'
                                }]
                            }]
                        },
                        // Paid Documents
                        {
                            xtype: 'fieldset',
                            title: 'Paid Invoice(s)',
                            columnWidth: 1,
                            margin: '0 10 10 10',
                            padding: '10 10 0 10',
                            layout: {
                                type: 'column'
                            },
                            items: [{
                                columnWidth: 1,
                                xtype: 'gridpanel',
                                itemId: 'gridInvoice',
                                minHeight: 250,
                                maxHeight: 250,
                                features: [{
                                    ftype: 'summary'
                                }],
                                store: storeInvoices,
                                columns: [{
                                    xtype: 'gridcolumn',
                                    dataIndex: 'InvoiceNum',
                                    width: 80,
                                    text: 'Invoice Num.'
                                }, {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'QHeaderReference',
                                    width: 120,
                                    text: 'Quote Reference'
                                }, {
                                    xtype: 'gridcolumn',
                                    width: 80,
                                    dataIndex: 'PayVendorDetailReference',
                                    text: 'Reference #'
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 1,
                                    dataIndex: 'CustName',
                                    text: 'Customer'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 80,
                                    dataIndex: 'DetailCurrencyRate',
                                    text: 'Cur. Rate',
                                    align: 'right',
                                    format: '0,000.00',
                                    summaryType: 'count',
                                    summaryRenderer: function(value, summaryData, dataIndex) {
                                        return Ext.String.format('Totals', value, value !== 1 ? value : 0);
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'DetailAmount',
                                    text: 'Paid Amount/$',
                                    align: 'right',
                                    format: '0,000.00',
                                    summaryType: 'sum'
                                }, {
                                    xtype: 'numbercolumn',
                                    width: 120,
                                    dataIndex: 'DetailAmountNB',
                                    text: 'Paid Amount/Bs.',
                                    align: 'right',
                                    format: '0,000.00',
                                    summaryType: 'sum'
                                }]
                            }]
                        }
                    ]
                },
                // Right Panel data view
                {
                    xtype: 'container',
                    margin: '0 10 0 5',
                    columnWidth: 0.15,
                    items: [{
                        xtype: 'fieldset',
                        title: 'Documents',
                        items: [/*{
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
                        }, */{
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
                                    height: 505,
                                    trackOver: true,
                                    overItemCls: 'x-item-over',
                                    itemSelector: 'div.thumb-wrap',
                                    emptyText: 'No images to display',
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
                                                s = l !== 1 ? 's' : '';
                                                //btnDelete = this.up('form').down('#btnDelete');

                                            //btnDelete.setDisabled(l === 0);

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
                    text: 'Close',
                    formBind: true,
                    listeners: {
                        click: {
                            fn: me.onClickCloseButton,
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

    onClickCloseButton: function() {
        this.destroy();
    },

    onShowWindow: function() {
        var me = this;
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
        window.open('../wa/getattach?id=' + record.data.AttachId, record.data.AttachName, true);
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
    }
});
