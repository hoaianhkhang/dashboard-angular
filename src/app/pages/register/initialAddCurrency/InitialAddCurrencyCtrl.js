(function () {
    'use strict';

    angular.module('BlurAdmin.pages.initialAddCurrency')
        .controller('InitialAddCurrencyCtrl', InitialAddCurrencyCtrl);

    /** @ngInject */
    function InitialAddCurrencyCtrl($rootScope,$scope,$http,toastr,cookieManagement,environmentConfig,$location,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.intialCurrency = false;
        $rootScope.$pageFinishedLoading = false;
        $scope.addCurrency = {};
        $scope.addCurrency.currencyChoice = {};
        $scope.showCustomCurrency = false;
        $scope.loadingCurrencies = false;

        vm.getCurrencies = function(){
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/currencies/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.addCurrency.currencyChoice = res.data.data.results.find(function (currency) {
                            return currency.code == 'USD';
                        });
                        $scope.currencyOptions = res.data.data.results;
                        $rootScope.$pageFinishedLoading = true;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCurrencies();

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

            var code = currency.code;

            $rootScope.$pageFinishedLoading = false;
            $http.patch(environmentConfig.API + '/admin/currencies/' + code+'/', {enabled: true}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
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

        $scope.addInitialCustomCompanyCurrency = function(newCurrencyParams){

            $rootScope.$pageFinishedLoading = false;
            $scope.addCurrency = {};
            $http.post(environmentConfig.API + '/admin/currencies/', newCurrencyParams, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.showCustomCurrency = false;
                    $scope.addInitialCompanyCurrency(res.data.data);
                    toastr.success('New custom currency has been created successfully');
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
