(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('MakeTransactionModalCtrl', MakeTransactionModalCtrl);

    function MakeTransactionModalCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$filter,
                                      sharedResources,localStorageManagement,$state,typeaheadService,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.transactionType = {
            tx_type: 'credit'
        };

        $scope.panelTitle = 'Create transaction';
        $scope.confirmTransaction = false;
        $scope.completeTransaction = false;

        $scope.toggleConfirmTransaction = function () {
            if($scope.confirmTransaction){
                $scope.confirmTransaction = false;
                $scope.panelTitle = 'Create transaction';
            } else {
                $scope.confirmTransaction = true;
                $scope.panelTitle = 'Confirm ' + $scope.transactionType.tx_type;
            }
        };

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.subtypeOptions = res.data.data;
                $scope.subtypeOptions.unshift({name: '',tx_type: 'credit'});
                $scope.subtypeOptions.unshift({name: '',tx_type: 'debit'});
            });
        };
        $scope.getSubtypes();

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                        if ($state.params.currencyCode) {
                            // $scope.transactionData.currency = $scope.currencyOptions.find(function (element) {
                            //     return element.code == $state.params.currencyCode;
                            // });
                            // will change when calling each using shortcuts

                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.createTransaction = function () {

            var api,sendTransactionData;

            if($scope.transactionType.tx_type == 'credit'){
                api = environmentConfig.API + '/admin/transactions/credit/';
                sendTransactionData = {
                    user: $scope.creditTransactionData.user,
                    amount: currencyModifiers.convertToCents($scope.creditTransactionData.amount,$scope.creditTransactionData.currency.divisibility),
                    reference: $scope.creditTransactionData.reference,
                    status: $scope.creditTransactionData.status,
                    metadata: $scope.creditTransactionData.metadata ? JSON.parse($scope.creditTransactionData.metadata) : {},
                    currency: $scope.creditTransactionData.currency.code,
                    subtype: $scope.creditTransactionData.subtype,
                    note: $scope.creditTransactionData.note,
                    account: $scope.creditTransactionData.account.reference
                };

                if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

            } else if($scope.transactionType.tx_type == 'debit'){
                api = environmentConfig.API + '/admin/transactions/debit/';
                sendTransactionData = {
                    user: $scope.debitTransactionData.user,
                    amount: currencyModifiers.convertToCents($scope.debitTransactionData.amount,$scope.debitTransactionData.currency.divisibility),
                    reference: $scope.debitTransactionData.reference,
                    status: $scope.debitTransactionData.status,
                    metadata: $scope.debitTransactionData.metadata ? JSON.parse($scope.debitTransactionData.metadata) : {},
                    currency: $scope.debitTransactionData.currency.code,
                    subtype: $scope.debitTransactionData.subtype,
                    note: $scope.debitTransactionData.note,
                    account: $scope.debitTransactionData.account.reference
                };

                if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

            } else if($scope.transactionType.tx_type == 'transfer'){
                api = environmentConfig.API + '/admin/transactions/transfer/';
                sendTransactionData = {
                    user: $scope.transferTransactionData.user,
                    recipient: $scope.transferTransactionData.recipient,
                    amount: currencyModifiers.convertToCents($scope.transferTransactionData.amount,$scope.transferTransactionData.currency.divisibility),
                    currency: $scope.transferTransactionData.currency.code,
                    debit_account: $scope.transferTransactionData.account.reference,
                    credit_account: $scope.transferTransactionData.credit_account.reference,
                    debit_reference: $scope.transferTransactionData.debit_reference,
                    credit_reference: $scope.transferTransactionData.credit_reference

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

    }
})();
