(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('MakeTransactionModalCtrl', MakeTransactionModalCtrl);

    function MakeTransactionModalCtrl($http,$scope,errorHandler,toastr,environmentConfig,$filter,$uibModalInstance,
                                      newTransactionParams,localStorageManagement,currencyModifiers,$location) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.transactionType = {
            tx_type: 'credit'
        };
        $scope.newTransactionParams = newTransactionParams || {};
        $scope.panelTitle = 'New transaction';
        vm.completedTransaction = {};
        $scope.confirmTransaction = false;
        $scope.completeTransaction = false;
        $scope.loadingTransactionSettings = false;

        if($scope.newTransactionParams.txType){
            $scope.transactionType.tx_type = $scope.newTransactionParams.txType;
        }

        $scope.toggleConfirmTransaction = function () {
            if($scope.confirmTransaction){
                $scope.confirmTransaction = false;
                $scope.panelTitle = 'New transaction';
            } else {
                $scope.confirmTransaction = true;
                $scope.panelTitle = 'Confirm ' + $scope.transactionType.tx_type;
            }
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.createTransaction = function () {

            var api,sendTransactionData,creditMetadata,debitMetadata,transferCreditMetadata,transferDebitMetadata;

            if($scope.transactionType.tx_type == 'credit'){

                if($scope.creditTransactionData.metadata){
                    if(vm.isJson($scope.creditTransactionData.metadata)){
                        creditMetadata =  JSON.parse($scope.creditTransactionData.metadata);
                    } else {
                        toastr.error('Incorrect metadata format');
                        $scope.toggleConfirmTransaction();
                        return false;
                    }
                } else {
                    creditMetadata = {};
                }

                api = environmentConfig.API + '/admin/transactions/credit/';
                sendTransactionData = {
                    user: $scope.creditTransactionData.user,
                    amount: currencyModifiers.convertToCents($scope.creditTransactionData.amount,$scope.creditTransactionData.currency.divisibility),
                    reference: $scope.creditTransactionData.reference,
                    status: $scope.creditTransactionData.status,
                    metadata: creditMetadata,
                    currency: $scope.creditTransactionData.currency.code,
                    subtype: $scope.creditTransactionData.subtype ? $scope.creditTransactionData.subtype.name ? $scope.creditTransactionData.subtype.name : null : null,
                    note: $scope.creditTransactionData.note,
                    account: $scope.creditTransactionData.account.reference
                };

                if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

            } else if($scope.transactionType.tx_type == 'debit'){

                if($scope.debitTransactionData.metadata){
                    if(vm.isJson($scope.debitTransactionData.metadata)){
                        debitMetadata =  JSON.parse($scope.debitTransactionData.metadata);
                    } else {
                        toastr.error('Incorrect metadata format');
                        $scope.toggleConfirmTransaction();
                        return false;
                    }
                } else {
                    debitMetadata = {};
                }

                api = environmentConfig.API + '/admin/transactions/debit/';
                sendTransactionData = {
                    user: $scope.debitTransactionData.user,
                    amount: currencyModifiers.convertToCents($scope.debitTransactionData.amount,$scope.debitTransactionData.currency.divisibility),
                    reference: $scope.debitTransactionData.reference,
                    status: $scope.debitTransactionData.status,
                    metadata: debitMetadata,
                    currency: $scope.debitTransactionData.currency.code,
                    subtype: $scope.debitTransactionData.subtype ? $scope.debitTransactionData.subtype.name ? $scope.debitTransactionData.subtype.name : null : null,
                    note: $scope.debitTransactionData.note,
                    account: $scope.debitTransactionData.account.reference
                };

                if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

            } else if($scope.transactionType.tx_type == 'transfer'){

                if($scope.transferTransactionData.credit_metadata){
                    if(vm.isJson($scope.transferTransactionData.credit_metadata)){
                        transferCreditMetadata =  JSON.parse($scope.transferTransactionData.credit_metadata);
                    } else {
                        toastr.error('Incorrect sender metadata format');
                        $scope.toggleConfirmTransaction();
                        return false;
                    }
                } else {
                    transferCreditMetadata = {};
                }

                if($scope.transferTransactionData.debit_metadata){
                    if(vm.isJson($scope.transferTransactionData.debit_metadata)){
                        transferDebitMetadata =  JSON.parse($scope.transferTransactionData.debit_metadata);
                    } else {
                        toastr.error('Incorrect recipient metadata format');
                        $scope.toggleConfirmTransaction();
                        return false;
                    }
                } else {
                    transferDebitMetadata = {};
                }

                api = environmentConfig.API + '/admin/transactions/transfer/';
                sendTransactionData = {
                    user: $scope.transferTransactionData.user,
                    recipient: $scope.transferTransactionData.recipient,
                    amount: currencyModifiers.convertToCents($scope.transferTransactionData.amount,$scope.transferTransactionData.currency.divisibility),
                    currency: $scope.transferTransactionData.currency.code,
                    debit_account: $scope.transferTransactionData.account.reference,
                    credit_account: $scope.transferTransactionData.credit_account.reference,
                    debit_reference: $scope.transferTransactionData.debit_reference,
                    credit_reference: $scope.transferTransactionData.credit_reference,
                    debit_metadata: transferDebitMetadata,
                    credit_metadata: transferCreditMetadata

                };

                if(!sendTransactionData.user || !sendTransactionData.recipient || !sendTransactionData.amount || !sendTransactionData.currency){
                    toastr.error('Please fill in the required fields');
                    return;
                }
            }

            $scope.onGoingTransaction = true;
            // $http.post takes the params as follow post(url, data, {config})
            // https://docs.angularjs.org/api/ng/service/$http#post
            $http.post(api, sendTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.onGoingTransaction = false;
                if (res.status === 201) {
                    vm.completedTransaction = res.data.data;
                    $scope.completeTransaction = true;
                    $scope.confirmTransaction = false;
                    $scope.panelTitle = $filter('capitalizeWord')($scope.transactionType.tx_type) + ' successful';
                    toastr.success('Your transaction has been completed successfully.');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.closeModal = function () {
            $uibModalInstance.close(true);
        };

        $scope.takeToUser = function (identifier) {
            $location.path('/user/' + identifier + '/details');
            $scope.$dismiss();
        };

        $scope.showTransactionModal = function () {
            $uibModalInstance.close(vm.completedTransaction);
        };

    }
})();
