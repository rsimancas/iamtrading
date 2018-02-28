Ext.define('Overrides.view.AbstractView', {
    override: 'Ext.view.AbstractView',
    // private
    updateIndexes: function(startIndex, endIndex) {
        var nodes = this.all.elements,
            records = this.getViewRange(),
            i;

        startIndex = startIndex || 0;
        endIndex = endIndex || ((endIndex === 0) ? 0 : (nodes.length - 1));

        for (i = startIndex; i <= endIndex; i++) {
            var node = nodes[i];
            if (node) {
                nodes[i].viewIndex = i;
                nodes[i].viewRecordId = records[i].internalId;
                if (!nodes[i].boundView) {
                    nodes[i].boundView = this.id;
                }
            }
        }
    }
});
