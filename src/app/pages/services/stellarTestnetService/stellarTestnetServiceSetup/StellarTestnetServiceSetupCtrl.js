(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.stellarTestnetService.stellarTestnetServiceSetup')
        .controller('StellarTestnetServiceSetupCtrl', StellarTestnetServiceSetupCtrl);

    /** @ngInject */
    function StellarTestnetServiceSetupCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,errorHandler,$location) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = extensionsList[78];
        $rootScope.dashboardTitle = 'Stellar testnet service | Rehive';
        $rootScope.dashboardTitle = 'Stellar testnet extension | Rehive';
        $scope.loadingStellarTestnetService = false;
        $scope.stellarTestnetConfigComplete = false;

        $scope.checkStellarTestnetServiceInitialState = function () {
            $scope.loadingStellarTestnetService = true;
            $http.get(vm.serviceUrl + 'admin/company/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingStellarTestnetService = false;
                if (res.status === 200) {
                    // var stellarTestnetFullySetup = res.data.data.has_completed_setup;
                    var stellarTestnetFullySetup = false;
                    // var stellarTestnetFullySetup = true;
                    // for(var state in res.data.data){
                    //     if(res.data.data.hasOwnProperty(state)){
                    //         if(!res.data.data[state]){
                    //             stellarTestnetFullySetup = false;
                    //         }
                    //     }
                    // }
                    if(stellarTestnetFullySetup){
                        // $location.path('/services/stellar-testnet/accounts');
                        $location.path('/extensions/stellar-testnet/accounts');
                    } else {
                        $scope.loadingStellarTestnetService = false;
                    }
                }
            }).catch(function (error) {
                $scope.loadingStellarTestnetService = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.checkStellarTestnetServiceInitialState();

        vm.updateSetupCompletionStatus = function(){
            if(vm.token){
                $http.patch(vm.serviceUrl + 'admin/company/', {has_completed_setup: true}, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function(res){
                    $scope.loadingStellarTestnetService = false;
                    $scope.stellarTestnetConfigComplete = true;
                    // $location.path('/services/stellar-testnet/configuration');
                    $location.path('/extensions/stellar-testnet/configuration');
                }).catch(function(error){
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.checkTXLMCurrency = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                $http.get(environmentConfig.API + 'admin/currencies/?archived=false&page_size=250&code=TXLM', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        // if(res.data.data.results.length == 1){
                        //     vm.checkUserGroup();
                        // } else if(res.data.data.results.length == 0){
                        //     vm.createTXLMCurrency();
                        // }
                        // $location.path('/services/stellar-testnet/configuration');
                        if(res.data.data.results.length == 1){
                            vm.updateSetupCompletionStatus();
                        } else if(res.data.data.results.length == 0){
                            vm.createTXLMCurrency();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.createTXLMCurrency = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                var TXLMCurrencyObj = {
                    code: "TXLM",
                    description: "Stellar Lumen",
                    symbol: "*",
                    unit: "lumen",
                    divisibility: 7
                };

                $http.post(environmentConfig.API + 'admin/currencies/', TXLMCurrencyObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        // vm.checkUserGroup();
                        vm.updateSetupCompletionStatus();
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        /**** Uncomment for complete setup -
        vm.checkUserGroup = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                $http.get(environmentConfig.API + 'admin/groups/?name=user', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length == 1){
                            vm.checkDefaultAccConfig();
                        } else if(res.data.data.results.length == 0){
                            vm.createUserGroup();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.createUserGroup = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                var UserGroupObj = {
                    name: "user",
                    label: "User",
                    public: true,
                    default: true
                };

                $http.post(environmentConfig.API + 'admin/groups/', UserGroupObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        vm.checkDefaultAccConfig();
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.checkDefaultAccConfig = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                $http.get(environmentConfig.API + 'admin/groups/user/account-configurations/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        var defaultAccConfigExists = false;
                        if(res.data.data.results.length > 0){
                            res.data.data.results.forEach(function (account) {
                                if(account.name == 'default'){
                                    defaultAccConfigExists = true;
                                }
                            });
                        }

                        if(defaultAccConfigExists){
                            vm.addTXLMToDefaultAccConfig();
                        } else{
                            vm.createDefaultAccConfig();
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.createDefaultAccConfig = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                var defaultAccConfigObj = {
                    name: "default",
                    label: "Default",
                    primary: true,
                    default: true
                };

                $http.post(environmentConfig.API + 'admin/groups/user/account-configurations/', defaultAccConfigObj,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        vm.addTXLMToDefaultAccConfig();
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.addTXLMToDefaultAccConfig = function () {
            if(vm.token){
                $scope.loadingStellarTestnetService = true;
                $http.post(environmentConfig.API + 'admin/groups/user/account-configurations/default/currencies/', {currency: 'TXLM'},{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.loadingStellarTestnetService = false;
                        $scope.stellarTestnetConfigComplete = true;
                    }
                }).catch(function (error) {
                    $scope.loadingStellarTestnetService = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        ****/
    }
})();
