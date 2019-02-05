(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionRates')
        .controller('CurrencyConversionRatesCtrl', CurrencyConversionRatesCtrl);

    /** @ngInject */
    function CurrencyConversionRatesCtrl($rootScope,$scope,$http,localStorageManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $rootScope.dashboardTitle = 'Conversion service | Rehive';
        $scope.loadingRates =  true;

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        vm.getRatesListUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/rates/' + vm.filterParams;
        };

        $scope.getCurrencies = function () {
            $http.get(vm.baseUrl + 'admin/currencies/', {
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
        };
        $scope.getCurrencies();

        $scope.getRatesList = function () {
            $scope.loadingRates =  true;
            $scope.ratesList = [];

            var ratesListUrl = vm.getRatesListUrl();

            if(vm.token) {
                $http.get(ratesListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingRates =  false;
                    if (res.status === 200) {
                        $scope.ratesListData = res.data.data;
                        $scope.ratesList = res.data.data.results;
                        console.log($scope.ratesList);
                    }
                }).catch(function (error) {
                    $scope.loadingRates =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getRatesList();

        $scope.goToAddRatesView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCurrencyConversionRatesModalCtrl',
                scope: $scope,
                resolve: {
                    currenciesList: function () {
                        return $scope.currenciesList;
                    }
                }
            });

            vm.theAddModal.result.then(function(rates){
                if(rates){
                    $scope.getRatesList();
                }

            }, function(){
            });
        };

        $scope.openDeleteRatesModal = function (page, size,rate) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteCurrencyConversionRatesModalCtrl',
                scope: $scope,
                resolve: {
                    rate: function () {
                        return rate;
                    }
                }
            });

            vm.theModal.result.then(function(rate){
                if(rate){
                    $scope.getRatesList();
                }
            }, function(){
            });
        };

        $scope.openEditRatesModal = function (page, size,rate) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditCurrencyConversionRatesModalCtrl',
                scope: $scope,
                resolve: {
                    rate: function () {
                        return rate;
                    }
                }
            });

            vm.theModal.result.then(function(rate){
                if(rate){
                    $scope.getRatesList();
                }
            }, function(){
            });
        };

    }

})();
