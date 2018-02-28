Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': 'ux',
        'Ext.ux.DataView': 'ux/DataView/',
        'Overrides': 'overrides'
    }
});

Ext.grid.RowEditor.prototype.cancelBtnText = "Cancel";
Ext.grid.RowEditor.prototype.saveBtnText = "Save";


// Format date to UTC
Ext.JSON.encodeDate = function(o) {
    return '"' + Ext.Date.format(o, 'c') + '"';
};

Ext.require('Ext.data.Types', function() {
    Ext.apply(Ext.data.Types, {
        DATE: {
            convert: function(v) {
                var df = this.dateFormat,
                    parsed;

                if (!v) {
                    return null;
                }
                if (Ext.isDate(v)) {
                    return v;
                }
                if (df) {
                    if (df == 'timestamp') {
                        return new Date(v * 1000);
                    }
                    if (df == 'time') {
                        return new Date(parseInt(v, 10));
                    }
                    return Ext.Date.parse(v, df);
                }

                parsed = Date.parse(v);
                // Add PST timezone offset in milliseconds.
                var valor = parsed ? new Date(parsed + 4.5 * 3600 * 1000) : null;
                //console.log(valor,v);
                return valor;
            }
        }
    });
});

/*
    Declare Validation types
*/
// custom Vtype for vtype:'rif'
Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    rif: function(val, field) {
        return /^[vejg]\d{6,9}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    rifText: 'El Rif debe contener el siguiente formato: J999999999 \nEl primer caracter debe ser J,V,E ó G',
    // vtype Mask property: The keystroke filter mask
    rifMask: /[\s:vejg\d{6,9}]/i
});

Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    numcta: function(val, field) {
        return /^\d{20}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    numctaText: 'La Cuenta debe tener 20 digitos',
    // vtype Mask property: The keystroke filter mask
    numctaMask: /[\d{20}]/i
});

Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    vimp: function(val, field) {
        return /^(pigy)\d{4}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    vimpText: 'Debe comenzar con el prefijo PIGY\n\rSeguido de 4 numeros',
    // vtype Mask property: The keystroke filter mask
    vimpMask: /[pigy\d]/i // /^[\s:p\s:i\s:g\s:y\d{4}$]/i
});

Ext.apply(Ext.form.field.VTypes, {
    //  vtype validation function
    vdis: function(val, field) {
        return /^(pgy)\d{4}$/i.test(val);
        //return val;
    },
    // vtype Text property: The error text to display when the validation function returns false
    vdisText: 'Debe comenzar con el prefijo PGY\n\rSeguido de 4 numeros',
    // vtype Mask property: The keystroke filter mask
    vdisMask: /[pgy\d]/i // /^[\s:p\s:i\s:g\s:y\d{4}$]/i
});

// Vtype for phone number validation
Ext.apply(Ext.form.VTypes, {
    'phoneText': 'Phone number mask example: (0212) 456.78.90',
    'phoneMask': /[\-\+0-9\(\)\s\.Ext]/,
    'phoneRe': /^(\({1}[0-9]{4}\){1}\s{1})([0-9]{3}[.]{1}[0-9]{2}[.]{1}[0-9]{2})$|^(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}$|^Ext. [0-9]+$/,
    'phone': function(v) {
        return this.phoneRe.test(v);
    }
});


// Function to format a phone number
Ext.apply(Ext.util.Format, {
    phoneNumber: function(value) {
        var phoneNumber = value.replace(/\./g, '').replace(/-/g, '').replace(/[^0-9]/g, '');

        if (phoneNumber !== '' && phoneNumber.length == 11) {
            return '(' + phoneNumber.substr(0, 4) + ') ' + phoneNumber.substr(4, 3) + '.' + phoneNumber.substr(7, 2) + '.' + phoneNumber.substr(9, 2);
        } else {
            return value;
        }
    }
});

Ext.namespace('Ext.ux.plugin');

// Plugin to format a phone number on value change
Ext.ux.plugin.FormatPhoneNumber = Ext.extend(Ext.form.TextField, {
    init: function(c) {
        c.on('change', this.onChange, this);
    },
    onChange: function(c) {
        c.setValue(Ext.util.Format.phoneNumber(c.getValue()));
    }
});

