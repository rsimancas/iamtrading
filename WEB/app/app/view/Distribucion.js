Ext.define('IAMTrading.view.Distribucion', {
    extend: 'Ext.form.Panel',
    alias: 'widget.distribucion',
    title: 'Distribuci\u00F3n',

    headers: {'Content-type':'multipart/form-data'},

    layout: {
        type: 'column'
    },
    bodyPadding: 0,
    padding: '0 0 0 0',
    frameHeader: false,
    header: false,

    storeNavigator: null,

    CiudadId: 0,

    requires: [
    'Ext.ux.form.Toolbar',
    'Ext.ux.form.NumericField'
    ],

    previousDate: new Date(),

    initComponent: function() {
        var me = this;

        rowEditing = new Ext.grid.plugin.RowEditing({
            clicksToMoveEditor: 2,
            autoCancel: false,
            errorSummary: false,
            listeners: {
                beforeedit: {
                    //delay: 200,
                    fn: function (item, context) {
                        var toolbar = this.getEditor().up('form').down('formtoolbar');

                        if(toolbar.isEditing === false) {
                            return false;
                        }

                        this.getEditor().onFieldChange();
                    }
                },
                cancelEdit: { 
                    fn: function (rowEditing, context) {
                        var grid = this.editor.up('gridpanel');
                        // Canceling editing of a locally added, unsaved record: remove it
                        if (context.record.phantom) {
                            grid.store.remove(context.record);
                        }
                        grid.getView().refresh();
                    }
                },
                edit: {
                    fn: function (rowEditing, context) {
                        var grid = this.editor.up('gridpanel'),
                            record = context.record,
                            fromEdit = true,
                            isPhantom = record.phantom;

                        if(fromEdit && isPhantom)
                            grid.up('panel').down("#addline").fireHandler();

                        grid.getView().refresh();
                    }
                }
            }
        });

        storeClientesReparto = Ext.create('IAMTrading.store.Clientes').load({params:{page:0, start:0, limit:0}});
        storeClientes = Ext.create('IAMTrading.store.Clientes').load({params:{page:0, start:0, limit:0}});
        storeCiudadesReparto =  Ext.create('IAMTrading.store.Ciudades').load({params:{iata: 1, page:0, start:0, limit:0}});
        storeCiudades = Ext.create('IAMTrading.store.Ciudades').load({params:{iata: 1, page:0, start:0, limit:0}});
        storeEstatus = Ext.create('IAMTrading.store.Estatus').load({params:{tipo:'D', page:0, start:0, limit:0}});
        storeChoferes = Ext.create('IAMTrading.store.Choferes').load({params:{page:0, start:0, limit:0}});
        storeEquipos = null;
        storeTabulador = Ext.create('IAMTrading.store.Tabulador').load({params:{page:0, start:0, limit:0}});
        storeRepartos = null;

        var storeUbicaciones = Ext.create('IAMTrading.store.Ubicaciones').load();
        
        var curDate = new Date();

        Ext.Ajax.request({
            url: '../wa/api/GetPreviousDate',
            scope: me,
            method: 'GET',
            headers: {
                'Authorization-Token': Ext.util.Cookies.get('IAM.AppAuth')
            },
            params: {
                daysAgo: 1
            },
            success: function(response){
                var me = this;
                var obj = Ext.decode(response.responseText);
                me.previousDate = obj.data;
            }
        });

        Ext.applyIf(me, {
            fieldDefaults: {
                labelAlign: 'top',
                msgTarget: 'side',
                fieldStyle: 'font-size:11px',
                labelStyle: 'font-size:11px'
            },
            items:[
            // Tab Panel
            {
                xtype: 'tabpanel',
                columnWidth: 1,
                //margin: '5 0 0 0',
                activeTab: 0,
                items:[
                // Datos Generales
                {
                    xtype: 'panel',
                    title: 'Datos Generales',
                    itemId: 'panelgeneral',
                    margin: '0 0 10 0',
                    layout: {
                        type: 'column'
                    },
                    items: [
                    // primera linea
                    {
                        xtype: 'textfield',
                        columnWidth: 0.25,
                        name: 'MovViaje',
                        fieldLabel: 'N° Viaje',
                        selectOnFocus : true,
                        readOnly: true,
                        editable: false,
                        enableKeyEvents: true,
                        listeners:{
                            change: function(field, newValue, oldValue){
                                field.setValue(newValue.toUpperCase());
                            }
                        }
                    },
                    {
                        margin: '0 0 0 5',
                        columnWidth: 0.25,
                        xtype:'combo',
                        fieldLabel: 'Equipo',
                        displayField: 'x_EquipoPlaca',
                        valueField: 'EquipoId',
                        name: 'EquipoId',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 2,
                        allowBlank: false,
                        forceSelection: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        autoSelect:true,
                        selectOnFocus: true,
                        store:storeEquipos,
                        listeners: {
                            beforequery: function(record){  
                                record.query = new RegExp(record.query, 'i');
                                record.forceAll = true;
                            },
                            blur: function(field) {
                                var me = this.up('form'),
                                    toolbar = me.down('#FormToolbar');

                                if(field.getValue() !== null && toolbar.isEditing && toolbar.getCurrentRecord().phantom) {
                                    me.onCheckRepartos();
                                }
                            }
                        }
                    },
                    {
                        margin: '0 0 0 5',
                        columnWidth: 0.25,
                        xtype:'combo',
                        fieldLabel: 'Condición',
                        fieldStyle:'text-transform:uppercase',
                        displayField: 'name',
                        valueField: 'name',
                        name: 'MovCondicion',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 1,
                        allowBlank: false,
                        forceSelection: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        autoSelect:true,
                        selectOnFocus: true,
                        store: {
                            fields: ['name'],
                            data : [
                                {"name":"VACIO"},
                                {"name":"LLENO"}
                            ]
                        }
                    },
                    {
                        columnWidth: 0.25,
                        margin: '0 0 0 5',
                        xtype:'combo',
                        fieldLabel: 'Ubicación',
                        fieldStyle:'text-transform:uppercase',
                        displayField: 'name',
                        valueField: 'name',
                        name: 'MovUbicacion',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 1,
                        allowBlank: false,
                        forceSelection: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        autoSelect: true,
                        selectOnFocus: true,
                        store: storeUbicaciones
                        // store: {
                        //     fields: ['name'],
                        //     data : [
                        //         {"name":"PLANTA"},
                        //         {"name":"FERRARI"}
                        //     ]
                        // }
                    },
                    // Segunda linea
                    {
                        xtype: 'hidden',
                        name: 'MovTotalRepartos'
                    },
                    {
                        xtype: 'hidden',
                        name: 'MovTieneRepartos'
                    },
                    {
                        xtype: 'hidden',
                        name: 'MovCantidadCauchos'
                    },
                    {
                        xtype: 'hidden',
                        name: 'MovCostoFlete'
                    },
                    {
                        xtype: 'hidden',
                        name: 'ClienteId'
                    },
                    {
                        xtype: 'hidden',
                        name: 'CiudadId'
                    },
                    {
                        columnWidth: 0.5,
                        xtype: 'numericfield',
                        name: 'MovMontoEscolta',
                        fieldLabel: 'Seguridad (Escolta)',
                        minValue: 0,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        decimalPrecision: 2,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        alwaysDecimals: false,
                        thousandSeparator: ',',
                        fieldStyle: 'text-align: right;'
                    },
                    {
                        columnWidth: 0.5,
                        margin: '0 0 0 5',
                        xtype: 'fieldcontainer',
                        layout: {
                            type: 'hbox'
                        },
                        items: [
                        {
                            anchor: '50%',
                            margin: '20 10 0 5',
                            xtype: 'checkbox',
                            name: 'MovAcarreo',
                            labelSeparator: '',
                            hideLabel: true,
                            boxLabel: 'Acarreo',
                            listeners: {
                                change: function (field) {
                                    var nextField = field.next();
                                    nextField.setDisabled(true);
                                    if(field.value) nextField.setDisabled(false);
                                }
                            }
                        },
                        {
                            margin: '0 0 0 5',
                            flex: 1,
                            xtype: 'numericfield',
                            name: 'MovAcarreoMonto',
                            fieldLabel: 'Monto',
                            minValue: 0,
                            hideTrigger: true,
                            useThousandSeparator: true,
                            decimalPrecision: 2,
                            alwaysDisplayDecimals: true,
                            allowNegative: false,
                            alwaysDecimals: true,
                            allowDecimals: true,
                            decimalSeparator: '.',
                            fieldStyle: 'text-align: right;',
                            disabled: true,
                            editable: false
                        }
                        ]
                    },
                    // tercera linea
                    {
                        xtype:'combo',
                        columnWidth: 0.5,
                        fieldLabel: 'Chofer',
                        fieldStyle:'text-transform:uppercase',
                        displayField: 'ChoferNombreCompleto',
                        valueField: 'ChoferId',
                        name: 'ChoferId',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 2,
                        allowBlank: true,
                        forceSelection: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        autoSelect:false,
                        selectOnFocus: true,
                        listeners: {
                            select: function (field, records, eOpts) {
                                if(records[0]) {
                                    field.next('field[name=MovCedula]').setValue(records[0].data.ChoferCedula);
                                }
                            },
                            beforequery: function(record){  
                                record.query = new RegExp(record.query, 'i');
                                record.forceAll = true;
                            }
                        },
                        store:storeChoferes
                    },
                    {
                        xtype: 'textfield',
                        columnWidth: 0.25,
                        name: 'MovCedula',
                        fieldLabel: 'Cédula',
                        allowBlank: true,
                        selectOnFocus : true,
                        margin: '0 0 0 5',
                        vtype:'rif',
                        editable: false,
                        readOnly: true,
                        enableKeyEvents: true,
                        listeners:{
                            change: function(field, newValue, oldValue){
                                field.setValue(newValue.toUpperCase());
                            }
                        }
                    },
                    {
                        margin: '0 0 0 5',
                        columnWidth: 0.25,
                        name: 'MovFechaEntregaFactura',
                        fieldLabel: 'Fecha Entrega Facturas',
                        xtype: 'datefield',
                        format: 'd/m/Y'//,
                        //disabledDays:  [0]
                    },
                    // cuarta linea
                    {
                        xtype:'combo',
                        columnWidth: 0.5,
                        fieldLabel: 'Estatus',
                        fieldStyle:'text-transform:uppercase',
                        name: 'EstatusId',
                        displayField: 'EstatusNombre',
                        valueField: 'EstatusId',
                        queryMode: 'local',
                        typeAhead: true,
                        minChars: 2,
                        allowBlank: false,
                        forceSelection: true,
                        selectOnFocus: true,
                        emptyText: 'Seleccionar',
                        enableKeyEvents: true,
                        store:storeEstatus,
                        listeners: {
                            change: function(field) {
                                var me = field.up('form'),
                                    rawValue = field.getRawValue(),
                                    toolbar = me.down("#FormToolbar"),
                                    record = toolbar.getCurrentRecord(), 
                                    fieldFecha = me.down('field[name=fecha]');

                                if(!toolbar.isEditing) return;

                                fieldFecha.setFieldLabel('Fecha');
                                fieldFecha.editable = true;
                                fieldFecha.setReadOnly(false);
                                fieldFecha.allowBlank = true;

                                me.getFechaEstatus(rawValue, record.data);

                                if(rawValue == "ASIGNADO") {
                                    fieldFecha.setFieldLabel('Fecha Asinado');
                                    fieldFecha.editable = true;
                                    fieldFecha.allowBlank = false;
                                } else if(rawValue === "COMPLETADO"){
                                    fieldFecha.setFieldLabel('Fecha Completado');
                                    fieldFecha.editable = false;
                                    fieldFecha.setReadOnly(true);
                                    fieldFecha.allowBlank = false;
                                } else if(rawValue === "PROGRAMADO"){
                                    fieldFecha.editable = true;
                                    fieldFecha.setFieldLabel('Fecha Programado');
                                    fieldFecha.allowBlank = false;
                                } else if(rawValue === "REPROGRAMADO"){
                                    fieldFecha.editable = true;
                                    fieldFecha.setFieldLabel('Fecha Reprogramado');
                                    fieldFecha.allowBlank = false;
                                }
                            },
                            beforequery: function(record){  
                                record.query = new RegExp(record.query, 'i');
                                record.forceAll = true;
                            }
                        }
                    },
                    {
                        margin: '0 0 0 5',
                        columnWidth: 0.25,
                        name: 'fecha',
                        fieldLabel: 'Fecha',
                        xtype: 'datefield',
                        format: 'd/m/Y' //,
                        //disabledDays:  [0]
                    },
                    {
                        margin: '0 0 0 5',
                        columnWidth: 0.25,
                        name: 'MovFechaEstimada',
                        fieldLabel: 'Fecha Cita Makro',
                        xtype: 'datefield',
                        format: 'd/m/Y' //,
                        //disabledDays:  [0]
                    },
                    // quinta Linea
                    {
                        margin: '0 0 0 0',
                        columnWidth: 0.25,
                        xtype: 'numericfield',
                        name: 'MovMedidaRestoEquipo',
                        fieldLabel: 'Restante Equipo',
                        minValue: 0,
                        hideTrigger: true,
                        useThousandSeparator: true,
                        decimalPrecision: 2,
                        alwaysDisplayDecimals: true,
                        allowNegative: false,
                        alwaysDecimals: true,
                        allowDecimals: true,
                        decimalSeparator: '.',
                        fieldStyle: 'text-align: right;'
                    },
                    {
                        margin: '0 0 0 10',
                        xtype      : 'fieldcontainer',
                        fieldLabel : 'Unidad de Medida',
                        defaultType: 'radiofield',
                        columnWidth: 0.25,
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                            {
                                boxLabel  : 'Metros',
                                name      : 'MovMedidaRestoEquipoUnd',
                                inputValue: 'mts',
                                id        : 'radio1'
                            }, 
                            {
                                boxLabel  : 'Centimetros',
                                name      : 'MovMedidaRestoEquipoUnd',
                                inputValue: 'cms',
                                id        : 'radio2'
                            }
                        ]
                    },
                    {
                        margin: '0 0 0 10',
                        xtype      : 'fieldcontainer',
                        fieldLabel : 'Turno',
                        defaultType: 'radiofield',
                        columnWidth: 0.50,
                        defaults: {
                            flex: 1
                        },
                        layout: 'hbox',
                        items: [
                        {
                            boxLabel  : 'Primero',
                            name      : 'MovTurno',
                            inputValue: '0',
                            id        : 'radioT1'
                        }, 
                        {
                            boxLabel  : 'Segundo',
                            name      : 'MovTurno',
                            inputValue: '1',
                            id        : 'radioT2'
                        }, 
                        {
                            boxLabel  : 'Tercero',
                            name      : 'MovTurno',
                            inputValue: '2',
                            id        : 'radioT3'
                        }
                        ]
                    }
                    ]
                },
                // Charges Panel
                {
                    xtype: 'panel',
                    title: 'Repartos',
                    itemId: 'panelrepartos',
                    disabled: true,
                    margin: '0 0 10 0',
                    layout: {
                        type: 'column'
                    },
                    items: [
                    // Grid Charges
                    {
                        xtype: 'grid',
                        itemId: 'gridrepartos',
                        autoScroll: true,
                        viewConfig: {
                            stripeRows: true
                        },
                        columnWidth: 1,
                        minHeight: 340,
                        margin: '0 5 5 0',
                        store: storeRepartos,
                        features: [{
                            ftype: 'summary'
                        }],
                        columns: [
                        {
                            xtype: 'rownumberer',
                            flex: 0.25,
                            format: '00,000',
                        },
                        {
                            xtype: 'gridcolumn',
                            flex: 3,
                            dataIndex: 'x_Cliente',
                            text: 'Cliente',
                            editor: {
                                xtype:'combo',
                                displayField: 'ClienteNombre',
                                valueField: 'ClienteId',
                                name: 'ClienteId',
                                fieldStyle:'text-transform:uppercase',
                                queryMode: 'local',
                                minChars: 2,
                                allowBlank: true,
                                forceSelection: true,
                                emptyText: 'Seleccionar',
                                autoSelect:false,
                                matchFieldWidth: false,
                                listConfig: {
                                    width: 400
                                },
                                listeners: {
                                    blur: function(field) {
                                        var form = field.up('panel'),
                                            record = form.context.record;

                                        if(field.value === null) {
                                            var rawValue = field.getRawValue();
                                            field.setRawValue(rawValue.toUpperCase());
                                            record.set('x_Cliente', field.getRawValue());
                                        }
                                    },
                                    change: function(field) {
                                        var form = field.up('panel');
                                        form.onFieldChange(); // esto se hace con el proposito de forzar el valid del form del grid
                                    },
                                    select: function (field, records, eOpts) {
                                        var form = field.up('panel'),
                                            record = form.context.record;

                                        if(records.length > 0) {
                                            record.set('x_Cliente', field.getRawValue());
                                        }
                                    },
                                    beforequery: function(record){  
                                        record.query = new RegExp(record.query, 'i');
                                        record.forceAll = true;
                                    }
                                },
                                selectOnFocus: true,
                                store:storeClientesReparto
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            flex: 2,
                            dataIndex: 'x_Ciudad',
                            text: 'Ciudad',
                            editor: {
                                xtype:'combo',
                                displayField: 'x_CodigoNombre',
                                valueField: 'CiudadId',
                                name: 'CiudadId',
                                fieldStyle:'text-transform:uppercase',
                                queryMode: 'local',
                                minChars: 2,
                                allowBlank: true,
                                forceSelection: true,
                                emptyText: 'Seleccionar',
                                autoSelect:false,
                                matchFieldWidth: false,
                                listConfig: {
                                    width: 400
                                },
                                listeners: {
                                    change: function(field) {
                                        var form = field.up('panel');
                                        form.onFieldChange(); // esto se hace con el proposito de forzar el valid del form del grid
                                    },
                                    select: function (field, records, eOpts) {
                                        var form = field.up('panel'),
                                            record = form.context.record;

                                        if(records.length > 0) {
                                            record.set('x_Ciudad', field.getRawValue());

                                            var ciudadId = field.getValue(),
                                                tabIndex = storeTabulador.find("CiudadId", ciudadId),
                                                costoFlete = (tabIndex > -1) ? storeTabulador.getAt(tabIndex).data.TabTarifa : 0;

                                            record.set('RepartoTarifa', costoFlete);
                                        }
                                    },
                                    beforequery: function(record){  
                                        record.query = new RegExp(record.query, 'i');
                                        record.forceAll = true;
                                    }
                                },
                                selectOnFocus: true,
                                store:storeCiudadesReparto
                            }
                        },
                        {
                            xtype:'gridcolumn',
                            flex: 2,
                            dataIndex: 'RepartoFacturas',
                            text: 'Facturas',
                            summaryType: 'count',
                            summaryRenderer: function(value, summaryData, dataIndex) {
                                var me = this.up('form');
                                return Ext.String.format('Total {0} de {1}', value, me.down('field[name=MovTotalRepartos]').getValue()); 
                            },
                            editor: {
                                xtype:'textfield',
                                name:'RepartoFacturas',
                                fieldStyle:'text-transform:uppercase',
                                allowBlank: true,
                                listeners: {
                                    change: function(field) {
                                        var form = field.up('panel');
                                        form.onFieldChange(); // esto se hace con el proposito de forzar el valid del form del grid
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'numbercolumn',
                            flex: 2,
                            dataIndex: 'RepartoCantidad',
                            text: 'Cantidad',
                            align: 'right',
                            format: '00,000',
                            summaryType: 'sum',
                            editor: {
                                xtype: 'numericfield',
                                name: 'RepartoCantidad',
                                hideTrigger: false,
                                allowBlank: true,
                                useThousandSeparator: true,
                                minValue: 0,
                                alwaysDisplayDecimals: false,
                                allowNegative: false,
                                alwaysDecimals: false,
                                thousandSeparator: ',',
                                fieldStyle: 'font-size:11px,text-align: right;',
                                selectOnFocus: true,
                                listeners: {
                                    change: function(field) {
                                        var form = field.up('panel');
                                        form.onFieldChange(); // esto se hace con el proposito de forzar el valid del form del grid
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'actioncolumn',
                            flex: 1,
                            items: [
                            {
                                handler: me.onClickActionColumn,
                                iconCls: 'app-grid-edit',
                                tooltip: 'Editar'
                            }]
                        }
                        ],
                        tbar: [
                        {
                            text: 'Add',
                            itemId: 'addline',
                            handler : function() {
                                var me = this.up('gridpanel').up('form'), 
                                    grid = this.up('gridpanel'),
                                    toolbar = me.down('#FormToolbar'), 
                                    record = toolbar.getCurrentRecord(),
                                    count = grid.getStore().count();

                                // si no se esta editando se aborta el evento
                                if(!toolbar.isEditing) return;

                                // se cancela cualquier cambio o registro nuevo
                                rowEditing.cancelEdit();

                                // Si se completo la cantidad de repartos presentados
                                if(count >= me.down("field[name=MovTotalRepartos]").getValue()) return;

                                // Cargamos el modelo de repartos y asignamos el MovId actual y seteamos la cantidad en 0
                                var r = Ext.create('IAMTrading.model.Repartos', {
                                    RepartoCantidad: 0,
                                    MovId: record.data.MovId
                                });

                                //insertamos el registro y comenzamos su edición
                                grid.store.insert(count, r);
                                rowEditing.startEdit(count, 1);
                            }
                        }, 
                        {
                            itemId: 'removeline',
                            text: 'Delete',
                            handler: function() {
                                var grid = this.up('gridpanel');
                                var sm = grid.getSelectionModel();

                                rowEditing.cancelEdit();

                                selection = sm.getSelection();

                                if(selection){
                                    grid.store.remove(selection[0]);
                                }
                            },
                            disabled: true
                        }
                        ],
                        selType: 'rowmodel',
                        plugins: [rowEditing],
                        listeners: {
                            selectionchange : function(view, records, eOpts) {
                                var me = this.up('form'),
                                    toolbar = me.down('#FormToolbar');

                                // si se esta en edición se habilita el boton de eliminar
                                if(toolbar.isEditing)
                                    this.down('#removeline').setDisabled(!records.length);
                            }
                        }
                    }
                    ]
                } 
                ]
            }
            ],
            dockedItems: [
            {
                xtype: 'formtoolbar',
                itemId: 'FormToolbar',
                dock: 'top',
                store: me.storeNavigator,
                navigationEnabled: true,
                listeners: {
                    addrecord : {
                        fn: me.onAddClick,
                        scope: me
                    },
                    savechanges: {
                        fn: me.onSaveClick,
                        scope: me
                    },
                    deleterecord: {
                        fn: me.onDeleteClick,
                        scope: me
                    },
                    afterloadrecord: {
                        fn: me.onAfterLoadRecord,
                        scope: me
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
                close: {
                    fn: me.onCloseForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        
    },

    onAfterLoadRecord: function(tool, record) {
        var me = this;

        me.getFechaEstatus(record.data.x_Estatus, record.data);

        var currentId = record.data.MovId, 
            curorden = record.data.x_EstatusOrden;

        var curRec = record;

        //me.down('#panelrepartos').setDisabled(true);

        me.down('#gridrepartos').reconfigure(curRec.x_RepartosStore);

        if(curRec.data.MovTieneRepartos) {
            me.down('#panelrepartos').setDisabled(false);
            // me.down('field[name=ClienteId]').setVisible(false);
            // me.down('field[name=CiudadId]').setVisible(false);
            // me.down('field[name=MovCostoFlete]').setVisible(false);
            // me.down('field[name=MovFacturas]').setVisible(false);
            // me.down('field[name=MovCantidadCauchos]').setVisible(false);
        }

        if(curRec.data.x_Estatus === "COMPLETADO") {
            me.down('field[name=EstatusId]').setReadOnly(true);
            me.down('field[name=fecha]').setReadOnly(true);
            me.down('field[name=EstatusId]').editable = false;
            me.down('field[name=fecha]').editable = false;
        } else {
            //me.down('field[name=EstatusId]').setReadOnly(false);
            //me.down('field[name=fecha]').setReadOnly(false);
            me.down('field[name=EstatusId]').editable = true;
            me.down('field[name=fecha]').editable = true;
        }

        Ext.Msg.wait('Cargando','Espere');
        storeEquipos = Ext.create('IAMTrading.store.Equipos',{remoteFilter:false}).load({
            params:{page:0, start:0, limit:0},
            callback: function() {

                storeEquipos.clearFilter(true);
                storeEquipos.filter([{
                    filterFn: function(r) { 
                        return r.get('EquipoSerial') !== 'INACTIVO' && (r.get('EquipoId') === curRec.data.EquipoId || r.get("x_Estatus") === 'COMPLETADO' || r.get('x_Estatus') === 'DISPONIBLE'); 
                    }
                }]);

                me.down('field[name=EquipoId]').bindStore(storeEquipos);
                me.down('field[name=EquipoId]').setValue(curRec.data.EquipoId);

                //storeEstatus = Ext.create('IAMTrading.store.Estatus').load({params:{tipo:'D', orden: curorden, fallido: esFallido, page:0, start: 0, limit: 0}, 
                storeEstatus = Ext.create('IAMTrading.store.Estatus',{remoteSort: false}).load({params:{tipo:'D', page:0, start: 0, limit: 0}, 
                    callback: function() {
                        var fieldEstatus = me.down('field[name=EstatusId]');
                        fieldEstatus.bindStore(storeEstatus);

                        var curEstatusId = curRec.data.EstatusId;
                        if(record.phantom) {
                            estatusIndex = this.find("EstatusOrden",1);
                            curEstatusId = (estatusIndex > -1) ? this.getAt(estatusIndex).data.EstatusId : 0;
                        }

                        storeEstatus.clearFilter(true);
                        storeEstatus.filter([{
                            filterFn: function(r) { 
                                return r.get('EstatusId') == curEstatusId ||
                                r.get('EstatusNombre') === 'ASIGNADO' ||
                                r.get("EstatusNombre") === 'PROGRAMADO'  ||
                                r.get("EstatusNombre") === 'REPROGRAMADO';
                            }
                        }]);

                        storeEstatus.sort([
                            {
                                property : 'EstatusOrden',
                                direction: 'ASC'
                            },
                            {
                                property : 'EstatusNombre',
                                direction: 'ASC'
                            }
                        ]);

                        if (curEstatusId > 0) fieldEstatus.setValue(curEstatusId);

                        // if(fieldEstatus.rawValue == "FALLLIDO") {
                        //     this.filter([
                        //         Ext.create('Ext.util.Filter', {
                        //             filterFn: function(item) { 
                        //                 return item.get("EstatusNombre") == "FALLLIDO" || item.get("EstatusNombre")=="ASIGNADO" ; 
                        //             }, 
                        //             root: 'data'
                        //         })
                        //     ]);
                        // }

                        Ext.Msg.hide();
                        
                        me.down('field[name=EquipoId]').focus(true, 200);
                    }
                });
            }
        });
    },

    onCloseForm: function() {
        var me = this,
            grid = me.callerForm.down('gridpanel');
            grid.store.reload();
    },

    registerKeyBindings: function(view, options){
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
            if (evt.keyCode === Ext.EventObject.F8) {
                evt.stopEvent();
                me.onSaveClick();
            }
        }, 
        this);
    },


    onAddClick: function(tool, record) {
        var me = this, 
            toolbar = me.down('#FormToolbar'),
            grid = me.down('#gridrepartos'),
            tab = me.down('tabpanel');

        tab.setActiveTab(tab.down('#panelgeneral'));

        record.data.MovCondicion = 'LLENO';
        record.data.MovUbicacion = 'PLANTA';
        record.data.MovTieneRepartos = true;
        record.data.ClienteId = null;
        record.data.MovTipo = 'D';
        record.data.x_EstatusOrden = 1;
        record.data.MovTurno = getHorario();

        grid.reconfigure(record.x_RepartosStore);

        //toolbar.bindStore(Ext.create('IAMTrading.store.Movimientos'));
        //toolbar.store.add(r);
        //me.down('#FormToolbar').gotoAt(1);
        //toolbar.down('#edit').fireHandler();
    },

    onSaveClick: function(button, e, eOpts) {
        
        var me = this,
            editform = me.getForm();

        if(!editform.isValid())  { 
            Ext.Msg.alert("Warning",'Faltan datos obligatorios');
            return false;
        }

        if(!me.validRepartos()) return false;

        editform.updateRecord();

        var record = editform.getRecord(),
            isNewRecord = true;

        if(!record.phantom) {
            record.data.MovModificadoPor = Ext.JSON.decode(Ext.util.Cookies.get("IAM.CurrentUser")).UserId;
            isNewRecord = false;
        }

        var cliente = me.down('field[name=ClienteId]').getRawValue();
        record.data.x_Cliente = (isNaN(record.data.ClienteId)) ? cliente : "";

        record.data.MovChofer = me.down('field[name=ChoferId]').getRawValue();

        storeRepartos = me.down('#gridrepartos').store;

        var repartos = [];
        Ext.each(storeRepartos.data.items, function(item, index, allItems) {
            repartos[index] = item.data;
        });


        record.data.x_Repartos = repartos;

        me.setFechaStatus(record);
        
        Ext.Msg.wait("Espere","Grabando registro!!!");

        record.save({ 
            success: function(e) { 
                var toolbar = me.down('#FormToolbar');
                Ext.Msg.hide();
                if(!isNewRecord) {
                    toolbar.doRefresh();
                } else {
                    var grid = me.callerForm.down('gridpanel'),
                    lastOpt = grid.store.lastOptions;
                    grid.store.reload({params: lastOpt.params});
                    var btn = toolbar.down('#add');
                    btn.fireEvent('click', btn);
                }
            },
            failure: function() {
                Ext.Msg.hide();
                return false;
            }
        });
    },

    onDeleteClick: function(pageTool, record) {
        if(record){
            var curRec = record.index - 1;
            curPage = pageTool.store.currentPage;
            prevRec = (curRec <= 0) ? 1 : curRec;

            Ext.Msg.show({
                title:'Delete',
                msg: 'Desea borrar el registro actual?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                fn: function(btn) {
                    if(btn === "yes") {
                        record.destroy({
                            success: function() {
                                pageTool.store.reload();
                                pageTool.gotoAt(prevRec);
                            }
                        });
                    }
                }
            });
        }
    },

    getFechaEstatus: function(estatus, record) {
        var me = this,
            fecha = null,
            hora = null,
            hora12 = null,
            minutos = null,
            ampm = null;

        switch (estatus) {
            case "ASIGNADO":
                fecha = (!Ext.isDate(record.MovFechaAsignado)) ? new Date() : record.MovFechaAsignado;
                hora = fecha.getHours();
                hora12 = hora >= 13 ? hora - 12 : hora;
                minutos = fecha.getMinutes();
                ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
                break;

            case "COMPLETADO":
                fecha = record.MovFechaCompletado;
                if(Ext.isDate(fecha)) {
                    hora = fecha.getHours();
                    hora12 = hora >= 13 ? hora - 12 : hora;
                    minutos = fecha.getMinutes();
                    ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
                }
                break;

            case "PROGRAMADO":
                fecha = record.MovFechaSalida;
                if(Ext.isDate(fecha)) {
                    hora = fecha.getHours();
                    hora12 = hora >= 13 ? hora - 12 : hora;
                    minutos = fecha.getMinutes();
                    ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
                }
                break;

            case "REPROGRAMADO":
                fecha = record.MovFechaSalida;
                if(Ext.isDate(fecha)) {
                    console.log(fecha);
                    hora = fecha.getHours();
                    hora12 = hora >= 13 ? hora - 12 : hora;
                    minutos = fecha.getMinutes();
                    ampm = fecha.getHours() >= 12 ? 'PM' : 'AM';
                }
                break;
        }

        me.down('field[name=fecha]').setValue(fecha);

        if(Ext.isDate(fecha)) {
            hora12 = Ext.String.leftPad(hora12, 2, '0');
            minutos = Ext.String.leftPad(minutos, 2, '0');
            returnDate = "{0} {1}:{2} {3}".format(Ext.Date.format(fecha,"d/m/Y"), hora12, minutos, ampm);
            return returnDate;
        }

        return null;
    },

    setFechaStatus: function(record) {
        var me = this,
            fechaEstatus = me.down('field[name=fecha]').getValue(),
            estatus = me.down('field[name=EstatusId]').getRawValue();

        switch (estatus) {
            case "ASIGNADO":
                record.data.MovFechaAsignado = fechaEstatus;
                break;

            case "COMPLETADO":
                record.data.MovFechaCompletado = fechaEstatus;
                break;
            case "PROGRAMADO":
                record.data.MovFechaSalida = fechaEstatus;
                break;
            case "REPROGRAMADO":
                record.data.MovFechaSalida = fechaEstatus;
                break;
        }
    },

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        rowEditing.startEdit(record, 1);
        this.up('panel').editingPlugin.editor.down('field[name=ClienteId]').focus(true, 200);
    },

    onCheckRepartos: function() {
        var me = this;

        me.down('#panelrepartos').setDisabled(false);

        var form = Ext.create('IAMTrading.view.PromptRepartos',{
            height: 185,
            modal: true,
            width: 334,
            frameHeader: true,
            header: true,
            title: 'Cuantos repartos tiene este viaje?',
            callerForm: me,
            stateful: false,
            floating: true
        });

        form.show();
    },

    // setReadOnlyForAll: function (bReadOnly) {
    //     this.getForm().getFields().each (function (field) {
    //       field.setReadOnly (bReadOnly);
    //     });
    // },

    validRepartos: function() {
        var me = this, 
            grid = me.down('#gridrepartos'),
            count = grid.store.getCount(),
            totalRepartos = me.down('field[name=MovTotalRepartos]').getValue(),
            cantidadCauchos = grid.store.sum('RepartoCantidad'),
            costoFlete = grid.store.max('RepartoTarifa');



        if(count < totalRepartos) {
            Ext.Msg.alert('Warning','Debe completar la cantidad de repartos');
            return false;
        }

        me.down('field[name=MovCostoFlete]').setValue(costoFlete);
        me.down('field[name=MovCantidadCauchos]').setValue(cantidadCauchos);
        me.down('field[name=ClienteId]').setValue(grid.store.getAt(0).data.ClienteId);
        me.down('field[name=CiudadId]').setValue(grid.store.getAt(0).data.CiudadId);

        return true;
    }

});