(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .controller('StellarTestnetServiceConfigCtrl', StellarTestnetServiceConfigCtrl);

    /** @ngInject */
    function StellarTestnetServiceConfigCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$location,
                                             Rehive, serializeFiltersService, $uibModal, $state, currencyModifiers) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        vm.stellarTestnetConfigurations = vm.companyIdentifier + "_stellarTestnetConfigs";
        vm.serviceUrl = extensionsList[78];
        // vm.serviceUrl = "https://stellar-testnet.services.rehive.io/api/1/";
        $scope.currentConfigView = 'user defaults';
        $scope.groupOptions = [];
        $scope.maxOptions = 0;
        $scope.addedCount = 0;
        $scope.testnetConfig = {};
        $scope.hotwalletHasBeenFunded = false;
        $scope.warmStorageHasBeenFunded = false;
        $scope.hotwalletHasBeenFunded = false;
        $scope.warmStorage = {
            publicKey: '',
            privateKey: ''
        };
        $scope.confirmedPrivateKeyCopied = false;
        $scope.warmStoragePublicKeyLengthValid = false;
        $scope.showHelpMessage = false;
        $scope.fundingAccountUsingTestnet = false;
        $scope.hasAccountConfigs = true;
        $scope.fundingIssuerAccount = false;
        vm.initialize = function(){
            $scope.testnetConfig.userDefaults = {};
            vm.testnetConfigs = localStorageManagement.getValue(vm.stellarTestnetConfigurations) ?
                JSON.parse(localStorageManagement.getValue(vm.stellarTestnetConfigurations)) : null;

            if(!vm.testnetConfigs){
                vm.testnetConfigs = {
                    step1Completed: false,
                    step2Completed: false,
                    currentStep: "user defaults",
                    userDefaults: null,
                    customAssetStep: null,
                    customAsset: null,
                    warmStorageIssued: false,
                    warmStorageIssuer: null,
                    warmStoragePrivate: null
                }
            }

            $scope.currentConfigView = vm.testnetConfigs.currentStep;

            $scope.testnetConfig.userDefaults.defaultGroup = null;
            $scope.testnetConfig.userDefaults.primaryAccountConfig = null;
            $scope.testnetConfig.userDefaults.groupAccountConfigs = null;
            $scope.testnetConfig.userDefaults.groups = [];
            $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
            $scope.testnetConfig.customAsset = null;

            $scope.warmStorage = {
                publicKey: '',
                privateKey: ''
            };

            $scope.customAssetSetupComplete = false;
        };
        vm.initialize();

        $scope.goToConfigView = function (view) {
            $scope.currentConfigView = view;
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
        };

        vm.updateSetupCompletionStatus = function(){
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/company/', {has_completed_setup: true}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    // $location.path('/services/stellar-testnet/configuration');
                    $location.path('/extensions/stellar-testnet/accounts');
                }).catch(function(error){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getGroups = function(){
            if(vm.token) {
                var groupFiltersObj = serializeFiltersService.objectFilters({
                    page_size: 250
                });
                $scope.groupOptions = [];
                Rehive.admin.groups.get({filters: groupFiltersObj}).then(function (res) {
                    res.results.forEach(function(group){
                        if(group.name !== "service" && group.name !== "admin"){
                            $scope.groupOptions.push(group);
                        }
                        if(group.default){
                            $scope.testnetConfig.userDefaults.defaultGroup = group;
                        }
                    });
                    $scope.maxOptions = $scope.groupOptions.length;
                    $scope.addedCount = 0;

                    if(vm.testnetConfigs.userDefaults){
                        console.log(vm.testnetConfigs.userDefaults);
                        $scope.testnetConfig.userDefaults.groups = null;
                        $scope.testnetConfig.userDefaults.groups = vm.testnetConfigs.userDefaults;
                        $scope.addedCount = vm.testnetConfigs.userDefaults.length;
                    }
                    else if($scope.maxOptions > 0){
                        if(!$scope.testnetConfig.userDefaults.defaultGroup){
                            $scope.testnetConfig.userDefaults.defaultGroup = $scope.groupOptions[0];
                        } else{
                            $scope.testnetConfig.userDefaults.defaultGroup.name = $scope.testnetConfig.userDefaults.defaultGroup.name  + " (default)";
                        }

                        $scope.testnetConfig.userDefaults.groups.push({
                            group: $scope.testnetConfig.userDefaults.defaultGroup,
                            config: null,
                            hasAccountConfigs: false,
                            groupAccountConfigs: []
                        });
                        ++$scope.addedCount;
                        $scope.trackGroupChange($scope.testnetConfig.userDefaults.defaultGroup);
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getGroups();

        $scope.trackGroupChange = function(group){
            var idx = -1, groupName = group.name;
            if(group.name.indexOf("(default)") > 0){
                groupName = group.name.split(' ')[0];
            }
            for(var i = 0; i < $scope.testnetConfig.userDefaults.groups.length; ++i){
                if($scope.testnetConfig.userDefaults.groups[i].group.name === group.name){
                    idx = i;
                    break;
                }
            }

            if(vm.token) {
                var groupAccountConfigurationsFilterObj = serializeFiltersService.objectFilters({
                    page: 1,
                    page_size: 250
                });
                $scope.testnetConfig.userDefaults.primaryAccountConfig = null;
                Rehive.admin.groups.accountConfigurations.get(groupName,{filters: groupAccountConfigurationsFilterObj}).then(function (res)
                {
                    $scope.testnetConfig.userDefaults.groups[idx].groupAccountConfigs = res.results;
                    if($scope.testnetConfig.userDefaults.groups[idx].groupAccountConfigs.length > 0){
                        $scope.testnetConfig.userDefaults.groups[idx].groupAccountConfigs.forEach(function(config){
                            if(config.primary){
                                $scope.testnetConfig.userDefaults.primaryAccountConfig = config;
                                return false;
                            }
                        });
                        $scope.testnetConfig.userDefaults.groups[idx].config = $scope.testnetConfig.userDefaults.primaryAccountConfig ? $scope.testnetConfig.userDefaults.primaryAccountConfig : res.results[0];
                        $scope.testnetConfig.userDefaults.groups[idx].hasAccountConfigs = true;
                        $scope.hasAccountConfigs = true;
                    }
                    else {
                        $scope.testnetConfig.userDefaults.groups[idx].hasAccountConfigs = false;
                        $scope.hasAccountConfigs = false;
                    }

                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openAddGroupModal = function () {
            $state.go('groups.overview', {externalCall: "stellar-testnet"});
        };

        $scope.addGroupAccountConfig = function(groupObj){
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: 'app/pages/groups/groupAccountConfigurations/addGroupAccountConfigModal/addGroupAccountConfigModal.html',
                size: 'md',
                controller: 'AddGroupAccountConfigModalCtrl',
                resolve: {
                    groupObj: function () {
                        return groupObj;
                    }
                }
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.trackGroupChange(groupObj);
                }
            }, function(){
            });
        };

        $scope.addGroupConfig = function(){
            ++$scope.addedCount;
            for(var i = 0; i < $scope.groupOptions.length; ++i){
                var newGroup = true;
                for(var j = 0; j < $scope.testnetConfig.userDefaults.groups.length; ++j){
                    if($scope.groupOptions[i].name === $scope.testnetConfig.userDefaults.groups[j].group.name){
                        newGroup = false;
                        break;
                    }
                }
                if(newGroup){
                    $scope.testnetConfig.userDefaults.groups.push({
                        group: $scope.groupOptions[i],
                        config: null,
                        hasAccountConfigs: false,
                        groupAccountConfigs: []
                    });
                    $scope.trackGroupChange($scope.groupOptions[i]);
                    break;
                }
            }
            console.log($scope.testnetConfig.userDefaults.groups)
        };

        $scope.removeGroupConfig = function(groupObj){
            $scope.testnetConfig.userDefaults.groups.forEach(function(item, index, array){
                if(item.group.name === groupObj.group.name){
                    array.splice(index, 1);
                    --$scope.addedCount;
                }
            });
            console.log($scope.testnetConfig.userDefaults.groups)
        };

        $scope.goBack = function(view){
            vm.testnetConfigs.currentStep = view;
            if(view == "user defaults"){
                $scope.testnetConfig.userDefaults.groups = null;
                $scope.testnetConfig.userDefaults.groups = vm.testnetConfigs.userDefaults;
            }
            localStorageManagement.setValue(vm.stellarTestnetConfigurations ,JSON.stringify(vm.testnetConfigs));
            $scope.goToConfigView(view);
        };

        $scope.goToNext = function(currentView, nextView){
            if(currentView == "user defaults"){
                vm.testnetConfigs.step1Completed = true;
                vm.testnetConfigs.userDefaults = $scope.testnetConfig.userDefaults.groups;
                $scope.checkHotwalletFundStatus();
            } else if(currentView == "hotwallet warmstorage"){
                vm.testnetConfigs.step2Completed = true;
                // $scope.testnetConfig.customAssetStep = "2";
                if(!vm.testnetConfigs.customAssetStep){
                    vm.testnetConfigs.customAssetStep = "1";
                    $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;

                } else {
                    $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
                }
                if(!$scope.testnetConfig.customAsset){
                    $scope.testnetConfig.customAsset = {
                        code: "",
                        description: "",
                        symbol: null,
                        unit: null,
                        supply: null
                    };
                }
                if(vm.testnetConfigs.warmStorageIssuer){
                    $scope.warmStorage.publicKey = vm.testnetConfigs.warmStorageIssuer;
                }
            }
            vm.testnetConfigs.currentStep = nextView;

            localStorageManagement.setValue(vm.stellarTestnetConfigurations ,JSON.stringify(vm.testnetConfigs));
            $scope.goToConfigView(nextView);
        };

        $scope.checkHotwalletFundStatus = function(){
            if(vm.token && !vm.testnetConfigs.step2Completed){
                $http.get(vm.serviceUrl + 'admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    console.log(res);
                    if(res.data.data.balance == 0){
                       $scope.fundAccountUsingFriendbot();
                    }
                }).catch(function(error){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.fundAccountUsingFriendbot = function () {
            $scope.fundingAccountUsingTestnet = true;
            var address = $scope.hotWalletFundObj.account_address;
            var url = "https://friendbot.stellar.org/?addr=" + address;
            $http.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                console.log(res);
                if (res.status === 200) {
                    vm.testnetConfigs.step2Completed = true;
                    localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
                    $scope.fundingAccountUsingTestnet = false;
                    $scope.hotwalletHasBeenFunded = true;
                }
            }).catch(function (error) {
                $scope.fundingAccountUsingTestnet = false;
                $scope.hotwalletHasBeenFunded = false;
                if(error.status !== 400){
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                }
                else{
                    vm.testnetConfigs.step2Completed = true;
                    localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
                }
            });
        };

        $scope.getFundHotwallet = function () {
            $scope.fundingHotwallet = true;
            $http.get(vm.serviceUrl + 'admin/hotwallet/fund/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.hotWalletFundObj = res.data.data;
                    $scope.hotWalletFundObj.qr_code = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + $scope.hotWalletFundObj.account_address + '&choe=UTF-8';
                    $scope.fundingHotwallet = false;
                }
            }).catch(function (error) {
                $scope.fundingHotwallet = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getFundHotwallet();

        $scope.createIssuer = function(){
            $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/stellar_accounts/generate/',
                {type: 'issue'}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                vm.testnetConfigs.customAssetStep = "2";
                vm.testnetConfigs.customAsset = res.data.data.currency_code;
                vm.testnetConfigs.warmStorageIssued = true;
                vm.testnetConfigs.warmStorageIssuer = res.data.data.account_address;
                localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
                $scope.warmStorage.publicKey = res.data.data.account_address;
                $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
            }).catch(function (error) {
                $scope.addingPublicKey = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.addWarmStoragePublicKey = function () {
            $scope.addingPublicKey = true;
            $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', {account_address: $scope.warmStorage.publicKey,status: 'Active'}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicKey = false;
                // if (res.status === 201) {
                //     $scope.goToConfigView('finish');
                // }
            }).catch(function (error) {
                $scope.addingPublicKey = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.createCustomAsset = function() {
            var customAssetParams = {
                    currency_code: $scope.testnetConfig.customAsset.code,
                    address: $scope.hotWalletFundObj.account_address,
                    description: $scope.testnetConfig.customAsset.description,
                    symbol: $scope.testnetConfig.customAsset.symbol,
                    unit: $scope.testnetConfig.customAsset.unit
                };
            customAssetParams = serializeFiltersService.objectFilters(customAssetParams);

            $http.post('https://stellar-testnet.services.rehive.io/api/1/admin/asset/', customAssetParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                console.log(res);
                $scope.createIssuer();
            }).catch(function (error) {
                errorHandler.handleErrors(error);
            });
        };

        $scope.confirmPrivateKeyCopied = function(){
            vm.testnetConfigs.customAssetStep = "3";
            localStorageManagement.setValue(vm.stellarTestnetConfigurations, JSON.stringify(vm.testnetConfigs));
            $scope.testnetConfig.customAssetStep = vm.testnetConfigs.customAssetStep;
            $scope.addingPublicKey = true;
            $scope.getCurrencies();
        };

        $scope.getCurrencies = function(){
            Rehive.admin.currencies.get({
                filters: {
                    page: 1,
                    page_size: 250,
                    archived: false
                }
            }).then(function (res) {
                vm.currencyOptions = res.results.slice();

                vm.currencyOptions.sort(function (a, b) {
                    return a.code.localeCompare(b.code);
                });
                vm.currencyOptions.sort(function (a, b) {
                    return a.unit.localeCompare(b.unit);
                });

                vm.currencyOptions.forEach(function (currency) {
                    if (currency.code === $scope.testnetConfig.customAsset.code) {
                        $scope.customAsset = currency;
                    }
                });
                $scope.fundIssuerWithCustomAsset();
                $scope.$apply();
            }, function (error) {
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.fundIssuerWithCustomAsset = function(){
            if(vm.token){
                $scope.fundingIssuerAccount = true;
                $http.get('https://stellar-testnet.services.rehive.io/api/1/admin/hotwallet/active/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    var creditTransactionData = {
                        account: $scope.hotWalletFundObj.rehive_account_reference,
                        amount: currencyModifiers.convertToCents($scope.testnetConfig.customAsset.supply, $scope.customAsset.divisibility),
                        currency: $scope.testnetConfig.customAsset.code,
                        metadata: {},
                        note: "Custom currency for funding Stellar Testnet hotwallet",
                        reference: "Stellar Testnet custom asset fund",
                        status: "Complete",
                        subtype: '',
                        user: res.data.data.user_account_identifier,
                    };
                    creditTransactionData = serializeFiltersService.objectFilters(creditTransactionData);
                    Rehive.admin.transactions.createCredit(creditTransactionData).then(function (res) {
                        $scope.addingPublicKey = false;
                        $scope.$apply();
                    }, function (error) {
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }).catch(function (error) {
                    $scope.addingPublicKey = false;
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.onPublicKeyChange = function (warmStorage) {
            $scope.showHelpMessage = false;
            if(warmStorage.publicKey.length == 56){
                $scope.warmStoragePublicKeyLengthValid = true;
            } else {
                $scope.warmStoragePublicKeyLengthValid = false;
            }
        };

        $scope.copiedMetadataSuccessfully = function(){
            toastr.success('Metadata copied to clipboard');
        };

        $scope.finishConfig = function(){};

        $scope.goToAccountsView = function () {
            $location.path('services/stellar-testnet/accounts');
        };

    }
})();
