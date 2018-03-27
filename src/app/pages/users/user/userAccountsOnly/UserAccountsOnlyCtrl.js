(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('UserAccountsOnlyCtrl', UserAccountsOnlyCtrl);

    /** @ngInject */
    function UserAccountsOnlyCtrl($scope,environmentConfig,$stateParams,$rootScope,$uibModal,
                              $http,cookieManagement,errorHandler,$location,$state,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;
        vm.reference = '';
        $scope.newAccountCurrencies = {list: []};
        $scope.loadingUserAccounts = true;
        $scope.optionsCode = '';
        $scope.optionsReference = '';
        $scope.accountsFiltersCount = 0;
        $scope.showingAccountsFilters = false;
        $scope.accounts = [];
        $scope.filtersObj = {
            accountNameFilter: false,
            accountReferenceFilter: false
        };
        $scope.applyFiltersObj = {
            accountNameFilter: {
                selectedAccountName: ''
            },
            accountReferenceFilter: {
                selectedAccountReference: ''
            }
        };

        $scope.showAccountsFilters = function () {
            $scope.showingAccountsFilters = !$scope.showingAccountsFilters;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
            $scope.optionsReference = '';
        };

        $scope.showCurrenciesOptions = function (code,reference) {
            $scope.optionsCode = code;
            $scope.optionsReference = reference;
        };

        vm.getUsersAccountsUrl = function(){
            $scope.accountsFiltersCount = 0;

            for(var x in $scope.filtersObj){
                if($scope.filtersObj.hasOwnProperty(x)){
                    if($scope.filtersObj[x]){
                        $scope.accountsFiltersCount = $scope.accountsFiltersCount + 1;
                    }
                }
            }

            var searchObj = {
                page_size: 250,
                user: vm.uuid,
                reference: $scope.filtersObj.accountReferenceFilter ? ($scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference ?  $scope.applyFiltersObj.accountReferenceFilter.selectedAccountReference : null): null,
                name: $scope.filtersObj.accountNameFilter ?($scope.applyFiltersObj.accountNameFilter.selectedAccountName ?  $scope.applyFiltersObj.accountNameFilter.selectedAccountName : null): null
            };

            return environmentConfig.API + '/admin/accounts/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getUserAccounts = function(){
            if(vm.token) {
                $scope.loadingUserAccounts = true;
                $scope.showingAccountsFilters = false;

                if($scope.accounts.length > 0 ){
                    $scope.accounts.length = 0;
                }

                var usersAccountsUrl = vm.getUsersAccountsUrl();

                $http.get(usersAccountsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAccounts = false;
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0 ){
                            $scope.accounts = res.data.data.results;
                        } else {
                            $scope.accounts = [];
                        }

                    }
                }).catch(function (error) {
                    $scope.loadingUserAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getUserAccounts();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.goToView = function(state,currency,email,account){
            if(email){
                $state.go(state,{"email": email, "account": account});
            } else {
                $state.go(state,{"email": vm.uuid, "account": account});
            }

        };

        $scope.goToSettings = function(currencyCode, account){
            $location.path('user/' + vm.uuid + '/account/'+account+'/settings/'+ currencyCode);
        };

        $scope.clearAccountsFilters = function () {
            $scope.filtersObj = {
                accountNameFilter: false,
                accountReferenceFilter: false
            };
        };

        $scope.openAddAccountModal = function (page, size) {
            vm.theAccountModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddAccountModalCtrl',
                scope: $scope,
                resolve: {
                    currenciesList: function () {
                        return $scope.currencyOptions;
                    }
                }
            });

            vm.theAccountModal.result.then(function(account){
                if(account){
                    $scope.getUserAccounts();
                }
            }, function(){
            });
        };

        $scope.openEditAccountModal = function (page, size,account,currencies) {
            vm.theEditAccountModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccountModalCtrl',
                scope: $scope,
                resolve: {
                    account: function () {
                        return account;
                    },
                    currenciesList: function () {
                        return currencies;
                    }
                }
            });

            vm.theEditAccountModal.result.then(function(account){
                if(account){
                    $scope.getUserAccounts();
                }
            }, function(){
            });
        };

    }
})();
