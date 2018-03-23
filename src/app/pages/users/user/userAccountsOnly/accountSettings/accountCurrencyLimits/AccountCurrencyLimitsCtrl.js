(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('AccountCurrencyLimitsCtrl', AccountCurrencyLimitsCtrl);

    /** @ngInject */
    function AccountCurrencyLimitsCtrl($window,$scope,$stateParams,$http,$uibModal,environmentConfig,_,$rootScope,
                                       cookieManagement,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        vm.currencyCode = $stateParams.currencyCode;
        vm.reference = $stateParams.reference;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        $scope.loadingAccountCurrencyLimits = true;

        vm.getCurrencyObjFromCurrenciesList = function(){
            $scope.currencyObj = vm.currenciesList.find(function(element){
                return element.code == vm.currencyCode;
            });
        };
        vm.getCurrencyObjFromCurrenciesList();

        $scope.getAccountCurrencyLimits = function(){
            if(vm.token) {
                $scope.loadingAccountCurrencyLimits = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyLimits = false;
                    if (res.status === 200) {
                       $scope.accountCurrencyLimitsList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAccountCurrencyLimits = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAccountCurrencyLimits();

        $scope.openAddAccountCurrencyLimitModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddAccountCurrencyLimitCtrl',
                scope: $scope,
                resolve: {
                    currencyCode: function () {
                        return vm.currencyCode;
                    },
                    reference: function () {
                        return vm.reference;
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                if(accountCurrencyLimit){
                    $scope.getAccountCurrencyLimits();
                }
            }, function(){
            });
        };

        $scope.openEditAccountCurrencyLimitModal = function (page, size,accountCurrencyLimit) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccountCurrencyLimitCtrl',
                scope: $scope,
                resolve: {
                    accountCurrencyLimit: function () {
                        return accountCurrencyLimit;
                    },
                    currencyCode: function () {
                        return vm.currencyCode;
                    },
                    reference: function () {
                        return vm.reference;
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                if(accountCurrencyLimit){
                    $scope.getAccountCurrencyLimits();
                }
            }, function(){
            });
        };

        $scope.openAccountCurrencyLimitsModal = function (page, size,accountCurrencyLimit) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AccountCurrencyLimitsModalCtrl',
                scope: $scope,
                resolve: {
                    accountCurrencyLimit: function () {
                        return accountCurrencyLimit;
                    },
                    currencyCode: function () {
                        return vm.currencyCode;
                    },
                    reference: function () {
                        return vm.reference;
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyLimit){
                if(accountCurrencyLimit){
                    $scope.getAccountCurrencyLimits();
                }
            }, function(){
            });
        };


    }
})();