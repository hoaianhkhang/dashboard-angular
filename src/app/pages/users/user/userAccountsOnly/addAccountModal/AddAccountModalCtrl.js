(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .controller('AddAccountModalCtrl', AddAccountModalCtrl);

    function AddAccountModalCtrl($scope,$uibModalInstance,toastr,currenciesList,
                                 $stateParams,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.newUserAccountParams = {};
        vm.uuid = $stateParams.uuid;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.addingUserAccount = true;
        $scope.currenciesForNewAccount = {
            list: []
        };

        vm.getCompanyCurrencies = function(){
            $scope.addingUserAccount = true;
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.addingUserAccount = false;
                        $scope.currenciesList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.addingUserAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.addNewUserAccount = function(newUserAccountParams){
            if(vm.token) {
                newUserAccountParams.user = vm.uuid;
                $scope.addingUserAccount = true;
                $http.post(environmentConfig.API + '/admin/accounts/', newUserAccountParams, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        if($scope.currenciesForNewAccount.list.length > 0){
                            vm.addNewAccountCurrencies($scope.currenciesForNewAccount.list,res.data.data.reference);
                        } else{
                            $scope.addingUserAccount = false;
                            $scope.newUserAccountParams = {};
                            toastr.success('Account successfully added');
                            $uibModalInstance.close(res.data);
                        }
                    }
                }).catch(function (error) {
                    $scope.addingUserAccount = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.addNewAccountCurrencies = function(listOfCurrencies,reference){

            listOfCurrencies.forEach(function (element,index,array) {
                if(vm.token) {
                    $http.post(environmentConfig.API + '/admin/accounts/' + reference + '/currencies/',{currency: element.code}, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201) {
                            if(index == (array.length - 1)) {
                                $scope.addingUserAccount = false;
                                $scope.newUserAccountParams = {};
                                $scope.currenciesForNewAccount = {list: []};
                                toastr.success('Account successfully added');
                                $uibModalInstance.close(res.data);
                            }
                        }
                    }).catch(function (error) {
                        $scope.currenciesForNewAccount = {list: []};
                        $scope.addingUserAccount = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                }
            });
        };



    }
})();
