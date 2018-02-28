Ext.define('IAMTrading.model.Users', {
    extend: 'Ext.data.Model',

    fields: [
	    { name:'UserId', type:'string' },
	    { name:'UserFirstName', type:'string' },
	    { name:'UserLastName', type:'string' },
	    { name:'UserFullName', type:'string', useNull: true, defaultValue: null },
	    { name:'UserPassword', type:'string' },
	    { name:'UserLevel', type:'string' },
	    { name:'RoleId', type:'int'},
	    { name:'RememberMe', type:'boolean'}
    ]
});