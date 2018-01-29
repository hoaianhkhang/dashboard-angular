(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList')
        .controller('ShowCurrencyConversionConversionsModalCtrl', ShowCurrencyConversionConversionsModalCtrl);

    function ShowCurrencyConversionConversionsModalCtrl($scope,$uibModalInstance,metadataTextService,conversion,toastr,cleanObject,
                                               currencyModifiers,$http,cookieManagement,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.conversion = conversion;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(conversion.quote.metadata);



    }
})();
