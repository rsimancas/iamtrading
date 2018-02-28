 Ext.define('IAMTrading.view.common.MainHeader', {
     extend: 'Ext.container.Container',
     id: 'IAMAppHeader',
     xtype: 'app_header',
     autorRender: true,
     autoShow: true,
     frame: true,
     split: false,

     layout: {
         type: 'hbox'
     },

     requires: [
         'IAMTrading.view.common.ToolBar'
     ],

     initComponent: function() {
         var me = this;

         Ext.applyIf(me, {

             items: [{
                 xtype: 'container',
                 html: '<div><img src="images/logo_header.png" height="40"/></div>',
                 flex: 2
             }, {
                 xtype: 'numberfield',
                 margin: '5 0 0 5',
                 width: 180,
                 labelWidth: 80,
                 itemId: 'dolartoday',
                 fieldLabel: 'Dolar Today',
                 labelAlign: 'left',
                 readOnly: true,
                 name: 'DolarToday',
                 labelStyle: 'color: #FFFFFF; font-weight: bold; font-size: 12px;text-align: right;',
                 fieldStyle: 'font-size:12px; font-weight: bold; text-align: right;'
             }, {
                 xtype: 'numberfield',
                 margin: '5 0 0 5',
                 width: 180,
                 labelWidth: 80,
                 fieldLabel: 'Break-even',
                 labelAlign: 'left',
                 readOnly: true,
                 name: 'BreakEven',
                 labelStyle: 'color: #FFFFFF; font-weight: bold; font-size: 12px;text-align: right;',
                 fieldStyle: 'font-size:12px; font-weight: bold; text-align: right;'
             }, {
                 xtype: 'app_toolbar',
                 border: 0,
                 margin: '0 0 0 0',
             }]
         });

         me.callParent(arguments);

         Ext.Ajax.request({
             type: 'json',
             url: IAMTrading.GlobalSettings.webApiPath + 'dolartoday',
             success: function(rsp) {
                 var data = Ext.JSON.decode(rsp.responseText);

                 if (data.data)
                     me.up('app_viewport').down('#dolartoday').setValue(data.data.USD);
             }
         });
     }

 });
