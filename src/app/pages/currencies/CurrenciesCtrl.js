(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies')
        .controller('CurrenciesCtrl', CurrenciesCtrl);

    /** @ngInject */
    function CurrenciesCtrl($scope,$location,cookieManagement,environmentConfig,$http,errorHandler,$state,_,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.showingFilters = false;
        $scope.loadingCurrencies = true;
        $scope.optionsCode = '';
        $scope.showingRowsCurrencyCode = '';
        $scope.currencyOptions = [];
        $scope.filtersObj = {
            currencyFilter: false,
            unitFilter: false
        };
        $scope.applyFiltersObj = {
            currencyFilter:{
                selectedCurrencyOption: {}
            },
            unitFilter: {
                selectedCurrencyOption: {}
            }
        };

        $scope.toggleRowsVisibility = function (currency) {
            if($scope.showingRowsCurrencyCode == currency.code){
                $scope.showingRowsCurrencyCode = '';
            } else {
                $scope.showingRowsCurrencyCode = currency.code;
            }
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.hideFilters = function () {
            $scope.showingFilters = false;
        };

        $scope.showCurrenciesOptions = function (code) {
            if($scope.optionsCode == code){
                $scope.optionsCode = '';
            } else {
                $scope.optionsCode = code;
            }
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                currencyFilter: false,
                unitFilter: false
            };
        };

        vm.getCurrenciesUrl = function(){


            var searchObj = {
                enabled: true,
                code: $scope.filtersObj.currencyFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                unit: $scope.filtersObj.unitFilter ? $scope.applyFiltersObj.unitFilter.selectedCurrencyOption.unit: null
            };

            return environmentConfig.API + '/admin/currencies/?' + serializeFiltersService.serializeFilters(searchObj);
        };

        $scope.getCompanyCurrencies = function(){
            if($scope.showingFilters) {
                $scope.showFilters();
            }

            var currenciesUrl = vm.getCurrenciesUrl();

            if(vm.token) {
                $scope.loadingCurrencies = true;
                $http.get(currenciesUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length > 0){
                            $scope.currencies = res.data.data.results;
                            if($scope.currencyOptions.length == 0){
                                $scope.currencyOptions = res.data.data.results.slice(0);
                            }

                            $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = $scope.currencies[0];
                            $scope.applyFiltersObj.unitFilter.selectedCurrencyOption = $scope.currencies[0];
                            
                            $scope.currencies.forEach(function(element,idx,array){
                                if(idx === array.length - 1){
                                    vm.getCurrencyOverview(element,'last');
                                    return false;
                                }
                                vm.getCurrencyOverview(element);
                            });
                        } else {
                            $scope.loadingCurrencies = false;
                            $scope.currencies = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getCompanyCurrencies();

        vm.getCurrencyOverview = function (currency,last) {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                $http.get(environmentConfig.API + '/admin/currencies/' + currency.code + '/overview/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencies.forEach(function (element,index) {
                            if(element.code == currency.code){
                                _.extendOwn(element,res.data.data);
                            }
                        });
                        if(last){
                            $scope.loadingCurrencies = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.goToView = function(path){
            $location.path(path);
        };

        $scope.goToAddCurrency = function(){
            $location.path('/currency/add');
        };

        $scope.goToHistoryState = function (code) {
            $state.go('transactions.history',{"currencyCode": code});
        };

        $scope.goToUsersState = function (code) {
            $state.go('users',{"currencyCode": code});
        };

        $scope.goToPendingTransactions = function (currency,state) {
            $state.go(state);
        };

    }
})();