Ext.popupMsg = function() {
    var msgCt;

    function createBox(t, s) {
        if (t == "Warning") {
            return '<div class="msgError"><p align="center"><h3>' + s + '</h3></p></div>';
        } else {
            //return '<div class="msgSuccess"><div class="app-check"/><h3>' + s + '</h3></div>';
            return '<div class="msgSuccess"><p align="center"><h3>' + s + '</h3></p></div>';
        }
    }
    return {
        msg: function(title, format) {
            //if(!msgCt){
            if (title == "Warning") {
                msgCt = Ext.DomHelper.insertFirst(document.body, {
                    id: 'app-popup-error-div'
                }, true);
            } else {
                msgCt = Ext.DomHelper.insertFirst(document.body, {
                    id: 'app-popup-success-div'
                }, true);
            }
            //};
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", {
                delay: 1200,
                remove: true
            });
        },

        init: function() {
            //if(!msgCt){
            // It's better to create the msg-div here in order to avoid re-layouts 
            // later that could interfere with the HtmlEditor and reset its iFrame.
            //msgCt = Ext.DomHelper.insertFirst(document.body, {id:'app-popup-success-div'}, true);
            //}
        }
    };
}();

Ext.ux.LoaderX = Ext.apply({}, {
    load: function(fileList, callback, scope, preserveOrder) {
        var scope = scope || this,
            head = document.getElementsByTagName("head")[0],
            fragment = document.createDocumentFragment(),
            numFiles = fileList.length,
            loadedFiles = 0,
            me = this;

        // Loads a particular file from the fileList by index. This is used when preserving order
        var loadFileIndex = function(index) {
            head.appendChild(
                me.buildScriptTag(fileList[index], onFileLoaded)
            );
        };

        /**
         * Callback function which is called after each file has been loaded. This calls the callback
         * passed to load once the final file in the fileList has been loaded
         */
        var onFileLoaded = function() {
            loadedFiles++;

            //if this was the last file, call the callback, otherwise load the next file
            if (numFiles == loadedFiles && typeof callback == 'function') {
                callback.call(scope);
            } else {
                if (preserveOrder === true) {
                    loadFileIndex(loadedFiles);
                }
            }
        };

        if (preserveOrder === true) {
            loadFileIndex.call(this, 0);
        } else {
            //load each file (most browsers will do this in parallel)
            Ext.each(fileList, function(file, index) {
                fragment.appendChild(
                    this.buildScriptTag(file, onFileLoaded)
                );
            }, this);

            head.appendChild(fragment);
        }
    },

    buildScriptTag: function(filename, callback) {
        var exten = filename.substr(filename.lastIndexOf('.') + 1);
        var today = new Date(),
            href = '?_DC=' + today.getTime();

        if (exten == 'js') {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = filename + href;

            //IE has a different way of handling <script> loads, so we need to check for it here
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = callback;
            }
            return script;
        }
        if (exten == 'css') {
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = filename + href;
            callback();
            return style;
        }
    }
});

Ext.grid.RowEditorButtons.override({
    constructor: function(config) {
        var me = this,
            rowEditor = config.rowEditor,
            cssPrefix = Ext.baseCSSPrefix,
            plugin = rowEditor.editingPlugin;

        var buttons = [{
            cls: 'mycancel',
            iconCls: 'fa fa-times',
            handler: plugin.cancelEdit,
            text: 'Cancel'
        }, {
            cls: 'myupdate',
            iconCls: 'fa fa-save',
            itemId: 'update',
            handler: plugin.completeEdit,
            text: 'Save',
            disabled: rowEditor.updateButtonDisabled
        }];

        if (plugin.customButtonsEnabled) {
            buttons = plugin.customButtons.concat(buttons);
        }


        config = Ext.apply({
            baseCls: cssPrefix + 'grid-row-editor-buttons',
            defaults: {
                xtype: 'button',
                ui: rowEditor.buttonUI,
                scope: plugin,
                flex: 1,
                minWidth: Ext.panel.Panel.prototype.minButtonWidth
            },
            items: buttons
        }, config);

        Ext.grid.RowEditorButtons.superclass.constructor.call(this, config);

        me.addClsWithUI(me.position);
    }
});

Ext.override(Ext.data.proxy.Ajax, { timeout:0 });

