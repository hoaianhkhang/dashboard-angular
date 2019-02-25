(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($rootScope, $scope, $http, $location,localStorageManagement, environmentConfig,
                           errorHandler, Rehive, toastr, currencyModifiers, serializeFiltersService) {
        var vm=this;
        vm.token = localStorageManagement.getValue("token");
        $rootScope.companyConfigured = false;
        $rootScope.userGroupsSetup = false;
        $rootScope.groupTiersSetup = false;
        $rootScope.tierRequirementsAdded = false;
        $rootScope.servicesAdded = false;
        $rootScope.bitcoinTestnetSetup = false;
        $rootScope.stellarTestnetSetup = false;
        $rootScope.bulkNotificationsSetup = false;
        $rootScope.transactionSubtypesSetup = false;
        $rootScope.accountsConfigured = false;
        $rootScope.tierLimitsSetup = false;
        $rootScope.rewardsServiceSetup = false;
        $rootScope.productsServiceSetup = false;
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
            // if($rootScope.companyConfigured){vm.setupUserGroups();}
            //
            // var demoCompany = {
            //     name: "CompanyName",
            //     description: "CompanyName is a multi cryptocurrencies app for spending online.",
            //     website: "",
            //     email: "",
            //     logo: null,
            //     icon: null,
            //     public: false,
            //     config: {
            //         company: {
            //             name: "CompanyName",
            //             id: "CompanyId",
            //             description: "CompanyName is a multi cryptocurrencies app for spending online."
            //         },
            //         auth: {
            //             mfa: "",
            //             username: false,
            //             email: "",
            //             terms: [],
            //             identifier: "email",
            //             mobile: "",
            //             country: false,
            //             pin: "",
            //             first_name: false,
            //             last_name: false
            //         },
            //         design: {
            //             app: {
            //                 surface: true,
            //                 tabBarLabels: false
            //             },
            //             notifications: {
            //                 actionButtonsType: "contained",
            //                 layout: "material"
            //             },
            //             wallets: {
            //                 balance: "badge",
            //                 actionButtonsType: "",
            //                 layout: "mini",
            //                 showActions: false,
            //                 headerColor: "font",
            //                 header: "",
            //                 headerActionType: "text"
            //             },
            //             home: {
            //                 header: "wallets",
            //                 content: [
            //                     "notifications",
            //                     "rewards",
            //                     "wallets"
            //                 ]
            //             },
            //             other: {
            //                 floatingActionButtons: false,
            //                 actionButtonsType: "text",
            //                 homeCardLayout: "material"
            //             },
            //             campaigns: {
            //                 actionButtonsType: "contained",
            //                 layout: "material",
            //                 showActions: true
            //             },
            //             general: {
            //                 elevation: 2,
            //                 shadow: 3,
            //                 cornerRadius: 5
            //             },
            //             buttons: {
            //                 elevation: 4,
            //                 shadow: 10,
            //                 bold: false,
            //                 rounded: true
            //             },
            //             cards: {
            //                 elevation: 3,
            //                 shadow: 8,
            //                 actionButtonsType: "contained",
            //                 cornerRadius: 20
            //             },
            //             popUp: {
            //                 cornerRadius: 20
            //             }
            //         },
            //         cards: {
            //             home: {
            //                 custom: [
            //                     {
            //                         dismiss: true,
            //                         image: "blocks-card",
            //                         title: "Welcome to CompanyName",
            //                         id: 0,
            //                         description: "Multi-currency app for online payments and rewards."
            //                     }
            //                 ]
            //             }
            //         }
            //     }
            // };
            // demoCompany.config = JSON.stringify(demoCompany.config);
            //
            // if(vm.isJson(demoCompany.config)){
            //     demoCompany.config = JSON.parse(demoCompany.config);
            // }
            //
            // if(vm.token){
            //     Rehive.admin.company.update(demoCompany).then(function(res){
            //         $rootScope.pageTopObj.companyObj = res;
            //         $rootScope.companyConfigured = true;
            //         vm.setupUserGroups();
            //         $scope.$apply();
            //     }).catch(function(error){
            //         errorHandler.evaluateErrors(error.data);
            //         errorHandler.handleErrors(error);
            //         $scope.$apply();
            //     });
            // }
            vm.setupUserGroups();
        };

        vm.setupUserGroups = function(){
            console.log($rootScope.userGroupsSetup);
            if($rootScope.userGroupsSetup){
                $rootScope.setupGroupTiers();
            }

            var userGroup = {
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
                    description: "Managers have access to make transactions from their own operational account, " +
                        "view and verify user data. Managers do not have access to  system configurations."
                },
                supportGroup = {
                    name: "support",
                    label: "Support",
                    public: false,
                    default: false,
                    description: "Support has limited access to make transactions from their own operational account, " +
                        "view and verify user data. Support do not have access to  system configurations."
                },
                merchantGroup = {
                    name: "merchant",
                    label: "Merchant",
                    public: false,
                    default: false,
                    description: "Merchants are limited to their own accounts."
                };

            vm.addGroup(userGroup, null);
            vm.addGroup(managerGroup, null);
            vm.addGroup(supportGroup, null);
            vm.addGroup(merchantGroup, 'last');
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
                            errorHandler.evaluateErrors(error);
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
                                    $rootScope.userGroupsSetup = true;
                                    vm.setupGroupTiers();
                                }
                                $scope.$apply();
                            }, function (error) {
                                errorHandler.evaluateErrors(error);
                                errorHandler.handleErrors(error);
                                $scope.$apply();
                            });
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            }
        };

        vm.setupGroupTiers = function(){
            if($rootScope.groupTiersSetup){vm.getAllTiers();}

            var userTier1 = {
                    level: 1,
                    name: "1",
                    description: "Basic"
                },
                userTier2 = {
                    level: 2,
                    name: "2",
                    description: "Intermediary"
                },
                merchantTier1 = {
                    "level": 1,
                    "name": "1",
                    "description": "Basic"
                },
                merchantTier2 = {
                    "level": 2,
                    "name": "2",
                    "description": "Intermediary"
                }
            vm.addGroupTiers("user", userTier1, null);
            vm.addGroupTiers("user", userTier2, null);
            vm.addGroupTiers("merchant", merchantTier1, null);
            vm.addGroupTiers("merchant", merchantTier2, "last");
        };

        vm.addGroupTiers = function(groupName, tierObj, last){
            if(vm.token) {
                Rehive.admin.groups.tiers.create(groupName, tierObj).then(function (res) {
                    if(last){
                        $rootScope.groupTiersSetup = true;
                        vm.getAllTiers();
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.addingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.getAllTiers = function(){
            if($rootScope.tierRequirementsAdded){vm.setupServices();}

            Rehive.admin.groups.tiers.get("user").then(function (res) {
                $scope.userGroupTiers = res;
                for(var i = 0; i < $scope.userGroupTiers.length; ++i){
                    if($scope.userGroupTiers[i].level === 1 || $scope.userGroupTiers[i].level === 2){
                        vm.updateTierRequirements("user", $scope.userGroupTiers[i], "first_name");
                        vm.updateTierRequirements("user", $scope.userGroupTiers[i], "last_name");
                    }
                    if($scope.userGroupTiers[i].level === 2){
                        vm.updateTierRequirements("user", $scope.userGroupTiers[i], "email_address");
                    }
                }
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
            Rehive.admin.groups.tiers.get("merchant").then(function (res) {
                $scope.merchantGroupTiers = res;
                for(var i = 0; i < $scope.merchantGroupTiers.length; ++i){
                    if($scope.merchantGroupTiers[i].level === 1 || $scope.merchantGroupTiers[i].level === 2){
                        vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "first_name");
                        vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "last_name");
                    }
                    if($scope.merchantGroupTiers[i].level === 2){
                        vm.updateTierRequirements("merchant", $scope.merchantGroupTiers[i], "email_address");
                    }
                }
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.tierRequirementsAdded = 0;
        vm.updateTierRequirements = function(groupName, tierObj, requirementName){
            if(vm.token) {
                Rehive.admin.groups.tiers.requirements.create(groupName, tierObj.id, {
                    "requirement": requirementName
                }).then(function (res) {
                    ++vm.tierRequirementsAdded;
                    if(vm.tierRequirementsAdded === 10){
                        $rootScope.tierRequirementsAdded = true;
                        vm.setupServices();
                        $scope.$apply();
                    }
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        vm.setupServices = function(){
            if($rootScope.servicesAdded){vm.setupBitcoinTestnetService();}

            var servicesArray = [4, 12, 45, 78, 79, 80];
            if(vm.token){
                for(var i = 0; i < servicesArray.length; ++i) {
                    $http.put(environmentConfig.API + '/admin/services/' + servicesArray[i] + '/',
                        {terms_and_conditions: true, active: true},
                        {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(index === (servicesArray.length - 1)){
                            $rootScope.servicesAdded = true;
                            vm.setupBitcoinTestnetService();
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            }
        };

        vm.setupBitcoinTestnetService = function(){
            if($rootScope.bitcoinTestnetSetup){vm.setupStellarTestnetService();}

            var hotwalletParams = {
                low_balance_percentage: 0.1
            };
            if(vm.token){
                $http.post('https://bitcoin-testnet.services.rehive.io/api/1/admin/hotwallet/', hotwalletParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingHotwallet = false;
                    if (res.status === 201) {
                        $rootScope.bitcoinTestnetSetup = true;
                        vm.setupStellarTestnetService();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
            // vm.setupStellarTestnetService();
        };

        vm.setupStellarTestnetService = function(){
            if($rootScope.stellarTestnetSetup){vm.setupNotificationService();}

            vm.addStellarTestnetHotwallet();
        };

        vm.addStellarTestnetHotwallet = function(){
            var hotwalletParams = {
                low_balance_percentage: 0.1
            };
            $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/hotwallet/', hotwalletParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $http.get('https://stellar-testnet.services.rehive.io/api/1/admin/hotwallet/fund', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    vm.addDemoAsset(res.data.data.account_address);
                }).catch(function (error) {
                    $scope.addingHotwallet = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }).catch(function (error) {
                $scope.addingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.addDemoAsset = function(issuerAddress){
            var demoAssetParams = {
                currency_code: "DEMO",
                address: issuerAddress,
                description: "a demo asset setup for Stellar Testnet service.",
                symbol: 'd',
                unit: "demo"
            };

            $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/asset/', demoAssetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $rootScope.stellarTestnetSetup = true;
                vm.setupNotificationService();
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.setupNotificationService = function(){
            if($rootScope.bulkNotificationsSetup){vm.setupRewardsService();}

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
                    errorHandler.evaluateErrors(error.data);
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
                    errorHandler.evaluateErrors(error.data);
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
                $http.post(vm.baseUrl + 'admin/notifications/',notificationObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200 || res.status === 201) {
                        if(last){
                            $rootScope.bulkNotificationsSetup = true;
                            vm.setupTransactionSubtypes();
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.setupTransactionSubtypes = function(){
            if($rootScope.transactionSubtypesSetup){vm.setupAccountConfigurations();}

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
                    name: "mass_pay",
                    label: "Mass pay",
                    tx_type: "debit",
                    description: "Subtype is used to debit the source account balance for bulk transfer transactions."
                },
                {
                    name: "mass_pay",
                    label: "Mass pay",
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
                        $rootScope.transactionSubtypesSetup = true;
                        vm.getCompanyCurrencies();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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

                        vm.setupAccountConfigurations();
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                });
            }
        };

        vm.setupAccountConfigurations = function(){
            if($rootScope.accountsConfigured){vm.setupRewardsService();}

            var operationalAccountConfig = {
                name: "operational",
                label: "Operational",
                default: true,
                primary: true,
                list: []
            },
            walletAccountConfig = {
                name: "wallet",
                label: "Wallet",
                default: true,
                primary: true,
                list: []
            };
            vm.addGroupAccountConfigurations("admin", operationalAccountConfig, null);
            vm.addGroupAccountConfigurations("manager", operationalAccountConfig, null);
            vm.addGroupAccountConfigurations("support", operationalAccountConfig, null);
            vm.addGroupAccountConfigurations("user", walletAccountConfig, 'last');


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
                    errorHandler.evaluateErrors(error);
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
                        $rootScope.accountsConfigured = true;
                        vm.setupTierLimits();
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            });
        };

        vm.setupTierLimits = function(){
            if($rootScope.tierLimitsSetup){vm.setupRewardsService();}

            var tier1LimitCr = {
                    tx_type: "credit",
                    currency: null,
                    value: 1000,
                    type: 'month_max'
                },
                tier1LimitDr = {
                    tx_type: "debit",
                    currency: null,
                    value: 1000,
                    type: 'month_max'
                },
                tier2LimitCr = {
                    tx_type: "credit",
                    currency: null,
                    value: 10000,
                    type: 'month_max'
                },
                tier2LimitDr = {
                    tx_type: "debit",
                    currency: null,
                    value: 10000,
                    type: 'month_max'
                };

            for(var i = 0; i > $scope.currencyOptions.length; ++i){
                var currency = $scope.currencyOptions[i];
                tier1LimitCr.value = tier1LimitDr.value = currencyModifiers.convertToCents(tier1LimitDr.value, currency.divisibility);
                tier2LimitCr.value = tier2LimitDr.value = currencyModifiers.convertToCents(userTier2LimitDr.value, currency.divisibility);

                tier1LimitCr.currency = tier1LimitDr.currency = tier2LimitCr.currency = tier2LimitDr.currency = currency.code;

                for(var j = 0; j < $scope.userGroupTiers.length; ++j){
                    if($scope.userGroupTiers[j].level === 1){
                        vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier1LimitCr, null);
                        vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier1LimitDr, null);
                    }
                    else if($scope.userGroupTiers[j].level === 2){
                        vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier2LimitCr, null);
                        vm.addTierLimit("user", $scope.userGroupTiers[j].id, tier2LimitDr, null);
                    }
                }
                for(var k = 0; k < $scope.merchantGroupTiers.length; ++k){
                    if($scope.merchantGroupTiers[k].level === 1){
                        vm.addTierLimit("merchant", $scope.userGroupTiers[k].id, tier1LimitCr, null);
                        vm.addTierLimit("merchant", $scope.userGroupTiers[k].id, tier1LimitDr, null);
                    }
                    else if($scope.merchantGroupTiers[k].level === 2 && i === ($scope.currencyOptions.length - 1) && k === ($scope.merchantGroupTiers.length - 1)){
                        vm.addTierLimit("merchant", $scope.userGroupTiers[k].id, tier2LimitCr, null);
                        vm.addTierLimit("merchant", $scope.userGroupTiers[k].id, tier2LimitDr, 'last');
                    }
                    else if($scope.merchantGroupTiers[k].level === 2){
                        vm.addTierLimit("merchant", $scope.userGroupTiers[k].id, tier2LimitCr, null);
                        vm.addTierLimit("merchant", $scope.userGroupTiers[k].id, tier2LimitDr, null);
                    }
                }
            }
        };

        vm.addTierLimit = function(groupName, tierId, tierLimitsParams, last){
            if(vm.token) {
                Rehive.admin.groups.tiers.limits.create(groupName, tierId, tierLimitsParams)
                    .then(function (res){
                        if(last){
                            $rootScope.tierLimitsSetup = true;
                            vm.setupRewardsService();
                        }
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
            }
        };

        vm.setupRewardsService = function(){
            if($rootScope.rewardsServiceSetup){vm.setupProductService();}

            vm.setupCurrencies();

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
                    account: null,
                    reward_percentage: null,
                    amount_type: 'Fixed',
                    status: 'active',
                    max_per_user: 1,
                    visible: true,
                    request: false,
                    event: 'user.update'
            },
            rewardsCampaign2 = {
                name: "First 250 users",
                description: "The first 250 users to claim this reward get and additional 10 DEMO tokens.",
                currency: $scope.demoCurrency.code,
                company: $rootScope.pageTopObj.companyObj.id,
                start_date: moment(date1).format('YYYY-MM-DD') +'T00:00:00Z',
                end_date: moment(date2).format('YYYY-MM-DD') +'T00:00:00Z',
                reward_total: currencyModifiers.convertToCents(2500, $scope.demoCurrency.divisibility),
                reward_amount: currencyModifiers.convertToCents(20.00, $scope.demoCurrency.divisibility),
                account: null,
                reward_percentage: null,
                amount_type: 'Fixed',
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
                        if (res.status === 201 || res.status === 200) {
                            $rootScope.rewardsServiceSetup = true;
                            vm.setupProductService();
                        }
                    }).catch(function (error) {
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.setupProductService = function(){
            if($rootScope.productsServiceSetup){vm.goToCurrencies();}
            var newProduct1 = {
                name: "Steam voucher",
                description: "$10 Steam voucher",
                quantity: 100,
                type: "voucher",
                code: "STEA10",
                enabled: true,
                prices: [
                    {currency: "DEMO", amount: currencyModifiers.convertToCents(5, $scope.demoCurrency.divisibility)},
                    {currency: "TXBT", amount: currencyModifiers.convertToCents(0.002.amount, $scope.txbtCurrency.divisibility)}
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
                    {currency: "DEMO", amount: currencyModifiers.convertToCents(10, $scope.demoCurrency.divisibility)},
                    {currency: "TXBT", amount: currencyModifiers.convertToCents(0.005, $scope.txbtCurrency.divisibility)}
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
                            $scope.addingProduct =  false;
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.formatPricesOfProducts = function(id, product){
            product.prices.forEach(function(price,idx,array){
                if(idx === array.length - 1 && product.code === "AMAZ50"){
                    vm.addPriceToProducts(id,{currency: price.currency, amount: price.amount},'last');
                    return false;
                }
                vm.addPriceToProducts(id,{currency: price.currency, amount: price.amount}, null);
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
                            $rootScope.productsServiceSetup = true;
                            $scope.settingUpDemo = false;
                            $rootScope.securityConfigured = true;
                            vm.goToCurrencies();
                        }
                    }
                }).catch(function (error) {
                    $scope.addingProduct =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.initializeDemoSetup = function(){
            console.log($rootScope);
            $scope.settingUpDemo = true;
            vm.configureCompanyDetails();
        };

        vm.goToCurrencies = function(){
            $location.path('/currencies');
        };
    }
})();
