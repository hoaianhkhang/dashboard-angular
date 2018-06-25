(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialSetupScreen')
        .controller('InitialCurrenciesModalModalCtrl', InitialCurrenciesModalModalCtrl);

    /** @ngInject */
    function InitialCurrenciesModalModalCtrl($scope,Rehive,$uibModalInstance,
                                             currenciesList,errorHandler,toastr,$location) {

        var vm = this;

        $scope.currenciesToAdd = [];
        $scope.initialCurrencies = currenciesList.slice();
        $scope.loadingDefaultValues = false;

        $scope.addCompanyCurrency = function (currencies) {
            if(currencies && currencies.length > 0){
                $scope.loadingDefaultValues = true;
                currencies.forEach(function(currency,index,array){
                    currency.enabled = true;
                    Rehive.admin.currencies.create(currency).then(function (res) {
                        if (index == (array.length - 1)) {
                            vm.addDefaultValues();
                            $scope.$apply();
                        }
                    }, function (error) {
                        $scope.loadingDefaultValues = false;
                        errorHandler.evaluateErrors(error);
                        errorHandler.handleErrors(error);
                        $scope.$apply();
                    });
                });
            } else {
                toastr.info('Please select atleast one currency');
            }
        };

        vm.addDefaultValues = function(){
            Rehive.admin.groups.create({
                name: 'users',
                label: 'Users',
                default: true,
                public: true
            }).then(function (res) {
                vm.addAccountConfiguration();
                $scope.$apply();
            }, function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addAccountConfiguration = function () {
            Rehive.admin.groups.accountConfigurations.create('users',
            {
                name: 'default',
                label: 'Default',
                primary: true,
                default: true
            }).then(function (res) {
                vm.addCurrenciesAccount();
                $scope.$apply();
            }, function (error) {
                $scope.loadingDefaultValues = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.addCurrenciesAccount = function () {
            $scope.currenciesToAdd.forEach(function(element,i,array) {
                Rehive.admin.groups.accountConfigurations.currencies.create('users','default',
                {
                    currency: element.code
                }).then(function (res) {
                    if(i == (array.length - 1)){
                        $scope.loadingDefaultValues = false;
                        toastr.success('Company has been setup with default values');
                        $uibModalInstance.close();
                        $location.path('/currencies');
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingDefaultValues = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            });
        };

    }
})();
