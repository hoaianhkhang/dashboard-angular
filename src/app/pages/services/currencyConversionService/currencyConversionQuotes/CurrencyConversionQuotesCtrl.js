(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('CurrencyConversionQuotesCtrl', CurrencyConversionQuotesCtrl);

    /** @ngInject */
    function CurrencyConversionQuotesCtrl($scope,$http,cookieManagement,errorHandler,$uibModal,cleanObject,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.loadingQuotes =  true;
        $scope.filterObj = {
            quoteId: ''
        };

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };

        vm.getQuotesListUrl = function(){

            vm.filterParams = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage,
                id: $scope.filterObj.quoteId ? $scope.filterObj.quoteId : null
            };

            return vm.baseUrl + 'admin/quotes/?' + serializeFiltersService.serializeFilters(cleanObject.cleanObj(vm.filterParams));
        };

        $scope.getQuotesList = function () {
            $scope.loadingQuotes =  true;
            $scope.quotesList = [];

            var quotesListUrl = vm.getQuotesListUrl();

            console.log(quotesListUrl)

            if(vm.token) {
                $http.get(quotesListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingQuotes =  false;
                    if (res.status === 200) {
                        $scope.quotesListData = res.data.data;
                        $scope.quotesList = res.data.data.results;
                        console.log($scope.quotesList[0])
                    }
                }).catch(function (error) {
                    $scope.loadingQuotes =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getQuotesList();

        $scope.goToQuotesView = function (page, size, quote) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'CurrencyConversionQuotesModalCtrl',
                scope: $scope,
                resolve: {
                    quote: function () {
                        return quote;
                    }
                }
            });
        };

    }

})();
