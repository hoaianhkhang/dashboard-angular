(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList')
        .controller('CurrencyConversionConversionsCtrl', CurrencyConversionConversionsCtrl);

    /** @ngInject */
    function CurrencyConversionConversionsCtrl($scope,$http,localStorageManagement,errorHandler,$uibModal) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[9];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
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
                    }
                }).catch(function (error) {
                    $scope.loadingConversions =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getConversionsList();

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
