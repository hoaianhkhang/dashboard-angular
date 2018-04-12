(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('EditAccountModalCtrl', EditAccountModalCtrl);

    function EditAccountModalCtrl($scope,$uibModalInstance,account,toastr,$stateParams,currenciesList,
                                      $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userAccount = account;
        $scope.currenciesList = currenciesList;
        vm.updatedUserAddress = {};
        $scope.editUserAddress = {};
        $scope.editingUserAddress = true;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        $scope.newAccountCurrencies = {list: []};
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
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

        vm.getAccount = function(){
            if(vm.token) {
                $scope.loadingUserAccountsList = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + $scope.userAccount.reference + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserAccountsList = false;
                    if (res.status === 200) {
                        $scope.editUserAccountParams = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                $http.patch(environmentConfig.API + '/admin/accounts/' + editUserAccountParams.reference + '/',updateUserAccount , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if($scope.newAccountCurrencies.list.length > 0){
                            $scope.addAccountCurrency($scope.newAccountCurrencies.list);
                        } else {
                            $scope.loadingUserAccountsList = false;
                            toastr.success('Account updated successfully');
                            $uibModalInstance.close(res.data);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserAccountsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addAccountCurrency = function(listOfCurrencies){

            listOfCurrencies.forEach(function (element,index,array) {
                if(vm.token) {
                    $http.post(environmentConfig.API + '/admin/accounts/' + $scope.userAccount.reference + '/currencies/',{currency: element.code}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201) {
                            if(index == (array.length - 1)) {
                                $scope.loadingUserAccountsList = false;
                                $scope.newAccountCurrencies = {list: []};
                                toastr.success('Account updated successfully');
                                $uibModalInstance.close(res.data);
                            }
                        }
                    }).catch(function (error) {
                        $scope.newAccountCurrencies = {list: []};
                        $scope.loadingUserAccountsList = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            });
        };




    }
})();
