(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller('InitialCurrenciesModalModalCtrl', InitialCurrenciesModalModalCtrl);

    /** @ngInject */
    function InitialCurrenciesModalModalCtrl($scope,$http,environmentConfig,localStorageManagement,$uibModalInstance,
                                             currenciesList,errorHandler,toastr,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.currenciesToAdd = [];
        $scope.initialCurrencies = currenciesList.slice();
        $scope.loadingDefaultValues = false;

        $scope.addCompanyCurrency = function (currencies) {
            if(currencies && currencies.length > 0){
                $scope.loadingDefaultValues = true;
                currencies.forEach(function(currency,index,array){
                    currency.enabled = true;
                    $http.post(environmentConfig.API + '/admin/currencies/',currency, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                        if (res.status === 201) {
                            if (index == (array.length - 1)) {
                                vm.addDefaultValues();
                            }
                        }
                    }).catch(function (error) {
                        $scope.loadingDefaultValues = false;
                        errorHandler.evaluateErrors(error.data);
                        errorHandler.handleErrors(error);
                    });
                });

            } else {
                toastr.info('Please select atleast one currency');
            }
        };

        vm.addDefaultValues = function(){
            $http.post(environmentConfig.API + '/admin/groups/',
                {
                    name: 'user',
                    label: 'User',
                    default: true,
                    public: true
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    vm.addAccountConfiguration();
                }
            }).catch(function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.addAccountConfiguration = function () {
            $http.post(environmentConfig.API + '/admin/groups/user/account-configurations/',
                {
                    name: 'default',
                    label: 'Default',
                    primary: true,
                    default: true
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    vm.addCurrenciesAccount();
                }
            }).catch(function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.addCurrenciesAccount = function () {
            $scope.currenciesToAdd.forEach(function(element,i,array) {
                $http.post(environmentConfig.API + '/admin/groups/user/account-configurations/default/currencies/',
                    {
                        "currency": element.code
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': vm.token
                        }
                    }).then(function (res) {
                    if (res.status === 201) {
                        if(i == (array.length - 1)){
                            $scope.loadingDefaultValues = false;
                            toastr.success('Company has been setup with default values');
                            $uibModalInstance.close();
                            $location.path('/currencies');
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingDefaultValues = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            });
        };

    }
})();
