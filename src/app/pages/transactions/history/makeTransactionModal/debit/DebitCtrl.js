(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('DebitCtrl', DebitCtrl);

    function DebitCtrl($http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,$filter,
                        sharedResources,localStorageManagement,$state,typeaheadService,currencyModifiers) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.debitTransactionData = {
            tx_type: 'debit',
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
        $scope.showAdvancedDebitOption = false;
        $scope.retrievedDebitUserObj = {};
        $scope.retrievedDebitUserAccountsArray = [];
        $scope.retrievedDebitAccountTransactions = [];
        $scope.debitTransactionStatus = ['Complete','Pending','Failed','Deleted'];

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.displayAdvancedDebitOption = function () {
            $scope.showAdvancedDebitOption = !$scope.showAdvancedDebitOption;
        };

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        vm.getDebitUserObj = function (debitTransactionData) {
            var user;

            $scope.retrievedDebitUserObj = {};
            user = debitTransactionData.user;

            $http.get(environmentConfig.API + '/admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 1){
                        $scope.retrievedDebitUserObj = res.data.data.results[0];
                        $scope.retrievedDebitUserObj.metadata = metadataTextService.convertToText($scope.retrievedDebitUserObj.metadata);
                    } else {
                        $scope.retrievedDebitUserObj = {};
                        $scope.retrievedUserAccountsArray = [];
                        debitTransactionData.currency = {};
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.$watch('debitTransactionData.user',function () {
            if($scope.debitTransactionData.user){

                $scope.retrievedDebitUserObj = {};
                $scope.retrievedDebitUserAccountsArray = [];
                $scope.retrievedDebitAccountTransactions = [];
                $scope.debitTransactionData.currency = {};
                $scope.debitTransactionData.account = {};
                vm.getDebitUserObj($scope.debitTransactionData);

            } else {

                $scope.retrievedDebitUserObj = {};
                $scope.retrievedDebitUserAccountsArray = [];
                $scope.retrievedDebitAccountTransactions = [];
                $scope.debitTransactionData.currency = {};
                $scope.debitTransactionData.account = {};

            }
        });

        $scope.debitCurrencySelected = function (debitTransactionData) {
            $scope.retrievedDebitUserAccountsArray = [];
            debitTransactionData.account = {};
            vm.getDebitAccounts($scope.retrievedDebitUserObj,debitTransactionData);
        };

        vm.getDebitAccounts = function (user,debitTransactionData) {

            $http.get(environmentConfig.API + '/admin/accounts/?user='+ user.identifier + '&currency=' + debitTransactionData.currency.code, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    res.data.data.results.forEach(function (account) {
                        if(account.primary){
                            account.name = account.name + ' - (primary)';
                            debitTransactionData.account = account;
                            $scope.debitAccountSelected(debitTransactionData);

                        }
                    });
                    $scope.retrievedDebitUserAccountsArray = res.data.data.results;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.debitAccountSelected = function (debitTransactionData) {

            var accountRef;

            if(debitTransactionData){
                $scope.retrievedDebitAccountTransactions = [];
                accountRef = debitTransactionData.account.reference;

                $http.get(environmentConfig.API + '/admin/transactions/?page=1&page_size=5&orderby=-created&account=' + accountRef, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.retrievedDebitAccountTransactions = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
