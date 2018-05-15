(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('CreditCtrl', CreditCtrl);

    function CreditCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$filter,
                                      sharedResources,localStorageManagement,$state,typeaheadService,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.creditTransactionData = {
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
        $scope.showAdvancedCreditOption = false;
        $scope.retrievedCreditUserObj = {};
        $scope.retrievedCreditUserAccountsArray = [];
        $scope.retrievedCreditAccountTransactions = [];
        $scope.creditTransactionStatus = ['Complete','Pending','Failed','Deleted'];

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.displayAdvancedCreditOption = function () {
            $scope.showAdvancedCreditOption = !$scope.showAdvancedCreditOption;
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
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

                $scope.retrievedCreditUserObj = {};
                $scope.retrievedCreditUserAccountsArray = [];
                $scope.retrievedCreditAccountTransactions = [];
                $scope.creditTransactionData.currency = {};
                $scope.creditTransactionData.account = {};
                vm.getCreditUserObj($scope.creditTransactionData);

            } else {

                $scope.retrievedCreditUserObj = {};
                $scope.retrievedCreditUserAccountsArray = [];
                $scope.retrievedCreditAccountTransactions = [];
                $scope.creditTransactionData.currency = {};
                $scope.creditTransactionData.account = {};

            }
        });

        $scope.creditCurrencySelected = function (creditTransactionData) {
            $scope.retrievedCreditUserAccountsArray = [];
            creditTransactionData.account = {};
            vm.getCreditAccounts($scope.retrievedCreditUserObj,creditTransactionData);
        };

        vm.getCreditAccounts = function (user,creditTransactionData) {

            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier + '&currency=' + creditTransactionData.currency.code, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    res.data.data.results.forEach(function (account) {
                        if(account.primary){
                            account.name = account.name + ' - (primary)';
                            creditTransactionData.account = account;
                            $scope.creditAccountSelected(creditTransactionData);

                        }
                    });
                    $scope.retrievedCreditUserAccountsArray = res.data.data.results;
                }
            }).catch(function (error) {
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
                        $scope.retrievedCreditAccountTransactions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
