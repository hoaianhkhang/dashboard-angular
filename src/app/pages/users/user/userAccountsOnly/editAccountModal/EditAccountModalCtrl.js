(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('EditAccountModalCtrl', EditAccountModalCtrl);

    function EditAccountModalCtrl($scope,$uibModalInstance,account,toastr,$stateParams,currenciesList,
                                  Rehive,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userAccount = account;
        $scope.currenciesList = currenciesList;
        vm.updatedUserAddress = {};
        $scope.editUserAddress = {};
        $scope.editingUserAddress = true;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        $scope.newAccountCurrencies = {list: []};
        vm.token = localStorageManagement.getValue('token');

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currencyOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.getAccount = function(){
            if(vm.token) {
                $scope.loadingUserAccountsList = true;
                Rehive.admin.accounts.get({reference: $scope.userAccount.reference}).then(function (res) {
                    $scope.loadingUserAccountsList = false;
                    $scope.editUserAccountParams = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getAccount();

        $scope.editUserAccountFunction = function (editUserAccountParams) {

            var updateUserAccount = {
                name: editUserAccountParams.name,
                primary: editUserAccountParams.primary
            };

            if(vm.token) {
                $scope.loadingUserAccountsList = true;
                Rehive.admin.accounts.update(editUserAccountParams.reference, updateUserAccount).then(function (res) {
                    if($scope.newAccountCurrencies.list.length > 0){
                        $scope.addAccountCurrency($scope.newAccountCurrencies.list);
                        $scope.$apply();
                    } else {
                        $scope.loadingUserAccountsList = false;
                        toastr.success('Account updated successfully');
                        $uibModalInstance.close(res);
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.addAccountCurrency = function(listOfCurrencies){

            listOfCurrencies.forEach(function (element,index,array) {
                if(vm.token) {
                    Rehive.admin.accounts.currencies.create($scope.userAccount.reference,{currency: element.code}).then(function (res) {
                        if(index == (array.length - 1)) {
                            $scope.loadingUserAccountsList = false;
                            $scope.newAccountCurrencies = {list: []};
                            toastr.success('Account updated successfully');
                            $uibModalInstance.close(res);
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.newAccountCurrencies = {list: []};
                        $scope.loadingUserAccountsList = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                }
            });
        };




    }
})();
