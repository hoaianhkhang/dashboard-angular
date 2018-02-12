(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.transfers')
        .controller('TransfersCtrl', TransfersCtrl);

    /** @ngInject */
    function TransfersCtrl($rootScope,$scope,typeaheadService,$http,environmentConfig,cookieManagement,toastr,errorHandler,currencyModifiers) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.dashboardTitle = 'Rehive | Transfers';

        $scope.transferData = {
            user: null,
            amount: null,
            recipient: "",
            currency: null
        };

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.onGoingTransaction = false;
        $scope.showView = 'createTransfer';

        $scope.goToView = function(view){
            if($scope.transferData.amount){
                var validAmount = currencyModifiers.validateCurrency($scope.transferData.amount,$scope.transferData.currency.divisibility);
                if(validAmount){
                    $scope.showView = view;
                } else {
                    toastr.error('Please input amount to ' + $scope.transferData.currency.divisibility + ' decimal places');
                }
            } else{
                $scope.showView = view;
            }
        };

        $scope.toggleTransferView = function() {
            $scope.transferData = {
                user: null,
                amount: null,
                recipient: null,
                currency: null
            };

            $scope.goToView('createTransfer');
        };

        $scope.createTransfer = function () {

            var sendTransactionData = {
                user: $scope.transferData.user,
                amount: currencyModifiers.convertToCents($scope.transferData.amount,$scope.transferData.currency.divisibility),
                recipient: $scope.transferData.recipient,
                currency: $scope.transferData.currency.code
            };

            $scope.onGoingTransaction = true;
            $http.post(environmentConfig.API + '/admin/transactions/transfer/',sendTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.onGoingTransaction = false;
                if (res.status === 201) {
                    toastr.success('You have successfully transferred the money');
                    $scope.goToView('completeTransfer');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

    }
})();
