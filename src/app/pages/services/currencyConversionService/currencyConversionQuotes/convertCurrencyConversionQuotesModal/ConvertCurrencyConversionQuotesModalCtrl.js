(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('ConvertCurrencyConversionQuoteModalCtrl', ConvertCurrencyConversionQuoteModalCtrl);

    function ConvertCurrencyConversionQuoteModalCtrl($scope,$uibModalInstance,quote,toastr,$http,localStorageManagement,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[9];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.convertingQuote = false;
        $scope.convertQuoteParams = {
            quoteId: quote.id
        };

        $scope.convertQuote = function (convertQuoteParams) {
            $scope.convertingQuote = true;

            $http.post(vm.baseUrl + 'admin/conversions/', {quote: convertQuoteParams.quoteId,recipient: convertQuoteParams.recipient}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.convertingQuote = false;
                if (res.status === 201) {
                    toastr.success('Quote converted successfully');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.convertingQuote = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();
