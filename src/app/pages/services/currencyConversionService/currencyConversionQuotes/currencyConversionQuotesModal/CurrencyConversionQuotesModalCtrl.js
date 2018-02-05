(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('CurrencyConversionQuotesModalCtrl', CurrencyConversionQuotesModalCtrl);

    function CurrencyConversionQuotesModalCtrl($scope,metadataTextService,quote,cookieManagement,$uibModal,$http,
                                               $uibModalInstance,toastr,errorHandler,$ngConfirm) {

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

        $scope.deleteQuoteConfirm = function (bank) {
            $ngConfirm({
                title: 'Delete quote',
                content: 'Are you sure you want to delete this quote?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteQuote();
                        }
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
