(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList')
        .controller('ShowCurrencyConversionConversionsModalCtrl', ShowCurrencyConversionConversionsModalCtrl);

    function ShowCurrencyConversionConversionsModalCtrl($scope,metadataTextService,conversion,cookieManagement,$location,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.conversion = conversion;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(conversion.quote.metadata);

        $scope.goToTransactionsHistoryView =  function (id) {
            $state.go('transactions.history',{"transactionId": id});
        };

        $scope.goToUserView =  function (uuid) {
            $location.path('user/' + uuid + '/details');
        };


    }
})();
