(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupAccountConfigurations')
        .controller('ManageGroupAccountConfigModalCtrl', ManageGroupAccountConfigModalCtrl);

    function ManageGroupAccountConfigModalCtrl($scope,$uibModalInstance,toastr,$http,$stateParams,_,$timeout,
                                            environmentConfig,cookieManagement,errorHandler,accountConfig) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroupAccountConfigurations = false;
        $scope.editAccountConfiguration = accountConfig;
        $scope.editAccountConfiguration.prevName = accountConfig.name;
        $scope.accountConfigurationCurrencies = {
            list: _.pluck(accountConfig.currencies,'code')
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

        $scope.groupEditAccountConfigurationNameToLowercase = function () {
            if($scope.editAccountConfiguration.name){
                $scope.editAccountConfiguration.name = $scope.editAccountConfiguration.name.toLowerCase();
            }
        };

        $scope.updateAccountConfiguration = function (editAccountConfiguration) {
            $scope.loadingGroupAccountConfigurations = true;
            var updateAccountConfiguration = {
                name: editAccountConfiguration.name,
                label: editAccountConfiguration.label,
                default: editAccountConfiguration.default,
                primary: editAccountConfiguration.primary
            };

            $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + editAccountConfiguration.prevName + '/',updateAccountConfiguration, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.separateCurrencies(editAccountConfiguration);
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.separateCurrencies = function (editAccountConfiguration) {
            var newCurrencyArray = [],deleteCurrencyArray = [],currencies = [];

            currencies = _.pluck(editAccountConfiguration.currencies,'code');
            newCurrencyArray = _.difference(currencies,$scope.accountConfigurationCurrencies.list);
            deleteCurrencyArray = _.difference($scope.accountConfigurationCurrencies.list,currencies);

            if(deleteCurrencyArray.length > 0){
                deleteCurrencyArray.forEach(function (currencyCode,index,array) {
                    $scope.deleteAccountConfigCurrency(editAccountConfiguration,currencyCode);
                    if(index === (array.length -1)){
                        if(newCurrencyArray.length > 0){
                            newCurrencyArray.forEach(function (currencyCode,index,array) {
                                if(index === (array.length -1)){
                                    $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode,'last');
                                } else{
                                    $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode);
                                }
                            });
                        } else {
                            $timeout(function () {
                                $scope.loadingGroupAccountConfigurations = false;
                                toastr.success('Account configuration successfully updated');
                                $uibModalInstance.close(true);
                            },800);
                        }
                    }
                });
            } else {
                if(newCurrencyArray.length > 0){
                    newCurrencyArray.forEach(function (currencyCode,index,array) {
                        if(index === (array.length -1)){
                            $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode,'last');
                        } else{
                            $scope.createAccountConfigCurrency(editAccountConfiguration,currencyCode);
                        }
                    });
                } else {
                    $timeout(function () {
                        $scope.loadingGroupAccountConfigurations = false;
                        toastr.success('Account configuration successfully updated');
                        $uibModalInstance.close(true);
                    },800);
                }
            }


        };

        $scope.deleteAccountConfigCurrency = function(editAccountConfiguration,currencyCode){
            $scope.loadingGroupAccountConfigurations = true;
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + editAccountConfiguration.prevName + '/currencies/' + currencyCode + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {

                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.createAccountConfigCurrency = function(editAccountConfiguration,currencyCode,last){
            $scope.loadingGroupAccountConfigurations = true;
            $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + editAccountConfiguration.prevName + '/currencies/',{currency: currencyCode}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    if(last){
                        $timeout(function () {
                            $scope.loadingGroupAccountConfigurations = false;
                            toastr.success('Account configuration successfully updated');
                            $uibModalInstance.close(res.data);
                        },800);
                    }
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
