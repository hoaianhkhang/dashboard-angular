(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialAddCurrency')
        .controller('InitialAddCurrencyCtrl', InitialAddCurrencyCtrl);

    /** @ngInject */
    function InitialAddCurrencyCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,
                                    environmentConfig,$location,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.intialCurrency = false;
        $rootScope.$pageFinishedLoading = false;
        vm.currenciesList = currenciesList;
        $scope.addCurrency = {};
        $scope.addCurrency.currencyChoice = {};
        $scope.showCustomCurrency = false;
        $scope.loadingCurrencies = false;

        vm.getCurrencies = function(){
            $scope.addCurrency.currencyChoice = vm.currenciesList.find(function (currency) {
                return currency.code == 'USD';
            });
            $scope.currencyOptions = vm.currenciesList;
            $rootScope.$pageFinishedLoading = true;
        };

        vm.getCompanyCurrencies = function(){
            $rootScope.$pageFinishedLoading = false;
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(!res.data.data.results.length == 0){
                            $rootScope.intialCurrency = true;
                            $location.path('/currencies');
                        } else {
                            $rootScope.intialCurrency = false;
                            vm.getCurrencies();
                        }
                    }
                }).catch(function (error) {
                    $rootScope.$pageFinishedLoading = true;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.addInitialCompanyCurrency = function(currency){

            var newCurrency = {
                code: currency.code,
                description: currency.description,
                divisibility: currency.divisibility,
                symbol: currency.symbol,
                unit: currency.unit,
                enabled: true
            };

            $rootScope.$pageFinishedLoading = false;
            $http.post(environmentConfig.API + '/admin/currencies/',newCurrency, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $rootScope.intialCurrency = true;
                    if($rootScope.intialCurrency && $rootScope.haveCompanyName && $rootScope.userVerified) {
                        $rootScope.userFullyVerified = true;
                    }
                    toastr.success('Initial currency added successfully');
                    $location.path('/currencies');
                    $rootScope.$pageFinishedLoading = true;
                }
            }).catch(function (error) {
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.showCustomCurrencyView = function(){
            $scope.showCustomCurrency = true;
        };

        $scope.back = function(){
            $scope.showCustomCurrency = false;
        };



    }
})();
