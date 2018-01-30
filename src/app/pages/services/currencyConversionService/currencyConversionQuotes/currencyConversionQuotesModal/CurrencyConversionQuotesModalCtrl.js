(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionQuotes')
        .controller('CurrencyConversionQuotesModalCtrl', CurrencyConversionQuotesModalCtrl);

    function CurrencyConversionQuotesModalCtrl($scope,metadataTextService,quote,cookieManagement) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.quote = quote;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(quote.metadata);



    }
})();
