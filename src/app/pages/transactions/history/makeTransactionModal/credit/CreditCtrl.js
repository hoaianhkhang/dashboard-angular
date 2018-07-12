(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('CreditCtrl', CreditCtrl);

    function CreditCtrl($scope,Rehive,errorHandler,metadataTextService,$window,
                        sharedResources,localStorageManagement,typeaheadService) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.creditSubtypeOptions = [];
        $scope.creditCurrencyOptions = [];
        $scope.creditTransactionData = {
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
        $scope.showAdvancedCreditOption = false;
        $scope.retrievedCreditUserObj = {};
        $scope.retrievedCreditUserAccountsArray = [];
        $scope.retrievedCreditAccountTransactions = [];
        $scope.creditTransactionStatus = ['Complete','Pending','Failed','Deleted'];
        $scope.creditUserAccountsAvailable = true;
        $scope.creditCurrencyAccountsAvailable = true;

        vm.getCreditCompanyCurrencies = function(){
            if(vm.token){
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    $scope.creditCurrencyOptions = res.results;
                    if($scope.newTransactionParams.currencyCode) {
                        $scope.creditTransactionData.currency = $scope.creditCurrencyOptions.find(function (element) {
                            return element.code == $scope.newTransactionParams.currencyCode;
                        });
                        vm.getCreditUserAccounts($scope.retrievedCreditUserObj,$scope.creditTransactionData);
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
            vm.getCreditCompanyCurrencies();
        }

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.creditSubtypeOptions = res;
            });
        };
        $scope.getSubtypes();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.displayAdvancedCreditOption = function () {
            $scope.showAdvancedCreditOption = !$scope.showAdvancedCreditOption;
        };

        vm.getCreditUserObj = function (creditTransactionData) {
            var user;

            $scope.retrievedCreditUserObj = {};
            user = creditTransactionData.user;

            Rehive.admin.users.get({filters: {user: user}}).then(function (res) {
                if(res.results.length == 1){
                    $scope.retrievedCreditUserObj = res.results[0];
                    $scope.retrievedCreditUserObj.metadata = metadataTextService.convertToText($scope.retrievedCreditUserObj.metadata);
                    if($scope.creditCurrencyOptions.length === 1){
                        $scope.creditTransactionData.currency = $scope.creditCurrencyOptions[0];
                        vm.getCreditUserAccounts($scope.retrievedCreditUserObj,$scope.creditTransactionData);
                        $scope.$apply();
                    } else if($scope.newTransactionParams.txType){
                        vm.getCreditCompanyCurrencies();
                        $scope.$apply();
                    }
                } else {
                    $scope.retrievedCreditUserObj = {};
                    $scope.retrievedUserAccountsArray = [];
                    creditTransactionData.currency = {};
                    $scope.$apply();
                }
            }, function (error) {
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.$watch('creditTransactionData.user',function () {
            if($scope.creditTransactionData.user){
                vm.resetCreditData();
                if(!$scope.newTransactionParams.txType){
                    vm.getCreditUserObj($scope.creditTransactionData);
                }
            } else {
                vm.resetCreditData();
            }
        });

        vm.resetCreditData = function () {
            $scope.retrievedCreditUserObj = {};
            $scope.retrievedCreditUserAccountsArray = [];
            $scope.retrievedCreditAccountTransactions = [];
            $scope.creditTransactionData.currency = {};
            $scope.creditTransactionData.account = {};
            $scope.creditUserAccountsAvailable = true;
            $scope.creditCurrencyAccountsAvailable = true;
        };

        $scope.creditCurrencySelected = function (creditTransactionData) {
            $scope.retrievedCreditUserAccountsArray = [];
            creditTransactionData.account = {};
            vm.getCreditUserAccounts($scope.retrievedCreditUserObj,creditTransactionData);
        };

        vm.getCreditUserAccounts = function (user,creditTransactionData) {
            Rehive.admin.accounts.get({filters: {user: user.identifier}}).then(function (res) {
                if(res.results.length > 0){
                    $scope.creditUserAccountsAvailable = true;
                    vm.getCreditAccounts(user,creditTransactionData);
                    $scope.$apply();
                } else {
                    $scope.creditUserAccountsAvailable = false;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        vm.getCreditAccounts = function (user,creditTransactionData) {
            Rehive.admin.accounts.get({filters: {user: user.identifier,currency: creditTransactionData.currency.code}}).then(function (res) {
                if(res.results.length > 0){
                    $scope.creditCurrencyAccountsAvailable = true;
                    res.results.find(function (account) {
                        if(account.reference == $scope.newTransactionParams.accountUser){
                            creditTransactionData.account = account;
                            $scope.creditAccountSelected(creditTransactionData);
                            return true;
                        } else if(account.primary){
                            account.name = account.name + ' - (primary)';
                            creditTransactionData.account = account;
                            $scope.creditAccountSelected(creditTransactionData);
                            return true;
                        }
                    });
                    $scope.retrievedCreditUserAccountsArray = res.results;
                    $scope.$apply();
                } else {
                    $scope.creditCurrencyAccountsAvailable = false;
                    $scope.retrievedCreditUserAccountsArray = res.results;
                    $scope.$apply();
                }
            }, function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.creditAccountSelected = function (creditTransactionData) {

            var accountRef;

            if(creditTransactionData){
                $scope.retrievedCreditAccountTransactions = [];
                accountRef = creditTransactionData.account.reference;

                Rehive.admin.transactions.get({filters: {
                    page: 1,
                    page_size: 5,
                    orderby: '-created',
                    account: accountRef
                }}).then(function (res) {
                    $scope.loadingTransactionSettings = false;
                    $scope.retrievedCreditAccountTransactions = res.results;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.goToCreditUserAccountCreate = function () {
            $window.open('/#/user/' + $scope.retrievedCreditUserObj.identifier + '/accounts?accountAction=newAccount','_blank');
        };

        $scope.goToAddCurrencyModal = function () {
            $window.open('/#/currencies?currencyAction=newCurrency','_blank');
        };

        if($scope.newTransactionParams.userEmail){
            $scope.creditTransactionData.user = $scope.newTransactionParams.userEmail;
        }

        if($scope.newTransactionParams.txType){
            $scope.loadingTransactionSettings = true;
            $scope.creditTransactionData.user = $scope.newTransactionParams.emailUser;
            vm.getCreditUserObj($scope.creditTransactionData);
        }

    }
})();
