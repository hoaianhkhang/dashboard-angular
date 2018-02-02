(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList')
        .controller('AddCurrencyConversionConversionsModalCtrl', AddCurrencyConversionConversionsModalCtrl);

    function AddCurrencyConversionConversionsModalCtrl($scope,$uibModalInstance,toastr,$http,cookieManagement,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.baseUrl = cookieManagement.getCookie('SERVICEURL');
        $scope.addingConversion = false;
        $scope.invalidAmount = false;
        $scope.conversionParams = {};

        $scope.addConversion = function (conversionParams) {
            $scope.addingConversion = true;

            $http.post(vm.baseUrl + 'admin/conversions/', {quote: conversionParams.quoteId,recipient: conversionParams.recipient}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.addingConversion = false;
                if (res.status === 201) {
                    toastr.success('Conversion successfully added');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.addingConversion = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();
