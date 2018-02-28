Ext.define('IAMTrading.view.appViewPort', {
    extend: 'Ext.container.Viewport',
    xtype: 'app_viewport',
    id: 'app_viewport',

    layout: {
        type: 'border'
    },

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [{
                region: 'north',
                xtype: 'app_header'
            }, {
                region: 'center',
                xtype: 'app_ContentPanel',
                forceFit: true,
                items: [Ext.widget('quoteslist')]
            }]
        });

        me.callParent(arguments);
    }
});
