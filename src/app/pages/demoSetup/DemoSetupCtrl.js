(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($rootScope, $scope, $http, $location,localStorageManagement, environmentConfig,
                           errorHandler, Rehive, toastr, currencyModifiers, serializeFiltersService,$filter) {
        var vm=this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Demo setup | Rehive';
        $rootScope.securityConfigured = false;

        $scope.settingUpDemo = false;
        $scope.userGroupTiers = [];
        $scope.merchantGroupTiers = [];
        $scope.currencyOptions = [];
        $scope.demoCurrency = {};
        $scope.txbtCurrency = {};

        vm.setupCurrencies = function(){
            $scope.currencyOptions.forEach(function(currency){
                if(currency.code === "DEMO"){
                    $scope.demoCurrency = currency;
                }
                else if(currency.code === "TXBT"){
                    $scope.txbtCurrency = currency;
                }
            });
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        vm.configureCompanyDetails = function(){
            var demoCompany = {
                name: "CompanyName",
                description: "CompanyName is a multi cryptocurrencies app for spending online.",
                website: "",
                email: "",
                logo: null,
                icon: null,
                public: false,
                config: {
                    company: {
                        name: "CompanyName",
                        id: "CompanyId",
                        description: "CompanyName is a multi cryptocurrencies app for spending online."
                    },
                    auth: {
                        mfa: "",
                        username: false,
                        email: "",
                        terms: [],
                        identifier: "email",
                        mobile: "",
                        country: false,
                        pin: "",
                        first_name: false,
                        last_name: false
                    },
                    design: {
                        app: {
                            surface: true,
                            tabBarLabels: false
                        },
                        notifications: {
                            actionButtonsType: "contained",
                            layout: "material"
                        },
                        wallets: {
                            balance: "badge",
                            actionButtonsType: "",
                            layout: "mini",
                            showActions: false,
                            headerColor: "font",
                            header: "",
                            headerActionType: "text"
                        },
                        home: {
                            header: "wallets",
                            content: [
                                "notifications",
                                "rewards",
                                "wallets"
                            ]
                        },
                        other: {
                            floatingActionButtons: false,
                            actionButtonsType: "text",
                            homeCardLayout: "material"
                        },
                        campaigns: {
                            actionButtonsType: "contained",
                            layout: "material",
                            showActions: true
                        },
                        general: {
                            elevation: 2,
                            shadow: 3,
                            cornerRadius: 5
                        },
                        buttons: {
                            elevation: 4,
                            shadow: 10,
                            bold: false,
                            rounded: true
                        },
                        cards: {
                            elevation: 3,
                            shadow: 8,
                            actionButtonsType: "contained",
                            cornerRadius: 20
                        },
                        popUp: {
                            cornerRadius: 20
                        }
                    },
                    cards: {
                        home: {
                            custom: [
                                {
                                    dismiss: true,
                                    image: "blocks-card",
                                    title: "Welcome to CompanyName",
                                    id: 0,
                                    description: "Multi-currency app for online payments and rewards."
                                }
                            ]
                        }
                    }
                }
            };
            demoCompany.config = JSON.stringify(demoCompany.config);

            if(vm.isJson(demoCompany.config)){
                demoCompany.config = JSON.parse(demoCompany.config);
            }

            demoCompany = serializeFiltersService.objectFilters(demoCompany);
            if(vm.token){
                Rehive.admin.company.update(demoCompany).then(function(res){
                    $rootScope.pageTopObj.companyObj = res;
                    vm.setupUserGroups();
                    $scope.$apply();
                }).catch(function(error){
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.setupUserGroups = function(){
            var adminGroup = {name: "admin"},
                serviceGroup = {name: "service"},
                userGroup = {
                    name: "user",
                    label: "User",
                    public: true,
                    default: true,
                    description: "Users are limited to their own accounts."
                },
                managerGroup = {
                    name: "manager",
                    label: "Manager",
                    public: false,
                    default: false,
                    description: "Managers are able to make transactions from their own operational account, " +
                        "and view and verify user data. Managers do not have access to system configurations."
                },
                supportGroup = {
                    name: "support",
                    label: "Support",
                    public: false,
                    default: false,
                    description: "Support have limited access to make transactions from their own operational account, " +
                        "view and verify user data. Support do not have access to system configurations."
                },
                merchantGroup = {
                    name: "merchant",
                    label: "Merchant",
                    public: false,
                    default: false,
                    description: "Merchants are limited to their own accounts."
                };
            vm.addGroup(managerGroup, null);
            vm.addGroup(supportGroup, null);
            vm.addGroup(userGroup, null);
            vm.addGroup(merchantGroup, 'last');
            // vm.addGroup(serviceGroup, null);
            // vm.addGroup(adminGroup, 'last');
        };

        vm.addGroup = function(groupObj, last){
            if(vm.token){
                if(groupObj.name === 'admin'){
                    Rehive.admin.groups.update(groupObj.name, {description: "Admin users have full access to all aspects of the company."})
                        .then(function(res){
                            $scope.$apply();
                        }, function (error) {
                            errorHandler.evaluateErrors(error);
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                }
                else if(groupObj.name === 'service'){
                    Rehive.admin.groups.update(groupObj.name, {description: "Services have access to specific permissions that’s needed for each service."})
                        .then(function(res){
                            $scope.$apply();
                        }, function (error) {
                            errorHandler.handleErrors(error);
                            $scope.$apply();
                        });
                }
                else {
                    Rehive.admin.groups.create(groupObj).then(function (res)
                    {
                        Rehive.admin.groups.update(groupObj.name, groupObj)
                            .then(function(res){
                                if(last){
                                    vm.setupGroupPermissions();
                                }
                                $scope.$apply();
                            }, function (error) {
                                errorHandler.handleErrors(error);
                                $scope.$apply();
                            });
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            }
        };

        vm.setupGroupPermissions = function(){
            var userPermissions = [
                {type:'account', level: "view", section: 'user'},
                {type:'address', level: "view", section: 'user'},
                {type:'bankaccount', level: "view", section: 'user'},
                {type:'currency', level: "view", section: 'user'},
                {type:'company', level: "view", section: 'user'},
                {type:'cryptoaccount', level: "view", section: 'user'},
                {type:'document', level: "view", section: 'user'},
                {type:'email', level: "view", section: 'user'},
                {type:'group', level: "view", section: 'user'},
                {type:'mfa', level: "view", section: 'user'},
                {type:'mobile', level: "view", section: 'user'},
                {type:'token', level: "view", section: 'user'},
                {type:'transaction', level: "view", section: 'user'},
                {type:'user', level: "view", section: 'user'}
            ];
            var len = userPermissions.length;
            for(var i = 0; i < len; ++i){
                userPermissions.push({type: userPermissions[i].type, level: "add", section: 'user'});
                userPermissions.push({type: userPermissions[i].type, level: "change", section: 'user'});
                userPermissions.push({type: userPermissions[i].type, level: "delete", section: 'user'});
            }
            var managerAdminPermissions = [
                {type:'accesscontrolrule', level: "view", section: 'admin'},
                {type:'account', level: "view", section: 'admin'},
                {type:'address', level: "view", section: 'admin'},
                {type:'bankaccount', level: "view", section: 'admin'},
                {type:'currency', level: "view", section: 'admin'},
                {type:'company', level: "view", section: 'admin'},
                {type:'cryptoaccount', level: "view", section: 'admin'},
                {type:'document', level: "view", section: 'admin'},
                {type:'email', level: "view", section: 'admin'},
                {type:'group', level: "view", section: 'admin'},
                {type:'mfa', level: "view", section: 'admin'},
                {type:'mobile', level: "view", section: 'admin'},
                {type:'notification', level: "view", section: 'admin'},
                {type:'request', level: "view", section: 'admin'},
                {type:'service', level: "view", section: 'admin'},
                {type:'token', level: "view", section: 'admin'},
                {type:'transaction', level: "view", section: 'admin'},
                {type:'transactionsubtypes', level: "view", section: 'admin'},
                {type:'user', level: "view", section: 'admin'},
                {type:'webhook', level: "view", section: 'admin'}
            ];
            len = managerAdminPermissions.length;
            for(var i = 0; i < len; ++i){
                if(managerAdminPermissions[i].type === 'address' || managerAdminPermissions[i].type === 'bankaccount'
                    || managerAdminPermissions[i].type === 'cryptoaccount' || managerAdminPermissions[i].type === 'document'
                    || managerAdminPermissions[i].type === 'email' || managerAdminPermissions[i].type === 'mobile' || managerAdminPermissions[i].type === 'user'){
                    managerAdminPermissions.push({type: managerAdminPermissions[i].type, level: "add", section: "admin"});
                    managerAdminPermissions.push({type: managerAdminPermissions[i].type, level: "change", section: "admin"});
                    managerAdminPermissions.push({type: managerAdminPermissions[i].type, level: "delete", section: "admin"});
                }
            }
            var supportAdminPermissions = [
                {type:'account', level: "view", section: 'admin'},
                {type:'address', level: "view", section: 'admin'},
                {type:'address', level: "add", section: 'admin'},
                {type:'address', level: "change", section: 'admin'},
                {type:'address', level: "delete", section: 'admin'},
                {type:'bankaccount', level: "view", section: 'admin'},
                {type:'bankaccount', level: "add", section: 'admin'},
                {type:'bankaccount', level: "change", section: 'admin'},
                {type:'bankaccount', level: "delete", section: 'admin'},
                {type:'currency', level: "view", section: 'admin'},
                {type:'cryptoaccount', level: "view", section: 'admin'},
                {type:'cryptoaccount', level: "add", section: 'admin'},
                {type:'cryptoaccount', level: "change", section: 'admin'},
                {type:'cryptoaccount', level: "delete", section: 'admin'},
                {type:'document', level: "view", section: 'admin'},
                {type:'document', level: "add", section: 'admin'},
                {type:'document', level: "change", section: 'admin'},
                {type:'document', level: "delete", section: 'admin'},
                {type:'email', level: "view", section: 'admin'},
                {type:'email', level: "add", section: 'admin'},
                {type:'email', level: "change", section: 'admin'},
                {type:'email', level: "delete", section: 'admin'},
                {type:'group', level: "view", section: 'admin'},
                {type:'mobile', level: "view", section: 'admin'},
                {type:'mobile', level: "add", section: 'admin'},
                {type:'mobile', level: "change", section: 'admin'},
                {type:'mobile', level: "delete", section: 'admin'},
                {type:'transaction', level: "view", section: 'admin'},
                {type:'transaction', level: "add", section: 'admin'},
                {type:'transactionsubtypes', level: "view", section: 'admin'},
                {type:'user', level: "view", section: 'admin'},
                {type:'user', level: "add", section: 'admin'},
                {type:'user', level: "change", section: 'admin'},
                {type:'user', level: "delete", section: 'admin'},
            ];

            vm.addGroupPermissions('manager', userPermissions, null);
            vm.addGroupPermissions('manager', managerAdminPermissions, null);
            vm.addGroupPermissions('support', userPermissions, null);
            vm.addGroupPermissions('support', supportAdminPermissions, null);
            vm.addGroupPermissions('user', userPermissions, null);
            vm.addGroupPermissions('merchant', userPermissions, 'last');
        };

        vm.addGroupPermissions = function(groupName, permissionsArray, last){
            if(vm.token) {
                $scope.loadingPermissions = true;
                Rehive.admin.groups.permissions.create(groupName,{permissions: permissionsArray}).then(function (res) {
                    if(last){
                        vm.setupGroupTiers();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.setupGroupTiers = function(){
            var tier1 = {
                    level: 1,
                    name: "1",
                    description: "Basic"
                },
                tier2 = {
                    level: 2,
                    name: "2",
                    description: "Intermediary"
                },
                tier3 = {
                    level: 3,
                    name: "1",
                    description: "Advanced"
                };
            vm.addGroupTiers("user", tier1, null);
            vm.addGroupTiers("user", tier2, null);
            vm.addGroupTiers("user", tier3, null);
            vm.addGroupTiers("merchant", tier1, null);
            vm.addGroupTiers("merchant", tier2, null);
            vm.addGroupTiers("merchant", tier3, "last");
        };

        vm.addGroupTiers = function(groupName, tierObj, last){
            if(vm.token) {
                Rehive.admin.groups.tiers.create(groupName, tierObj).then(function (res) {
                    if(last){
                        vm.getAllTiers();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getAllTiers = function(){
            if(vm.token){
                Rehive.admin.groups.tiers.get("user").then(function (res) {
                    $scope.userGroupTiers = res;
                    for(var i = 0; i < $scope.userGroupTiers.length; ++i){
                        if($scope.userGroupTiers[i].level === 2 || $scope.userGroupTiers[i].level === 3){
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "first_name");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "last_name");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "email_address");
                        }
                        if($scope.userGroupTiers[i].level === 3){
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "nationality");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "birth_date");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "id_number");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "mobile_number");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "proof_of_identity");
                            vm.updateTierRequirements("user", $scope.userGroupTiers[i], "proof_of_address");
                        }
                    }
                    Rehive.admin.groups.tiers.get("merchant").then(function (res) {
                        $scope.merchantGroupTiers = res;
                        for(var i = 0; i < $scope.merchantGroupTiers.length; ++i){
                            if($scope.merchantGroupTiers[i].level === 2 || $scope.merchantGroupTiers[i].level === 3){
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "first_name");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "last_name");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "email_address");
                            }
                            if($scope.merchantGroupTiers[i].level === 3){
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "nationality");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "birth_date");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "id_number");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "mobile_number");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "proof_of_identity");
                                vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "proof_of_address");
                            }
                        }
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.tierRequirementsAdded = 0;
        vm.updateTierRequirements = function(groupName, tierObj, requirementName){
            if(vm.token) {
                Rehive.admin.groups.tiers.requirements.create(groupName, tierObj.id, {
                    "requirement": requirementName
                }).then(function (res) {
                    ++vm.tierRequirementsAdded;
                    if(vm.tierRequirementsAdded === 24){
                        vm.setupTransactionSubtypes();
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.setupTransactionSubtypes = function(){
            var subtypes = [
                {
                    name: "issue",
                    label: "Issue",
                    tx_type: "credit",
                    description: "Subtype is used to issue funds to the destination address when issuing crypto assets."
                },
                {
                    name: "fund",
                    label: "Fund",
                    tx_type: "credit",
                    description: "Subtype is used to funds operational accounts."
                },
                {
                    name: "deposit",
                    label: "Deposit",
                    tx_type: "credit",
                    description: "Subtype is used to credit the destination account balance for a deposit transaction."
                },
                {
                    name: "deposit",
                    label: "Deposit",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for a deposit transaction."
                },
                {
                    name: "withdraw",
                    label: "Withdraw",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for a withdraw transaction."
                },
                {
                    name: "send",
                    label: "Send",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for a transfer transaction."
                },
                {
                    name: "receive",
                    label: "Receive",
                    tx_type: "credit",
                    description: "Subtype is used to credit the destination account balance for a transfer transaction."
                },
                {
                    name: "reward",
                    label: "Reward",
                    tx_type: "credit",
                    description: "Subtype is used to credit the destination account balance for a rewards transaction."
                },
                {
                    name: "reward",
                    label: "Reward",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for a rewards transaction."
                },
                {
                    name: "purchase",
                    label: "Purchase",
                    tx_type: "credit",
                    description: "Subtype is used to credit the destination account balance for a purchase transaction in the marketplace or in store."
                },
                {
                    name: "purchase",
                    label: "Purchase",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for a purchase transaction in the marketplace or in store."
                },
                {
                    name: "mass_send",
                    label: "Mass send",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for bulk transfer transactions."
                },
                {
                    name: "mass_send",
                    label: "Mass send",
                    tx_type: "credit",
                    description: "Subtype is used to credit the destination account balance for bulk transfer transactions."
                }
            ];

            for(var i = 0; i < subtypes.length; ++i){
                if(i === (subtypes.length - 1)){
                    vm.addTransactionSubtype(subtypes[i], 'last');
                }
                else {
                    vm.addTransactionSubtype(subtypes[i], null);
                }
            }

        };

        vm.addTransactionSubtype = function(subtypeObj, last){
            if(vm.token){
                Rehive.admin.subtypes.create(subtypeObj).then(function (res) {
                    if(last){
                        vm.setupServices();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.setupServices = function(){
            var servicesArray = [4, 12, 45, 78, 79, 80];
            var len = servicesArray.length;
            if(vm.token){
                for(var idx = 0; idx < len; ++idx) {
                    $http.put(environmentConfig.API + '/admin/services/' + servicesArray[idx] + '/',{terms_and_conditions: true, active: true},{
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(res.data.data.id === 12){
                            vm.setupBitcoinTestnetService();
                        }
                    }).catch(function (error) {
                        errorHandler.handleErrors(error);
                    });
                }
            }
        };

        vm.setupBitcoinTestnetService = function(){
            var bitCoinSubtypes = {
                transaction_credit_subtype: "deposit",
                transaction_debit_subtype: "withdraw",
                transaction_fee_subtype: "fee",
                transaction_fund_subtype: "fund",
            };

            bitCoinSubtypes = serializeFiltersService.objectFilters(bitCoinSubtypes);

            if(vm.token){
                $http.patch('https://bitcoin-testnet.services.rehive.io/api/1/admin/company/configuration/', bitCoinSubtypes, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    vm.setupStellarTestnetService();

                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.setupStellarTestnetService = function(){
            var stellarSubtypes = {
                transaction_credit_subtype: "deposit",
                transaction_debit_subtype: "withdraw",
                transaction_fee_subtype: "fee",
                transaction_fund_subtype: "fund",
                transaction_issue_subtype: "issue",
            };

            stellarSubtypes = serializeFiltersService.objectFilters(stellarSubtypes);

            if(vm.token){
                $http.patch('https://stellar-testnet.services.rehive.io/api/1/admin/company/', {has_completed_setup: true}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    $http.patch('https://stellar-testnet.services.rehive.io/api/1/admin/company/configuration/', stellarSubtypes, {
                        headers: {
                            'Content-type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function(res){
                        vm.fundStellarTestnetHotwallet();
                    }).catch(function(error){
                        errorHandler.handleErrors(error);
                    });
                }).catch(function(error){
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.fundStellarTestnetHotwallet = function(recall){
            if(vm.token){
                $http.get('https://stellar-testnet.services.rehive.io/api/1/admin/hotwallet/fund', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    var hotwalletFundObj = res.data.data;
                    // vm.addDemoAsset(hotwalletFundObj.account_address);
                    var url = "https://friendbot.stellar.org/?addr=" + hotwalletFundObj.account_address;
                    $http.get(url, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then(function (res) {
                        vm.addDemoAsset(hotwalletFundObj.account_address);
                    }).catch(function (error) {
                        if(error.status === 400){
                            vm.demoCurrency(hotwalletFundObj.account_address);
                        }
                        else {
                            errorHandler.handleErrors(error);
                        }
                    });
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });

            }
        };

        vm.addDemoAsset = function(issuerAddress){
            var demoAssetParams = {
                currency_code: "DEMO",
                address: issuerAddress,
                description: "a demo asset setup for Stellar Testnet service.",
                symbol: 'd',
                unit: "demo"
            };
            demoAssetParams = serializeFiltersService.objectFilters(demoAssetParams);

            $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/asset/', demoAssetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                vm.setupNotificationService();
            }).catch(function (error) {
                errorHandler.handleErrors(error);
            });
        };

        vm.setupNotificationService = function(){
            var emailTemplates = [];
            var smsTemplates = [];
            vm.getEmailNotificationTemplates(emailTemplates, smsTemplates);
        };

        vm.getEmailNotificationTemplates = function(emailTemplates, smsTemplates){
            if(vm.token){
                $http.get('https://notification.services.rehive.io/api/admin/templates/?type=email&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    emailTemplates = res.data.data.results;
                    vm.getSmsNotificationTemplates(emailTemplates, smsTemplates);
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getSmsNotificationTemplates = function(emailTemplates, smsTemplates){
            if(vm.token){
                $http.get('https://notification.services.rehive.io/api/admin/templates/?type=sms&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    smsTemplates = res.data.data.results;
                    vm.enableBulkNotifications(emailTemplates, smsTemplates);
                }).catch(function (error) {
                    $scope.addingBulkNotification = false;
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.enableBulkNotifications = function(emailTemplates, smsTemplates){
            emailTemplates.forEach(function (emailNotification,index,arr) {
                vm.addNotification(emailNotification, null, 'email');
            });

            smsTemplates.forEach(function (emailNotification,index,arr) {
                if(index === (arr.length-1) ){
                    vm.addNotification(emailNotification, 'last', 'sms');
                }
                else{
                    vm.addNotification(emailNotification, null, 'sms');
                }
            });
        };

        vm.addNotification = function (notification,last,type) {
            var notificationObj = {};

            if(type == 'email'){
                notificationObj = {
                    name: notification.name,
                    description: notification.description,
                    subject: notification.subject,
                    event: notification.event,
                    html_message: notification.html_message,
                    text_message: notification.text_message,
                    to_email: notification.to_email,
                    expression: notification.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'email'
                };
            } else {
                notificationObj = {
                    name: notification.name,
                    description: notification.description,
                    subject: notification.subject,
                    event: notification.event,
                    sms_message: notification.sms_message,
                    to_mobile: notification.to_mobile,
                    expression: notification.expression,
                    enabled: notification.enabled,
                    preference_enabled: false,
                    type: 'sms'
                };
            }

            if(vm.token) {
                $http.post('https://notification.services.rehive.io/api/admin/notifications/',notificationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(last){
                            vm.getCompanyCurrencies();
                        }
                    }
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                        page:1,
                        page_size: 250,
                        archived: false
                    }}).then(function (res) {
                        if($scope.currencyOptions.length > 0){
                            $scope.currencyOptions.length = 0;
                        }
                        $scope.currencyOptions = res.results.slice();

                        $scope.currencyOptions.sort(function(a, b){
                            return a.code.localeCompare(b.code);
                        });
                        $scope.currencyOptions.sort(function(a, b){
                            return a.unit.localeCompare(b.unit);
                        });
                        vm.setupCurrencies();
                        vm.setupAccountConfigurations();
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                });
            }
        };

        vm.setupAccountConfigurations = function(){
            var operationalAccountConfig = {
                name: "operational",
                label: "Operational",
                default: true,
                primary: true,
                list: []
            },
            userAccountConfig = {
                name: "default",
                label: "Default",
                default: true,
                primary: true,
                list: []
            };

            operationalAccountConfig = serializeFiltersService.objectFilters(operationalAccountConfig);
            userAccountConfig = serializeFiltersService.objectFilters(userAccountConfig);

            vm.addGroupAccountConfigurations("admin", operationalAccountConfig, null);
            vm.addGroupAccountConfigurations("manager", operationalAccountConfig, null);
            vm.addGroupAccountConfigurations("support", operationalAccountConfig, null);
            vm.addGroupAccountConfigurations("user", userAccountConfig, 'last');
        };

        vm.addGroupAccountConfigurations = function(groupName, groupAccountConfigurationParams, last){
            if(vm.token) {
                Rehive.admin.groups.accountConfigurations.create(groupName, groupAccountConfigurationParams).then(function (res)
                {
                    if(last){
                        vm.addGroupAccountConfigurationCurrency(groupName, res, last);
                    }
                    else{
                        vm.addGroupAccountConfigurationCurrency(groupName, res, null);
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.addGroupAccountConfigurationCurrency = function (groupName, account, last) {
            $scope.currencyOptions.forEach(function (element,index,array) {
                Rehive.admin.groups.accountConfigurations.currencies.create(groupName, account.name, {currency: element.code}).then(function (res)
                {
                    if (last && index === (array.length - 1)){
                        // vm.setupTierLimits();
                        vm.reactivateProductService();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            });
        };

        // vm.setupTierLimits = function(){
        //     var tier1LimitCr = {
        //             tx_type: "credit",
        //             currency: null,
        //             value: 1000,
        //             type: 'month_max'
        //         },
        //         tier1LimitDr = {
        //             tx_type: "debit",
        //             currency: null,
        //             value: 1000,
        //             type: 'month_max'
        //         },
        //         tier2LimitCr = {
        //             tx_type: "credit",
        //             currency: null,
        //             value: 10000,
        //             type: 'month_max'
        //         },
        //         tier2LimitDr = {
        //             tx_type: "debit",
        //             currency: null,
        //             value: 10000,
        //             type: 'month_max'
        //         };
        //
        //     tier1LimitCr = serializeFiltersService.objectFilters(tier1LimitCr);
        //     tier1LimitDr = serializeFiltersService.objectFilters(tier1LimitDr);
        //     tier2LimitCr = serializeFiltersService.objectFilters(tier2LimitCr);
        //     tier2LimitDr = serializeFiltersService.objectFilters(tier2LimitDr);
        //
        //     for(var i = 0; i < $scope.currencyOptions.length; ++i){
        //         var currency = $scope.currencyOptions[i];
        //
        //         tier1LimitCr.currency = tier1LimitDr.currency = tier2LimitCr.currency = tier2LimitDr.currency = currency.code;
        //
        //         tier1LimitCr.value = tier1LimitDr.value = currencyModifiers.convertToCents(1000, currency.divisibility);
        //         tier2LimitCr.value = tier2LimitDr.value = currencyModifiers.convertToCents(10000, currency.divisibility);
        //
        //         for(var j = 0; j < $scope.userGroupTiers.length; ++j){
        //             if($scope.userGroupTiers[j].level === 1){
        //                 vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier1LimitCr, null);
        //                 vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier1LimitDr, null);
        //             }
        //             else if($scope.userGroupTiers[j].level === 2){
        //                 vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier2LimitCr, null);
        //                 vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier2LimitDr, null);
        //             }
        //         }
        //         for(var k = 0; k < $scope.merchantGroupTiers.length; ++k){
        //             if($scope.merchantGroupTiers[k].level === 1){
        //                 vm.addTierLimit("merchant", $scope.merchantGroupTiers[k].id, tier1LimitCr, null);
        //                 vm.addTierLimit("merchant", $scope.merchantGroupTiers[k].id, tier1LimitDr, null);
        //             }
        //             else if($scope.merchantGroupTiers[k].level === 2 && i === ($scope.currencyOptions.length - 1) && k === ($scope.merchantGroupTiers.length - 1)){
        //                 vm.addTierLimit("merchant", $scope.merchantGroupTiers[k].id, tier2LimitCr, null);
        //                 vm.addTierLimit("merchant", $scope.merchantGroupTiers[k].id, tier2LimitDr, 'last');
        //             }
        //             else if($scope.merchantGroupTiers[k].level === 2){
        //                 vm.addTierLimit("merchant", $scope.merchantGroupTiers[k].id, tier2LimitCr, null);
        //                 vm.addTierLimit("merchant", $scope.merchantGroupTiers[k].id, tier2LimitDr, null);
        //             }
        //         }
        //     }
        // };

        // vm.addTierLimit = function(groupName, tierId, tierLimitsParams, last){
        //     if(vm.token) {
        //         Rehive.admin.groups.tiers.limits.create(groupName, tierId, tierLimitsParams)
        //             .then(function (res){
        //                 if(last){
        //                     vm.reactivateProductService();
        //                 }
        //                 $scope.$apply();
        //             }, function (error) {
        //                 errorHandler.evaluateErrors(error);
        //                 errorHandler.handleErrors(error);
        //                 $scope.$apply();
        //             });
        //     }
        // };

        /*To update the service currencies: */
        vm.reactivateProductService = function(){
            if(vm.token){
                $http.put(environmentConfig.API + '/admin/services/' + 79 + '/',{active: false},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $http.put(environmentConfig.API + '/admin/services/' + 79 + '/',{terms_and_conditions: true, active: true},{
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        vm.setupProductService();
                    }).catch(function (error) {
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.setupProductService = function(){
            var newProduct1 = {
                    name: "Steam voucher",
                    description: "$10 Steam voucher",
                    quantity: 100,
                    type: "voucher",
                    code: "STEA10",
                    enabled: true,
                    prices: [
                        {currency: $scope.demoCurrency, amount: 500000},
                        {currency: $scope.txbtCurrency, amount: 20000}
                    ]
                },
                newProduct2 = {
                    name: "Amazon voucher",
                    description: "$50 Amazon voucher",
                    quantity: 100,
                    type: "voucher",
                    code: "AMAZ50",
                    enabled: true,
                    prices: [
                        {currency: $scope.demoCurrency, amount: 100000000},
                        {currency: $scope.txbtCurrency, amount: 50000}
                    ]
                };

            newProduct1 = serializeFiltersService.objectFilters(newProduct1);
            newProduct2 = serializeFiltersService.objectFilters(newProduct2);

            if(vm.token) {
                $http.post('https://product.services.rehive.io/api/admin/products/', newProduct1, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        vm.formatPricesOfProducts(res.data.data.id, newProduct1);
                        $http.post('https://product.services.rehive.io/api/admin/products/', newProduct2, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function (res) {
                            if (res.status === 201 || res.status === 200) {
                                vm.formatPricesOfProducts(res.data.data.id, newProduct2);
                            }
                        }).catch(function (error) {
                            errorHandler.handleErrors(error);
                        });
                    }
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.formatPricesOfProducts = function(id, product){
            product.prices.forEach(function(price,idx,array){
                if(idx === (array.length - 1) && product.code === "AMAZ50"){
                    vm.addPriceToProducts(id,{currency: price.currency.code, amount: price.amount},'last');
                    return false;
                }
                vm.addPriceToProducts(id,{currency: price.currency.code, amount: price.amount}, null);
            });
        };

        vm.addPriceToProducts = function(productId, priceObj, last){
            if(vm.token) {
                $http.post('https://product.services.rehive.io/api/admin/products/' + productId + '/prices/', priceObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201 || res.status === 200) {
                        if(last){
                            vm.getAllUsers();
                        }
                    }
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getAllUsers = function(){
            if(vm.token){
                Rehive.admin.users.get().then(function (res) {
                    vm.configureAdminAccount(res.results);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getAdminUser = function(usersArray){
            var adminUser = {};
            usersArray.forEach(function (userObj) {
                if(userObj.email){
                    adminUser = {
                        id: userObj.id,
                        first_name: userObj.first_name,
                        last_name: userObj.last_name,
                        email: userObj.email,
                        mobile: userObj.mobile,
                        groupName: userObj.groups.length > 0 ? userObj.groups[0].name: null,
                        created: userObj.created ? $filter("date")(userObj.created,'mediumDate') + ' ' + $filter("date")(userObj.created,'shortTime'): null,
                        updated: userObj.updated ? $filter("date")(userObj.updated,'mediumDate') + ' ' + $filter("date")(userObj.updated,'shortTime'): null,
                        archived: $filter("capitalizeWord")(userObj.archived),
                        status: $filter("capitalizeWord")(userObj.status),
                        kycStatus: $filter("capitalizeWord")(userObj.kyc.status),
                        last_login: userObj.last_login ? $filter("date")(userObj.last_login,'mediumDate') + ' ' + $filter("date")(userObj.last_login,'shortTime'): null,
                        verified: userObj.verified ? 'Yes' : 'No',
                        id_number: userObj.id_number,
                        nationality: userObj.nationality ? $filter("isoCountry")(userObj.nationality): null,
                        language: userObj.language,
                        timezone: userObj.timezone,
                        birth_date: userObj.birth_date,
                        username: userObj.username,
                        createdJSTime: userObj.created
                    };
                }
            });
            return (adminUser === {}) ? null : adminUser;
        };

        vm.configureAdminAccount = function(usersArray){
            var adminUser = vm.getAdminUser(usersArray);
            var adminAccountParams = {
                name: "operational",
                primary: true,
                user: adminUser.email
            };

            if(vm.token) {
                Rehive.admin.accounts.create(adminAccountParams).then(function (res) {
                    vm.addAdminAccountCurrencies(res);
                    $scope.$apply();
                }, function (error) {
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.addAdminAccountCurrencies = function(adminAccount){
            $scope.currencyOptions.forEach(function (element,index,array) {
                if(vm.token) {
                    Rehive.admin.accounts.currencies.create(adminAccount.reference,{currency: element.code}).then(function (res) {
                        if(index == (array.length - 1)) {
                            vm.fundAdminAccountWithDemo(adminAccount);
                            $scope.$apply();
                        }
                    }, function (error) {
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            });
        };

        vm.fundAdminAccountWithDemo = function(adminAccount){
            var creditTransactionData = {
                account: adminAccount.reference,
                amount: currencyModifiers.convertToCents(7500, $scope.demoCurrency.divisibility),
                currency: "DEMO",
                metadata: {},
                note: "Demo currency amount added for Rewards",
                reference: "rewards_demo",
                status: "Complete",
                subtype: "reward",
                user: adminAccount.user.email,
            };

            creditTransactionData = serializeFiltersService.objectFilters(creditTransactionData);

            Rehive.admin.transactions.createCredit(creditTransactionData).then(function (res) {
                vm.setupRewardsService();
                $scope.$apply();
            }, function (error) {
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.setupRewardsService = function(adminAccountRef){
            var date1 = new Date(), date2 = new Date(new Date().setMonth(new Date().getMonth() + 1));

            var rewardsCampaign1 = {
                    name: "Just for joining",
                    description: "You have received 20 Demo tokens for registering!",
                    currency: $scope.demoCurrency.code,
                    company: $rootScope.pageTopObj.companyObj.id,
                    start_date: moment(date1).format('YYYY-MM-DD') +'T00:00:00Z',
                    end_date: moment(date2).format('YYYY-MM-DD') +'T00:00:00Z',
                    reward_total: currencyModifiers.convertToCents(5000, $scope.demoCurrency.divisibility),
                    reward_amount: currencyModifiers.convertToCents(20.00, $scope.demoCurrency.divisibility),
                    account: adminAccountRef,
                    reward_percentage: null,
                    amount_type: "fixed",
                    status: 'active',
                    max_per_user: 1,
                    visible: true,
                    request: false,
                    event: 'user.create'
            },
            rewardsCampaign2 = {
                name: "First 250 users",
                description: "The first 250 users to claim this reward get an additional 10 DEMO tokens.",
                currency: $scope.demoCurrency.code,
                company: $rootScope.pageTopObj.companyObj.id,
                start_date: moment(date1).format('YYYY-MM-DD') +'T00:00:00Z',
                end_date: moment(date2).format('YYYY-MM-DD') +'T00:00:00Z',
                reward_total: currencyModifiers.convertToCents(2500, $scope.demoCurrency.divisibility),
                reward_amount: currencyModifiers.convertToCents(10.00, $scope.demoCurrency.divisibility),
                account: adminAccountRef,
                reward_percentage: null,
                amount_type: "fixed",
                status: 'active',
                max_per_user: 1,
                visible: true,
                request: true,
                event: ''
            };
            rewardsCampaign1 = serializeFiltersService.objectFilters(rewardsCampaign1);
            rewardsCampaign2 = serializeFiltersService.objectFilters(rewardsCampaign2);

            if(vm.token) {
                $http.post('https://reward.services.rehive.io/api/admin/campaigns/', rewardsCampaign1, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $http.post('https://reward.services.rehive.io/api/admin/campaigns/',rewardsCampaign2, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        vm.goToCurrencies();
                    }).catch(function (error) {
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.initializeDemoSetup = function(){
            $scope.settingUpDemo = true;
            vm.configureCompanyDetails();
        };

        vm.goToCurrencies = function(){
            $scope.settingUpDemo = false;
            $rootScope.securityConfigured = true;
            toastr.success('All demo config has been successfully setup.');
            $location.path('/currencies');
        };
    }
})();
