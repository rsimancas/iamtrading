Ext.define('IAMTrading.view.ShowImage', {
    extend: 'Ext.window.Window',
    alias: 'widget.showimage',
    //title: 'Upload a Photo',
    width: 700,
    height: 500,
    //bodyPadding: 10,
    frame: true,
    //renderTo: Ext.getBody(),
    layout: {
        type: 'column'
    },
    autoScroll: true, 
    resizable: true,
    fixed: false,
    maximized: true,

    initComponent: function() {
        var me = this,
            today = new Date();

        // var fileUploadPhotoPreview = new Ext.Component({
        //     padding: '20 20 20 20',
        //     marginBottom: '10px'
        //     autoEl: { 
        //         tag: 'img', src: IAMTrading.GlobalSettings.webApiPath + 'attachment/' + me.MovId + '?_'+ today.getTime(), id: 'photoPreview'
        //     }
        // });

        Ext.applyIf(me, {
            items: [
            {
                columnWidth: 1,
                xtype: 'image',
                padding: '10 10 10 10',
                style: {
                    width: 'auto',
                    height: 'auto'
                },
                src:'../wa/getattach?id=' + me.AttachId + '&_dc='+ today.getTime()
            }
                //fileUploadPhotoPreview
            ],
        });

        me.callParent(arguments);
    }
});