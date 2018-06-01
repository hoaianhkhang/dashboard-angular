(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('TransferCtrl', TransferCtrl);

    function TransferCtrl(Rehive,$scope,errorHandler,metadataTextService,$window,
                          $location,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.transferCurrencyOptions = [];
        $scope.retrievedSenderUserObj = {};
        $scope.retrievedSenderUserAccountsArray = [];
        $scope.retrievedSenderAccountTransactions = [];
        $scope.retrievedRecipientObj = {};
        $scope.retrievedRecipientAccountsArray = [];
        $scope.retrievedRecipientAccountTransactions = [];
        $scope.senderUserAccountsAvailable = true;
        $scope.senderCurrencyAccountsAvailable = true;
        $scope.recipientUserAccountsAvailable = true;
        $scope.recipientCurrencyAccountsAvailable = true;

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

        vm.getTransferCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    $scope.transferCurrencyOptions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getTransferCompanyCurrencies();

        $scope.$watch('transferTransactionData.user',function () {
            if($scope.transferTransactionData.user){
                vm.resetTransferData();
                vm.getUserObj($scope.transferTransactionData);
            } else {
                vm.resetTransferData();
            }
        });

        $scope.$watch('transferTransactionData.recipient',function () {
            if($scope.transferTransactionData.recipient){
                vm.resetTransferData('recipient');
                vm.getUserObj($scope.transferTransactionData,'recipient');
            } else {
                vm.resetTransferData('recipient');
            }
        });

        vm.resetTransferData = function (recipient) {
            if(recipient){
                $scope.retrievedRecipientObj = {};
                $scope.retrievedRecipientAccountsArray = [];
                $scope.retrievedRecipientAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.credit_account = {};
                $scope.senderUserAccountsAvailable = true;
                $scope.senderCurrencyAccountsAvailable = true;
                $scope.recipientUserAccountsAvailable = true;
                $scope.recipientCurrencyAccountsAvailable = true;
            } else {
                $scope.retrievedSenderUserObj = {};
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedSenderAccountTransactions = [];
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.account = {};
                $scope.senderUserAccountsAvailable = true;
                $scope.senderCurrencyAccountsAvailable = true;
                $scope.recipientUserAccountsAvailable = true;
                $scope.recipientCurrencyAccountsAvailable = true;
            }
        };

        vm.getUserObj = function (transactionData,recipient) {
            var user;

            if(recipient){
                $scope.retrievedRecipientObj = {};
                user = transactionData.recipient;
            } else {
                $scope.retrievedSenderUserObj = {};
                user = transactionData.user;
            }

            Rehive.admin.users.get({filters: {user: user}}).then(function (res) {
                if(res.results.length == 1){
                    if(recipient){
                        $scope.retrievedRecipientObj = res.results[0];
                        $scope.retrievedRecipientObj.metadata = metadataTextService.convertToText($scope.retrievedRecipientObj.metadata);
                        if($scope.transferCurrencyOptions.length === 1){
                            $scope.transferTransactionData.currency = $scope.transferCurrencyOptions[0];
                            $scope.currencySelected($scope.transferTransactionData,'recipient');
                        }
                        $scope.$apply();
                    } else {
                        $scope.retrievedSenderUserObj = res.results[0];
                        $scope.retrievedSenderUserObj.metadata = metadataTextService.convertToText($scope.retrievedSenderUserObj.metadata);
                        $scope.$apply();
                    }
                } else {
                    if(recipient){
                        $scope.retrievedRecipientAccountsArray = [];
                        $scope.retrievedRecipientObj = {};
                        $scope.$apply();
                    } else {
                        $scope.retrievedSenderUserObj = {};
                        $scope.retrievedSenderUserAccountsArray = [];
                        $scope.$apply();
                    }

                    transactionData.currency = {};
                }
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.currencySelected = function (transactionData,recipient) {
            if(recipient){
                $scope.retrievedSenderUserAccountsArray = [];
                $scope.retrievedRecipientAccountsArray = [];
                transactionData.credit_account = {};
                transactionData.debit_account = {};
                vm.getUserAccounts($scope.retrievedRecipientObj,transactionData,recipient);
                vm.getUserAccounts($scope.retrievedSenderUserObj,transactionData);
            } else {
                $scope.retrievedSenderUserAccountsArray = [];
                transactionData.account = {};
                vm.getUserAccounts($scope.retrievedSenderUserObj,transactionData);
            }
        };

        vm.getUserAccounts = function (user,transactionData,recipient) {
            Rehive.admin.accounts.get({filters: {user: user.identifier}}).then(function (res) {
                if(res.results.length > 0 ){
                    if(recipient){
                        $scope.recipientUserAccountsAvailable = true;
                        vm.getAccounts(user,transactionData,recipient);
                        $scope.$apply();
                    } else {
                        $scope.senderUserAccountsAvailable = true;
                        vm.getAccounts(user,transactionData);
                        $scope.$apply();
                    }
                } else {
                    if(recipient){
                        $scope.recipientUserAccountsAvailable = false;
                        $scope.$apply();
                    } else {
                        $scope.senderUserAccountsAvailable = false;
                        $scope.$apply();
                    }
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getAccounts = function (user,transactionData,recipient) {
            Rehive.admin.accounts.get({filters: {user: user.identifier,currency: transactionData.currency.code}}).then(function (res) {
                if(res.results.length > 0 ){
                    res.results.forEach(function (account) {
                        if(account.primary){
                            if(recipient){
                                account.name = account.name + ' - (primary)';
                                transactionData.credit_account = account;
                                $scope.accountSelected(transactionData,recipient);
                                $scope.$apply();
                            } else {
                                account.name = account.name + ' - (primary)';
                                transactionData.account = account;
                                $scope.accountSelected(transactionData);
                                $scope.$apply();
                            }

                        }
                    });

                    if(recipient){
                        $scope.recipientCurrencyAccountsAvailable = true;
                        $scope.retrievedRecipientAccountsArray = res.results;
                        $scope.$apply();
                    } else {
                        $scope.senderCurrencyAccountsAvailable = true;
                        $scope.retrievedSenderUserAccountsArray = res.results;
                        $scope.$apply();
                    }
                } else {
                    if(recipient){
                        $scope.recipientCurrencyAccountsAvailable = false;
                        $scope.$apply();
                    } else {
                        $scope.senderCurrencyAccountsAvailable = false;
                        $scope.$apply();
                    }
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.accountSelected = function (transactionData,recipient) {

            var accountRef;

            if(transactionData){
                if(recipient && transactionData.credit_account){
                    $scope.retrievedRecipientAccountTransactions = [];
                    accountRef = transactionData.credit_account.reference;
                } else if(transactionData.account) {
                    $scope.retrievedSenderAccountTransactions = [];
                    accountRef = transactionData.account.reference;
                }

                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    if(recipient){
                        $scope.retrievedRecipientAccountTransactions = res.results;
                    } else {
                        $scope.retrievedSenderAccountTransactions = res.results;
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.goToTransferUserAccountCreate = function (identifier) {
            $window.open('/#/user/' + identifier + '/accounts?accountAction=newAccount','_blank');
        };

    }
})();
