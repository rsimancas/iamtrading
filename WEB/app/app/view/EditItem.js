Ext.define('IAMTrading.view.EditItem', {
    extend: 'Ext.form.Panel',
    alias: 'widget.edititem',
    height: 600,
    modal: true,
    width: 700,
    layout: {
        type: 'absolute'
    },
    title: 'Item',
    closable: true,
    //constrain: true,
    formBind: true,
    floating: true,
    callerForm: "",
    calledFromQuotes: false,

    requires: ['IAMTrading.view.EditVendor'],

    initComponent: function() {

        var me = this;

        var storeImages = new IAMTrading.store.Images().load({
            params: {
                ItemId: me.currentRecord.data.ItemId
            }
        });

        var imageTpl = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="image-{AttachId}">',
            '<div class="thumb"><img src="../wa/GetAttach?id={AttachId}" title="{ImageDesc}"></div>',
            '<span class="x-editable">{ImageDesc}</span></div>',
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
            items: [{
                xtype: 'tabpanel',
                columnWidth: 1,
                margin: '5 5 5 5',
                activeTab: 0,
                items: [{
                    xtype: 'panel',
                    title: 'Item Information',
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
                                columnWidth: 0.20,
                                name: 'ItemGYCode',
                                fieldLabel: 'GoodYear Code',
                                allowBlank: false
                            }, {
                                margin: '0 0 0 5',
                                xtype: 'textfield',
                                columnWidth: 0.4,
                                name: 'ItemNum',
                                fieldLabel: 'Part #',
                                allowBlank: true
                            }, {
                                margin: '0 0 0 5',
                                xtype: 'textfield',
                                columnWidth: 0.4,
                                name: 'ItemNumSupplier',
                                fieldLabel: 'Supplier Part #',
                                allowBlank: true
                            },
                            // ComboBox Vendors
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
                                allowBlank: false,
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
                                store: new IAMTrading.store.Vendors({
                                    params: {
                                        page: 1,
                                        start: 0,
                                        limit: 8
                                    }
                                })
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Item Name',
                                columnWidth: 1,
                                name: 'ItemName',
                                allowBlank: false
                            }, {
                                xtype: 'textfield',
                                fieldLabel: 'Supplier Name',
                                columnWidth: 1,
                                name: 'ItemNameSupplier',
                                allowBlank: true
                            }, {
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Unit Cost',
                                name: 'ItemCost',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: false,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true,
                                hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)
                            }, {
                                margin: '0 0 0 5',
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Unit Price',
                                name: 'ItemPrice',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: false,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true
                            }, {
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Weight (Lbs)',
                                name: 'ItemWeight',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: true,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true,

                            }, {
                                margin: '0 0 0 5',
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Weight (Lbs)/Vol',
                                name: 'ItemVolume',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: true,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true
                            }, {
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Width (inches)',
                                name: 'ItemWidth',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: true,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true,
                                hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)
                            }, {
                                margin: '0 0 0 5',
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Height (inches)',
                                name: 'ItemHeight',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: true,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true
                            }, {
                                xtype: 'numericfield',
                                columnWidth: 0.5,
                                fieldLabel: 'Length (inches)',
                                name: 'ItemLength',
                                minValue: 0,
                                hideTrigger: true,
                                allowBlank: true,
                                useThousandSeparator: true,
                                decimalPrecision: 2,
                                alwaysDisplayDecimals: true,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'text-align: right;',
                                enableKeyEvents: true
                            }
                        ]
                    }]
                }, {
                    xtype: 'panel',
                    title: 'Images',
                    itemId: 'panelImages',
                    margin: '0 0 10 0',
                    hidden: me.currentRecord.phantom,
                    layout: {
                        type: 'column'
                    },
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
                            msgTarget: 'side',
                            allowBlank: true,
                            anchor: '100%',
                            formBind: false,
                            buttonText: 'Load Image...',
                            listeners: {
                                afterrender: function(cmp) {
                                    cmp.fileInputEl.set({
                                        accept: 'images/*;',
                                        capture: ''
                                    });
                                },
                                change: function(field, value) {
                                    var me = this.up('form');
                                    if (field.regex.test(value))
                                        me.saveImage();
                                }
                            },
                            regex: (/.(jpg)|.(jpeg)|.(png)|.(bmp)$/i),
                            regexText: 'Only images files allowed for upload'
                        }, {
                            margin: '0 0 0 5',
                            xtype: 'button',
                            itemId: 'btnDelete',
                            text: 'Delete Selected',
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
                        layout: {
                            type: 'column'
                        },
                        items: [
                            Ext.create('Ext.view.View', {
                                itemId: 'data-view',
                                store: storeImages,
                                tpl: imageTpl,
                                multiSelect: true,
                                columnWidth: 1,
                                height: 310,
                                trackOver: true,
                                overItemCls: 'x-item-over',
                                itemSelector: 'div.thumb-wrap',
                                emptyText: 'No images to display',
                                plugins: [
                                    Ext.create('Ext.ux.DataView.DragSelector', {}),
                                    Ext.create('Ext.ux.DataView.LabelEditor', {
                                        dataIndex: 'ImageDesc',
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
                            scope: me
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

    onShowWindow: function() {
        this.down('field[name=ItemGYCode]').focus(true, 200);
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
                    grid = form.down('#gridmain');

                if (!me.calledFromQuotes) {
                    if (!isPhantom) {
                        me.destroy();
                    } else {
                        var newRecord = Ext.create('IAMTrading.model.Items');
                        me.loadRecord(newRecord);
                        me.down('field[name=ItemGYCode]').focus(true, 200);
                    }

                    if (grid) {
                        grid.store.reload();
                    }
                } else {
                    me.destroy();
                    //form.show();
                    var fieldItem = form.down('field[name=ItemId]');
                    fieldItem.setRawValue(record.data.ItemName);
                    fieldItem.doRawQuery();
                    fieldItem.focus(true, 200);
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

    addVendor: function() {
        var me = this,
            record = Ext.create('IAMTrading.model.Vendors');

        var formVendor = new IAMTrading.view.EditVendor({
            title: 'New Vendor',
            calledFromEditItem: true
        });
        formVendor.loadRecord(record);
        //form.center();
        formVendor.callerForm = me;
        formVendor.show();
        formVendor.setX(me.getX() + 15);
        formVendor.setY(me.getY() + 15);
        //me.hide();
    },

    saveImage: function() {
        var me = this,
            documentType = null,
            docTypeID = null,
            currentUser = IAMTrading.GlobalSettings.getCurrentUserId();

        var formPost = new FormData(),
            values = me.currentRecord.data,
            files = me.getEl().down('input[type=file]').dom.files,
            file = (files.length > 0) ? files[files.length - 1] : null; //form.getContentEl().down('input[type=file]')

        // Read in the image file as a binary string.
        reader = new FileReader();

        me.getEl().mask('Please wait...');

        reader.onloadend = function(e) {
            var dataUrl = e.target.result;

            formPost.append("ItemId", values.ItemId);
            formPost.append("DocTypeID", docTypeID);
            formPost.append("CurrentUser", currentUser);
            formPost.append("FileName", file.name);
            formPost.append("ImageFile", file, file.name);

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
            http.open('POST', IAMTrading.GlobalSettings.webApiPath + 'attachimage');

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

        // Ext.Array.each(records, function(record, index) {
        //     record.getProxy().setSilentMode(true);
        //     record.destroy();
        // });

        dv.up('panel').setTitle('(0 items selected)');
    }
});
