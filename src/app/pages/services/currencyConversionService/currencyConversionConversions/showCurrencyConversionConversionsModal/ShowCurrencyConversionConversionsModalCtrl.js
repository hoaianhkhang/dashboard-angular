(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.currencyConversionService.currencyConversionList')
        .controller('ShowCurrencyConversionConversionsModalCtrl', ShowCurrencyConversionConversionsModalCtrl);

    function ShowCurrencyConversionConversionsModalCtrl($scope,metadataTextService,conversion,environmentConfig,
                                                        $http,localStorageManagement,$window,$state,toastr,errorHandler) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[9];
        // vm.baseUrl = "https://conversion.services.rehive.io/api/";
        $scope.conversion = conversion;
        $scope.formatted = {};
        $scope.formatted.metadata = metadataTextService.convertToText(conversion.quote.metadata);

        $scope.goToTransactionsHistoryView =  function (id) {
            $state.go('transactions.history',{"transactionId": id});
        };

        $scope.goToUserView =  function (uuid) {
            var url = '/#/user/' + uuid + '/details';
            $window.open(url,'_blank');
        };

        $scope.goToRecipientView= function (email) {
            $http.get(environmentConfig.API + '/admin/users/?email__contains=' + email, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 0){
                        toastr.success('No users have been found');
                    } else {
                        var url = '/#/user/' + res.data.data.results[0].id + '/details';
                        $window.open(url,'_blank');
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
