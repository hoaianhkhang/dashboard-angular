(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.listExchangeServiceQuotes')
        .controller('ListExchangeServiceQuotesCtrl', ListExchangeServiceQuotesCtrl);

    /** @ngInject */
    function ListExchangeServiceQuotesCtrl($scope,environmentConfig,$http,cookieManagement,$uibModal,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.loadingQuotes =  false;
        $scope.quotesList =  [];
        $scope.filters = {email: ""};

        $scope.pagination = {
            itemsPerPage: 20,
            pageNo: 1,
            maxSize: 5
        };
        
        vm.currencies = [
          {
            "code": "USD",
            "description": "United States Dollar",
            "symbol": "$",
            "unit": "dollar",
            "divisibility": 2,
            "enabled": true
          },
          {
            "code": "NGN",
            "description": "Nigerian Naira",
            "symbol": "\u20a6",
            "unit": "naira",
            "divisibility": 2,
            "enabled": true
          },
        ];      

        vm.getCurrency = function(code) {
          var result = $.grep(vm.currencies, function(e){ return e.code == code; });
          return result.length == 0 ? {} : result[0];
        }

        vm.getQuoteListUrl = function(){
            vm.filterParams = '?page=' + $scope.pagination.pageNo + '&page_size=' + $scope.pagination.itemsPerPage; // all the params of the filtering
            if($scope.filters.email) {
              vm.filterParams += "&email="+$scope.filters.email.replace("+","%2B");
            }

            return 'http://45.55.183.106:8000/api/admin/quotes/' + vm.filterParams;
            //return vm.baseUrl + 'admin/quotes/' + vm.filterParams;
        };

        $scope.getQuotesList = function () {
            $scope.loadingQuotes =  true;
            $scope.quotesList = [];

            var quoteListUrl = vm.getQuoteListUrl();

            if(vm.token) {
                $http.get(quoteListUrl, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingQuotes =  false;
                    if (res.status === 200) {
                        $scope.quotesListData = res.data.data;
                        var quotes = res.data.data.results;
                        for(var i=0;i<quotes.length;i++) {
                          var quote = quotes[i];
                          quote.from_currency = vm.getCurrency(quote.from_currency);
                          quote.to_currency = vm.getCurrency(quote.to_currency);
                          quote.from_amount = quote.from_amount / Math.pow(10, quote.from_currency.divisibility);
                          quote.to_amount = quote.to_amount / Math.pow(10, quote.to_currency.divisibility);
                        }

                        $scope.quotesList = quotes;
                    }
                }).catch(function (error) {
                    $scope.loadingQuotes =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getQuotesList();

        $scope.openTransactionsModal = function (page, size,quote ) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ExchangeServiceQuoteModalCtrl',
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
