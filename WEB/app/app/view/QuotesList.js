Ext.define('IAMTrading.view.QuotesList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.quoteslist',
    xtype: 'QuotesList',
    layout: {
        type: 'column'
    },

    bodyPadding: '0 10 10 10',

    title: 'Quotes',

    initComponent: function() {
        var me = this,
            userLevel = IAMTrading.GlobalSettings.getCurrentUserLevel();

        var firstDayOfYear = new Date();

        firstDayOfYear = new Date(firstDayOfYear.getFullYear(), 0, 1);

        var storeQuoteHeader = new IAMTrading.store.QuoteHeader({
            autoLoad: false,
            pageSize: Math.round(((screen.height * (70 / 100)) - 40) / 35)
        });

        var storeQuoteDetail = null;

        var selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: true,
            listeners: {
                select: function(model, record) {
                    record.set('x_Selected', true);
                },
                deselect: function(model, record) {
                    record.set('x_Selected', false);
                }
            }
        });

        var storeChart = new IAMTrading.store.QuoteChart();

        var filters = {
            ftype: 'filters',
            // encode and local configuration options defined previously for easier reuse
            encode: true, // json encode the filter query
            //local: local, // defaults to false (remote filtering)

            // Filters are most naturally placed in the column definition, but can also be
            // added here.
            filters: [{
                type: 'string',
                dataIndex: 'QHeaderStatusInfo'
            }]
        };

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
                        margin: '20 10 0 10',
                        width: 115,
                        xtype: 'checkbox',
                        name: 'ShowOnlySelected',
                        labelSeparator: '',
                        hideLabel: true,
                        boxLabel: 'Show only selected',
                        listeners: {
                            change: function(field, newValue, oldValue, eOpts) {
                                var me = this.up('form');
                                var grid = field.up('panel').down('gridpanel');
                                if (field.value) {
                                    grid.store.filter("x_Selected", true);
                                    me.RecalcTotals(true);
                                } else {
                                    grid.store.clearFilter();
                                    me.RecalcTotals(true);
                                }
                            }
                        }
                    }, {
                        xtype: 'numericfield',
                        width: 70,
                        name: 'VWQuotes',
                        labelAlign: 'top',
                        fieldLabel: 'V.W (Libras)',
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
                        editable: false,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 70,
                        name: 'CFQuotes',
                        labelAlign: 'top',
                        fieldLabel: 'Cubic Feet',
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
                        editable: false,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 90,
                        name: 'ProfitQuotes',
                        labelAlign: 'top',
                        fieldLabel: 'Profit',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: '$',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 90,
                        name: 'CostQuotes',
                        labelAlign: 'top',
                        labelWidth: 20,
                        fieldLabel: 'Cost',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: '$',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: (userLevel === -1) ? 120 : 90,
                        name: 'TotalQuotes',
                        labelAlign: 'top',
                        labelWidth: 40,
                        fieldLabel: (userLevel === -1) ? 'Total Consulta' : 'Total',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: '$',
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
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 120,
                        name: 'TotalQuotesBS',
                        labelAlign: 'top',
                        labelWidth: 40,
                        fieldLabel: (userLevel === -1) ? 'Total Bs Consulta' : 'Total Bs',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: 'Bs',
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
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: (userLevel === -1) ? 120 : 90,
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3, 4]),
                        name: 'ExchangeVariation',
                        labelAlign: 'top',
                        labelWidth: (userLevel === -1) ? 70 : 40,
                        fieldLabel: (userLevel === -1) ? 'Dif.Cambiaria Consulta' : 'Exchange Var',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: '$',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                if (newValue >= 0) {
                                    field.removeCls('var-negative');
                                    //field.addCls('var-positive');
                                } else {
                                    //field.removeCls('var-positive');
                                    field.addCls('var-negative');
                                }
                            }
                        }
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 90,
                        name: 'x_NetProfit',
                        labelAlign: 'top',
                        labelWidth: 40,
                        fieldLabel: 'Net Profit',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: '$',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 90,
                        name: 'x_InternalCharges',
                        labelAlign: 'top',
                        labelWidth: 40,
                        fieldLabel: 'Internal Charges',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        currencySymbol: '$',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: true //,
                            //hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 120,
                        name: 'x_TotalPorAprobacion',
                        labelAlign: 'top',
                        labelWidth: (userLevel === -1) ? 70 : 40,
                        fieldLabel: 'Total En Analisis',
                        labelSeparator: '',
                        labelStyle: 'text-align: right;',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        currencySymbol: '$',
                        alwaysDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: userLevel !== -1
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 80,
                        name: 'x_CountPorAprobacion',
                        labelAlign: 'top',
                        labelWidth: (userLevel === -1) ? 70 : 40,
                        fieldLabel: 'por aprobacion',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        //currencySymbol:'$',
                        alwaysDecimals: false,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: false,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: userLevel !== -1
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: (userLevel === -1) ? 120 : 40,
                        name: 'DaysProm',
                        labelAlign: 'top',
                        fieldLabel: (userLevel === -1) ? 'Dias Promedio Aprob.' : 'Days',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        //currencySymbol:'$',
                        alwaysDecimals: false,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: false,
                        allowNegative: true,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 120,
                        name: 'x_GrandInvoiceBalance',
                        labelAlign: 'top',
                        labelWidth: (userLevel === -1) ? 70 : 40,
                        fieldLabel: 'Balance Bs.',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        //currencySymbol: 'Bs',
                        alwaysDecimals: true,
                        alwaysDisplayDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 120,
                        name: 'x_GrandPOBalance',
                        labelAlign: 'top',
                        labelWidth: (userLevel === -1) ? 70 : 40,
                        fieldLabel: 'Balance $',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        //currencySymbol: 'Bs',
                        alwaysDecimals: true,
                        alwaysDisplayDecimals: true,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false
                    }, {
                        margin: '0 0 0 5',
                        xtype: 'numericfield',
                        width: 120,
                        name: 'x_GrandPaid',
                        labelAlign: 'top',
                        labelWidth: 40,
                        fieldLabel: 'Paid Bs.',
                        fieldStyle: 'text-align: right; color: green; font-weight: bold',
                        labelStyle: 'text-align: right;',
                        //currencySymbol:'Bs',
                        alwaysDecimals: false,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        alwaysDisplayDecimals: false,
                        allowNegative: false,
                        thousandSeparator: ',',
                        selectOnFocus: true,
                        readOnly: true,
                        editable: false,
                        hidden: userLevel == -1
                    }, {
                        margin: '0 0 0 5',
                        width: 90,
                        xtype: 'combo',
                        displayField: 'name',
                        valueField: 'name',
                        value: 'All',
                        labelAlign: 'top',
                        fieldLabel: 'Show only',
                        name: 'cboWithInvoiceFilter',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 1,
                        allowBlank: false,
                        forceSelection: true,
                        emptyText: 'choose filter',
                        enableKeyEvents: true,
                        autoSelect: true,
                        selectOnFocus: true,
                        store: {
                            fields: ['name'],
                            data: [{
                                "name": "All"
                            }, {
                                "name": "With Invoice"
                            }, {
                                "name": "For Invoice"
                            }, {
                                "name": "Ex.V +"
                            }, {
                                "name": "Ex.V -"
                            }]
                        },
                        listeners: {
                            'change': function(field) {
                                me.onSearchFieldChange();
                            }
                        }
                    }]
                },
                // Search and filter
                {
                    margin: '10 0 10 0',
                    xtype: 'container',
                    columnWidth: 1,
                    layout: {
                        type: 'column'
                    },
                    items: [
                        // Search Field
                        {
                            xtype: 'searchfield',
                            columnWidth: 0.25,
                            itemId: 'searchfield',
                            name: 'searchField',
                            listeners: {
                                'triggerclick': function(field) {
                                    me.onSearchFieldChange();
                                }
                            }
                        }, {
                            margin: '0 0 0 10',
                            columnWidth: 0.09,
                            xtype: 'combo',
                            //fieldLabel: 'Status Info.',
                            displayField: 'name',
                            valueField: 'name',
                            value: 'Received',
                            name: 'cboDateFilter',
                            queryMode: 'local',
                            typeAhead: true,
                            minChars: 1,
                            allowBlank: false,
                            forceSelection: true,
                            emptyText: 'choose filter',
                            enableKeyEvents: true,
                            autoSelect: true,
                            selectOnFocus: true,
                            store: {
                                fields: ['name'],
                                data: [{
                                    "name": "Received"
                                }, {
                                    "name": "Paid"
                                }, {
                                    "name": "Invoiced"
                                }]
                            }
                        }, {
                            margin: '0 0 0 5',
                            xtype: 'datefield',
                            columnWidth: 0.15,
                            fieldLabel: 'From',
                            name: 'DateFrom',
                            labelWidth: 30,
                            labelStyle: 'text-align:right',
                            format: 'd/m/Y',
                            listeners: {
                                change: function(field, newValue, oldValue) {
                                    var valor = field.getRawValue();
                                    if (String.isNullOrEmpty(valor)) {
                                        me.onSearchFieldChange();
                                    }
                                }
                            }
                        }, {
                            xtype: 'datefield',
                            columnWidth: 0.15,
                            labelWidth: 30,
                            fieldLabel: 'To',
                            name: 'DateTo',
                            labelAlign: 'right',
                            format: 'd/m/Y',
                            listeners: {
                                change: function(field, newValue, oldValue) {
                                    var valor = field.getRawValue();
                                    if (String.isNullOrEmpty(valor)) {
                                        me.onSearchFieldChange();
                                    }
                                }
                            }
                        }, {
                            margin: '0 0 0 10',
                            xtype: 'numericfield',
                            width: 200,
                            name: 'filterBalance',
                            //labelAlign: 'top',
                            labelWidth: 85,
                            fieldLabel: 'Balance mayor a',
                            //fieldStyle: 'text-align: right; color: green; font-weight: bold',
                            labelStyle: 'text-align: right;',
                            currencySymbol: 'Bs',
                            alwaysDecimals: false,
                            hideTrigger: true,
                            useThousandSeparator: true,
                            alwaysDisplayDecimals: false,
                            allowNegative: false,
                            thousandSeparator: ',',
                            selectOnFocus: true,
                            listeners: {
                                change: function(field, newValue, oldValue) {
                                    var valor = field.getRawValue();
                                    if (String.isNullOrEmpty(valor)) {
                                        me.onSearchFieldChange();
                                    }
                                }
                            }
                        }, {
                            margin: '0 0 0 10',
                            columnWidth: 0.05,
                            xtype: 'button',
                            text: 'Find',
                            tooltip: 'Find by Date Received',
                            handler: function() {
                                var me = this.up('form');
                                me.onSearchFieldChange();
                            }
                        }, {
                            margin: '0 0 0 5',
                            width: 24,
                            xtype: 'button',
                            tooltip: 'Export Excel',
                            iconCls: 'excel',
                            handler: function() {
                                var me = this.up('form');
                                me.onExportExcel();
                            }
                        }, {
                            xtype: 'component',
                            flex: 1
                        },
                        // Buttons on Grid Header
                        {
                            margin: '0 0 0 15',
                            columnWidth: 0.1,
                            xtype: 'button',
                            text: 'New Quote',
                            disabled: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4])),
                            handler: function() {
                                record = Ext.create('IAMTrading.model.QuoteHeader');

                                var form = new IAMTrading.view.EditQuoteHeader();
                                form.loadRecord(record);
                                form.center();
                                form.callerForm = this.up('form');
                                form.show();
                            }
                        }
                    ]
                },
                // Grid Quote List
                {
                    xtype: 'gridpanel',
                    itemId: 'gridQuoteHeader',
                    autoScroll: false,
                    scrollable: false,
                    viewConfig: {
                        stripeRows: true
                    },
                    //title: 'Header',
                    columnWidth: 1,
                    minHeight: (screen.height * (65 / 100)).toFixed(0) - 115,
                    maxHeight: (screen.height * (65 / 100)).toFixed(0) - 115,
                    margin: '0 5 5 0',
                    store: storeQuoteHeader,
                    columns: [{
                        xtype: 'rownumberer',
                        width: 30
                    }, {
                        xtype: 'gridcolumn',
                        width: 75,
                        dataIndex: 'QHeaderDate',
                        text: 'Date',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    }, {
                        xtype: 'gridcolumn',
                        width: 200,
                        dataIndex: 'QHeaderReference',
                        text: 'Reference'
                    }, {
                        xtype: 'gridcolumn',
                        width: 80,
                        dataIndex: 'QHeaderOC',
                        text: 'Num. Order'
                    }, {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'x_CustName',
                        text: 'Customer',
                    }, {
                        xtype: 'gridcolumn',
                        width: 74,
                        dataIndex: 'QHeaderOCDate',
                        text: 'Date Order',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y'),
                        hidden: true
                    }, {
                        xtype: 'gridcolumn',
                        width: 74,
                        dataIndex: 'x_DateOrderReceived',
                        text: 'Received',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    }, {
                        xtype: 'numbercolumn',
                        width: 45,
                        dataIndex: 'x_DateApproved',
                        text: 'Days',
                        tooltip: 'Days Approved',
                        align: 'right',
                        format: '0,000',
                        hidden: true,
                        renderer: function(value, metaData, record) {
                            var daysProm = record.data.x_DaysAvg,
                                daysHalf = (daysProm / 2).toFixed(0);

                            if (value <= daysHalf) {
                                metaData.style = "color:green; font-weight: bold";
                                return value;
                            } else if (value < daysProm) {
                                metaData.style = "color:orange; font-weight: bold";
                                return value;
                            } else {
                                metaData.style = "color:red; font-weight: bold";
                                return value;
                            }
                        },
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'x_PORate',
                        text: 'Rate Order',
                        align: 'right',
                        hidden: (userLevel !== -1)
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'x_PBRate',
                        text: 'Rate Conver.',
                        tooltip: 'Rate Converted',
                        align: 'right',
                        hidden: (userLevel !== -1)
                    }, {
                        xtype: 'gridcolumn',
                        width: 75,
                        dataIndex: 'x_PaidDate',
                        text: 'Paid Date',
                        renderer: Ext.util.Format.dateRenderer('d/m/Y')
                    }, {
                        xtype: 'gridcolumn',
                        width: 80,
                        dataIndex: 'x_VendorName',
                        text: 'Vendor',
                        //hidden: true
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        xtype: 'gridcolumn',
                        width: 80,
                        dataIndex: 'x_BrokerName',
                        text: 'Broker'
                    }, {
                        xtype: 'gridcolumn',
                        width: 165,
                        dataIndex: 'x_StatusName',
                        text: 'Status'
                    }, {
                        xtype: 'gridcolumn',
                        width: 100,
                        dataIndex: 'QHeaderStatusInfo',
                        text: 'Sta. Info',
                        filterable: true,
                        renderer: function(value, metaData, record) {
                            if (value === "POR REEMPLAZO") {
                                metaData.tdCls += ' blink';
                                metaData.style += "color:red; ; font-weight: bold";
                                metaData.tdAttr += ' data-qtip="' + record.data.QHeaderOC + '"';
                                return value;
                            } else {
                                return value;
                            }
                        }
                    }, {
                        xtype: 'gridcolumn',
                        width: 70,
                        dataIndex: 'x_Condition',
                        text: 'Condition',
                        hidden: true //(userLevel === -1)
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'x_Cost',
                        text: 'Cost',
                        align: 'right',
                        renderer: function(value, metaData, record) {
                            if (value === 0 || value === null) {
                                metaData.style = "color:red;";
                                return Ext.util.Format.usMoney(value);
                            } else {
                                return Ext.util.Format.usMoney(value);
                            }
                        },
                        //renderer: Ext.util.Format.usMoney,
                        hidden: (userLevel === -1)
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'x_Total',
                        text: 'Total',
                        align: 'right',
                        renderer: Ext.util.Format.usMoney
                    }, {
                        xtype: 'numbercolumn',
                        width: 120,
                        dataIndex: 'x_TotalBS',
                        text: 'Total Bs.',
                        align: 'right',
                        renderer: Ext.util.Format.bsMoney
                    }, {
                        xtype: 'numbercolumn',
                        width: 85,
                        dataIndex: 'x_Profit',
                        text: 'Profit',
                        align: 'right',
                        //renderer: Ext.util.Format.usMoney,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4])),
                        renderer: function(value, metaData, record) {
                            if (value < 0) {
                                metaData.style = "color:red;";
                                return Ext.util.Format.usMoney(value);
                            } else {
                                return Ext.util.Format.usMoney(value);
                            }
                        }
                    }, {
                        xtype: 'numbercolumn',
                        width: 60,
                        dataIndex: 'x_ProfitPct',
                        text: 'Pr. %',
                        align: 'right',
                        format: '##0.00',
                        //renderer: Ext.util.Format.usMoney,
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4])),
                        renderer: function(value, metaData, record) {
                            if (value < 0) {
                                metaData.style = "color:red;";
                                return value;
                            } else {
                                return value;
                            }
                        }
                    }, {
                        xtype: 'numbercolumn',
                        width: 80,
                        dataIndex: 'x_ExchangeVariation',
                        text: (userLevel === -1) ? 'Dif.C' : 'Ex.V',
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
                        xtype: 'numbercolumn',
                        width: 100,
                        dataIndex: 'x_Paid',
                        text: 'Paid Bs.',
                        align: 'right',
                        format: '#,##0.00',
                        hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4])),
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'x_InvoiceBalance',
                        text: 'Balance Bs',
                        align: 'right',
                        format: '#,##0.00',
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'POBalance',
                        text: 'Balance $',
                        align: 'right',
                        //format: '#,##0.00',
                        renderer: function(value, metaData, record) {
                                var dt = Ext.getCmp("IAMAppHeader").down("#dolartoday").getValue();
								var originValue = value;
                                value = (record.data.x_InvoiceBalance / dt).toFixed(2);
                                return record.data.QHeaderCurrencyNA ? Ext.util.Format.usMoney(originValue) : Ext.util.Format.usMoney(value);

                                /*if (record.data.x_InvoiceBalance > 1) {
                                    metaData.style = "color:red;";
                                    return Ext.util.Format.usMoney(value);
                                } else {
                                    return Ext.util.Format.usMoney(value);
                                }*/
                            }
                            //hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        xtype: 'numbercolumn',
                        width: 95,
                        dataIndex: 'POBalance',
                        text: 'Balance $',
                        align: 'right',
                        format: '#,##0.00',
                        hidden: true
                            //hidden: (userLevel === -1 || IAMTrading.GlobalSettings.deniedAccess([3, 4]))
                    }, {
                        xtype: 'actioncolumn',
                        width: 25,
                        iconCls: 'app-grid-edit',
                        tooltip: 'edit',
                        handler: function(grid, rowIndex, colIndex) {
                            var me = this.up('form');
                            var record = grid.getStore().getAt(rowIndex);
                            me.onClickEditHeader(record);
                        }
                    }, {
                        xtype: 'actioncolumn',
                        width: 25,
                        items: [{
                            iconCls: 'app-find',
                            tooltip: 'view details'
                        }],
                        listeners: {
                            click: {
                                fn: me.onClickViewDetails,
                                scope: me
                            }
                        }
                    }, {
                        xtype: 'actioncolumn',
                        width: 30,
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3, 4]),
                        items: [{
                            handler: me.onClickDeleteColumn,
                            scope: me,
                            iconCls: 'app-page-delete',
                            tooltip: 'Delete'
                        }]
                    }],
                    features: [filters],
                    selModel: 'rowmodel', //selModel,
                    dockedItems: [{
                        xtype: 'pagingtoolbar',
                        itemId: 'pagingtoolbar',
                        store: storeQuoteHeader,
                        displayInfo: true,
                        dock: 'bottom',
                        displayMsg: 'Displaying records {0} - {1} of {2}',
                        emptyMsg: "No records to display",
                        listeners: {
                            change: function(pageTool, pageData, eOpts) {
                                var me = this.up('form');
                                me.RecalcTotals();
                            }
                        }
                    }],
                    // Grid Quote Header Listeners
                    listeners: {
                        selectionchange: {
                            fn: me.onSelectChange,
                            scope: me
                        },
                        celldblclick: function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                            var me = grid.up('form');
                            me.onClickEditHeader(record);
                        },
                        viewready: function(grid) {
                            var view = grid.view;

                            // record the current cellIndex
                            grid.mon(view, {
                                uievent: function(type, view, cell, recordIndex, cellIndex, e) {
                                    grid.cellIndex = cellIndex;
                                    grid.recordIndex = recordIndex;
                                }
                            });

                            grid.tip = Ext.create('Ext.tip.ToolTip', {
                                target: view.el,
                                delegate: '.x-grid-cell',
                                trackMouse: true,
                                renderTo: Ext.getBody(),
                                listeners: {
                                    beforeshow: function updateTipBody(tip) {
                                        if (!Ext.isEmpty(grid.cellIndex) && grid.cellIndex !== -1) {
                                            header = grid.headerCt.getGridColumns()[grid.cellIndex];
                                            tip.update(grid.getStore().getAt(grid.recordIndex).get(header.dataIndex));
                                        }
                                    }
                                }
                            });
                        }
                    }
                },
                // Graph
                {
                    xtype: 'chart',
                    itemId: 'quoteChartA',
                    columnWidth: 0.5,
                    height: 225,
                    store: storeChart,
                    style: 'background:#fff',
                    animate: true,
                    legend: {
                        visible: false,
                        position: 'right'
                    },
                    //theme: 'Category1',
                    axes: [{
                        type: 'Numeric',
                        position: 'left',
                        fields: ['Total', 'GY', 'INV'],
                        //title: 'Orders',
                        grid: true,
                        label: {
                            renderer: function(v) {
                                //return String(parseFloat(v)/1000000)+'M';
                                return Ext.util.Format.number(v, '0,000.00');
                            }
                        }
                    }, {
                        type: 'Category',
                        position: 'bottom',
                        fields: ['Month'],
                        //title: 'Month'
                    }],
                    series: [{
                        type: 'line',
                        highlight: {
                            size: 5,
                            radius: 5
                        },
                        axis: 'left',
                        xField: 'Month',
                        yField: ['Total'],
                        smooth: true,
                        fill: true,
                        markerConfig: {
                            type: 'circle',
                            size: 4,
                            radius: 4,
                            'stroke-width': 0
                        },
                        tips: {
                            trackMouse: true,
                            width: 140,
                            height: 28,
                            renderer: function(storeItem, item) {
                                var showValue = Ext.util.Format.number(item.value[1], '0,000.00');
                                this.setTitle(showValue);
                            }
                        }
                    }]
                }
            ],
            // Form Listeners
            listeners: {
                afterrender: {
                    fn: me.onRenderForm,
                    scope: me
                }
            }
        });

        /*if (userLevel === -1) {
            var filterCust = new Ext.util.Filter({
                property: 'CustId',
                value: 1
            });

            storeQuoteHeader.loadPage(1, {
                params: {
                    Role: userLevel
                },
                filters: [filterCust]
            });

        } else {
            storeQuoteHeader.loadPage(1, {
                params: {
                    Role: userLevel
                }
            });
        }*/

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;
        me.onSearchFieldChange(true);
    },

    onSearchFieldChange: function(fromOnRenderForm) {
        var me = this,
            userLevel = IAMTrading.GlobalSettings.getCurrentUserLevel(),
            field = me.down('#searchfield'),
            filterDateField = me.down('field[name=cboDateFilter]').getValue(),
            filterBalance = me.down('field[name=filterBalance]').getValue(),
            filterWithInvoice = me.down('field[name=cboWithInvoiceFilter]').getValue(),
            dateFrom = me.down('field[name=DateFrom]').getValue(),
            dateTo = me.down('field[name=DateTo]').getValue(),
            fieldValue = field.getRawValue(),
            grid = me.down('#gridQuoteHeader'),
            chartA = me.down('#quoteChartA');

        grid.store.removeAll();

        if (!fromOnRenderForm) {
            chartA.getEl().mask('Loading');
        }

        var filterCust = null;
        if (!String.isNullOrEmpty(fieldValue)) {
            if (userLevel === -1) {
                filterCust = new Ext.util.Filter({
                    property: 'CustId',
                    value: 1
                });

                grid.store.loadPage(1, {
                    params: {
                        query: fieldValue,
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    filters: [filterCust]
                });

                chartA.store.load({
                    params: {
                        query: fieldValue,
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    filters: [filterCust],
                    callback: function() {
                        chartA.getEl().unmask();
                    }
                });

            } else {
                grid.store.loadPage(1, {
                    params: {
                        query: fieldValue,
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    }
                });

                chartA.store.load({
                    params: {
                        query: fieldValue,
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    callback: function() {
                        chartA.getEl().unmask();
                    }
                });
            }
        } else {
            if (userLevel === -1) {
                filterCust = new Ext.util.Filter({
                    property: 'CustId',
                    value: 1
                });

                grid.store.loadPage(1, {
                    params: {
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    filters: [filterCust],
                    callback: function() {
                        me.RecalcTotals();
                        this.lastOptions.callback = null;
                    }
                });

                chartA.store.load({
                    params: {
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    filters: [filterCust],
                    callback: function() {
                        chartA.getEl().unmask();
                    }
                });
            } else {
                grid.store.loadPage(1, {
                    params: {
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    callback: function() {
                        me.RecalcTotals();
                        this.lastOptions.callback = null;
                    }
                });

                chartA.store.load({
                    params: {
                        DateFrom: dateFrom,
                        DateTo: dateTo,
                        FilterDateField: filterDateField,
                        Role: userLevel,
                        FilterBalance: filterBalance,
                        FilterShowWithInvoice: filterWithInvoice
                    },
                    callback: function() {
                        chartA.getEl().unmask();
                    }
                });
            }
        }
    },

    onClickEditHeader: function(record) {
        if (!Ext.isObject(record)) return;

        var callerForm = this;
        var selectedRecord = record;

        Ext.Msg.wait('Loading', 'Wait');

        var storeQuoteHeader = new IAMTrading.store.QuoteHeader().load({
            params: {
                id: selectedRecord.data.QHeaderId
            },
            callback: function() {
                selectedRecord = storeQuoteHeader.getAt(0);

                var storeVendors = new IAMTrading.store.Vendors().load({
                    params: {
                        id: selectedRecord.data.VendorId,
                        page: 1,
                        start: 0,
                        limit: 8
                    },
                    callback: function() {
                        var form = new IAMTrading.view.EditQuoteHeader({
                            currentRecord: selectedRecord,
                            title: 'Quote ' + record.data.QHeaderReference
                        });
                        form.down('field[name=VendorId]').bindStore(this);
                        form.down('field[name=VendorId]').setValue(selectedRecord.data.VendorId);
                        form.loadRecord(selectedRecord);
                        form.callerForm = callerForm;
                        form.center();
                        form.show();

                        Ext.Msg.hide();

                        this.lastOptions.callback = null;
                    }
                });

                this.lastOptions.callback = null;
            }
        });
    },

    onSelectChange: function(model, records) {
        var me = this;
    },

    onClickViewDetails: function(view, rowIndex, colIndex, item, e, record) {

        var me = view.panel.up('form'),
            grid = me.down('gridpanel');

        grid.getSelectionModel().select(record.index);

        if (record) {
            var qHeaderId = record.data.QHeaderId;

            var vp = this.up('app_viewport');

            vp.getEl().mask("Please Wait...");

            var formDetail = Ext.widget('quotedetailslist', {
                QHeaderId: qHeaderId,
                title: 'Details of ' + record.data.QHeaderReference
            });

            var storeQuoteDetail = new IAMTrading.store.QuoteDetails().load({
                params: {
                    QHeaderId: qHeaderId,
                    page: 0,
                    start: 0,
                    limit: 0
                },
                callback: function() {
                    var vp = me.up('app_viewport');

                    formDetail.down('gridpanel').reconfigure(storeQuoteDetail);

                    var panel = vp.down('app_ContentPanel');

                    me.hide(); //panel.removeAll();
                    panel.add(formDetail);

                    formDetail.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                formDetail.down("field[name=searchField]").focus(true, 200);
                            }
                        }
                    });

                    storeQuoteDetail.lastOptions.callback = null;
                    vp.getEl().unmask();
                }
            });
        }
    },

    RecalcTotals: function(fromChecked) {
        var me = this,
            userLevel = IAMTrading.GlobalSettings.getCurrentUserLevel(),
            grid = me.down('#gridQuoteHeader'),
            store = grid.store,
            totalInQuotes = 0,
            profitPct = 0,
            dateTo = new Date(),
            daysProm = 0,
            dt = me.up('app_viewport').down('#dolartoday').getValue();

        //me.down('field[name=x_ExchVarHistory]').setValue(store.max('x_ExchVarHistory'));
        var breakEven = store.max('x_GrandInvoiceBalance') / store.max('x_GrandPOBalance');
        me.down('field[name=x_GrandPaid]').setValue(store.max('x_GrandPaid'));
        me.down('field[name=x_GrandInvoiceBalance]').setValue(store.max('x_GrandInvoiceBalance'));
        //me.down('field[name=x_GrandPOBalance]').setValue(store.max('x_GrandPOBalance'));
        me.down('field[name=x_GrandPOBalance]').setValue((store.max('x_GrandInvoiceBalance') / dt).toFixed(2));
        me.down('field[name=x_TotalPorAprobacion]').setValue(store.max('x_TotalPorAprobacion'));
        me.down('field[name=x_CountPorAprobacion]').setValue(store.max('x_CountPorAprobacion'));
        //me.down('field[name=x_InternalCharges]').setValue(store.max('x_ICInQuotes'));

        var netProfit = store.max('x_ProfitInQuotes') + store.max('x_ExchangeVariationInQuotes');
        totalInQuotes = store.max('x_TotalInQuotes');
        if (totalInQuotes > 0)
            profitPct = (netProfit / totalInQuotes) * 100;
        me.down('field[name=x_NetProfit]').setFieldLabel('Net Profit (' + profitPct.toFixed(2) + ')');
        me.down('field[name=x_NetProfit]').setValue(netProfit);


        if (me.down('field[name=filterBalance]').getValue() > 0)
            me.up("app_viewport").down('field[name=BreakEven]').setValue(breakEven);

        if (!fromChecked) {
            for (i = 0; i < store.getCount(); i++) {
                store.data.items[i].set("x_ExchangeVariation", store.data.items[i].data.x_ExchangeVariation);
            }


            totalBSInQuotes = store.max('x_TotalBSInQuotes');
            profitPct = 0;

            me.down('field[name=TotalQuotes]').setValue(totalInQuotes);
            me.down('field[name=TotalQuotesBS]').setValue(totalBSInQuotes);
            me.down('field[name=ExchangeVariation]').setValue(store.max('x_ExchangeVariationInQuotes'));
            me.down('field[name=DaysProm]').setValue(store.max('x_DaysAvg'));

            //me.up('app_viewport').down('#dolariam').setValue(store.max('x_DolarIAM'));

            daysProm = store.max('x_DaysAvg');

            if (userLevel !== -1) {
                if (totalInQuotes > 0)
                    profitPct = (store.max('x_ProfitInQuotes') / totalInQuotes) * 100;

                me.down('field[name=VWQuotes]').setValue(store.max('x_VolumeWeightInQuotes'));
                me.down('field[name=CFQuotes]').setValue(store.max('x_CubicFeetInQuotes'));

                me.down('field[name=CostQuotes]').setValue(store.max('x_CostInQuotes'));
                me.down('field[name=ProfitQuotes]').setValue(store.max('x_ProfitInQuotes'));
                me.down('field[name=ProfitQuotes]').setFieldLabel('Profit (' + profitPct.toFixed(2) + ')');
            }
        } else {
            var record = null,
                volumeW = 0,
                cubicFeet = 0,
                cost = 0,
                profit = 0,
                exVar = 0,
                daysAvg = 0,
                count = 0,
                pORateIAM = 0,
                pORateIAMCount = 0;

            totalInQuotes = 0;

            for (i = 0; i < store.getCount(); i++) {
                record = store.data.items[i];

                if (record.data.x_Selected) {
                    totalInQuotes += record.data.QHeaderTotal;
                    volumeW += record.data.QHeaderVolumeWeight;
                    cubicFeet += record.data.QHeaderCubicFeet;
                    exVar += record.data.x_ExchangeVariation;
                    profit += record.data.x_Profit;
                    cost += record.data.QHeaderCost;
                    daysAvg += record.data.x_DateApproved;
                    pORateIAM += record.data.QHeaderCurrencyRate;
                    pORateIAMCount += (record.data.QHeaderCurrencyRate > 0) ? 1 : 0;
                }
            }

            if (pORateIAMCount > 0) pORateIAM = pORateIAM / pORateIAMCount;

            count = store.getCount();
            profitPct = 0;

            me.down('field[name=TotalQuotes]').setValue(totalInQuotes);
            me.down('field[name=ExchangeVariation]').setValue(exVar);

            //me.up('app_viewport').down('#dolariam').setValue(pORateIAM);

            if (totalInQuotes > 0)
                profitPct = (profit / totalInQuotes) * 100;

            me.down('field[name=VWQuotes]').setValue(volumeW);
            me.down('field[name=CFQuotes]').setValue(cubicFeet);

            me.down('field[name=CostQuotes]').setValue(cost);
            me.down('field[name=ProfitQuotes]').setValue(profit);
            me.down('field[name=ProfitQuotes]').setFieldLabel('Profit (' + profitPct.toFixed(2) + ')');

            me.down('field[name=DaysProm]').setValue(daysAvg / count);

            daysProm = (daysAvg / count).toFixed(0);
        }

        daysProm += 9;
        var dateFrom = datediff(daysProm, new Date());
        dateTo = datediff(-daysProm, dateTo);

        //if (!isNaN(dateFrom)) me.up('app_viewport').down('#dategy').setValue(dateFrom);


        if (!isNaN(dateTo)) {
            Ext.Ajax.request({
                method: 'GET',
                type: 'json',
                headers: {
                    'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
                },
                params: {
                    dateTo: dateTo
                },
                url: IAMTrading.GlobalSettings.webApiPath + 'GetRateOfDate',
                success: function(rsp) {
                    var data = Ext.JSON.decode(rsp.responseText),
                        rate = (data) ? data.data : 0;
                    dolarToday = me.up('app_viewport').down('#dolartoday').getValue();

                    // if (Ext && me.up('app_viewport')) {
                    //     me.up('app_viewport').down('#dolargy').setValue(dolarToday + (dolarToday - rate));
                    // }
                },
                failure: function() {
                    Ext.Msg.hide();
                }
            });
        }
    },

    onExportExcel: function() {
        var me = this,
            grid = me.down('#gridQuoteHeader');

        Ext.Msg.wait('Loading Report....', 'Wait');
        Ext.Ajax.request({
            url: '../wa/Reports/Export2Excel',
            method: 'GET',
            headers: {
                'Authorization-Token': IAMTrading.GlobalSettings.tokenAuth
            },
            params: grid.store.lastOptions.params,
            success: function(response) {
                var text = response.responseText;
                //window.open('../wa/Reports/GetPDFReport?_file=' + text, 'Quote Customer','width='+screen.width+',height='+screen.height);
                window.open('../wa/Reports/GetExcel?_file=' + text, 'Quotes');
                Ext.Msg.hide();
            }
        });
    },

    onClickDeleteColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this;

        var grid = me.down('gridpanel');

        var myCallback = function(btn, password, msgBox) {
            if (btn === "ok" && password === "241199") {
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
        };

        var myMsgBox = new Ext.window.MessageBox({
            cls: 'msgbox',
            bodyCls: 'popWindow'
        });
        myMsgBox.textField.inputType = 'password';
        myMsgBox.textField.width = 240;
        myMsgBox.textField.center();
        myMsgBox.prompt("Delete", 'Enter password', myCallback);
    }
});
