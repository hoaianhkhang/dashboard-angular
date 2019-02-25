(function () {
    'use strict';

    angular.module('BlurAdmin.pages.demoSetup')
        .controller("DemoSetupCtrl", DemoSetupCtrl);

    function DemoSetupCtrl($rootScope, $scope, $http, $location,localStorageManagement, environmentConfig,
                           errorHandler, Rehive, toastr) {
        var vm=this;
        vm.token = localStorageManagement.getValue("token");
        vm.companyConfigured = false;
        vm.userGroupsSetup = false;
        vm.groupTiersSetup = false;
        vm.tierRequirementsAdded = false;
        vm.servicesAdded = false;
        vm.bitcoinTestnetSetup = false;
        vm.stellarTestnetSetup = false;
        vm.bulkNotificationsSetup = false;
        vm.transactionSubtypesSetup = false;
        vm.accountsConfigured = false;

        $rootScope.dashboardTitle = 'Demo setup | Rehive';
        $rootScope.securityConfigured = false;
        $scope.settingUpDemo = false;
        $scope.currencyOptions = [];


        vm.configureCompanyDetails = function(){
            if(vm.companyConfigured){vm.setupUserGroups();}

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

            if(vm.token){
                Rehive.admin.company.update(demoCompany).then(function(res){
                    $rootScope.pageTopObj.companyObj = res;
                    vm.companyConfigured = true;
                    vm.setupUserGroups();
                    $scope.$apply();
                }).catch(function(error){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
            //vm.setupUserGroups();
        };

        vm.setupUserGroups = function(){
            if(vm.userGroupsSetup){vm.setupGroupTiers();}

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
                                    vm.userGroupsSetup = true;
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
            if(vm.groupTiersSetup){vm.getAllTiers();}

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
                        vm.groupTiersSetup = true;
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
            if(vm.tierRequirementsAdded){vm.setupServices();}

            var userGroupTiers = [];
            var merchantGroupTiers = [];

            Rehive.admin.groups.tiers.get("user").then(function (res) {
                userGroupTiers = res;
                for(var i = 0; i < userGroupTiers.length; ++i){
                    if(userGroupTiers[i].level === 1 || userGroupTiers[i].level === 2){
                        vm.updateTierRequirements("user", userGroupTiers[i], "first_name");
                        vm.updateTierRequirements("user", userGroupTiers[i], "last_name");
                    }
                    if(userGroupTiers[i].level === 2){
                        vm.updateTierRequirements("user", userGroupTiers[i], "email_address");
                    }
                }
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
            Rehive.admin.groups.tiers.get("merchant").then(function (res) {
                merchantGroupTiers = res;
                for(var i = 0; i < merchantGroupTiers.length; ++i){
                    if(merchantGroupTiers[i].level === 1 || merchantGroupTiers[i].level === 2){
                        vm.updateTierRequirements("merchant", merchantGroupTiers[i], "first_name");
                        vm.updateTierRequirements("merchant", merchantGroupTiers[i], "last_name");
                    }
                    if(userGroupTiers[i].level === 2){
                        vm.updateTierRequirements("merchant", merchantGroupTiers[i], "email_address");
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
                        vm.tierRequirementsAdded = false;
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
            if(vm.servicesAdded){vm.setupBitcoinTestnetService();}

            var servicesArray = [4, 12, 45, 78, 79, 80];
            if(vm.token){
                for(var i = 0; i < servicesArray.length; ++i) {
                    $http.put(environmentConfig.API + '/admin/services/' + servicesArray[i] + '/',{terms_and_conditions: true, active: true}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if(index === (servicesArray.length - 1)){
                            vm.servicesAdded = true;
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
            if(vm.bitcoinTestnetSetup){vm.setupStellarTestnetService();}

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
                        vm.bitcoinTestnetSetup = true;
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
            if(vm.stellarTestnetSetup){vm.setupNotificationService();}

            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                var TXLMCurrencyObj = {
                    code: "TXLM",
                    description: "Stellar Lumen",
                    symbol: "*",
                    unit: "lumen",
                    divisibility: 7
                };

                $http.post(environmentConfig.API + '/admin/currencies/', TXLMCurrencyObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $http.patch('https://stellar-testnet.services.rehive.io/api/1/admin/company/', {has_completed_setup: true}, {
                            headers: {
                                'Content-type': 'application/json',
                                'Authorization': vm.token
                            }
                        }).then(function(res){
                            vm.addStellarTestnetHotwallet();
                        }).catch(function(error){
                            errorHandler.evaluateErrors(error.data);
                            errorHandler.handleErrors(error);
                        });
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
            // vm.setupNotificationService();
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
                vm.stellarTestnetSetup = true;
                vm.setupNotificationService();
            }).catch(function (error) {
                $scope.addingassets = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.setupNotificationService = function(){
            if(vm.bulkNotificationsSetup){vm.setupRewardsService();}

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
                            vm.bulkNotificationsSetup = true;
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
            if(vm.transactionSubtypesSetup){vm.setupAccountConfigurations();}

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
                        vm.transactionSubtypesSetup = true;
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
                        $scope.applyFiltersObj.unitFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                });
            }
        };

        vm.setupAccountConfigurations = function(){};

        vm.setupRewardsService = function(){};

        vm.setupProductService = function(){
            $scope.settingUpDemo = false;
            $rootScope.securityConfigured = true;
            vm.goToCurrencies();
        };

        // vm.setupBatchSendService = function(){};

        $scope.initializeDemoSetup = function(){
            $scope.settingUpDemo = true;
            vm.configureCompanyDetails();
        };

        vm.goToCurrencies = function(){
            $location.path('/currencies');
        };
    }
})();
