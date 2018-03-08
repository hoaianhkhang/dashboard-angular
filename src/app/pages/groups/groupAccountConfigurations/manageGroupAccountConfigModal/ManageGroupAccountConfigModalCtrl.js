(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupAccountConfigurations')
        .controller('ManageGroupAccountConfigModalCtrl', ManageGroupAccountConfigModalCtrl);

    function ManageGroupAccountConfigModalCtrl($scope,$uibModalInstance,toastr,$http,$stateParams,
                                            environmentConfig,cookieManagement,errorHandler,accountConfig) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroupAccountConfigurations = false;
        $scope.editAccountConfiguration = accountConfig;
        $scope.editAccountConfiguration.prevName = accountConfig.name;
        $scope.accountConfigurationCurrencies = {
            list: accountConfig.currencies
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

        $scope.trackCurrencies = function (currency) {
            console.log(currency)
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
                    $scope.deleteAccountConfigCurrency(editAccountConfiguration);

                    // $scope.editGroupAccountConfigurationObj = {};
                    // $scope.accountConfigName =  res.data.data.name;
                    // vm.getAccountConfiguration();
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.separateCurrencies = function (currencies) {
            var newCurrencyArray = [];
            newCurrencyArray = currencies.map(function (currency) {
                var index;
                index = $scope.accountConfigurationCurrencies.list.findIndex(function (accountCurrency) {
                    return accountCurrency.code == currency.code;
                });
                if(index > -1){
                    return currency;
                }
            });

            console.log(newCurrencyArray)
        };

        $scope.deleteAccountConfigCurrency = function(editAccountConfiguration){

            // $scope.loadingGroupAccountConfigurations = true;
            // $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + editAccountConfiguration.prevName + '/currencies/' + currency.code + '/', {
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': vm.token
            //     }
            // }).then(function (res) {
            //     if (res.status === 200) {
            //         $scope.loadingGroupAccountConfigurations = false;
            //         toastr.success('Account configuration successfully updated');
            //         $uibModalInstance.close(res.data);
            //     }
            // }).catch(function (error) {
            //     $scope.loadingGroupAccountConfigurations = false;
            //     errorHandler.evaluateErrors(error.data);
            //     errorHandler.handleErrors(error);
            // });
        };



    }
})();
