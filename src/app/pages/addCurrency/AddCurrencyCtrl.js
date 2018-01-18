(function () {
    'use strict';

    angular.module('BlurAdmin.pages.addCurrency')
        .controller('AddCurrencyCtrl', AddCurrencyCtrl);

    /** @ngInject */
    function AddCurrencyCtrl($scope,$http,environmentConfig,cookieManagement,$window,currenciesList,errorHandler,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addCurrency = {};
        $scope.addCurrency.currencyChoice = {};
        vm.currenciesList = currenciesList;
        $scope.showConfirmCurrency = false;
        $scope.showCompleteCurrency = false;
        $scope.showCustomCurrency = false;
        $scope.loadingCurrencies = true;

        vm.getCurrencies = function(){
            $scope.addCurrency.currencyChoice = vm.currenciesList.find(function (currency) {
                return currency.code == 'USD';
            });
            $scope.currencyOptions = vm.currenciesList;
            $scope.loadingCurrencies = false;
        };
        vm.getCurrencies();

        $scope.addCompanyCurrency = function(currency){

            var newCurrency = {
                code: currency.code,
                description: currency.description,
                divisibility: currency.divisibility,
                symbol: currency.symbol,
                unit: currency.unit,
                enabled: true
            };

            $scope.loadingCurrencies = true;
            $http.post(environmentConfig.API + '/admin/currencies/',newCurrency, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingCurrencies = false;
                if (res.status === 201) {
                    vm.getCompanyCurrencies();
                    $scope.showConfirmCurrency = false;
                    $scope.showCompleteCurrency = true;
                }
            }).catch(function (error) {
                $scope.loadingCurrencies = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.addCustomCompanyCurrency = function(newCurrencyParams){

            $scope.loadingCurrencies = true;
            $scope.addCurrency = {};
            newCurrencyParams.enabled = true;
            $http.post(environmentConfig.API + '/admin/currencies/', newCurrencyParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingCurrencies = false;
                if (res.status === 201) {
                    vm.getCompanyCurrencies();
                    $scope.addCurrency.currencyChoice = newCurrencyParams;
                    $scope.showCustomCurrency = false;
                    $scope.showConfirmCurrency = false;
                    $scope.showCompleteCurrency = true;
                    toastr.success('New custom currency has been created successfully');
                }
            }).catch(function (error) {
                $scope.loadingCurrencies = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $window.sessionStorage.currenciesList = JSON.stringify(res.data.data.results);
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.next = function(){
            $scope.showConfirmCurrency = true;
        };

        $scope.back = function(){
            $scope.showConfirmCurrency = false;
        };

        $scope.toggleCustomCurrencyView = function () {
            $scope.showCustomCurrency = !$scope.showCustomCurrency;
        };

        $scope.backToAddCurrency = function () {
            $scope.addCurrency.currencyChoice = vm.currenciesList.find(function (currency) {
                return currency.code == 'USD';
            });
            $scope.showCustomCurrency = false;
            $scope.showConfirmCurrency = false;
            $scope.showCompleteCurrency = false;
        };

    }
})();
