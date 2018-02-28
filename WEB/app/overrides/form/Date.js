Ext.define('Overrides.form.Date', {
	override: 'Ext.form.field.Date',
    listeners: {
    	focus: function(field) {
    		console.log(field);
    		field.expand();
    	}
    }
});