Ext.define('IAMTrading.view.DistribucionShowImage', {
    extend: 'Ext.form.Panel',
    alias: 'widget.distribucionshowimage',
    //title: 'Upload a Photo',
    width: 700,
    height: 500,
    //bodyPadding: 10,
    frame: true,
    //renderTo: Ext.getBody(),
    layout: {
        type: 'column'
    },
    //autoScroll: true, 

    initComponent: function() {
        var me = this,
            today = new Date();

        // var fileUploadPhotoPreview = new Ext.Component({
        //     padding: '20 20 20 20',
        //     marginBottom: '10px'
        //     autoEl: { 
        //         tag: 'img', src: '../wa/api/attachment/' + me.MovId + '?_'+ today.getTime(), id: 'photoPreview'
        //     }
        // });

        Ext.applyIf(me, {
            items: [
            {
                columnWidth: 1,
                xtype: 'image',
                padding: '10 10 10 10',
                style: {
                    width: '100%',
                    height: '100%'
                },
                src:'../wa/api/attachment/' + me.MovId + '?_'+ today.getTime()
            }
                //fileUploadPhotoPreview
            ],
        });

        me.callParent(arguments);
    }
});