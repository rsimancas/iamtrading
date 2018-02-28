Ext.define('Ext.ux.SearchField', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.searchfield',
    initComponent: function () {
        var me = this;

        me.triggerCls = 'x-form-clear-trigger';

        me.callParent(arguments);
    },
    // override onTriggerClick
    onTriggerClick: function() {
        this.setRawValue('');
    }
});