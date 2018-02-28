Ext.define('IAMTrading.view.EditVendorQuote', {
    extend: 'Ext.form.Panel',
    alias: 'widget.EditVendorQuote',
    modal: true,
    width: parseInt(screen.width * 0.70),
    height: parseInt(screen.height * 0.60),
    layout: 'absolute',
    title: 'Vendor Quote',
    closable: true,
    floating: true,
    callerForm: null,
    currentRecord: null,

    initComponent: function() {

        Ext.require([
            'IAMTrading.view.ShowImage'
        ]);

        var me = this,
            windowWidth = parseInt(screen.width * 0.70),
            windowHeight = parseInt(screen.height * 0.60);

        var storeItems = null;

        var rowItemsEditingPlugin = me.loadItemsEditingPluging();

        var vendorQuoteId = (me.currentRecord) ? me.currentRecord.data.VendorQuoteId : 0;

        var storeDocumentTypes = new IAMTrading.store.DocumentTypes({
            autoLoad: false
        }).load({
            params: {
                page: 0,
                limit: 0,
                start: 0
            }
        });
        var storeDocuments = new IAMTrading.store.Documents({
            autoLoad: false
        });
        var storeCurrencies = new IAMTrading.store.CurrencyRates({
            autoLoad: false
        }).load({
            params: {
                grouped: 1,
                page: 0,
                limit: 0,
                start: 0
            }
        });

        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{caption}">',
            '<div class="thumb"><img src="images/pdf-icon.png" title="{DocDesc}"></div>',
            '<span class="x-editable">{DocDesc}</span></div>',
            '</tpl>',
            '<div class="x-clear"></div>'
        );

        if (vendorQuoteId > 0) {
            storeDocuments.load({
                params: {
                    VendorQuoteId: vendorQuoteId
                }
            });
        }

        var storeVQDetails = new IAMTrading.store.VendorQuotesDetail().load({
            params: {
                fieldFilters: JSON.stringify({
                    fields: [
                        { name: 'VendorQuoteId', value: vendorQuoteId, type: 'int' }
                    ]
                }),
                page: 0,
                start: 0,
                limit: 0
            }
        });

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 60,
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            // Tab Panel
            items: [{
                xtype: 'tabpanel',
                columnWidth: 1,
                margin: '5 5 5 5',
                activeTab: 0,
                items: [
                    // General Information
                    {
                        xtype: 'panel',
                        title: 'General Information',
                        itemId: 'panelgeneral',
                        margin: '0 0 10 0',
                        layout: {
                            type: 'fit'
                        },
                        items: [{
                            xtype: 'fieldcontainer',
                            margin: '0 10 10 10',
                            itemId: 'mainContainer',
                            layout: {
                                type: 'column'
                            },
                            items: [{
                                    xtype: 'hidden',
                                    name: 'VendorQuoteId'
                                },
                                // Reference
                                {
                                    xtype: 'textfield',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Reference',
                                    name: 'VendorQuoteReference',
                                    allowBlank: false,
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    }
                                },
                                // Date
                                {
                                    xtype: 'datefield',
                                    margin: '0 0 0 5',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Date',
                                    name: 'VendorQuoteDate',
                                    allowBlank: false,
                                    format: 'd/m/Y'
                                },
                                // Currency
                                {
                                    xtype: 'combo',
                                    margin: '0 0 0 5',
                                    columnWidth: 0.25,
                                    displayField: 'CurrencyCode',
                                    valueField: 'CurrencyId',
                                    fieldLabel: 'Currency',
                                    name: 'CurrencyId',
                                    queryMode: 'local',
                                    typeAhead: true,
                                    minChars: 1,
                                    forceSelection: true,
                                    enableKeyEvents: true,
                                    autoSelect: true,
                                    selectOnFocus: true,
                                    //value: "USD",
                                    allowBlank: false,
                                    store: storeCurrencies,
                                    tpl: Ext.create('Ext.XTemplate',
                                        '<tpl for=".">',
                                        '<div class="x-boundlist-item" >{CurrencyCode} {CurrencyRate:number("0,000.00")}</div>',
                                        '</tpl>')
                                },
                                // Folio
                                // Referemne
                                {
                                    xtype: 'textfield',
                                    columnWidth: 0.25,
                                    margin: '0 0 0 5',
                                    fieldLabel: 'Folio',
                                    name: 'VendorQuoteFolio',
                                    allowBlank: false,
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    }
                                },
                                // Vendors
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Vendor',
                                    columnWidth: 1,
                                    name: 'VendorId',
                                    fieldStyle: 'font-size: 11px;',
                                    displayField: 'VendorName',
                                    valueField: 'VendorId',
                                    queryMode: 'remote',
                                    pageSize: 8,
                                    minChars: 2,
                                    allowBlank: true,
                                    forceSelection: false,
                                    selectOnFocus: true,
                                    triggerAction: '',
                                    queryBy: 'VendorName',
                                    queryCaching: false, // set for after add a new customer, this control recognize the new customer added
                                    enableKeyEvents: true,
                                    matchFieldWidth: false,
                                    listConfig: {
                                        width: 450
                                    },
                                    emptyText: 'Choose Vendor',
                                    listeners: {
                                        buffer: 100,
                                        blur: {
                                            fn: me.onVendorBlur,
                                            scope: this
                                        }
                                    },
                                    store: new IAMTrading.store.Vendors()
                                },
                                // Grid Quote Details
                                {
                                    margin: '10 10 10 10',
                                    title: 'Products',
                                    xtype: 'gridpanel',
                                    itemId: 'gridVQDetails',
                                    store: storeVQDetails,
                                    //title: 'Detail',
                                    columnWidth: 1,
                                    minHeight: parseInt(windowHeight * 0.50),
                                    maxHeight: parseInt(windowHeight * 0.50),
                                    features: [{
                                        ftype: 'summary'
                                    }],
                                    columns: [{
                                        xtype: 'rownumberer',
                                        width: 30
                                    }, {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        dataIndex: 'ItemName',
                                        text: 'Product',
                                        editor: {
                                            xtype: 'combo',
                                            name: 'ItemId',
                                            displayField: 'ItemName',
                                            valueField: 'ItemId',
                                            queryMode: 'remote',
                                            pageSize: 8,
                                            minChars: 2,
                                            allowBlank: true,
                                            forceSelection: false,
                                            selectOnFocus: true,
                                            triggerAction: '',
                                            queryBy: 'ItemName',
                                            queryCaching: false,
                                            enableKeyEvents: true,
                                            matchFieldWidth: false,
                                            listConfig: {
                                                width: parseInt(windowWidth * 0.7)
                                            },
                                            tpl: Ext.create('Ext.XTemplate',
                                                '<tpl for=".">',
                                                '<div class="x-boundlist-item" ><strong>{ItemNumSupplier}</strong> <strong>{ItemGYCode}</strong> {ItemName}</div>',
                                                '</tpl>'),
                                            emptyText: 'choose item',
                                            listeners: {
                                                buffer: 100,
                                                select: function(combo, records, eOpts) {
                                                    var rowEditForm = combo.up('form'),
                                                        contextRecord = rowEditForm.context.record;

                                                    contextRecord.set('ItemNameSupplier', records[0].data.ItemNameSupplier);
                                                    contextRecord.set('ItemGYCode', records[0].data.ItemGYCode);
                                                    contextRecord.set('ItemNumSupplier', records[0].data.ItemNumSupplier);
                                                }
                                            },
                                            store: storeItems
                                        }
                                    }, {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        dataIndex: 'ItemNameSupplier',
                                        text: 'Supplier Name'
                                    }, {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        dataIndex: 'ItemNumSupplier',
                                        text: 'Part #'
                                    }, {
                                        xtype: 'gridcolumn',
                                        flex: 1,
                                        dataIndex: 'ItemGYCode',
                                        text: 'Customer Code'
                                    }, {
                                        xtype: 'actioncolumn',
                                        width: 30,
                                        items: [{
                                            tooltip: 'Edit',
                                            handler: me.onClickEditActionColumn,
                                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                                return 'xf040@FontAwesome';
                                            }
                                        }]
                                    }, {
                                        xtype: 'actioncolumn',
                                        width: 30,
                                        items: [{
                                            handler: me.onClickDeleteColumn,
                                            scope: me,
                                            tooltip: 'Delete',
                                            getGlyph: function(itemScope, rowIdx, colIdx, item, rec) {
                                                return 'xf014@FontAwesome';
                                            }
                                        }]
                                    }],
                                    selType: 'rowmodel',
                                    plugins: [rowItemsEditingPlugin],
                                    // Grid Detail Toolbar
                                    tbar: [{
                                        xtype: 'component',
                                        flex: 1
                                    }, {
                                        itemId: 'addline',
                                        xtype: 'button',
                                        text: 'New Line',
                                        tooltip: 'Insert (Ins)',
                                        handler: function() {
                                            me.onClickAddline();
                                        }
                                    }]
                                }
                            ]
                        }],
                        listeners: {
                            activate: function() {
                                var me = this.up('form');
                                me.down('#btnSave').formBind = true;
                                me.down('#btnSave').setDisabled(false);
                            },
                            deactivate: function() {
                                var me = this.up('form');
                                me.down('#btnSave').formBind = false;
                                me.down('#btnSave').setDisabled(true);
                            }
                        }
                    },
                    // Purchase Evidence
                    {
                        xtype: 'panel',
                        title: 'Documents',
                        itemId: 'panelDocuments',
                        margin: '0 0 10 0',
                        hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                        layout: {
                            type: 'column'
                        },
                        scrollable: true,
                        items: [{
                            margin: '10 5 10 0',
                            xtype: 'container',
                            columnWidth: 1,
                            layout: 'hbox',
                            items: [{
                                xtype: 'component',
                                flex: 0.8
                            }, {
                                xtype: 'combo',
                                width: 200,
                                displayField: 'DocTypeName',
                                valueField: 'DocTypeID',
                                name: 'x_DocTypeName',
                                queryMode: 'local',
                                typeAhead: true,
                                minChars: 2,
                                allowBlank: true,
                                formBind: false,
                                forceSelection: true,
                                emptyText: 'choose document type',
                                enableKeyEvents: true,
                                autoSelect: true,
                                selectOnFocus: true,
                                store: storeDocumentTypes,
                                matchFieldWidth: false,
                                listConfig: {
                                    width: 450
                                },
                                listeners: {
                                    change: function(field, newValue, oldValue) {
                                        field.next().setDisabled(!newValue);
                                    }
                                }
                            }, {
                                disabled: true,
                                margin: '0 0 5 5',
                                xtype: 'filefield',
                                name: 'image',
                                buttonOnly: true,
                                //fieldLabel: 'Buscar Imagen',
                                //placeHolder: 'Seleccione una imagen',
                                labelWidth: 50,
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                buttonText: 'Add document...',
                                listeners: {
                                    afterrender: function(cmp) {
                                        cmp.fileInputEl.set({
                                            accept: 'application/pdf;',
                                            capture: ''
                                        });
                                    },
                                    change: function(field) {
                                        var me = field.up('form');
                                        me.saveDocument();
                                    }
                                }
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
                            //frame: true,
                            collapsible: false,
                            columnWidth: 1,
                            //renderTo: 'dataview-example',
                            title: '(0 items selected)',
                            items: [
                                Ext.create('Ext.view.View', {
                                    itemId: 'data-view',
                                    store: storeDocuments,
                                    tpl: imageTpl,
                                    multiSelect: true,
                                    //renderTo: ,
                                    //width: 600,
                                    height: 310,
                                    trackOver: true,
                                    overItemCls: 'x-item-over',
                                    itemSelector: 'div.thumb-wrap',
                                    emptyText: 'No images to display',
                                    plugins: [
                                        Ext.create('Ext.ux.DataView.DragSelector', {}),
                                        Ext.create('Ext.ux.DataView.LabelEditor', {
                                            dataIndex: 'DocDesc',
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
                    itemId: 'btnSave',
                    text: 'Save Changes',
                    formBind: (IAMTrading.GlobalSettings.getCurrentUserLevel() > -1) ? true : false,
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
                },
                close: {
                    fn: me.onCloseForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onShowWindow: function() {
        this.down('field[name=VendorQuoteReference]').focus(true, 200);

        if (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1 && !this.currentRecord.phantom) {
            Ext.Array.each(this.down('#mainContainer').items.items, function(item, index, allItems) {
                item.editable = false;
                item.formBind = false;
                item.setReadOnly(true);
            });
        }
    },

    onSaveChanges: function(button, e, eOpts) {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            Ext.Msg.alert("Validation", "Check data for valid input!!!");
            return false;
        }

        form.updateRecord();

        var model = form.getRecord();

        var isPhantom = model.phantom;

        me.getEl().mask('Saving...');

        model.save({
            success: function(record, operation) {
                me.saveItems(record);
            },
            failure: function() {
                me.getEl().unmask();
            }
        });
    },

    saveItems: function(savedRecord) {
        var me = this,
            grid = me.down("gridpanel"),
            store = grid.getStore();

        store.each(function(record) {
            record.getProxy().setSilentMode(true);
            record.set('VendorQuoteId', savedRecord.data.VendorQuoteId);
        });

        var toCreate = store.getNewRecords(),
            toUpdate = store.getUpdatedRecords(),
            toDestroy = store.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0 || toUpdate.length > 0 || toDestroy.length > 0) {
            needsSync = true;
        }

        if (needsSync) {
            store.sync({
                callback: function() {
                    me.getEl().unmask();
                    /*if (!savedRecord.data.QHeaderDraft && savedRecord.data.QHeaderStatus !== 2) {
                        Ext.Msg.show({
                            title: 'Nuvem B2B',
                            msg: 'Orçamento enviado corretamente',
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO
                        });
                    }
                    me.onBackToQuotes();*/
                }
            });
        } else {
            me.getEl().unmask();
            /*if (!savedRecord.data.QHeaderDraft && savedRecord.data.QHeaderStatus !== 2) {
                Ext.Msg.show({
                    title: 'Nuvem B2B',
                    msg: 'Orçamento enviado corretamente',
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.INFO
                });
            }
            me.onBackToQuotes();*/
        }
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

            var b64 = dataUrl.split("base64;")[1];

            formPost.append("VendorQuoteId", values.VendorQuoteId);
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

    loadItemsEditingPluging: function() {
        var me = this;

        // Configuramos el plugin de edición
        return new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            customButtonsEnabled: true,
            customButtons: [{
                cls: 'mybutton',
                text: 'New Item',
                iconCls: 'fa fa-plus',
                parentForm: me,
                handler: function(button, eOpts) {
                    button.parentForm.onAddItem();
                }
            }],
            listeners: {
                beforeedit: {
                    delay: 100,
                    fn: function(rowEditing, context, eOpts) {
                        var me = rowEditing.editor.up("form");
                        this.getEditor().onFieldChange();

                        me.getEl().mask("Loading...");

                        var fieldFilters = JSON.stringify({
                            fields: [
                                { name: 'ItemType', value: 0, type: 'int' }
                            ]
                        });

                        var params = {
                            page: 1,
                            limit: 8,
                            start: 0,
                            fieldFilters: fieldFilters
                        };

                        //if (!context.record.phantom)
                        if (context.record.data.ItemId)
                            params.id = context.record.data.ItemId;

                        var storeItems = new IAMTrading.store.Items().load({
                            params: params,
                            callback: function() {
                                var itemField = rowEditing.editor.down('field[name=ItemId]');

                                itemField.bindStore(this);
                                itemField.setValue(params.id);

                                me.getEl().unmask();

                                itemField.focus(true, 200);
                            }
                        });
                    }
                },
                cancelEdit: {
                    fn: function(rowEditing, context) {
                        var grid = this.editor.up("gridpanel");
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (!context.record.data.ItemId) {
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
                            itemName = this.editor.down("field[name=ItemId]").getRawValue();

                        record.set("ItemName", itemName);

                        grid.up('panel').down("#addline").fireHandler();
                    }
                }
            }
        });
    },

    onAddItem: function() {
        var me = this;

        var model = new IAMTrading.model.Items();

        var form = Ext.widget('edititem', {
            frameHeader: true,
            header: true,
            title: 'New Item',
            closable: true,
            floating: true,
            callerForm: me,
            currentRecord: model
        });

        form.loadRecord(model);
        form.center();
        form.show();
    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        var grid = me.down('gridpanel');

        Ext.Msg.show({
            title: 'Delete',
            msg: 'Do you want to delete?',
            buttons: Ext.Msg.YESNO,
            icon: Ext.Msg.QUESTION,
            fn: function(btn) {
                if (btn === "yes") {
                    record.destroy();
                }
            }
        });
    },

    onClickEditActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel');
        me.editingPlugin.startEdit(record, 1);
        //me.editingPlugin.editor.down('field[name=POrderDate]').focus(true, 200);
    },

    onClickAddline: function() {
        var me = this,
            grid = me.down("gridpanel");


        grid.editingPlugin.cancelEdit();

        record = new IAMTrading.model.VendorQuotesDetail({
            VendorQuoteId: me.down("field[name=VendorQuoteId]").getValue()
        });

        var count = parseFloat(grid.store.getCount());

        grid.store.insert(count, record);
        grid.editingPlugin.startEdit(record, 1);
    }
});
