(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('MakeTransactionModalCtrl', MakeTransactionModalCtrl);

    function MakeTransactionModalCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$filter,
                                      sharedResources,localStorageManagement,$state,typeaheadService,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.transactionData = {
            tx_type: 'credit',
            user: null,
            amount: null,
            reference: "",
            status: 'Complete',
            metadata: "",
            currency: {},
            subtype: "",
            note: "",
            account: {}
        };

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
        $scope.showAdvancedOption = false;
        $scope.retrievedUserObj = {};
        $scope.retrievedRecipientObj = {};
        $scope.retrievedUserAccountsArray = [];
        $scope.retrievedRecipientAccountsArray = [];
        $scope.retrievedAccountTransactions = [];
        $scope.retrievedRecipientAccountTransactions = [];
        $scope.transactionStatus = ['Complete','Pending','Failed','Deleted'];
        $scope.panelTitle = 'Create transaction';
        $scope.confirmTransaction = false;
        $scope.completeTransaction = false;

        $scope.toggleConfirmTransaction = function () {
            if($scope.confirmTransaction){
                $scope.confirmTransaction = false;
                $scope.panelTitle = 'Create transaction';
            } else {
                $scope.confirmTransaction = true;
                $scope.panelTitle = 'Confirm ' + $scope.transactionData.tx_type;
            }
        };

        $scope.displayAdvancedOption = function () {
            $scope.showAdvancedOption = !$scope.showAdvancedOption;
        };

        if($state.params.email){
            $scope.transactionData.user = $state.params.email;
        }

        if($state.params.account) {
            $scope.transactionData.account = $state.params.account;
        }

        $scope.$watch('transactionData.tx_type',function () {
            $scope.transactionData = {
                tx_type: $scope.transactionData.tx_type,
                user: null,
                amount: null,
                reference: "",
                status: 'Complete',
                metadata: "",
                currency: {},
                subtype: "",
                note: "",
                account: {}
            };

            $scope.transferTransactionData = {
                user: null,
                recipient: null,
                amount: null,
                currency: {},
                debit_account: {},
                credit_account: {},
                debit_reference: null,
                credit_reference: null
            };

            $scope.retrievedUserObj = {};
            $scope.retrievedRecipientObj = {};
            $scope.retrievedUserAccountsArray = [];
            $scope.retrievedRecipientAccountsArray = [];
            $scope.retrievedAccountTransactions = [];
            $scope.retrievedRecipientAccountTransactions = [];
        });

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                res.data.data = res.data.data.filter(function (element) {
                    return element.tx_type == $scope.transactionData.tx_type;
                });
                $scope.subtypeOptions = _.pluck(res.data.data,'name');
                $scope.subtypeOptions.unshift('');
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
                            $scope.transactionData.currency = $scope.currencyOptions.find(function (element) {
                                return element.code == $state.params.currencyCode;
                            });
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        // code above occurs right after modal opens

        vm.getUserObj = function (transactionData,recipient) {
            var user;

            if(recipient){
                $scope.retrievedRecipientObj = {};
                user = transactionData.recipient;
            } else {
                $scope.retrievedUserObj = {};
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
                            $scope.retrievedUserObj = res.data.data.results[0];
                            $scope.retrievedUserObj.metadata = metadataTextService.convertToText($scope.retrievedUserObj.metadata);
                        }
                    } else {
                        if(recipient){
                            $scope.retrievedRecipientAccountsArray = [];
                            $scope.retrievedRecipientObj = {};
                        } else {
                            $scope.retrievedUserObj = {};
                            $scope.retrievedUserAccountsArray = [];
                        }

                        transactionData.currency = {};
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.$watch('transactionData.user',function () {
            if($scope.transactionData.user){

                $scope.retrievedUserObj = {};
                $scope.transactionData.currency = {};
                $scope.transactionData.account = {};
                $scope.retrievedUserAccountsArray = [];
                $scope.retrievedAccountTransactions = [];
                vm.getUserObj($scope.transactionData);

            } else {

                $scope.retrievedUserObj = {};
                $scope.transactionData.currency = {};
                $scope.transactionData.account = {};
                $scope.retrievedUserAccountsArray = [];
                $scope.retrievedAccountTransactions = [];

            }
        });

        $scope.$watch('transferTransactionData.user',function () {
            if($scope.transferTransactionData.user){

                $scope.retrievedUserObj = {};
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.debit_account = {};
                $scope.retrievedUserAccountsArray = [];
                vm.getUserObj($scope.transferTransactionData);
            } else {
                $scope.retrievedUserObj = {};
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.debit_account = {};
                $scope.retrievedUserAccountsArray = [];
            }
        });

        $scope.$watch('transferTransactionData.recipient',function () {
            if($scope.transferTransactionData.user){

                $scope.retrievedRecipientObj = {};
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.credit_account = {};
                $scope.retrievedRecipientAccountsArray = [];
                vm.getUserObj($scope.transferTransactionData,'recipient');
            } else {
                $scope.retrievedRecipientObj = {};
                $scope.transferTransactionData.currency = {};
                $scope.transferTransactionData.credit_account = {};
                $scope.retrievedRecipientAccountsArray = [];
            }
        });


        $scope.currencySelected = function (transactionData,recipient) {
            if(recipient){
                $scope.retrievedUserAccountsArray = [];
                $scope.retrievedRecipientAccountsArray = [];
                transactionData.credit_account = {};
                transactionData.debit_account = {};
                vm.getAccounts($scope.retrievedRecipientObj,transactionData,recipient);
                vm.getAccounts($scope.retrievedUserObj,transactionData);
            } else {
                $scope.retrievedUserAccountsArray = [];
                transactionData.account = {};
                vm.getAccounts($scope.retrievedUserObj,transactionData);
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
                        $scope.retrievedUserAccountsArray = res.data.data.results;
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
                    $scope.retrievedAccountTransactions = [];
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
                            $scope.retrievedAccountTransactions = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createTransaction = function () {

            var api,sendTransactionData;

            if($scope.transactionData.tx_type == 'credit'){
                api = environmentConfig.API + '/admin/transactions/credit/';
                sendTransactionData = {
                    user: $scope.transactionData.user,
                    amount: currencyModifiers.convertToCents($scope.transactionData.amount,$scope.transactionData.currency.divisibility),
                    reference: $scope.transactionData.reference,
                    status: $scope.transactionData.status,
                    metadata: $scope.transactionData.metadata ? JSON.parse($scope.transactionData.metadata) : {},
                    currency: $scope.transactionData.currency.code,
                    subtype: $scope.transactionData.subtype,
                    note: $scope.transactionData.note,
                    account: $scope.transactionData.account.reference
                };

                if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

            } else if($scope.transactionData.tx_type == 'debit'){
                api = environmentConfig.API + '/admin/transactions/debit/';
                sendTransactionData = {
                    user: $scope.transactionData.user,
                    amount: currencyModifiers.convertToCents($scope.transactionData.amount,$scope.transactionData.currency.divisibility),
                    reference: $scope.transactionData.reference,
                    status: $scope.transactionData.status,
                    metadata: $scope.transactionData.metadata ? JSON.parse($scope.transactionData.metadata) : {},
                    currency: $scope.transactionData.currency.code,
                    subtype: $scope.transactionData.subtype,
                    note: $scope.transactionData.note,
                    account: $scope.transactionData.account.reference
                };

                if(!sendTransactionData.user || !sendTransactionData.amount || !sendTransactionData.currency
                    || !sendTransactionData.account){
                    toastr.error('Please fill in the required fields');
                    return;
                }

            } else if($scope.transactionData.tx_type == 'transfer'){
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
                    $scope.panelTitle = $filter('capitalizeWord')($scope.transactionData.tx_type) + ' successful';
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
