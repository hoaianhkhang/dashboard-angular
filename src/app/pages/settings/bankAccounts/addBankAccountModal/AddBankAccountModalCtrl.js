(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.bankAccounts')
        .controller('AddBankAccountModalCtrl', AddBankAccountModalCtrl);

    function AddBankAccountModalCtrl($scope,$uibModalInstance,toastr,$http,
                                      Rehive,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.addingBankAccount = false;
        $scope.newBankData = {};
        $scope.bankAccountCurrencies = {
            list: []
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesList = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.addBankAccount = function (newBankAccount) {
            $scope.addingBankAccount = true;
            Rehive.admin.bankAccounts.create(newBankAccount).then(function (res) {
                vm.addBankAccountCurrencies(res);
                $scope.$apply();
            }, function (error) {
                $scope.addingBankAccount = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
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
        };


    }
})();