Ext.onReady(function() {

    Ext.ux.LoaderX.load(
        ['app/resources/css/app.css', 'app/resources/css/data-view.css'],
        function() {
            document.getElementById("loading").style.display = 'none';
        }
    );

    function fnDolarToday() {
        Ext.Ajax.request({
            type: 'json',
            url: IAMTrading.GlobalSettings.webApiPath + 'dolartoday',
            success: function(rsp) {
                var data = Ext.JSON.decode(rsp.responseText);
                if (Ext && Ext.getCmp('app_viewport')) {
                    Ext.getCmp('app_viewport').down('#dolartoday').setValue(data.data.USD);
                }
            }
        });
    }

    function timerIncrement() {
        idleTime = idleTime + 1;

        if (idleTime >= 30) { // 20 minutes
            var out = function(btn) {
                if (btn !== "yes") {
                    Ext.util.Cookies.clear("IAM.AppAuth");
                    Ext.util.Cookies.clear("IAM.CurrentUser");
                    window.location.reload();
                }
            };

            Ext.Msg.show({
                title: 'Inactivity Detected',
                msg: 'Do you want to keep session?',
                buttons: Ext.Msg.YESNO,
                icon: Ext.Msg.QUESTION,
                closable: false,
                fn: out
            });

        }
    }


    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60 * 1000); // 1 minute

    // Solicitamos cada hora la tasa del dia
    var idleInterval2 = setInterval(fnDolarToday, (60 * 1000) * 60);

    //Zero the idle timer on mouse movement.
    document.onmousemove = function(e) {
        idleTime = 0;
    };
    document.onkeypress = function(e) {
        idleTime = 0;
    };
    document.onmousedown = function(e) {
        idleTime = 0;
    };
    document.onmouseup = function(e) {
        idleTime = 0;
    };
});

Ext.setGlyphFontFamily('FontAwesome');

Ext.application({

    requires: [
        'IAMTrading.GlobalSettings',
        'IAMTrading.view.Viewport',
        'Ext.ux.Router',
        'Ext.ux.form.Toolbar',
        'Ext.ux.form.NumericField',
        'Ext.ux.form.Currency',
        'Ext.ux.CapturePicture',
        'Ext.ux.CheckColumn',
        'Ext.ux.CheckColumnPatch',
        'Ext.ux.form.SearchField',
        'Ext.ux.DataView.DragSelector',
        'Ext.ux.DataView.LabelEditor',
        'Ext.ux.grid.FiltersFeature',
        'Ext.ux.form.field.TimePickerField',
        'Ext.ux.form.DateTimePicker',
        'Ext.ux.form.field.DateTimeField',
        'Ext.ux.form.DateTimeMenu',
        'Ext.ux.InputTextMask',
        'Overrides.form.field.Date',
        'Overrides.form.field.Base',
        'Overrides.form.ComboBox',
        'Overrides.view.Table',
        'Overrides.view.AbstractView',
        'Overrides.data.Store',
        'Overrides.data.proxy.Proxy',
        'Overrides.toolbar.Paging',
        'Overrides.util.Format',
        'Overrides.grid.column.Action'        
    ],

    routes: {
        '/': 'home#init',
        'logon': 'logon#passport',
        'users/:id/edit': 'users#edit'
    },

    controllers: [
        'Home',
        'Logon'
    ],

    //autoCreateViewport: true,

    name: 'IAMTrading',

    launch: function() {
        Ext.require('Ext.device.*');

        /* 
         * Ext.ux.Router provides some events for better controlling
         * dispatch flow
         */
        Ext.ux.Router.on({

            routemissed: function(token) {
                Ext.Msg.show({
                    title: 'Error 404',
                    msg: 'Route not found: ' + token,
                    buttons: Ext.Msg.OK,
                    icon: Ext.Msg.ERROR
                });
            },

            beforedispatch: function(token, match, params) {
                //consolex.log('beforedispatch ' + token);
            },

            /**
             * For this example I'm using the dispatch event to render the view
             * based on the token. Each route points to a controller and action. 
             * Here I'm using these 2 information to get the view and render.
             */
            dispatch: function(token, match, params, controller) {
                if (controller.id == "Home") {
                    Ext.create("IAMTrading.view.Viewport");
                }
            }
        });
    }
});
