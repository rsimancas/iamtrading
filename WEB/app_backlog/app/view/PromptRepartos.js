Ext.define('IAMTrading.view.PromptRepartos', {
    extend: 'Ext.form.Panel',
    height: 185,
    modal: true,
    width: 334,
    title: 'Cuantos repartos tiene este viaje?',
    bodyPadding: 10,
    closable: false,
    //constrain: true,
    callerForm: null,
    layout: 'column',

    initComponent: function() {

        var me = this;

        Ext.applyIf(me, 
        {
            items:[
            {
            	columnWidth: 1,
                xtype:'numberfield',
                itemId:'Repartos',
                format: '000',
                fieldLabel: 'Repartos',
                labelAlign: 'top',
                minValue: 1,
                allowBlank: false,
                enableKeyEvents: true,
                fieldStyle: 'text-align: right;'
            }
            // {
            // 	columnWidth: 1,
            //     xtype:'numberfield',
            //     itemId:'TotalCauchos',
            //     format: '00,000',
            //     fieldLabel: 'Total Cauchos',
            //     labelAlign: 'top',
            //     minValue: 1,
            //     allowBlank: false,
            //     enableKeyEvents: true,
            //     fieldStyle: 'text-align: right;'
            // }
            ],
            dockedItems: [
            {
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: [
                {
                    xtype: 'component',
                    flex: 1
                },
                {
                    xtype: 'button',
                    itemId: 'btnOK',
                    text: 'Ok',
                    formBind: true,
                    listeners: {
                        click: {
                            fn: me.onOkClick,
                            scope: me
                        }
                    },
                    disabled: true
                },
                {
                    xtype: 'button',
                    itemId: 'btnCancel',
                    text: 'Cancel',
                    listeners: {
                        click: {
                            fn: me.onCancelClick,
                            scope: me
                        }
                    }
                }
                ]
            }
            ],
            listeners:{
                show: {
                    fn: me.onShowForm,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    onShowForm: function() {
    	var me = this,
    		repartos = 1;

    	repartos = Math.max(repartos, me.callerForm.down('field[name=MovTotalRepartos]').getValue());
    	//me.down('#TotalCauchos').setValue(me.callerForm.down('field[name=MovCantidadCauchos]').getValue());
    	me.down('#Repartos').setValue(repartos);
        me.down('#Repartos').focus(true, 200);
    },

    onOkClick: function() {
    	var me = this,
    		callerForm = me.callerForm;
    	//me.callerForm.down('field[name=MovCantidadCauchos]').setValue(me.down('#TotalCauchos').getValue());
    	callerForm.down('field[name=MovTotalRepartos]').setValue(me.down('#Repartos').getValue());
    	me.destroy();
    	callerForm.down('tabpanel').setActiveTab(callerForm.down('#panelrepartos'));
    	callerForm.down('#addline').fireHandler();
    },

    onCancelClick: function() {
    	var me = this,
        callerForm = me.callerForm;
        me.destroy();
    	callerForm.down('field[name=EquipoId]').focus(true, 500);
    }
});