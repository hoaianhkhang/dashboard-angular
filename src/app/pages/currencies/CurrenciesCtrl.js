(function () {
    'use strict';

    angular.module('BlurAdmin.pages.currencies')
        .controller('CurrenciesCtrl', CurrenciesCtrl);

    /** @ngInject */
    function CurrenciesCtrl($rootScope,$scope,$location,localStorageManagement,
                            errorHandler,$state,_,serializeFiltersService,$uibModal,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.dashboardTitle = 'Currencies | Rehive';
        vm.createNewCurrencyRequest = $location.search();
        $scope.showingFilters = false;
        $scope.loadingCurrencies = true;
        $scope.optionsCode = '';
        $scope.showingRowsCurrencyCode = '';
        $scope.codeArray = [];
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
        $scope.pagination = {
            itemsPerPage: 15,
            pageNo: 1,
            maxSize: 5
        };

        $scope.findIndexOfCode = function (currency) {
            return $scope.codeArray.findIndex(function (element) {
                return element == currency.code;
            });
        };

        $scope.toggleRowsVisibility = function (currency) {
            if($scope.findIndexOfCode(currency) >= 0){
                var index = $scope.findIndexOfCode(currency);
                $scope.codeArray.splice(index,1);
            } else {
                $scope.codeArray.push(currency.code);
            }
        };

        $scope.showFilters = function () {
            $scope.showingFilters = !$scope.showingFilters;
        };

        $scope.hideFilters = function () {
            $scope.showingFilters = false;
        };

        $scope.closeOptionsBox = function () {
            $scope.optionsCode = '';
        };

        $scope.showCurrenciesOptions = function (code) {
            $scope.optionsCode = code;
        };

        $scope.clearFilters = function () {
            $scope.filtersObj = {
                currencyFilter: false,
                unitFilter: false
            };
        };

        vm.getAllCompanyCurrencies = function () {
            Rehive.admin.currencies.get({filters: {
                page:1,
                page_size: 250,
                enabled: true
            }}).then(function (res) {
                if($scope.currencyOptions.length > 0){
                    $scope.currencyOptions.length = 0;
                }

                $scope.currencyOptions = res.results.slice();
                $scope.currencyOptions.sort(function(a, b){
                    return a.code.localeCompare(b.code);
                });
                $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                $scope.currencyOptions.sort(function(a, b){
                    return a.unit.localeCompare(b.unit);
                });
                $scope.applyFiltersObj.unitFilter.selectedCurrencyOption = $scope.currencyOptions[0];
                $scope.$apply();
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };
        vm.getAllCompanyCurrencies();

        vm.getCurrenciesFiltersObj = function(){


            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage,
                enabled: true,
                code: $scope.filtersObj.currencyFilter ? $scope.applyFiltersObj.currencyFilter.selectedCurrencyOption.code: null,
                unit: $scope.filtersObj.unitFilter ? $scope.applyFiltersObj.unitFilter.selectedCurrencyOption.unit: null
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getCompanyCurrencies = function(applyFilter){
            if($scope.showingFilters) {
                $scope.showFilters();
            }

            if(applyFilter){
                $scope.pagination.pageNo = 1;
            }

            var currenciesFiltersObj = vm.getCurrenciesFiltersObj();

            if(vm.token) {
                $scope.loadingCurrencies = true;

                Rehive.admin.currencies.get({filters: currenciesFiltersObj}).then(function (res) {
                    if(res.results.length > 0){
                        $scope.currenciesData = res;
                        $scope.currencies = res.results;

                        $scope.currencies.forEach(function(element,idx,array){
                            if(idx === array.length - 1){
                                vm.getCurrencyOverview(element,'last');
                                return false;
                            }
                            vm.getCurrencyOverview(element);
                        });
                    } else {
                        $scope.loadingCurrencies = false;
                        $scope.currencies = res.results;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getCompanyCurrencies();

        vm.getCurrencyOverview = function (currency,last) {
            if(vm.token) {
                $scope.loadingCurrencies = true;
                Rehive.admin.currencies.overview.get(currency.code).then(function (res) {
                    $scope.currencies.forEach(function (element,index) {
                        if(element.code == currency.code){
                            _.extendOwn(element,res);
                        }
                    });
                    if(last){
                        $scope.loadingCurrencies = false;
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingCurrencies = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.goToView = function(path){
            $location.path(path);
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

        $scope.openAddCurrenciesModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCurrencyModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(currency){
                if(currency){
                    vm.getAllCompanyCurrencies();
                    $scope.getCompanyCurrencies();
                }
            }, function(){
            });
        };

        if(vm.createNewCurrencyRequest.currencyAction == 'newCurrency'){
            $scope.openAddCurrenciesModal('app/pages/currencies/addCurrencyModal/addCurrencyModal.html','md');
            $location.search('currencyAction',null);
        }


    }
})();
