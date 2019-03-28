(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceConfig')
        .controller('StellarTestnetServiceConfigCtrl', StellarTestnetServiceConfigCtrl);

    /** @ngInject */
    function StellarTestnetServiceConfigCtrl($scope,$http,localStorageManagement,toastr,errorHandler,$location,
                                             Rehive, serializeFiltersService, $uibModal) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
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
            publicKey: ''
        };
        $scope.warmStoragePublicKeyLengthValid = false;
        $scope.showHelpMessage = false;
        $scope.fundingAccountUsingTestnet = false;
        $scope.hasAccountConfigs = true;

        vm.initialize = function(){
            $scope.testnetConfig.userDefaults = {};
            $scope.testnetConfig.subtypes = {};

            $scope.testnetConfig.userDefaults.defaultGroup = null;
            $scope.testnetConfig.userDefaults.primaryAccountConfig = null;
            $scope.testnetConfig.userDefaults.groupAccountConfigs = null;
            $scope.testnetConfig.userDefaults.groups = [];
        };
        vm.initialize();

        $scope.goToConfigView = function (view) {
            $scope.currentConfigView = view;
        };

        $scope.copiedSuccessfully = function () {
            toastr.success('Address copied successfully');
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

        $scope.fundAccountUsingFriendbot = function () {
            $scope.fundingAccountUsingTestnet = true;
            var address = $scope.hotWalletFundObj.account_address;
            var url = "https://friendbot.stellar.org/?addr=" + address;
            $http.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.fundingAccountUsingTestnet = false;
                    $scope.hotwalletHasBeenFunded = true;
                }
            }).catch(function (error) {
                $scope.fundingAccountUsingTestnet = false;
                $scope.hotwalletHasBeenFunded = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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

        $scope.addWarmStoragePublicKey = function () {
            $scope.addingPublicKey = true;
            $http.post(vm.serviceUrl + 'admin/warmstorage/accounts/', {account_address: $scope.warmStorage.publicKey,status: 'Active'}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingPublicKey = false;
                if (res.status === 201) {
                    $scope.goToConfigView('finish');
                }
            }).catch(function (error) {
                $scope.addingPublicKey = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.onPublicKeyChange = function (warmStorage) {
            $scope.showHelpMessage = false;
            if(warmStorage.publicKey.length == 56){
                $scope.warmStoragePublicKeyLengthValid = true;
            } else {
                $scope.warmStoragePublicKeyLengthValid = false;
            }
        };

        $scope.goToAccountsView = function () {
            $location.path('services/stellar-testnet/accounts');
        };

    }
})();
