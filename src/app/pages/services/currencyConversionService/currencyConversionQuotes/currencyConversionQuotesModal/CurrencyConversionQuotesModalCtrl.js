(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('CurrencyConversionQuotesModalCtrl', CurrencyConversionQuotesModalCtrl);

    function CurrencyConversionQuotesModalCtrl($scope,metadataTextService,quote,cookieManagement,$uibModal,$http,
                                               $uibModalInstance,toastr,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.quote = quote;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(quote.metadata);

        $scope.goToConvertQuoteView = function (page, size) {
            vm.theSecondModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ConvertCurrencyConversionQuoteModalCtrl',
                scope: $scope,
                resolve: {
                    quote: function () {
                        return quote;
                    }
                }
            });
        };

        $scope.deleteQuote = function () {
            $scope.deletingQuote = true;
            $http.delete(vm.baseUrl + 'admin/quotes/' + quote.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingQuote = false;
                if (res.status === 200) {
                    toastr.success('Quote deleted successfully');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.deletingQuote = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
