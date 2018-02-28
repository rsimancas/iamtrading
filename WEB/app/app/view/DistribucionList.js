Ext.define('IAMTrading.view.DistribucionList', {
    extend: 'Ext.form.Panel',
    alias: 'widget.distribucionlist',
    title: 'Distribuci\u00F3n',

    initComponent: function() {
        var me = this;

        Ext.require([
            //'Ext.toolbar.Paging',
            //'Ext.ux.SearchField',
            'IAMTrading.view.Distribucion',
            'IAMTrading.view.DistribucionFileUpload'
        ]);

        var storeMovs = Ext.create('IAMTrading.store.Movimientos').load({params:{tipo:'D'}});

        Ext.applyIf(me, {
            items:[
            {
                xtype: 'gridpanel',
                itemId: 'gridmain',
                //autoScroll: true,
                minHeight: 450,
                //forceFit: true,
                store: storeMovs,
                columns: [
                {
                    xtype: 'rownumberer',
                    flex: 1
                },
                {
                    xtype: 'gridcolumn',
                    flex: 2,
                    dataIndex: 'MovViaje',
                    text: 'Viaje',
                    align: 'center'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 2,
                    dataIndex: 'MovFechaAsignado',
                    text: 'Asig.',
                    renderer: Ext.util.Format.dateRenderer('d/m'),
                    align: 'center'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 2,
                    dataIndex: 'MovFechaCompletado',
                    text: 'Comp.',
                    renderer: Ext.util.Format.dateRenderer('d/m'),
                    align: 'center'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 3,
                    dataIndex: 'MovChofer',
                    text: 'Chofer'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 4,
                    dataIndex: 'x_Cliente',
                    text: 'Cliente'
                },
                {
                    xtype: 'numbercolumn',
                    flex: 2,
                    dataIndex: 'MovCantidadCauchos',
                    text: 'Cant.',
                    format: '0,000',
                    align: 'right'
                },
                {
                    xtype: 'numbercolumn',
                    flex: 2,
                    dataIndex: 'MovTotalRepartos',
                    text: 'Rep.',
                    format: '0,000',
                    align: 'right'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 3,
                    dataIndex: 'x_Equipo',
                    text: 'Equipo'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 2,
                    dataIndex: 'x_Ciudad',
                    text: 'Ciu.',
                    align: 'center'
                },
                {
                    xtype: 'gridcolumn',
                    flex: 3,
                    dataIndex: 'x_Estatus',
                    text: 'Estatus',
                    tdCls: 'x-change-cell',
                    align: 'center'
                },
                {
                    xtype: 'actioncolumn',
                    width: 25,
                    items: [
                    {
                        handler: me.onCellDobleClick,
                        scope: me,
                        iconCls: 'app-find',
                        //iconCls: 'x-form-search-trigger',
                        tooltip: 'Detalle'
                    }]
                },
                {
                    xtype: 'actioncolumn',
                    width: 25,
                    items: [
                    {
                        handler: me.onClickAttach,
                        scope: me,
                        iconCls: 'app-attachment',
                        //iconCls: 'x-form-search-trigger',
                        tooltip: 'Cargar Imagen'
                    }]
                },
                {
                    xtype: 'actioncolumn',
                    width: 25,
                    items: [
                    {
                        handler: me.onClickCamera,
                        scope: me,
                        iconCls: 'app-camera',
                        //iconCls: 'x-form-search-trigger',
                        tooltip: 'Tomar Foto'
                    }]
                },
                {
                    xtype: 'actioncolumn',
                    width: 25,
                    items: [
                    {
                        handler: function(view, rowIndex, colIndex, item, e, record) {
                            var me = view.up('form');
                            me.onClickPrint(record);
                        },
                        iconCls: 'app-print',
                        tooltip: 'Recibo'
                    }]
                }
                ],
                tbar:
                [
                //'Buscar',
                {
                    xtype: 'searchfield',
                    width: '50%',
                    itemId: 'searchfield',
                    name:'searchField',
                    listeners: {
                        'triggerclick' : function(field) {
                            me.onSearchFieldChange();
                        }
                    }
                },
                {
                    xtype: 'component',
                    flex: 1
                },
                {
                    itemId: 'addline',
                    xtype: 'button',
                    text: 'Add',
                    tooltip: 'Pulse (Ins)',
                    handler : function() {
                        var me = this.up('form');
                        var grid = me.down('gridpanel');

                        var storeToNavigate =  Ext.create('IAMTrading.store.Movimientos');

                        var form = Ext.widget('distribucion', {
                            storeNavigator: storeToNavigate,
                            modal: true,
                            width: 700,
                            frameHeader: true,
                            header: true,
                            layout: {
                                type: 'column'
                            },
                            bodyPadding: 10,
                            closable: true,
                            stateful: false,
                            floating: true,
                            callerForm: me,
                            forceFit: true
                        });

                        form.show();
                        var btn = form.down('#FormToolbar').down('#add');
                        btn.fireEvent('click', btn);
                    }
                }, 
                {
                    itemId: 'deleteline',
                    text: 'Delete',
                    handler: function() {
                        var grid = this.up('gridpanel'),
                            sm = grid.getSelectionModel(),
                            selection = sm.getSelection();

                        if(selection){
                            var sel = selection[0];
                            sel.destroy({
                                success: function() {
                                    grid.store.reload({callback: function(){ sm.select(0); } });
                                }
                            });
                        }
                    },
                    disabled: true
                }
                ],
                selType: 'rowmodel',
                bbar: new Ext.PagingToolbar({
                    itemId:'pagingtoolbar',
                    store: storeMovs,
                    displayInfo: true,
                    displayMsg: 'Mostrando {0} - {1} of {2}',
                    emptyMsg: "No hay registros para mostrar"
                }),
                listeners: {
                    celldblclick: {
                        fn: me.onCellDobleClick,
                        scope: me
                    },
                    selectionchange : function(view, records) {
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
                }
            }

        });

        me.callParent(arguments);
    },

    onRenderForm: function() {
        var me = this;

        var grid = me.down('#gridmain');

        if(grid.getSelectionModel().selected.length == 0) {
            grid.getSelectionModel().select(0);
        };

        var field = me.down('#searchfield').focus(true, 200);
    },

    registerKeyBindings: function(view, options){
        var me = this;
        Ext.EventManager.on(view.getEl(), 'keyup', function(evt, t, o) {
            if (evt.keyCode === Ext.EventObject.INSERT) {
                evt.stopEvent();
                var btn = me.down('#addline')
                //console.log(btn); //.click();
                btn.fireHandler();
            };
        }, 
        this);
    },

    onSearchFieldChange: function() {
        var form = this,
            field = form.down('#searchfield'),
            fieldValue = field.getRawValue(),
            grid = form.down('#gridmain');
        
        grid.store.removeAll();

        if(!String.isNullOrEmpty(fieldValue)) {
            //field.triggerEl.show();
            grid.store.loadPage(1, {params:{query:fieldValue,tipo:'D'}, callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        } else {
            //field.triggerEl.hide(true);
            grid.store.loadPage(1, {params:{tipo:'D'},callback: function() {
                form.down('#pagingtoolbar').bindStore(this);
            }});
        }
    },

    onCellDobleClick: function() {
        var me = this,
            record = me.down('gridpanel').getSelectionModel().getLastSelected();

        if(Ext.isObject(arguments[5])) record = arguments[5];

        var storeMovs = Ext.create('IAMTrading.store.Movimientos').load({
            params:{id: record.data.MovId}, 
            callback: function() {
                var form = Ext.widget('distribucion', {
                    storeNavigator: storeMovs,
                    modal: true,
                    width: 700,
                    frameHeader: true,
                    header: true,
                    layout: {
                        type: 'column'
                    },
                    title: 'Distribuci\u00F3n',
                    bodyPadding: 10,
                    closable: true,
                    //constrain: true,
                    stateful: false,
                    floating: true,
                    callerForm: me,
                    forceFit: true,
                    CiudadId: record.data.CiudadId,
                    ClienteId: record.data.ClienteId
                });

                form.down('#FormToolbar').gotoAt(1);

                form.show();
            }
        });
        // var field = form.down('field[name=MovChofer]');
        // //field.setValue(value);
        // field.focus(true, 200);
    },

    onClickActionColumn: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        var form = Ext.widget('distribucion', {
            storeNavigator: me.down('gridpanel').store,
            modal: true,
            width: 700,
            frameHeader: true,
            header: true,
            layout: {
                type: 'column'
            },
            title: 'Distribuci\u00F3n',
            bodyPadding: 10,
            closable: true,
            //constrain: true,
            stateful: false,
            floating: true,
            callerForm: me,
            forceFit: true,
            CiudadId: record.data.CiudadId,
            ClienteId: record.data.ClienteId
        });

        form.down('#FormToolbar').gotoAt(record.index + 1);

        form.show();
        // var field = form.down('field[name=MovChofer]');
        // //field.setValue(value);
        // field.focus(true, 200);
    },

    onClickAttach: function(view, rowIndex, colIndex, item, e, record) {
        var me = this.up('panel').up('panel');

        var form = Ext.widget('distribucionfileupload', {
            modal: true,
            //width: 200,
            //height: 200,
            frameHeader: true,
            header: true,
            layout: {
                type: 'column'
            },
            //title: 'Distribuci\u00F3n',
            //bodyPadding: 10,
            closable: true,
            //constrain: true,
            stateful: false,
            floating: true,
            callerForm: me,
            forceFit: true,
            title: record.data.MovViaje,
            MovId: record.data.MovId
        });

        form.getForm().setValues({
            MovId: record.data.MovId,
            MovViaje: record.data.MovViaje
        });

        //form.down('#FormToolbar').gotoAt(record.index + 1);

        form.show();
    },

    onClickCamera: function(view, rowIndex, colIndex, item, e, record) {

        window.open('../takephoto?MovId='+record.data.MovId+"&MovViaje="+record.data.MovViaje);

        // var me = this.up('panel').up('panel');

        // var form = Ext.widget('distribucionshowimage', {
        //     modal: true,
        //     //width: 400,
        //     //height: 550,
        //     frameHeader: true,
        //     header: true,
        //     layout: {
        //         type: 'column'
        //     },
        //     //title: 'Distribuci\u00F3n',
        //     bodyPadding: 10,
        //     closable: true,
        //     //constrain: true,
        //     stateful: false,
        //     floating: true,
        //     callerForm: me,
        //     forceFit: true,
        //     title: record.data.MovViaje,
        //     MovId: record.data.MovId
        // });

        // //form.down('#FormToolbar').gotoAt(record.index + 1);

        // form.show();
    },

    onClickPrint: function(record) {

        Ext.Msg.wait('Cargando Reporte....','Espere por favor');
        Ext.Ajax.request({
            url: '../wa/Reports/ReciboViaje',
            method: 'GET',
            headers: {
                'Authorization-Token': Ext.util.Cookies.get('IAM.AppAuth')
            },
            params: {
                id: record.get('MovId')
            },
            success: function(response){
                var text = response.responseText;
                //window.open('../wa/Reports/GetPDFReport?_file=' + text, 'Quote Customer','width='+screen.width+',height='+screen.height);
                window.open('../wa/Reports/GetPDF?_file=' + text, 'Recibo Viaje');
                Ext.Msg.hide();
            }
        });
        
    }
});