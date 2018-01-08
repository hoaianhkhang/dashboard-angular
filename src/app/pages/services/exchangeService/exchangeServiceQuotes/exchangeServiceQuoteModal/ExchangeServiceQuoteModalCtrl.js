(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.exchangeService.listExchangeServiceQuotes')
        .controller('ExchangeServiceQuoteModalCtrl', ExchangeServiceQuoteModalCtrl);

    function ExchangeServiceQuoteModalCtrl($scope,environmentConfig,$uibModalInstance,quote,toastr,$http,cookieManagement,errorHandler) {

        var vm = this;

        $scope.quote = quote;
        $scope.loadingTransactions = true;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.deletingExchange = false;

        vm.getTransactions = function() {
            $scope.loadingTransactions = true;
            var url = environmentConfig.API + '/admin/transactions/?metadata__quote_id='+$scope.quote.id;
            $http.get(url, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                  $scope.loadingTransactions = false;
                  if(res.status >= 200 && res.status < 300)
                    $scope.transactions = res.data.data.results;
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
        };
        vm.getTransactions();
 
    }
})();
