Ext.define('IAMTrading.controller.Logon', {
    extend: 'Ext.app.Controller',

    models: [
        'Users'
    ],

    stores: [
        'Users'
    ],

    views: [
        'Logon'
    ],

    init: function() {
        this.control({
            'logon button[text="Submit"]': {
                click: this.onSubmitLogon
            },
            'logon textfield[fieldLabel="Password"]': {
                keypress: this.onLogonTextFieldKeypress
            }
        });
    },

    passport: function(application) {
        viewport = Ext.create('Ext.Viewport', {
            cls: 'custom-viewport',
            renderTo: Ext.getBody()
        });
        view = Ext.create('IAMTrading.view.Logon', {
            autoRender: true,
            autoShow: true
        });

        viewport.add(view);
    },

    onLogonTextFieldKeypress: function(textfield, e, eOpts) {
        if (e.getCharCode() == Ext.EventObject.ENTER) {
            var but = textfield.up('form').down('toolbar').down('button');
            but.fireEvent("click", but);
        }
    },

    onSubmitLogon: function(button, e, eOpts) {

        var currentForm = button.up('form').getForm();

        record = Ext.create('IAMTrading.model.Users');

        currentForm.updateRecord(record);

        Ext.Msg.wait('Starting Session...', 'Login');


        Ext.Ajax.request({
            url: IAMTrading.GlobalSettings.webApiPath + 'auth',
            jsonData: Ext.JSON.encode(record),
            timeout: 120000,

            success: function(response, opts) {
                var d = new Date();
                //var expiry = new Date(now.getTime()+(24*3600*1000)); // Ten minutes
                var expiry = new Date(d.setHours(23, 59, 59, 999)); // at end of day
                var result = Ext.JSON.decode(response.responseText);

                Ext.util.Cookies.set('IAM.AppAuth', result.security, expiry);
                Ext.util.Cookies.set('IAM.CurrentUser', Ext.JSON.encode(result.data), expiry);

                Ext.Msg.hide();
                var url = location.href;
                url = url.split('#');
                location.href = url[0];
            },

            failure: function(response, opts) {
                Ext.Msg.alert('Warning', 'Starting Session Failed!!!');
                //currentForm.reset(); 
            }
        });
    }
});
