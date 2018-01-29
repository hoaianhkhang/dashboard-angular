(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList')
        .controller('CurrencyConversionConversionsCtrl', CurrencyConversionConversionsCtrl);

    /** @ngInject */
    function CurrencyConversionConversionsCtrl($scope,$http,cookieManagement,toastr,errorHandler,$state,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.loadingConversions =  true;

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        vm.getConversionsListUrl = function(){

            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering

            return vm.baseUrl + 'admin/conversions/' + vm.filterParams;
        };

        $scope.getConversionsList = function () {
            $scope.loadingConversions =  true;
            $scope.conversionList = [];

            var conversionListUrl = vm.getConversionsListUrl();

            if(vm.token) {
                $http.get(conversionListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingConversions =  false;
                    if (res.status === 200) {
                        $scope.conversionListData = res.data.data;
                        $scope.conversionList = res.data.data.results;
                        $scope.conversionList = [{debit_tx: 'sadkadsjaslks'}]
                    }
                }).catch(function (error) {
                    $scope.loadingConversions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getConversionsList();

        $scope.goToAddConversionView = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddCurrencyConversionConversionsModalCtrl',
                scope: $scope
            });

            vm.theAddModal.result.then(function(conversion){
                if(conversion){
                    $scope.getConversionsList();
                }
            }, function(){
            });
        };

        $scope.goToConversionView = function (page, size,conversion) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ShowCurrencyConversionConversionsModalCtrl',
                scope: $scope,
                resolve: {
                    conversion: function () {
                        return conversion;
                    }
                }
            });

        };

    }

})();
