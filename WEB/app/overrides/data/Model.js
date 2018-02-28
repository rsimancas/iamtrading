Ext.define('Overrides.data.Model', {
	override: 'Ext.data.Model',
    silentMode: true,
    setSilentMode: function(silentMode) {
        this.silentMode = silentMode;
    }
});