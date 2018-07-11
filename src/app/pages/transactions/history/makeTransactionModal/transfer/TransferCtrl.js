(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('TransferCtrl', TransferCtrl);

    function TransferCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$window,
                          $location,localStorageManagement,$state,typeaheadService,currencyModifiers) {

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
        $scope.showAdvancedTransferOption = false;

        $scope.transferTransactionData = {
            user: null,
            recipient: null,
            amount: null,
            currency: {},
            account: {},
            credit_account: {},
            debit_reference: null,
            credit_reference: null,
            debit_metadata: null,
            credit_metadata: null
        };

        if($scope.newTransactionParams.userEmail){
            $scope.transferTransactionData.user = $scope.newTransactionParams.userEmail;
            $location.search('userEmail', null);
        }

        vm.getTransferCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.transferCurrencyOptions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                            if($scope.transferCurrencyOptions.length === 1){
                                $scope.transferTransactionData.currency = $scope.transferCurrencyOptions[0];
                                $scope.currencySelected($scope.transferTransactionData,'recipient');
                            }
                        } else {
                            $scope.retrievedSenderUserObj = res.data.data.results[0];
                            $scope.retrievedSenderUserObj.metadata = metadataTextService.convertToText($scope.retrievedSenderUserObj.metadata);
                        }
                    } else {
                        if(recipient){
                            $scope.retrievedRecipientAccountsArray = [];
                            $scope.retrievedRecipientObj = {email: user + ' ( new user )'};
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
                vm.getUserAccounts($scope.retrievedRecipientObj,transactionData,recipient);
                vm.getUserAccounts($scope.retrievedSenderUserObj,transactionData);
            } else {
                $scope.retrievedSenderUserAccountsArray = [];
                transactionData.account = {};
                vm.getUserAccounts($scope.retrievedSenderUserObj,transactionData);
            }
        };

        vm.getUserAccounts = function (user,transactionData,recipient) {

            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length > 0 ){
                        if(recipient){
                            $scope.recipientUserAccountsAvailable = true;
                            vm.getAccounts(user,transactionData,recipient);
                        } else {
                            $scope.senderUserAccountsAvailable = true;
                            vm.getAccounts(user,transactionData);
                        }
                    } else {
                        if(recipient){
                            $scope.recipientUserAccountsAvailable = false;
                        } else {
                            $scope.senderUserAccountsAvailable = false;
                        }
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getAccounts = function (user,transactionData,recipient) {

            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier + '&currency=' + transactionData.currency.code, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length > 0 ){
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
                            $scope.recipientCurrencyAccountsAvailable = true;
                            $scope.retrievedRecipientAccountsArray = res.data.data.results;
                        } else {
                            $scope.senderCurrencyAccountsAvailable = true;
                            $scope.retrievedSenderUserAccountsArray = res.data.data.results;
                        }
                    } else {
                        if(recipient){
                            $scope.recipientCurrencyAccountsAvailable = false;
                        } else {
                            $scope.senderCurrencyAccountsAvailable = false;
                        }
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
                if(recipient && transactionData.credit_account){
                    $scope.retrievedRecipientAccountTransactions = [];
                    accountRef = transactionData.credit_account.reference;
                } else if(transactionData.account) {
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

        $scope.displayAdvancedTransferOption = function () {
            $scope.showAdvancedTransferOption = !$scope.showAdvancedTransferOption;
        };

        $scope.goToTransferUserAccountCreate = function (identifier) {
            $window.open('/#/user/' + identifier + '/accounts?accountAction=newAccount','_blank');
        };

    }
})();
