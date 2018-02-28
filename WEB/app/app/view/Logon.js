Ext.define('IAMTrading.view.Logon', {
    extend: 'Ext.container.Container',
    alias: 'widget.logon',
    autoRender: true,
    autoShow: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    // xtype: 'container',
                    // frame: false,
                    xtype: 'component',
                    autoEl: {
                        tag: 'div',
                        html: '<p align="center"><img src="images/logo_logon.png"/></p>' ,
                        href: '#' 
                    }
                    //html: '<div><p align="center"><img src="images/logo_logon.png"/></p></div>'
                },
                {
                    xtype: 'form',
                    autoRender: true,
                    autoShow: true,
                    frame: true,
                    layout: { type: 'fit'},
                    style: {
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    },
                    width: 300,
                    bodyPadding: 0,
                    title: 'Logon',
                    jsonSubmit: true,
                    items: [
                        {
                            xtype: 'fieldcontainer',
                            height: 120,
                            margin: '0 5 0 5',
                            layout: {
                                type: 'anchor'
                            },
                            fieldDefaults: {
                                labelAlign: 'top',
                                labelWidth: 90,
                                msgTarget: 'qtip'
                            },
                            labelAlign: 'top',
                            items: [
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    margin: '0 5 0 5',
                                    fieldLabel: 'Login:',
                                    msgTarget: 'side',
                                    name: 'UserId',
                                    allowBlank: false,
                                    //emptyText: 'Nombre de User'
                                },
                                {
                                    xtype: 'textfield',
                                    anchor: '100%',
                                    margin: '0 5 0 5',
                                    fieldLabel: 'Password',
                                    msgTarget: 'side',
                                    name: 'UserPassword',
                                    inputType: 'password',
                                    allowBlank: false,
                                    enableKeyEvents: true
                                }
                            ]
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            stateful: true,
                            autoRender: true,
                            autoShow: true,
                            margin: '',
                            ui: 'footer',
                            layout: {
                                align: 'stretch',
                                pack: 'end',
                                type: 'hbox'
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    formBind: false,
                                    width: 100,
                                    text: 'Submit'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});