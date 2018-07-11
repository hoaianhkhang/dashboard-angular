(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('CreditCtrl', CreditCtrl);

    function CreditCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$window,
                        sharedResources,localStorageManagement,$state,typeaheadService,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
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
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.creditCurrencyOptions = res.data.data.results;
                        console.log($scope.creditCurrencyOptions)
                        if($scope.newTransactionParams.currencyCode) {
                            $scope.creditTransactionData.currency = $scope.creditCurrencyOptions.find(function (element) {
                                return element.code == $scope.newTransactionParams.currencyCode;
                            });
                            vm.getCreditUserAccounts($scope.retrievedCreditUserObj,$scope.creditTransactionData);
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        if(!$scope.newTransactionParams.txType){
            vm.getCreditCompanyCurrencies();
        }

        $scope.getSubtypes = function () {
            sharedResources.getSubtypes().then(function (res) {
                $scope.creditSubtypeOptions = res.data.data;
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

            $http.get(environmentConfig.API + '/admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 1){
                        $scope.retrievedCreditUserObj = res.data.data.results[0];
                        $scope.retrievedCreditUserObj.metadata = metadataTextService.convertToText($scope.retrievedCreditUserObj.metadata);
                        if($scope.creditCurrencyOptions.length === 1){
                            $scope.creditTransactionData.currency = $scope.creditCurrencyOptions[0];
                            vm.getCreditUserAccounts($scope.retrievedCreditUserObj,$scope.creditTransactionData);
                        } else if($scope.newTransactionParams.txType){
                            vm.getCreditCompanyCurrencies();
                        }
                    } else {
                        $scope.retrievedCreditUserObj = {};
                        $scope.retrievedUserAccountsArray = [];
                        creditTransactionData.currency = {};
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
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
            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length > 0){
                        $scope.creditUserAccountsAvailable = true;
                        vm.getCreditAccounts(user,creditTransactionData);
                    } else {
                        $scope.creditUserAccountsAvailable = false;
                    }
                }
            }).catch(function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getCreditAccounts = function (user,creditTransactionData) {
            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier + '&currency=' + creditTransactionData.currency.code, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length > 0){
                        $scope.creditCurrencyAccountsAvailable = true;
                        res.data.data.results.find(function (account) {
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
                        $scope.retrievedCreditUserAccountsArray = res.data.data.results;
                    } else {
                        $scope.creditCurrencyAccountsAvailable = false;
                        $scope.retrievedCreditUserAccountsArray = res.data.data.results;
                    }
                }
            }).catch(function (error) {
                $scope.loadingTransactionSettings = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.creditAccountSelected = function (creditTransactionData) {

            var accountRef;

            if(creditTransactionData){
                $scope.retrievedCreditAccountTransactions = [];
                accountRef = creditTransactionData.account.reference;

                $http.get(environmentConfig.API + '/admin/transactions/?page=1&page_size=5&orderby=-created&account=' + accountRef, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingTransactionSettings = false;
                        $scope.retrievedCreditAccountTransactions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
