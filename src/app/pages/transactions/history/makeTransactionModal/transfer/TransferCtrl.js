(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('TransferCtrl', TransferCtrl);

    function TransferCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$filter,
                          $location,localStorageManagement,$state,typeaheadService,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.retrievedSenderUserObj = {};
        $scope.retrievedSenderUserAccountsArray = [];
        $scope.retrievedSenderAccountTransactions = [];
        $scope.retrievedRecipientObj = {};
        $scope.retrievedRecipientAccountsArray = [];
        $scope.retrievedRecipientAccountTransactions = [];

        $scope.transferTransactionData = {
            user: null,
            recipient: null,
            amount: null,
            currency: {},
            account: {},
            credit_account: {},
            debit_reference: null,
            credit_reference: null
        };

        if($scope.newTransactionParams.userEmail){
            $scope.transferTransactionData.user = $scope.newTransactionParams.userEmail;
            $location.search('userEmail', null);
        }

        $scope.$watch('transferTransactionData.user',function () {
            if($scope.transferTransactionData.user){

                $scope.retrievedSenderUserObj = {};
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedSenderAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.account = {};
                vm.getUserObj($scope.transferTransactionData);
            } else {
                $scope.retrievedSenderUserObj = {};
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedSenderAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.account = {};
            }
        });

        $scope.$watch('transferTransactionData.recipient',function () {
            if($scope.transferTransactionData.recipient){

                $scope.retrievedRecipientObj = {};
                $scope.retrievedRecipientAccountsArray = [];
                $scope.retrievedRecipientAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.credit_account = {};
                vm.getUserObj($scope.transferTransactionData,'recipient');
            } else {
                $scope.retrievedRecipientObj = {};
                $scope.retrievedRecipientAccountsArray = [];
                $scope.retrievedRecipientAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.credit_account = {};
            }
        });

        vm.getUserObj = function (transactionData,recipient) {
            var user;

            if(recipient){
                $scope.retrievedRecipientObj = {};
                user = transactionData.recipient;
            } else {
                $scope.retrievedSenderUserObj = {};
                user = transactionData.user;
            }

            $http.get(environmentConfig.API + '/admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 1){
                        if(recipient){
                            $scope.retrievedRecipientObj = res.data.data.results[0];
                            $scope.retrievedRecipientObj.metadata = metadataTextService.convertToText($scope.retrievedRecipientObj.metadata);
                        } else {
                            $scope.retrievedSenderUserObj = res.data.data.results[0];
                            $scope.retrievedSenderUserObj.metadata = metadataTextService.convertToText($scope.retrievedSenderUserObj.metadata);
                        }
                    } else {
                        if(recipient){
                            $scope.retrievedRecipientAccountsArray = [];
                            $scope.retrievedRecipientObj = {};
                        } else {
                            $scope.retrievedSenderUserObj = {};
                            $scope.retrievedSenderUserAccountsArray = [];
                        }

                        transactionData.currency = {};
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.currencySelected = function (transactionData,recipient) {
            if(recipient){
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedRecipientAccountsArray = [];
                transactionData.credit_account = {};
                transactionData.debit_account = {};
                vm.getAccounts($scope.retrievedRecipientObj,transactionData,recipient);
                vm.getAccounts($scope.retrievedSenderUserObj,transactionData);
            } else {
                $scope.retrievedSenderUserAccountsArray = [];
                transactionData.account = {};
                vm.getAccounts($scope.retrievedSenderUserObj,transactionData);
            }
        };

        vm.getAccounts = function (user,transactionData,recipient) {

            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier + '&currency=' + transactionData.currency.code, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    res.data.data.results.forEach(function (account) {
                        if(account.primary){
                            if(recipient){
                                account.name = account.name + ' - (primary)';
                                transactionData.credit_account = account;
                                $scope.accountSelected(transactionData,recipient);
                            } else {
                                account.name = account.name + ' - (primary)';
                                transactionData.account = account;
                                $scope.accountSelected(transactionData);
                            }

                        }
                    });
                    if(recipient){
                        $scope.retrievedRecipientAccountsArray = res.data.data.results;
                    } else {
                        $scope.retrievedSenderUserAccountsArray = res.data.data.results;
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.accountSelected = function (transactionData,recipient) {

            var accountRef;

            if(transactionData){
                if(recipient){
                    $scope.retrievedRecipientAccountTransactions = [];
                    accountRef = transactionData.credit_account.reference;
                } else {
                    $scope.retrievedSenderAccountTransactions = [];
                    accountRef = transactionData.account.reference;
                }

                $http.get(environmentConfig.API + '/admin/transactions/?page=1&page_size=5&orderby=-created&account=' + accountRef, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(recipient){
                            $scope.retrievedRecipientAccountTransactions = res.data.data.results;
                        } else {
                            $scope.retrievedSenderAccountTransactions = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
