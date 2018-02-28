Ext.define('IAMTrading.view.EditQuoteHeader', {
    extend: 'Ext.form.Panel',
    alias: 'widget.editquoteheader',
    /*modal: true,
    width: 800,
    height: 580,*/
    layout: 'column',
    //title: 'Quote',
    closable: false,
    /*floating: true,*/
    callerForm: null,
    currentRecord: null,
    header: {
        items: [
        {
            xtype: 'button',
            width: 40,
            ui: 'plain',
            style: 'color:#fff !important;',
            glyph: 0xf112,
            tooltip: 'Back to Quotes',
            handler: function() {
                var me = this.up("form");
                me.onBackToQuotes();
            }
        }
        ]
    },
    /*tools: [{
        //glyph: 0xf112,
        type:'prev',
        tooltip: 'back to quotes',
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
    }],*/

    initComponent: function() {

        Ext.require([
            'IAMTrading.view.ShowImage'
        ]);

        var me = this;

        // Configuramos el plugin de edición
        var rowEditing = new Ext.grid.plugin.RowEditing({
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
                            grid.up('form').recalcTotals();
                        }
                    }
                },
                edit: {
                    fn: function(editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;

                        //if (record.data.POrderType === 'PB' || record.data.POrderType === 'PP' || record.data.POrderType === 'IC') {
                        if (Ext.Array.contains(['PB', 'PP', 'IC', 'PN', 'CN'], record.data.POrderType)) {
                            record.data.POrderAmount = Math.abs(record.data.POrderAmount) * -1;
                            record.data.POrderAmountNB = Math.abs(record.data.POrderAmountNB) * -1;
                        }

                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function() {
                                        if (fromEdit && isPhantom)
                                            grid.up('panel').down("#addline").fireHandler();

                                        grid.up('form').recalcTotals();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });

        var rowEditingPOV = new Ext.grid.plugin.RowEditing({
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
                            grid.up('form').recalcTotals();
                        }
                    }
                },
                edit: {
                    fn: function(editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;

                        if (record.data.POVType === 'PB') {
                            record.data.POVAmount = Math.abs(record.data.POVAmount) * -1;
                            record.data.POVAmountNB = Math.abs(record.data.POVAmountNB) * -1;
                        }

                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function() {
                                        if (fromEdit && isPhantom)
                                            grid.up('panel').down("#addlinePOV").fireHandler();
                                        grid.up('form').recalcTotals();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });

        // General Charges
        var rowEditingGeneralCharges = me.loadGeneralChargesPluginEdit();

        var qHeaderId = (me.currentRecord) ? me.currentRecord.data.QHeaderId : 0;

        var storeStatus = new IAMTrading.store.Status({
            pageSize: 0
        }).load({
            params: {
                page: 0,
                limit: 0,
                start: 0
            },
            callback: function() {
                if (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1) {

                    this.clearFilter();

                    var filter = new Ext.util.Filter({
                        filterFn: function(item) {
                            return item.get("StatusName").substr(0, 5) === "FASE1" || item.get('StatusId') === me.currentRecord.data.StatusId;
                        }
                    });

                    this.filter(filter);

                    var statusName = me.down('field[name=StatusId]').getRawValue();

                    if (statusName.substr(0, 5) === 'FASE1') {

                        var fieldStatus = me.down('field[name=StatusId]');
                        fieldStatus.setReadOnly(false);

                        me.down('field[name=QHeaderOC]').setReadOnly(false);
                        me.down('field[name=QHeaderOCDate]').setReadOnly(false);
                        me.down('field[name=QHeaderGYComments]').setReadOnly(false);
                    }
                }
            }
        });
        var storeBrokers = new IAMTrading.store.Brokers({
            pageSize: 0
        }).load();
        var storeCustomers = new IAMTrading.store.Customers({
            pageSize: 0
        }).load();
        var storePurchases = new IAMTrading.store.PurchaseOrders({
            pageSize: 0,
            autoLoad: false
        });
        var storePurchasesVendors = new IAMTrading.store.PurchaseOrdersVendors({
            pageSize: 0,
            autoLoad: false
        });
        var storeDocumentTypes = new IAMTrading.store.DocumentTypes({
            pageSize: 0,
            autoLoad: true
        });
        var storeDocuments = new IAMTrading.store.Documents({
            autoLoad: false
        });

        var storeQuoteDetail = new IAMTrading.store.QuoteDetails().load({
            params: {
                QHeaderId: qHeaderId,
                page: 0,
                start: 0,
                limit: 0
            }
        });

        var storeChargesDescriptions = new IAMTrading.store.ChargesDescriptions().load({
            params: {page:0, limit:0,start:0}
        });

        var filtersFields = JSON.stringify({fields: [
            {name:'QHeaderId',value:qHeaderId,type:'int'}
        ]});

        var storeGeneralCharges = new IAMTrading.store.GeneralCharges().load({
            params: {
                fieldFilters: filtersFields
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

        if (qHeaderId > 0) {
            storePurchases.load({
                params: {
                    QHeaderId: qHeaderId
                },
                callback: function() {
                    me.recalcTotals();
                }
            });
            storePurchasesVendors.load({
                params: {
                    QHeaderId: qHeaderId
                }
            });
            storeDocuments.load({
                params: {
                    QHeaderId: qHeaderId
                }
            });
        }

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
                    // Quote Header Data
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
                                    xtype: 'textfield',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Reference',
                                    name: 'QHeaderReference',
                                    allowBlank: false,
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    }
                                }, {
                                    xtype: 'datefield',
                                    margin: '0 0 0 5',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Quote Date',
                                    name: 'QHeaderDate',
                                    allowBlank: false,
                                    format: 'd/m/Y'
                                }, {
                                    xtype: 'textfield',
                                    margin: '0 0 0 5',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Num Order',
                                    name: 'QHeaderOC',
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    }
                                }, {
                                    xtype: 'datefield',
                                    margin: '0 0 0 5',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Date Order',
                                    name: 'QHeaderOCDate',
                                    format: 'd/m/Y'
                                }, {
                                    columnWidth: 0.25,
                                    xtype: 'combo',
                                    fieldLabel: 'Status Info.',
                                    displayField: 'name',
                                    valueField: 'name',
                                    name: 'QHeaderStatusInfo',
                                    queryMode: 'local',
                                    typeAhead: true,
                                    minChars: 1,
                                    allowBlank: false,
                                    forceSelection: true,
                                    emptyText: 'choose status',
                                    enableKeyEvents: true,
                                    autoSelect: true,
                                    selectOnFocus: true,
                                    store: {
                                        fields: ['name'],
                                        data: [{
                                            "name": "ABIERTA"
                                        }, {
                                            "name": "CERRADA"
                                        }, {
                                            "name": "ANULADA"
                                        }, {
                                            "name": "COTIZADA"
                                        }, {
                                            "name": "POR REEMPLAZO"
                                        }]
                                    }
                                }, {
                                    xtype: 'datefield',
                                    margin: '0 0 0 5',
                                    columnWidth: 0.25,
                                    fieldLabel: 'Estimated Date',
                                    name: 'QHeaderEstimatedDate',
                                    format: 'd/m/Y'
                                }, {
                                    xtype: 'numericfield',
                                    columnWidth: 0.25,
                                    margin: '0 0 0 5',
                                    name: 'QHeaderCurrencyRate',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    currencySymbol: '$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    fieldLabel: 'Currency Rate',
                                    labelAlign: 'top',
                                    fieldStyle: 'text-align: right;',
                                    //allowBlank: false,
                                    //readOnly: true,
                                    //editable: false,
                                    listeners: {
                                        blur: function(field, The, eOpts) {

                                        }
                                    }
                                }, {
                                    xtype: 'numericfield',
                                    columnWidth: 0.25,
                                    margin: '0 0 0 5',
                                    name: 'QHeaderCost',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    currencySymbol: '$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    fieldLabel: 'Total Cost',
                                    labelAlign: 'top',
                                    fieldStyle: 'text-align: right;',
                                    //allowBlank: false,
                                    //readOnly: true,
                                    //editable: false,
                                    listeners: {
                                        blur: function(field, The, eOpts) {

                                        }
                                    },
                                    hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)
                                }, {
                                    xtype: 'numericfield',
                                    columnWidth: 0.5,
                                    name: 'QHeaderVolumeWeight',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    //currencySymbol:'$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    fieldLabel: 'Volumen/Weight (Libras)',
                                    labelAlign: 'top',
                                    fieldStyle: 'text-align: right;',
                                    //allowBlank: false,
                                    //readOnly: true,
                                    //editable: false,
                                    listeners: {
                                        blur: function(field, The, eOpts) {

                                        }
                                    }
                                }, {
                                    xtype: 'numericfield',
                                    columnWidth: 0.50,
                                    margin: '0 0 0 5',
                                    name: 'QHeaderCubicFeet',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    //currencySymbol:'$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    fieldLabel: 'Cubic Feet (ft³)',
                                    labelAlign: 'top',
                                    fieldStyle: 'text-align: right;',
                                    //allowBlank: false,
                                    //readOnly: true,
                                    //editable: false,
                                    listeners: {
                                        blur: function(field, The, eOpts) {

                                        }
                                    }
                                }, {
                                    xtype: 'combo',
                                    columnWidth: 1,
                                    name: 'StatusId',
                                    fieldLabel: 'Status',
                                    valueField: 'StatusId',
                                    displayField: 'StatusName',
                                    store: (storeStatus) ? storeStatus : null,
                                    queryMode: 'local',
                                    minChars: 2,
                                    allowBlank: false,
                                    forceSelection: true,
                                    selectOnFocus: true,
                                    hideTrigger: false,
                                    typeAhead: true,
                                    pageSize: 0,
                                    formBind: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                                    listeners: {
                                        beforequery: function(record) {
                                            record.query = new RegExp(record.query, 'i');
                                            record.forceAll = true;
                                        }
                                    }
                                },
                                // ComboBox Vendors
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Main Vendor',
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
                                    store: null
                                },
                                // ComboBox Brokers
                                {
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
                                },
                                // ComboBox Customers
                                {
                                    xtype: 'combo',
                                    fieldLabel: 'Customer',
                                    columnWidth: 1,
                                    name: 'CustId',
                                    fieldStyle: 'font-size: 11px;',
                                    displayField: 'CustName',
                                    valueField: 'CustId',
                                    queryMode: 'remote',
                                    pageSize: 8,
                                    minChars: 2,
                                    allowBlank: false,
                                    forceSelection: false,
                                    selectOnFocus: true,
                                    triggerAction: '',
                                    queryBy: 'CustName',
                                    queryCaching: false, // set for after add a new customer, this control recognize the new customer added
                                    enableKeyEvents: true,
                                    matchFieldWidth: false,
                                    listConfig: {
                                        width: 450
                                    },
                                    emptyText: 'Choose Customer',
                                    store: (storeCustomers) ? storeCustomers : null,
                                }, {
                                    xtype: 'textareafield',
                                    columnWidth: 0.5,
                                    fieldLabel: 'Comments',
                                    name: 'QHeaderComments',
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    }
                                }, {
                                    margin: '0 0 0 5',
                                    xtype: 'textareafield',
                                    columnWidth: 0.5,
                                    fieldLabel: 'Comments (GY)',
                                    name: 'QHeaderGYComments',
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    },
                                    disabled: (IAMTrading.GlobalSettings.getCurrentUserLevel() !== -1)
                                }, {
                                    xtype: 'textfield',
                                    columnWidth: 0.5,
                                    fieldLabel: 'Num Fianza',
                                    name: 'QHeaderNumFianza',
                                    allowBlank: true,
                                    listeners: {
                                        blur: function() {
                                            //me.onSaveChangesClick();
                                        }
                                    }
                                }, {
                                    margin: '0 0 0 5',
                                    xtype: 'numericfield',
                                    columnWidth: 0.5,
                                    name: 'QHeaderTotal',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    currencySymbol: '$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    fieldLabel: 'Estimated Sales',
                                    labelAlign: 'top',
                                    fieldStyle: 'text-align: right;',
                                    //allowBlank: false,
                                    //readOnly: true,
                                    editable: true,
                                    listeners: {
                                        blur: function(field, The, eOpts) {

                                        }
                                    },
                                    hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)
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
                    // Purchases Orders
                    {
                        xtype: 'panel',
                        title: 'Purchase Order',
                        itemId: 'panelPO',
                        margin: '0 0 10 0',
                        layout: {
                            type: 'column'
                        },
                        items: [
                            // Grid Purchase Orders
                            {
                                columnWidth: 1,
                                xtype: 'gridpanel',
                                itemId: 'gridPOrders',
                                store: storePurchases,
                                scrollable: true,
                                minHeight: 250,
                                maxHeight: 250,
                                columns: [{
                                    width: 45,
                                    xtype: 'checkcolumn',
                                    columnHeaderCheckbox: IAMTrading.GlobalSettings.getCurrentUserId() === "jorge",
                                    menuDisabled: true,
                                    sortable: false,
                                    dataIndex: 'POrderManagerChecked',
                                    disabled: IAMTrading.GlobalSettings.getCurrentUserId() !== "jorge",
                                    //header: '<img class="header-iconx" style="vertical-align:middle;margin-bottom:4px;" src="images/checkmark.png" data-qtip="Manager Checked"/>',
                                    listeners: {
                                        'checkchange': function(comp, rowIndex, checked, eOpts) {
                                            var me = comp.up('form');
                                            me.onPOCheckChange(comp, rowIndex, checked, eOpts);
                                        }
                                    }
                                }, {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'POrderType',
                                    text: 'Type',
                                    editor: {
                                        xtype: 'combo',
                                        displayField: 'name',
                                        valueField: 'id',
                                        name: 'POrderType',
                                        queryMode: 'local',
                                        typeAhead: true,
                                        minChars: 2,
                                        allowBlank: false,
                                        forceSelection: true,
                                        emptyText: 'choose',
                                        enableKeyEvents: true,
                                        autoSelect: true,
                                        selectOnFocus: true,
                                        store: {
                                            fields: ['name', 'id'],
                                            data: [{
                                                "name": "Purchase Order",
                                                'id': 'PO'
                                            }, {
                                                "name": "Purchase Update",
                                                'id': 'PU'
                                            }, {
                                                "name": "Invoice",
                                                'id': 'IN'
                                            }, {
                                                "name": "Internal Charge",
                                                'id': 'IC'
                                            }, {
                                                "name": "Pay Billing",
                                                'id': 'PB'
                                            }, {
                                                "name": "Prepaid",
                                                'id': 'PP'
                                            }, {
                                                "name": "IVA Invoice",
                                                'id': 'PI'
                                            }, {
                                                "name": "IVA Note",
                                                'id': 'PN'
                                            }, {
                                                "name": "Credit Note",
                                                'id': 'CN'
                                            }, {
                                                "name": "Internal Charge Note",
                                                'id': 'CI'
                                            }]
                                        },
                                        listeners: {
                                            blur: function(field) {
                                                var me = field.up('gridpanel').up('form');
                                                var record = field.up('form').context.record;

                                                if (record.phantom && field.value === 'PP') {
                                                    me.onPOrderTypeBlur(field, record);
                                                }
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'gridcolumn',
                                    flex: 0.8,
                                    dataIndex: 'POrderDate',
                                    text: 'Date Received',
                                    renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                                    align: 'center',
                                    editor: {
                                        xtype: 'datefield',
                                        name: 'POrderDate',
                                        allowBlank: false,
                                        format: 'd/m/Y',
                                        listeners: {
                                            change: function(field, newValue, oldValue, eOpts) {
                                                var me = field.up('form'),
                                                    fieldRate = me.down('field[name=POrderCurrencyRate]');

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
                                    flex: 0.8,
                                    dataIndex: 'POrderPaymentNumber',
                                    text: 'Number #',
                                    editor: {
                                        xtype: 'textfield',
                                        name: 'POrderPaymentNumber',
                                        allowBlank: false
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 0.8,
                                    dataIndex: 'POrderPctPP',
                                    text: '% P.P',
                                    align: 'right',
                                    format: '00.00',
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'POrderPctPP',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        //currencySymbol:'$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;',
                                        listeners: {
                                            blur: function(field) {
                                                var form = field.up('panel');
                                                form.onFieldChange();
                                            },
                                            change: function(field, newValue, oldValue, eOpts) {
                                                if (document.activeElement.name !== field.name) return;

                                                me.onPOrderPctPPChange(field);
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 0.8,
                                    dataIndex: 'POrderCurrencyRate',
                                    text: 'Cur. Rate',
                                    align: 'right',
                                    format: '0,000.00',
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'POrderCurrencyRate',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        //currencySymbol:'$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;',
                                        listeners: {
                                            blur: function(field) {
                                                var form = field.up('panel');
                                                form.onFieldChange();
                                            },
                                            change: function(field, newValue, oldValue, eOpts) {
                                                if (document.activeElement.name !== field.name) return;

                                                var form = field.up('form'),
                                                    amount = form.down('field[name=POrderAmount]').getValue();

                                                field.next().next().setValue(newValue * amount);
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 1.5,
                                    dataIndex: 'POrderAmount',
                                    text: 'Amount',
                                    align: 'right',
                                    renderer: Ext.util.Format.usMoney,
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'POrderAmount',
                                        hideTrigger: true,
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
                                                    tasa = form.down('field[name=POrderCurrencyRate]').getValue();

                                                field.next().setValue(newValue * tasa);
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'numbercolumn',
                                    flex: 2,
                                    dataIndex: 'POrderAmountNB',
                                    text: 'Amount/Bs.',
                                    align: 'right',
                                    renderer: Ext.util.Format.bsMoney,
                                    summaryRenderer: function(value, summaryData, dataIndex) {
                                        var amountNB = 0,
                                            pOrderParentType = 'PO',
                                            store = this.up('gridpanel').store;

                                        if (store.find('POrderType', 'IN') !== -1)
                                            pOrderParentType = 'IN';

                                        for (i = 0; i < store.getCount(); i++) {
                                            var record = store.data.items[i];

                                            porderType = record.get("POrderType");

                                            if (porderType === "PB" || porderType === "PP" || porderType === pOrderParentType) {
                                                amountNB += record.get("POrderAmountNB");
                                            }
                                        }

                                        if (amountNB !== 0)
                                            amountNB = Ext.util.Format.bsMoney(amountNB);

                                        return amountNB;
                                    },
                                    editor: {
                                        xtype: 'numericfield',
                                        margin: '0 0 0 5',
                                        name: 'POrderAmountNB',
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
                                                    fieldAmount = form.down('field[name=POrderAmount]'),
                                                    tasa = form.down('field[name=POrderCurrencyRate]').getValue();

                                                fieldAmount.setValue(Math.round(newValue / tasa, 2));
                                            }
                                        }
                                    }
                                }, {
                                    xtype: 'actioncolumn',
                                    width: 35,
                                    items: [{
                                        handler: me.onClickActionColumn,
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
                                    hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                                    handler: function() {
                                            var me = this.up('form');
                                            rowEditing.cancelEdit();

                                            var grid = this.up('gridpanel'),
                                                pOrderType = 'PB',
                                                pOrderAmount = me.currentRecord.data.QHeaderTotal,
                                                currencyRate = me.callerForm.up('app_viewport').down('#dolartoday').getValue(),
                                                pOrderAmountNB = pOrderAmount * currencyRate,
                                                pOrderNumber = me.currentRecord.data.QHeaderOC,
                                                count = grid.store.getCount();

                                            pOrderType = (count === 0) ? 'PO' : pOrderType;
                                            pOrderNumber = (count > 0) ? '' : pOrderNumber;

                                            // Create a model instance
                                            var r = Ext.create('IAMTrading.model.PurchaseOrders', {
                                                QHeaderId: me.currentRecord.data.QHeaderId,
                                                POrderCurrencyRate: currencyRate,
                                                POrderType: pOrderType,
                                                POrderAmount: pOrderAmount,
                                                POrderAmountNB: pOrderAmountNB,
                                                POrderPaymentNumber: pOrderNumber
                                            });

                                            grid.store.insert(count, r);
                                            rowEditing.startEdit(r, 1);
                                            rowEditing.editor.down('field[name=POrderType]').focus(true, 200);
                                        } //,
                                        //disabled:true
                                }, {
                                    itemId: 'removeMov',
                                    text: 'Delete',
                                    hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                                    handler: function() {
                                        var grid = this.up('gridpanel');
                                        var sm = grid.getSelectionModel();

                                        rowEditing.cancelEdit();

                                        selection = sm.getSelection();

                                        if (selection) {
                                            selection[0].destroy({
                                                success: function() {
                                                    grid.store.reload({
                                                        callback: function() {
                                                            sm.select(0);
                                                        }
                                                    });
                                                    grid.up('form').recalcTotals();
                                                }
                                            });
                                        }
                                    },
                                    disabled: true
                                }],
                                selType: 'rowmodel',
                                plugins: [rowEditing],
                                listeners: {
                                    'selectionchange': function(view, records) {
                                        this.down('#removeMov').setDisabled(!records.length);
                                    }
                                }
                            }, {
                                margin: '0 0 0 0',
                                padding: '2 10 10 10',
                                columnWidth: 1,
                                xtype: 'fieldset',
                                title: 'Results',
                                layout: {
                                    type: 'column'
                                },
                                items: [{
                                    xtype: 'container',
                                    layout: 'hbox',
                                    columnWidth: 0.5,
                                    items: [{
                                        margin: '0 0 0 5',
                                        xtype: 'numericfield',
                                        editable: false,
                                        anchor: '25%',
                                        name: 'NetIncome',
                                        fieldLabel: 'Net Income',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: '$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                        selectOnFocus: true,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                if (newValue >= 0) {
                                                    field.removeCls('var-negative');
                                                    field.addCls('var-positive');
                                                } else {
                                                    field.removeCls('var-positive');
                                                    field.addCls('var-negative');
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: 'component',
                                        flex: 1
                                    }]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    columnWidth: 0.5,
                                    items: [{
                                        xtype: 'component',
                                        flex: 1
                                    }, {
                                        margin: '0 0 0 5',
                                        xtype: 'numericfield',
                                        editable: false,
                                        anchor: '25%',
                                        name: 'PorFacturarBs',
                                        fieldLabel: 'P.O por Facturar',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: 'Bs.',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                        selectOnFocus: true,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                if (newValue >= 0) {
                                                    field.removeCls('var-negative');
                                                    field.addCls('var-positive');
                                                } else {
                                                    field.removeCls('var-positive');
                                                    field.addCls('var-negative');
                                                }
                                            }
                                        }
                                    }]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    columnWidth: 0.5,
                                    items: [{
                                        margin: '0 0 0 5',
                                        xtype: 'numericfield',
                                        editable: false,
                                        anchor: '25%',
                                        name: 'ExchVariation',
                                        fieldLabel: 'Exchange Variation',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: '$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                        selectOnFocus: true,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                if (newValue >= 0) {
                                                    field.removeCls('var-negative');
                                                    field.addCls('var-positive');
                                                } else {
                                                    field.removeCls('var-positive');
                                                    field.addCls('var-negative');
                                                }
                                            }
                                        }
                                    }, {
                                        xtype: 'component',
                                        flex: 1
                                    }]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    columnWidth: 0.5,
                                    items: [{
                                        xtype: 'component',
                                        flex: '1'
                                    }, {
                                        //margin: '0 0 0 5',
                                        xtype: 'numericfield',
                                        editable: false,
                                        columnWidth: 1,
                                        name: 'BalanceFacturasBs',
                                        fieldLabel: 'Facturas x Cobrar (Base)',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: 'Bs.',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                        selectOnFocus: true,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                if (newValue >= 0) {
                                                    field.removeCls('var-negative');
                                                    field.addCls('var-positive');
                                                } else {
                                                    field.removeCls('var-positive');
                                                    field.addCls('var-negative');
                                                }
                                            }
                                        }
                                    }]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    columnWidth: 1,
                                    items: [{
                                        xtype: 'component',
                                        flex: '1'
                                    }, {
                                        margin: '0 0 0 5',
                                        xtype: 'numericfield',
                                        editable: false,
                                        columnWidth: 1,
                                        name: 'IvaFacturasBs',
                                        fieldLabel: 'IVA Facturas x Cobrar',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: 'Bs.',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                        selectOnFocus: true,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                if (newValue >= 0) {
                                                    field.removeCls('var-negative');
                                                    field.addCls('var-positive');
                                                } else {
                                                    field.removeCls('var-positive');
                                                    field.addCls('var-negative');
                                                }
                                            }
                                        }
                                    }]
                                }, {
                                    xtype: 'container',
                                    layout: 'hbox',
                                    columnWidth: 1,
                                    items: [{
                                        xtype: 'component',
                                        flex: 1
                                    }, {
                                        margin: '0 0 0 5',
                                        xtype: 'numericfield',
                                        editable: false,
                                        columnWidth: 1,
                                        name: 'BalanceBs',
                                        fieldLabel: 'Total Balance Bs.',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: 'Bs.',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                        selectOnFocus: true,
                                        listeners: {
                                            change: function(field, newValue, oldValue) {
                                                if (newValue >= 0) {
                                                    field.removeCls('var-negative');
                                                    field.addCls('var-positive');
                                                } else {
                                                    field.removeCls('var-positive');
                                                    field.addCls('var-negative');
                                                }
                                            }
                                        }
                                    }]
                                }]
                            }, {
                                xtype: 'textareafield',
                                columnWidth: 1,
                                fieldLabel: 'Comments',
                                name: 'QHeaderPOComments',
                                listeners: {
                                    blur: function() {
                                        //me.onSaveChangesClick();
                                    }
                                },
                                disabled: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)
                            }
                        ]
                    },
                    // Cost & Charges
                    {
                        xtype: 'panel',
                        title: 'Cost & Charges',
                        itemId: 'panelPOV',
                        margin: '0 0 10 0',
                        hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1 || IAMTrading.GlobalSettings.deniedAccess([3,4])),
                        layout: {
                            type: 'column'
                        },
                        items: [{
                            columnWidth: 1,
                            xtype: 'gridpanel',
                            itemId: 'gridPOV',
                            //title: 'Roles',
                            features: [{
                                ftype: 'summary'
                            }],
                            store: storePurchasesVendors,
                            minHeight: 200,
                            columns: [{
                                xtype: 'gridcolumn',
                                dataIndex: 'POVType',
                                text: 'Type',
                                editor: {
                                    xtype: 'combo',
                                    displayField: 'name',
                                    valueField: 'id',
                                    name: 'POVType',
                                    queryMode: 'local',
                                    typeAhead: true,
                                    minChars: 2,
                                    allowBlank: false,
                                    forceSelection: true,
                                    emptyText: 'choose',
                                    enableKeyEvents: true,
                                    autoSelect: true,
                                    selectOnFocus: true,
                                    store: {
                                        fields: ['name', 'id'],
                                        data: [{
                                            "name": "Invoice/Quote",
                                            'id': 'IN'
                                        }, {
                                            "name": "Pay Billing",
                                            'id': 'PB'
                                        }, {
                                            "name": "Prepaid",
                                            'id': 'PP'
                                        }, {
                                            "name": "Royalty",
                                            'id': 'RO'
                                        }]
                                    }
                                }
                            }, {
                                xtype: 'gridcolumn',
                                dataIndex: 'x_VendorName',
                                text: 'Vendor',
                                editor: {
                                    xtype: 'combo',
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
                                }
                            }, {
                                xtype: 'gridcolumn',
                                flex: 0.8,
                                dataIndex: 'POVDate',
                                text: 'Date',
                                renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                                align: 'center',
                                editor: {
                                    xtype: 'datefield',
                                    name: 'POVDate',
                                    allowBlank: false,
                                    format: 'd/m/Y',
                                    listeners: {
                                        change: function(field, newValue, oldValue, eOpts) {
                                            var me = field.up('panel'),
                                                fieldRate = me.down('field[name=POVCurrencyRate]');

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
                                flex: 0.8,
                                dataIndex: 'POVPaymentNumber',
                                text: 'Number #',
                                editor: {
                                    xtype: 'textfield',
                                    name: 'POVPaymentNumber',
                                    allowBlank: false
                                }
                            }, {
                                xtype: 'numbercolumn',
                                flex: 0.8,
                                dataIndex: 'POVCurrencyRate',
                                text: 'Cur. Rate',
                                align: 'right',
                                format: '0,000.00',
                                editor: {
                                    xtype: 'numericfield',
                                    margin: '0 0 0 5',
                                    name: 'POVCurrencyRate',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    //currencySymbol:'$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    fieldStyle: 'text-align: right;',
                                    listeners: {
                                        blur: function(field) {
                                            var form = field.up('panel');
                                            form.onFieldChange();
                                        },
                                        change: function(field, newValue, oldValue, eOpts) {
                                            if (document.activeElement.name !== field.name) return;

                                            var form = field.up('form'),
                                                amount = form.down('field[name=POVAmount]').getValue();

                                            field.next().next().setValue(newValue * amount);
                                        }
                                    }
                                }
                            }, {
                                xtype: 'numbercolumn',
                                flex: 1.5,
                                dataIndex: 'POVAmount',
                                text: 'Amount',
                                align: 'right',
                                renderer: Ext.util.Format.usMoney,
                                summaryType: 'sum',
                                editor: {
                                    xtype: 'numericfield',
                                    margin: '0 0 0 5',
                                    name: 'POVAmount',
                                    hideTrigger: true,
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
                                                tasa = form.down('field[name=POVCurrencyRate]').getValue();

                                            field.next().setValue(newValue * tasa);
                                        }
                                    }
                                }
                            }, {
                                xtype: 'numbercolumn',
                                flex: 2,
                                dataIndex: 'POVAmountNB',
                                text: 'Amount/Bs.',
                                align: 'right',
                                renderer: Ext.util.Format.bsMoney,
                                summaryType: 'sum',
                                editor: {
                                    xtype: 'numericfield',
                                    margin: '0 0 0 5',
                                    name: 'POVAmountNB',
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
                                                fieldAmount = form.down('field[name=POVAmount]'),
                                                tasa = form.down('field[name=POVCurrencyRate]').getValue();

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
                                itemId: 'addlinePOV',
                                handler: function() {
                                        var me = this.up('form');
                                        rowEditingPOV.cancelEdit();

                                        var grid = this.up('gridpanel'),
                                            pOrderType = 'PB',
                                            pOrderAmount = me.currentRecord.data.QHeaderTotal,
                                            currencyRate = me.callerForm.up('app_viewport').down('#dolartoday').getValue(),
                                            pOrderAmountNB = pOrderAmount * currencyRate,
                                            count = grid.store.getCount();

                                        pOrderType = (count === 0) ? 'IN' : pOrderType;

                                        // Create a model instance
                                        var r = Ext.create('IAMTrading.model.PurchaseOrdersVendors', {
                                            QHeaderId: me.currentRecord.data.QHeaderId,
                                            POVCurrencyRate: currencyRate,
                                            POVType: pOrderType,
                                            POVAmount: 0,
                                            POVAmountNB: 0
                                        });

                                        grid.store.insert(count, r);
                                        rowEditingPOV.startEdit(r, 1);
                                        rowEditingPOV.editor.down('field[name=VendorId]').focus(true, 200);
                                    } //,
                                    //disabled:true
                            }, {
                                itemId: 'removeMovPOV',
                                text: 'Delete',
                                handler: function() {
                                    var grid = this.up('gridpanel');
                                    var sm = grid.getSelectionModel();

                                    rowEditing.cancelEdit();

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
                            plugins: [rowEditingPOV],
                            listeners: {
                                'selectionchange': function(view, records) {
                                    this.down('#removeMovPOV').setDisabled(!records.length);
                                }
                            }
                        }, {
                            margin: '10 0 10 0',
                            xtype: 'container',
                            columnWidth: 1,
                            layout: 'column',
                            items: [{
                                margin: '0 0 0 0',
                                columnWidth: 1,
                                xtype: 'fieldset',
                                layout: 'hbox',
                                padding: '5 10 10 10',
                                title: 'Results',
                                items: [{
                                    xtype: 'component',
                                    flex: 1
                                }, {
                                    margin: '0 0 0 5',
                                    xtype: 'numericfield',
                                    editable: false,
                                    anchor: '25%',
                                    name: 'POVProfit',
                                    fieldLabel: 'Profit',
                                    hideTrigger: true,
                                    useThousandSeparator: true,
                                    //decimalPrecision: 5,
                                    alwaysDisplayDecimals: true,
                                    allowNegative: false,
                                    currencySymbol: '$',
                                    alwaysDecimals: true,
                                    thousandSeparator: ',',
                                    value: 0,
                                    fieldStyle: 'text-align: right;font-size: 14px;font-weight: bold;',
                                    selectOnFocus: true,
                                    listeners: {
                                        change: function(field, newValue, oldValue) {
                                            if (newValue >= 0) {
                                                field.removeCls('var-negative');
                                                field.addCls('var-positive');
                                            } else {
                                                field.removeCls('var-positive');
                                                field.addCls('var-negative');
                                            }
                                        }
                                    }
                                }]
                            }]
                        }, {
                            xtype: 'textareafield',
                            columnWidth: 1,
                            fieldLabel: 'Comments',
                            name: 'QHeaderCostComments',
                            listeners: {
                                blur: function() {
                                    //me.onSaveChangesClick();
                                }
                            },
                            disabled: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)
                        }]
                    },
                    // Documents
                    {
                        xtype: 'panel',
                        title: 'Documents',
                        itemId: 'panelDocuments',
                        margin: '0 0 10 0',
                        hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1 ),
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
                                    style: {
                                        overflow: 'auto'
                                    },
                                    store: storeDocuments,
                                    tpl: imageTpl,
                                    multiSelect: true,
                                    //renderTo: ,
                                    //width: 600,
                                    height: 450,
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
                    },
                    // Cost & Items
                    {
                        xtype:'panel',
                        title: 'Items', //Cost & Items',
                        layout:'column',
                        items: [
                            // Customs Header
                            /*{
                                margin: '5 0 0 0',
                                xtype:'fieldset',
                                columnWidth: 0.30,
                                layout: 'column',
                                bodyPadding: 5,
                                items: [
                                    // Date
                                    {
                                        xtype: 'datefield',
                                        columnWidth: 1,
                                        fieldLabel: 'Date',
                                        name: 'CClearenceDate',
                                        format: 'd/m/Y'
                                    },
                                    // Broker
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 1,
                                        fieldLabel: 'Broker',
                                        name: 'BrokerName',
                                        readOnly: true
                                    },
                                    // Customer
                                    {
                                        xtype: 'textfield',
                                        columnWidth: 1,
                                        fieldLabel: 'Vendor',
                                        name: 'VendorName',
                                        readOnly: true
                                    },
                                    // Factor
                                    {
                                        xtype: 'numericfield',
                                        name: 'CClearenceFactor',
                                        columnWidth: 0.5,
                                        fieldLabel: 'Factor (Vol/Weight)',
                                        fieldStyle: 'text-align: right;',
                                        hideTrigger: false,
                                        useThousandSeparator: true,
                                        decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        alwaysDecimals: false,
                                        thousandSeparator: ',',
                                        selectOnFocus: true
                                    },
                                    // Tasa
                                    {
                                        margin: '0 0 5 5',
                                        columnWidth: 0.5,
                                        xtype: 'numericfield',
                                        name: 'CClearenceCurrencyRate',
                                        hideTrigger: true,
                                        useThousandSeparator: true,
                                        //decimalPrecision: 5,
                                        alwaysDisplayDecimals: true,
                                        allowNegative: false,
                                        currencySymbol: '$',
                                        alwaysDecimals: true,
                                        thousandSeparator: ',',
                                        fieldLabel: 'Currency Rate',
                                        labelAlign: 'top',
                                        fieldStyle: 'text-align: right;',
                                        //allowBlank: false,
                                        //readOnly: true,
                                        //editable: false,
                                        listeners: {
                                            blur: function(field, The, eOpts) {

                                            }
                                        }
                                    }
                                ]
                            },*/
                            // General Charges
                            /*{
                                xtype: 'fieldset',
                                title: 'General Charges',
                                columnWidth: 0.7,
                                padding: '0 5 5 5',
                                margin: '0 0 0 5',
                                layout: 'column',
                                items: [
                                    // Grid General Charges
                                    {
                                        xtype: 'grid',
                                        itemId: 'gridGeneralCharges',
                                        autoScroll: true,
                                        viewConfig: {
                                            stripeRows: true
                                        },
                                        columnWidth: 1,
                                        minHeight: 210,
                                        maxHeight: 210,
                                        margin: '0 0 0 0',
                                        store: storeGeneralCharges,
                                        columns: [
                                            // Description
                                            {
                                                xtype: 'gridcolumn',
                                                flex: 1,
                                                dataIndex: 'ChargeDescName',
                                                text: 'Description',
                                                editor: {
                                                    xtype: 'combo',
                                                    displayField: 'ChargeDescName',
                                                    valueField: 'ChargeDescId',
                                                    name: 'ChargeDescId',
                                                    fieldStyle: 'font-size:11px',
                                                    queryMode: 'local',
                                                    typeAhead: true,
                                                    minChars: 2,
                                                    allowBlank: false,
                                                    forceSelection: true,
                                                    emptyText: 'Choose Category',
                                                    autoSelect: false,
                                                    matchFieldWidth: false,
                                                    listConfig: {
                                                        width: 400
                                                    },
                                                    listeners: {
                                                        change: function(field) {
                                                            var form = field.up('panel');
                                                            form.onFieldChange();
                                                        },
                                                        select: function(field, records, eOpts) {
                                                            var form = field.up('panel'),
                                                                record = form.context.record;

                                                            if (records.length > 0) {
                                                                record.set('ChargeDescName', field.getRawValue());
                                                            }
                                                        },
                                                        beforequery: function(record) {
                                                            record.query = new RegExp(record.query, 'i');
                                                            record.forceAll = true;
                                                        }
                                                    },
                                                    //selectOnFocus: true,
                                                    store: storeChargesDescriptions
                                                }
                                            },
                                            // Factor
                                            {
                                                xtype: 'numbercolumn',
                                                flex: 0.25,
                                                dataIndex: 'GChargeFactor',
                                                text: 'Factor (%)',
                                                align: 'right',
                                                format: '000.00',
                                                summaryType: 'sum',
                                                editor: {
                                                    xtype: 'numericfield',
                                                    margin: '0 0 0 5',
                                                    name: 'GChargeFactor',
                                                    hideTrigger: true,
                                                    useThousandSeparator: true,
                                                    //decimalPrecision: 5,
                                                    alwaysDisplayDecimals: true,
                                                    allowNegative: false,
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

                                                            // var form = field.up('form'),
                                                            //     tasa = form.down('field[name=POVCurrencyRate]').getValue();
                                                            // field.next().setValue(newValue * tasa);
                                                        }
                                                    }
                                                }
                                            },
                                            // Amount
                                            {
                                                xtype: 'numbercolumn',
                                                flex: 0.25,
                                                dataIndex: 'GChargeAmount',
                                                text: 'Amount',
                                                align: 'right',
                                                renderer: Ext.util.Format.usMoney,
                                                summaryType: 'sum',
                                                editor: {
                                                    xtype: 'numericfield',
                                                    margin: '0 0 0 5',
                                                    name: 'GChargeAmount',
                                                    hideTrigger: true,
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

                                                            // var form = field.up('form'),
                                                            //     tasa = form.down('field[name=POVCurrencyRate]').getValue();
                                                            // field.next().setValue(newValue * tasa);
                                                        }
                                                    }
                                                }
                                            },
                                            // Delete Column
                                            {
                                                xtype: 'actioncolumn',
                                                width: 30,
                                                hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                                                items: [{
                                                    handler: me.onClickDeleteColumn,
                                                    scope: me,
                                                    iconCls: 'app-page-delete',
                                                    tooltip: 'Delete'
                                                }]
                                            }
                                        ],
                                        tbar: [{
                                                xtype: 'component',
                                                flex: 1
                                            }, {
                                            text: 'Add',
                                            itemId: 'addgeneralCharge',
                                            handler: function() {
                                                var me = this.up('gridpanel').up('form'),
                                                    grid = this.up('gridpanel'),
                                                    count = grid.getStore().count();

                                                rowEditingGeneralCharges.cancelEdit();

                                                var r = Ext.create('IAMTrading.model.GeneralCharges', {
                                                    QHeaderId: me.currentRecord.data.QHeaderId
                                                });

                                                grid.store.insert(count, r);
                                                rowEditingGeneralCharges.startEdit(count, 0);
                                            }
                                        }],
                                        selType: 'rowmodel',
                                        plugins: [rowEditingGeneralCharges],
                                        listeners: {
                                            selectionchange: function(view, records, eOpts) {
                                                // var me = this.up('form'),
                                                //     toolbar = me.down('toolbar');

                                                // if (toolbar.isEditing === true) {
                                                //     this.down('#removeGeneralCharge').setDisabled(!records.length);
                                                // }
                                            }
                                        }
                                    }
                                ]
                            },*/
                            // Grid Quote Details
                            {
                                margin: '5 5 5 0',
                                xtype: 'gridpanel',
                                itemId: 'gridQuoteDetails',
                                store: storeQuoteDetail,
                                title: 'Detail',
                                columnWidth: 1,
                                minHeight: 300,
                                maxHeight: (screen.height / 100) * 70,
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
                                tbar: [/*{
                                    xtype: 'searchfield',
                                    width: '30%',
                                    itemId: 'searchfield',
                                    name: 'searchField',
                                    listeners: {
                                        'triggerclick': function(field) {
                                            me.onSearchFieldDetailChange();
                                        }
                                    }
                                }, */
                                {
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
                                            QHeaderId: me.currentRecord.data.QHeaderId
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
                    itemId: 'btnSave',
                    text: 'Save Changes',
                    formBind: (IAMTrading.GlobalSettings.getCurrentUserLevel() > -1) ? true : false,
                    //disabled: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                    listeners: {
                        click: {
                            fn: me.onSaveChanges,
                            scope: this
                        }
                    }
                }]
            }],
            listeners: {
                render: {
                    fn: me.onRenderForm,
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

    onRenderForm: function() {
        this.down('field[name=QHeaderReference]').focus(true, 200);

        if (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1 && !this.currentRecord.phantom) {
            Ext.Array.each(this.down('#mainContainer').items.items, function(item, index, allItems) {
                item.editable = false;
                item.formBind = false;
                item.setReadOnly(true);
            });
        }

        this.getProfit();

        this.getCustomsClearence();
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
            success: function(record, operation) {
                Ext.Msg.hide();
                var form = me.callerForm,
                    grid = form.down('#gridQuoteHeader'),
                    searchField = form.down('#searchfield');

                me.destroy();

                var qHeaderReference = record.data.QHeaderReference;

                if (isPhantom) {
                    searchField.setValue(qHeaderReference);

                    if (grid) {
                        form.onSearchFieldChange();
                    }
                }
            },
            failure: function() {
                Ext.Msg.hide();
            }
        });
    },

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        if ((IAMTrading.GlobalSettings.getCurrentUserLevel() === -1)) return;
        var me = this.up('panel');

        me.editingPlugin.startEdit(record, 1);
        me.editingPlugin.editor.down('field[name=POrderDate]').focus(true, 200);
    },

    onClickActionColumnPOV: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel');

        me.editingPlugin.startEdit(record, 1);
        me.editingPlugin.editor.down('field[name=POVDate]').focus(true, 200);
    },


    onPOCheckChange: function(comp, rowIndex, checked, eOpts) {
        var me = this,
            record = me.down('#gridPOrders').store.getAt(rowIndex);

        if (hasOwnProperty(record.modified, "POrderManagerChecked")) {
            record.save();
        }
    },

    recalcTotals: function() {
        var me = this,
            store = this.down('#gridPOrders').store;

        me.checkBalance('PO', store);
        me.checkBalance('IN', store);

        me.getProfit();

    },

    checkBalance: function(type, store) {
        var me = this;
        var amountNB = 0,
            amount = 0,
            pay = 0,
            poAmount = 0,
            pOrderParentType = type,
            netIncome = 0,
            icAmount = 0,
            amountPO = 0,
            porFacturarBs = 0,
            balanceFacturasBs = 0,
            hasPU = false,
            facturadoBS = 0,
            amountPONB = 0,
            amountPU = 0,
            amountPUNB = 0,
            ivaFacturasBs = 0;

        for (i = 0; i < store.getCount(); i++) {
            var record = store.data.items[i];

            if (!record.phantom) {
                porderType = record.get("POrderType");

                if (porderType === "PB" || porderType === "PP") {
                    pay += record.get("POrderAmount");
                }

                if (porderType === "PB" || porderType === "PP" || porderType === "IC" || porderType === "CI" || porderType === pOrderParentType) {
                    amount += record.get("POrderAmount");
                }

                if (porderType === "PB" || porderType === "PP" || porderType === pOrderParentType) {
                    amountNB += record.get("POrderAmountNB");
                }

                if (porderType === pOrderParentType)
                    poAmount = record.get("POrderAmount");

                if (pOrderParentType === 'IN' && porderType === 'IC')
                    poAmount += record.get("POrderAmount");

                if (porderType === 'IN' || porderType === 'IC' || porderType === 'CN' || porderType === "CI")
                    netIncome += record.get("POrderAmount");

                if (porderType === 'IN' || porderType === 'CN')
                    facturadoBS += record.get("pOrderAmountNB");

                if (porderType === 'PU') {
                    hasPU = true;
                    amountPU = record.get('POrderAmount');
                    amountPUNB = record.get('POrderAmountNB');
                }

                if (porderType === 'PO')
                    amountPO += record.get('POrderAmount');

                if (porderType === 'PB' || porderType === 'IN' || porderType === 'CN') {
                    balanceFacturasBs += record.get("POrderAmountNB");
                }

                if (porderType === 'PI' || porderType === 'PN')
                    ivaFacturasBs += record.get("POrderAmountNB");
            }
        }

        if (hasPU) {
            amountPO = amountPU;
            amountPONB = amountPUNB;
        }

        porFacturarBs = amountPONB + ((facturadoBS) * -1);

        // if(porderType === 'IN') {
        //     porFacturarBs += record.get("POrderAmountNB")*-1;
        // }


        if (netIncome === 0)
            netIncome = amountPO * 0.8;

        me.down('field[name=NetIncome]').setValue(netIncome);
        me.down('field[name=PorFacturarBs]').setValue(porFacturarBs);
        me.down('field[name=BalanceFacturasBs]').setValue(balanceFacturasBs);
        me.down('field[name=IvaFacturasBs]').setValue(ivaFacturasBs);

        if (poAmount === 0) {
            me.down('field[name=BalanceBs]').setValue(0);
            //me.down('field[name=Result'+type+']').setValue(0);
            return;
        }

        me.down('field[name=BalanceBs]').setValue(amountNB);

        if (amountNB !== 0) {
            amountNB = (amountNB / me.callerForm.up('app_viewport').down('#dolartoday').getValue()) * -1;
            amountNB = pay + amountNB;
            amountNB = poAmount + amountNB;
        } else {
            amountNB = amount;
        }

        amountNB = amountNB.toFixed(2) * -1;

        //me.down('field[name=Result'+type+']').setValue(amountNB);
    },

    onPOrderTypeBlur: function(field, record) {
        var me = this,
            store = record.store;

        if (store.getCount() === 0) return;

        for (i = 0; i < store.getCount(); i++) {
            var curRec = store.data.items[i];
            if (curRec.data.POrderType === 'PO') {
                field.next().setValue(curRec.get('POrderDate'));
            }
        }
    },

    onPOrderPctPPChange: function(field) {
        var editingForm = field.up('form'),
            record = editingForm.context.record,
            amount = editingForm.down('field[name=POrderAmount]').getValue();

        var me = this,
            store = record.store;

        if (store.getCount() === 0) return;

        for (i = 0; i < store.getCount(); i++) {
            var curRec = store.data.items[i];
            if (curRec.data.POrderType === 'PO') {
                editingForm.down('field[name=POrderAmountNB]').setValue(curRec.get('POrderAmountNB') * (field.value / 100));
                var fieldAmount = editingForm.down('field[name=POrderAmount]'),
                    tasa = editingForm.down('field[name=POrderCurrencyRate]').getValue(),
                    newValue = editingForm.down('field[name=POrderAmountNB]').getValue();
                fieldAmount.setValue((newValue / tasa).toFixed(2));
            }
        }
    },

    getProfit: function() {
        var me = this,
            qHeaderId = (me.currentRecord) ? me.currentRecord.data.QHeaderId : 0,
            fieldProfit = me.down('field[name=POVProfit]');

        Ext.Ajax.request({
            method: 'GET',
            type: 'json',
            headers: {
                'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
            },
            params: {
                QHeaderId: qHeaderId
            },
            url: IAMTrading.GlobalSettings.webApiPath + 'GetProfit',
            success: function(rsp) {
                var data = Ext.JSON.decode(rsp.responseText),
                    rate = (data) ? data.data : fieldProfit.getValue();

                fieldProfit.setValue(rate);
                //Ext.Msg.hide();
            },
            failure: function() {
                //Ext.Msg.hide();
            }
        });
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

            formPost.append("QHeaderId", values.QHeaderId);
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
        // var me = this;

        // var form = Ext.widget('showimage', {
        //     modal: true,
        //     frameHeader: true,
        //     header: true,
        //     layout: {
        //         type: 'column'
        //     },
        //     closable: true,
        //     stateful: false,
        //     floating: true,
        //     callerForm: me,
        //     forceFit: true,
        //     title: record.data.DocDesc,
        //     AttachId: record.data.x_AttachId
        // });

        // form.show();

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
    },

    getCustomsClearence: function() {
        var me = this;

        var filtersFields = JSON.stringify({fields: [
            { name: 'QHeaderId', value: '{0}'.format(me.currentRecord.data.QHeaderId), type: 'int' }, 
            { name: 'CClearenceMode', value: '0', type: 'int' }

        ]});

        var storeCustomsClearence = new IAMTrading.store.CustomsClearence().load({
            params: {
                fieldFilters: filtersFields,
                page: 0,
                start: 0,
                limit: 0
            },
            callback: function(records, success, eOpts) {
                if(!records[0]) return;

                var record = records[0];

                me.down("field[name=BrokerName]").setValue(record.data.BrokerName);
                me.down("field[name=CClearenceDate]").setValue(record.data.CClearenceDate);
                me.down("field[name=VendorName]").setValue(record.data.VendorName);
                me.down("field[name=CClearenceFactor]").setValue(record.data.CClearenceFactor);
                me.down("field[name=CClearenceCurrencyRate]").setValue(record.data.CClearenceCurrencyRate);
            }
        });
    },

    onBackToQuotes: function() {
        var vp  = this.up('app_viewport');
        var that = this;
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
    },

    loadGeneralChargesPluginEdit: function() {
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
                            grid.up('form').recalcTotals();
                        }
                    }
                },
                edit: {
                    fn: function(editor, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;

                        record.save({
                            callback: function() {
                                grid.store.reload({
                                    callback: function() {
                                        if (fromEdit && isPhantom)
                                            grid.up('panel').down("#addlineGG").fireHandler();
                                        grid.up('form').recalcTotals();
                                    }
                                });
                            }
                        });
                    }
                }
            }
        });
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
    }
});