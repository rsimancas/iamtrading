Ext.define('IAMTrading.GlobalSettings', {
    singleton: true,
    webApiPath: '../wa/api/',
    tokenAuth: Ext.util.Cookies.get('IAM.AppAuth'),
    currentUser: Ext.JSON.decode(Ext.util.Cookies.get("IAM.CurrentUser")),
    getCurrentUser: function() {
        if (this.currentUser) {
            return this.currentUser;
        } else {
            return null;
        }
    },
    getCurrentUserId: function() {
        if (this.currentUser) {
            return this.currentUser.UserId;
        } else {
            return null;
        }
    },
    getCurrentUserLevel: function() {
        if (this.currentUser) {
            return this.currentUser.UserLevel;
        } else {
            return null;
        }
    },
    getCurrentUserRole: function() {
        if (this.currentUser) {
            return this.currentUser.RoleId;
        } else {
            return null;
        }
    },
    deniedAccess: function(roles) {
        var valid = false,
            me = this;
        Ext.Array.each(roles, function(value, index) {
            if (value === me.getCurrentUserRole()) {
                valid = true;
                return;
            }
        });

        return valid;
    },
    grantedAccess: function(roles) {
        var valid = false,
            me = this;
        Ext.Array.each(roles, function(value, index) {
            if (value === me.getCurrentUserRole()) {
                valid = true;
                return;
            }
        });

        return valid;
    }
});
