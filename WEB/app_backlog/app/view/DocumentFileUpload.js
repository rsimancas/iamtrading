Ext.define('IAMTrading.view.DocumentFileUpload', {
    extend: 'Ext.form.Panel',
    alias: 'widget.documentfileupload',
    //title: 'Upload a Photo',
    width: 500,
    height: 500,
    //bodyPadding: 10,
    //padding: '10 10 10 10',
    frame: true,
    //renderTo: Ext.getBody(),
    layout: {
        type: 'column'
    },

    QHeaderId: null,

    initComponent: function() {
        var me = this,
            today = new Date();

        Ext.applyIf(me, {
            items: [
            {
                columnWidth: 1,
                xtype:'hidden',
                fieldLabel: 'Viaje #:',
                value: me.title,
                name: 'QHeaderId'
            },
            {
                columnWidth: 1,
                xtype: 'image',
                padding: '10 10 10 10',
                //height: 200,
                style: {
                    minWidth: '400px',
                    minHeight: '400px'
                },
                src:'app/resources/images/no_image_available.png?_DC'+ new Date().getTime()
            },
            {
                xtype: 'component',
                columnWidth: 0.4
            }
            ],

            buttons: [
            {
                columnWidth: 0.6,
                xtype: 'filefield',
                name: 'image',
                buttonOnly: true,
                //fieldLabel: 'Photo',
                placeHolder: 'Seleccione una imagen',
                labelWidth: 50,
                msgTarget: 'side',
                allowBlank: false,
                anchor: '100%',
                //buttonText: 'Select Photo...'
                listeners:{
                    afterrender:function(cmp){
                        cmp.fileInputEl.set({
                            accept:'image/*;',
                            capture: ''
                        });
                    },
                    change: function() {
                        var imgShow = Ext.getCmp('documentfileupload').down('image').getEl();
                        if (event.target.files.length === 1 && event.target.files[0].type.indexOf("image/") === 0) {

                            var imgFake = new Image();
                            var url = window.URL ? window.URL : window.webkitURL;
                            imgFake.src = url.createObjectURL(event.target.files[0]);

                            imgFake.onload = function () {
                                imgShow.setStyle('display', 'block');
                                imgShow.set({
                                    src: jic.compress(this, 70).src
                                });
                            };
                        }
                    }
                }
            },
            {
                text: 'Actualizar',
                handler: me.saveImage,
                scope: me
            }]
        });

        me.callParent(arguments);
    },

    saveImage: function() {
        var me = this;

        var form = me.getForm(),
            values = form.getValues(),
            formPost = new FormData(),
            files = me.getEl().down('input[type=file]').dom.files, 
            file = files[0]; //form.getContentEl().down('input[type=file]')

        if (files.length === 1 && files[0].type.indexOf("image/") === 0) {
            // Create an image
            var img = new Image();

            img = me.down('image').getEl().dom;

            var canvas = document.createElement("canvas");

            var ctx = canvas.getContext("2d");
            var width = img.naturalWidth;
            var height = img.naturalHeight;

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            var dataurl = canvas.toDataURL("image/jpeg");

            me.getEl().down('input[type=file]').dom.value = '';

            formPost.append("MovId", values.MovId);
            formPost.append("MovViaje", values.MovViaje);
            formPost.append("Imagen", dataurl);

            Ext.Msg.wait('Cargando imagen...','Espere');

            var http = new XMLHttpRequest();

            // Uploading progress handler
            http.upload.onprogress = function(e) {
                if (e.lengthComputable) {
                    var percentComplete = (e.loaded / e.total) * 100; 
                   //console.log(percentComplete.toFixed(0) + '%');
                }
            };
            
            // Response handler
            http.onreadystatechange = function (e) {
                if (this.readyState === 4) {
                    //console.log(e);
                    //alert(e.currentTarget.responseText);
                    Ext.Msg.hide();
                    me.destroy();
                }
            };
            
            // Error handler
            http.upload.onerror = function(e) {
                //console.log(e.currentTarget.responseText);
                alert(e);
            };

            // Send form with file using XMLHttpRequest POST request
            http.open('POST', IAMTrading.GlobalSettings.webApiPath + 'attachdocument');
            
            http.send(formPost);
        }
    },

    genFile: function(base64Data, tempfilename, contentType) {
        contentType = contentType || '';
        var sliceSize = 1024;
        // Create Base64 Object
        //var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64;}else if(isNaN(i)){a=64;}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a);}return t;},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t;},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t;},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3;}}return t;}};

        var byteCharacters = base64Data;
        var bytesLength = byteCharacters.length;
        var slicesCount = Math.ceil(bytesLength / sliceSize);
        var byteArrays = new Array(slicesCount);

        for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
            var begin = sliceIndex * sliceSize;
            var end = Math.min(begin + sliceSize, bytesLength);

            var bytes = new Array(end - begin);
            for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
                bytes[i] = byteCharacters[offset].charCodeAt(0);
            }
            byteArrays[sliceIndex] = new Uint8Array(bytes);
        }
        var file = new File(byteArrays, tempfilename, { type: contentType });
        return file;
    }
});