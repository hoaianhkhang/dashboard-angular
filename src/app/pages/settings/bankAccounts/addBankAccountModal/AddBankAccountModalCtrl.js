(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('AddBankAccountModalCtrl', AddBankAccountModalCtrl);

    function AddBankAccountModalCtrl($scope,$uibModalInstance,toastr,$http,
                                      environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingBankAccount = false;
        $scope.newBankData = {};
        $scope.bankAccountCurrencies = {
            list: []
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currenciesList = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.addBankAccount = function (newBankAccount) {
            $scope.addingBankAccount = true;
            $http.post(environmentConfig.API + '/admin/bank-accounts/', newBankAccount, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    vm.addBankAccountCurrencies(res.data.data);
                }
            }).catch(function (error) {
                $scope.addingBankAccount = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.addBankAccountCurrencies = function (newBankAccount) {
            $scope.addingBankAccount = true;
            if($scope.bankAccountCurrencies.list.length > 0){
                $scope.bankAccountCurrencies.list.forEach(function (currency,index,array) {
                    $http.post(environmentConfig.API + '/admin/bank-accounts/' + newBankAccount.id + '/currencies/',{currency: currency.code}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201) {
                            if(index == (array.length - 1)){
                                $scope.addingBankAccount = false;
                                toastr.success('You have successfully added the bank account');
                                $scope.newBankData = {};
                                $uibModalInstance.close(res.data.data);
                            }
                        }
                    }).catch(function (error) {
                        $scope.addingBankAccount = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                });
            } else {
                $scope.addingBankAccount = false;
                toastr.success('You have successfully added the bank account');
                $scope.newBankData = {};
                $uibModalInstance.close(true);
            }
        }



    }
})();
