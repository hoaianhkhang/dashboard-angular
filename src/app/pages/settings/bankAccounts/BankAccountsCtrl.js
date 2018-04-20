(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('BankAccountsCtrl', BankAccountsCtrl);

    /** @ngInject */
    function BankAccountsCtrl($scope,environmentConfig,$uibModal,$http,localStorageManagement,
                              errorHandler,serializeFiltersService,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingBankAccounts = true;
        $scope.bankAccounts = [];

        $scope.pagination = {
            itemsPerPage: 15,
            pageNo: 1,
            maxSize: 5
        };

        vm.getBankAccountsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/bank-accounts/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getBankAccounts = function (fromModalDelete) {
            if(vm.token) {
                $scope.loadingBankAccounts = true;

                if ($scope.bankAccounts.length > 0) {
                    $scope.bankAccounts.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var bankAccountsUrl = vm.getBankAccountsUrl();

                $http.get(bankAccountsUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0 ){
                            $scope.bankAccountsData = res.data.data;
                            $scope.bankAccounts = res.data.data.results;
                            vm.getBankAccountCurrencies($scope.bankAccounts);
                        } else {
                            $scope.loadingBankAccounts = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingBankAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getBankAccounts();

        vm.getBankAccountCurrencies = function (bankAccounts) {
            $scope.loadingBankAccounts = true;

            bankAccounts.forEach(function (bank,index,array) {
                $http.get(environmentConfig.API + '/admin/bank-accounts/' + bank.id + '/currencies/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        bank.currencies = res.data.data.results;
                        if(index == (array.length -1)){
                            $scope.loadingBankAccounts = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingBankAccounts = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            });
        };

        $scope.openAddBankAccountModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddBankAccountModalCtrl',
                scope: $scope
            });

            vm.theAddModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.getBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openEditBankAccountModal = function (page, size,bankAccount) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditBankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theEditModal.result.then(function(bankAccount){
                if(bankAccount){
                    $scope.getBankAccounts();
                }
            }, function(){
            });
        };

        $scope.openBankAccountModal = function (page, size,bankAccount) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'BankAccountModalCtrl',
                scope: $scope,
                resolve: {
                    bankAccount: function () {
                        return bankAccount;
                    }
                }
            });

            vm.theModal.result.then(function(bankAccount){
               if(bankAccount){
                   $scope.getBankAccounts('fromModalDelete');
               }
            }, function(){
            });
        };
    }
})();
