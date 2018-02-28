Ext.define('Overrides.data.proxy.Rest', {
	override: 'Ext.data.proxy.Rest',
    _silentMode: false,
    setSilentMode: function(silentMode) {
        this._silentMode = silentMode;
        console.log('silent to: ', this._silentMode);
    },
    getSilentMode: function() {
        console.log('silent is: ', this._silentMode);
        return this._silentMode;
    }
});