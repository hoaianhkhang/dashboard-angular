(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('DebitCtrl', DebitCtrl);

    function DebitCtrl(Rehive,$scope,errorHandler,metadataTextService,$window,
                       sharedResources,localStorageManagement,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.debitSubtypeOptions = [];
        $scope.debitCurrencyOptions = [];
        $scope.debitTransactionData = {
            tx_type: 'debit',
            user: null,
            amount: null,
            reference: "",
            status: 'Complete',
            metadata: "",
            currency: {},
            subtype: {},
            note: "",
            account: {}
        };
        $scope.showAdvancedDebitOption = false;
        $scope.retrievedDebitUserObj = {};
        $scope.retrievedDebitUserAccountsArray = [];
        $scope.retrievedDebitAccountTransactions = [];
        $scope.debitTransactionStatus = ['Complete','Pending','Failed','Deleted'];
        $scope.debitUserAccountsAvailable = true;
        $scope.debitCurrencyAccountsAvailable = true;

        vm.getDebitCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.debitCurrencyOptions = res.results;
                    if($scope.newTransactionParams.currencyCode) {
                        $scope.debitTransactionData.currency = $scope.debitCurrencyOptions.find(function (element) {
                            return element.code == $scope.newTransactionParams.currencyCode;
                        });
                        vm.getDebitUserAccounts($scope.retrievedDebitUserObj,$scope.debitTransactionData);
                    }
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        if(!$scope.newTransactionParams.txType){
            vm.getDebitCompanyCurrencies();
        }

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.debitSubtypeOptions = res;
            });
        };
        $scope.getSubtypes();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.toggleAdvancedDebitOption = function () {
            $scope.showAdvancedDebitOption = !$scope.showAdvancedDebitOption;
        };

        vm.getDebitUserObj = function (debitTransactionData) {
            var user;

            $scope.retrievedDebitUserObj = {};
            user = debitTransactionData.user;

            Rehive.admin.users.get({filters: {user: user}}).then(function (res) {
                if(res.results.length == 1){
                    $scope.retrievedDebitUserObj = res.results[0];
                    $scope.retrievedDebitUserObj.metadata = metadataTextService.convertToText($scope.retrievedDebitUserObj.metadata);
                    $scope.$apply();
                    if($scope.debitCurrencyOptions.length === 1){
                        $scope.debitTransactionData.currency = $scope.debitCurrencyOptions[0];
                        vm.getDebitUserAccounts($scope.retrievedDebitUserObj,$scope.debitTransactionData);
                        $scope.$apply();
                    } else if($scope.newTransactionParams.txType){
                        vm.getDebitCompanyCurrencies();
                        $scope.$apply();
                    }
                } else {
                    $scope.retrievedDebitUserObj = {};
                    $scope.retrievedUserAccountsArray = [];
                    debitTransactionData.currency = {};
                    $scope.$apply();
                }
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.$watch('debitTransactionData.user',function () {
            if($scope.debitTransactionData.user){
                vm.resetDebitData();
                vm.getDebitUserObj($scope.debitTransactionData);
            } else {
                vm.resetDebitData();
            }
        });

        vm.resetDebitData = function () {
            $scope.retrievedDebitUserObj = {};
            $scope.retrievedDebitUserAccountsArray = [];
            $scope.retrievedDebitAccountTransactions = [];
            $scope.debitTransactionData.currency = {};
            $scope.debitTransactionData.account = {};
            $scope.debitUserAccountsAvailable = true;
            $scope.debitCurrencyAccountsAvailable = true;
        };

        $scope.debitCurrencySelected = function (debitTransactionData) {
            $scope.retrievedDebitUserAccountsArray = [];
            debitTransactionData.account = {};
            if(debitTransactionData.currency && debitTransactionData.currency.code){
                vm.getDebitUserAccounts($scope.retrievedDebitUserObj,debitTransactionData);
            }
        };

        vm.getDebitUserAccounts = function (user,debitTransactionData) {
            Rehive.admin.accounts.get({filters: {user: user.id}}).then(function (res) {
                if(res.results.length > 0){
                    $scope.debitUserAccountsAvailable = true;
                    vm.getDebitAccounts(user,debitTransactionData);
                    $scope.$apply();
                } else {
                    $scope.debitUserAccountsAvailable = false;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getDebitAccounts = function (user,debitTransactionData) {
            Rehive.admin.accounts.get({filters: {user: user.id,currency: debitTransactionData.currency.code}}).then(function (res) {
                if(res.results.length > 0){
                    $scope.debitCurrencyAccountsAvailable = true;
                    res.results.find(function (account) {
                        if(account.reference == $scope.newTransactionParams.accountUser){
                            debitTransactionData.account = account;
                            $scope.debitAccountSelected(debitTransactionData);
                            return true;
                        } else if(account.primary){
                            account.name = account.name + ' - (primary)';
                            debitTransactionData.account = account;
                            $scope.debitAccountSelected(debitTransactionData);
                            return true;
                        }
                    });
                    $scope.retrievedDebitUserAccountsArray = res.results;
                    $scope.$apply();
                } else {
                    $scope.debitCurrencyAccountsAvailable = false;
                    $scope.retrievedDebitUserAccountsArray = res.results;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.debitAccountSelected = function (debitTransactionData) {

            var accountRef;

            if(debitTransactionData){
                $scope.retrievedDebitAccountTransactions = [];
                accountRef = debitTransactionData.account.reference;

                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    $scope.loadingTransactionSettings = false;
                    $scope.retrievedDebitAccountTransactions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.goToDebitUserAccountCreate = function () {
            $window.open('/#/user/' + $scope.retrievedDebitUserObj.id + '/accounts?accountAction=newAccount','_blank');
        };

        if($scope.newTransactionParams.userEmail){
            $scope.debitTransactionData.user = $scope.newTransactionParams.userEmail;
        }

        if($scope.newTransactionParams.txType){
            if($scope.newTransactionParams.userIdentity){
                $scope.loadingTransactionSettings = true;
                $scope.debitTransactionData.user = $scope.newTransactionParams.userIdentity;
                vm.getDebitUserObj($scope.debitTransactionData);
            }
        }

    }
})();
