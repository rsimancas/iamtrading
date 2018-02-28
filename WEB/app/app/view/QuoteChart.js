Ext.define('IAMTrading.view.QuoteChart', {
    extend: 'Ext.chart.Chart',
    xtype: 'quotechart',
    style: 'background:#fff',
    animate: true,
    legend: {
        position: 'bottom'
    },
    //theme: 'Category1',
    axes: [{
        type: 'Numeric',
        position: 'left',
        fields: ['Total', 'GY','INV'],
        //title: 'Orders',
        grid: true,
        label: {
            renderer: function(v) {
                return (v) ? String(v/1000000)+'M' : 0;
            }
        }
    }, {
        type: 'Category',
        position: 'bottom',
        fields: ['Month'],
        //title: 'Month'
    }],
    series: [{
        type: 'column',
        axis: 'left',
        xField: 'Month',
        yField: ['Total', 'GY','INV'],
        markerConfig: {
            type: 'cross',
            size: 3
        }
    }]
});
