Ext.define('IAMTrading.view.common.ToolBar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'app_toolbar',
    style: 'background-color:transparent;',

    initComponent: function() {

        var auth = Ext.util.Cookies.get("IAM.CurrentUser");

        var currentUser = Ext.JSON.decode(auth);
        var tipo = typeof currentUser.UserFullName;

        var fullName = ("string" == tipo) ? currentUser.UserFullName : '';

        Ext.apply(this, {
            items: [{
                xtype: 'component',
                flex: 1
            }, '-', {
                xtype: 'button',
                text: 'Quotes',
                itemId: 'quotesbtn',
                cls: 'x-btn-toolbar-small-cus',
                handler: function() {
                    var vp = this.up('app_viewport');

                    // var myxMask = new Ext.LoadMask({
                    //     target: Ext.getBody(),
                    //     msg: "Please Wait..."
                    // });

                    // myxMask.show();

                    vp.getEl().mask("Please Wait...");

                    var form = Ext.widget('quoteslist', {});

                    var panel = vp.down('app_ContentPanel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("#searchfield").focus(true, 200);
                                vp.getEl().unmask();
                            }
                        }
                    });
                }
            }, '-', {
                xtype: 'button',
                text: 'History Search',
                cls: 'x-btn-toolbar-small-cus',
                handler: function() {
                    var vp = this.up('app_viewport');

                    vp.getEl().mask("Please Wait...");

                    var form = Ext.widget('historysearchlist', {});

                    var panel = vp.down('app_ContentPanel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("#searchfield").focus(true, 200);
                                vp.getEl().unmask();
                            }
                        }
                    });
                }
            }, '-', {
                xtype: 'button',
                text: 'Customs Clearence',
                cls: 'x-btn-toolbar-small-cus',
                disabled: true,
                handler: function() {
                    var vp = this.up('app_viewport');

                    vp.getEl().mask("Please Wait...");

                    var form = Ext.widget('CustomsClearenceList', {});

                    var panel = vp.down('app_ContentPanel');

                    panel.removeAll();
                    panel.add(form);

                    form.getEl().slideIn('r', {
                        easing: 'backOut',
                        duration: 1000,
                        listeners: {
                            afteranimate: function() {
                                form.down("#searchfield").focus(true, 200);
                                vp.getEl().unmask();
                            }
                        }
                    });
                }
            }, '-', {
                xtype: 'splitbutton',
                text: 'Database',
                /*hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),*/
                disabled: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1 || IAMTrading.GlobalSettings.deniedAccess([3,4])),
                menu: [
                    //Customers
                    {
                        text: 'Customers',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {
                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('customerslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Vendors
                    {
                        text: 'Vendors',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('vendorslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Items
                    {
                        text: 'Items',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('itemslist', {
                                title: 'Items'
                            });

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Status
                    {
                        text: 'Status',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('statuslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Brokers
                    {
                        text: 'Brokers',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('brokerslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Sequences
                    {
                        text: 'Sequences',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('sequenceslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // CurrencyRates
                    {
                        text: 'Currency Rates',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('currencyrateslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Document Types
                    {
                        text: 'Document Types',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('documenttypeslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Payment Methods
                    {
                        text: 'Payment Methods',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('paymentmodeslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Banking Institutions
                    {
                        text: 'Banking Institutions',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('bankslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Bank Accounts
                    {
                        text: 'Bank Accounts',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('bankaccountslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Roles
                    {
                        text: 'Roles',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('roleslist', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Charges Categories
                    {
                        text: 'Charges Categories',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('ChargesCategoriesList', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    },
                    // Charges Descriptions
                    {
                        text: 'Charges Descriptions',
                        hidden: IAMTrading.GlobalSettings.deniedAccess([3,4]),
                        handler: function() {

                            var vp = this.up('app_viewport');

                            vp.getEl().mask("Please Wait...");

                            var form = Ext.widget('ChargesDescriptionsList', {});

                            var panel = vp.down('app_ContentPanel');

                            panel.removeAll();
                            panel.add(form);

                            form.getEl().slideIn('r', {
                                easing: 'backOut',
                                duration: 1000,
                                listeners: {
                                    afteranimate: function() {
                                        form.down("field[name=searchField]").focus(true, 200);
                                        vp.getEl().unmask();
                                    }
                                }
                            });
                        }
                    }
                ]
            }, '-', {
                xtype: 'splitbutton',
                iconCls: 'app-user',
                text: fullName,
                menu: [{
                    //iconCls: 'app-logout',
                    text: 'Switch',
                    hidden: (IAMTrading.GlobalSettings.getCurrentUserLevel() === -1),
                    handler: function() {
                        var d = new Date();
                        var expiry = new Date(d.setHours(23, 59, 59, 999)); // at end of day

                        var userData = IAMTrading.GlobalSettings.getCurrentUser();

                        if (userData.UserLevel === 0) {
                            userData.UserLevel = -1;
                        } else {
                            userData.UserLevel = 0;
                        }

                        /*Ext.util.Cookies.clear("IAM.CurrentUser");
                        Ext.util.Cookies.set('IAM.CurrentUser', Ext.JSON.encode(userData), expiry);*/

                        var vp = this.up('app_viewport');

                        vp.getEl().mask("Please Wait...");

                        var form = Ext.widget('quoteslist', {});

                        var panel = vp.down('app_ContentPanel');

                        panel.removeAll();
                        panel.add(form);

                        form.getEl().slideIn('r', {
                            easing: 'backOut',
                            duration: 1000,
                            listeners: {
                                afteranimate: function() {
                                    form.down("#searchfield").focus(true, 200);
                                    vp.getEl().unmask();
                                }
                            }
                        });
                    }
                }, {
                    iconCls: 'app-logout',
                    text: 'Logout',
                    handler: function() {
                        Ext.util.Cookies.clear("IAM.AppAuth");
                        Ext.util.Cookies.clear("IAM.CurrentUser");
                        Ext.MessageBox.wait('Wait', 'Closing Session...');
                        var url = location.href;
                        url = url.split('#');
                        location.href = url[0];
                    }
                }]
            }]
        });

        this.callParent(arguments);
    }
});
