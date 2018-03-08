(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupAccountConfigurations')
        .controller('AddGroupAccountConfigModalCtrl', AddGroupAccountConfigModalCtrl);

    function AddGroupAccountConfigModalCtrl($scope,$uibModalInstance,toastr,$http,$stateParams,
                                    environmentConfig,cookieManagement,errorHandler,$timeout) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroupAccountConfigurations = false;
        $scope.groupAccountConfigurationParams = {};
        $scope.newAccountConfigurationCurrencies = {
            list: []
        };
        $scope.currenciesList = [];

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

        $scope.groupAccountConfigurationNameToLowercase = function () {
            if($scope.groupAccountConfigurationParams.name){
                $scope.groupAccountConfigurationParams.name = $scope.groupAccountConfigurationParams.name.toLowerCase();
            }
        };

        $scope.addGroupAccountConfigurations = function(groupAccountConfigurationParams){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/',groupAccountConfigurationParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.groupAccountConfigurationParams = {};
                        $scope.addGroupAccountConfigurationCurrency(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.addGroupAccountConfigurationCurrency = function (account) {
            $scope.loadingGroupAccountConfigurations = true;
            $scope.newAccountConfigurationCurrencies.list.forEach(function (element,index,array) {
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + account.name + '/currencies/',{currency: element.code}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        if (index === array.length - 1){
                            $timeout(function () {
                                $scope.newAccountConfigurationCurrencies = {
                                    list: []
                                };
                                $scope.loadingGroupAccountConfigurations = false;
                                toastr.success('Account configuration successfully added');
                                $uibModalInstance.close(res.data);
                            },100);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            });
        };


    }
})();
