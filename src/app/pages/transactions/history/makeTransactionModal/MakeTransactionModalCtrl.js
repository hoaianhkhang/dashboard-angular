(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('MakeTransactionModalCtrl', MakeTransactionModalCtrl);

    function MakeTransactionModalCtrl($uibModalInstance,$http,$scope,errorHandler,toastr,environmentConfig,_,metadataTextService,
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
            currency: null,
            subtype: "",
            note: "",
            account: {}
        };
        $scope.showAdvancedOption = false;
        $scope.retrievedUserObj = {};
        $scope.retrievedUserAccountsArray = [];
        $scope.retrievedAccountTransactions = [];
        $scope.transactionStatus = ['Complete','Pending','Failed','Deleted'];

        $scope.displayAdvancedOption = function () {
            $scope.showAdvancedOption = !$scope.showAdvancedOption;
        };

        if($state.params.email){
            $scope.transactionData.user = $state.params.email;
        }

        if($state.params.account) {
            $scope.transactionData.account = $state.params.account;
        }

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

        $scope.$watch('transactionData.user',function () {
            if($scope.transactionData.user){
                $http.get(environmentConfig.API + '/admin/users/?user=' + encodeURIComponent($scope.transactionData.user), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(res.data.data.results.length == 1){
                            $scope.retrievedUserObj = res.data.data.results[0];
                            $scope.retrievedUserObj.metadata = metadataTextService.convertToText($scope.retrievedUserObj.metadata);
                        } else {
                            $scope.retrievedUserObj = {};
                            $scope.transactionData.currency = {};
                            $scope.retrievedUserAccountsArray = [];
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $scope.retrievedUserObj = {};
                $scope.transactionData.currency = {};
                $scope.retrievedUserAccountsArray = [];
            }
        });

        $scope.currencySelected = function () {
            $scope.transactionData.account = {};
            $scope.retrievedUserAccountsArray = [];

            if($scope.retrievedUserObj.identifier && $scope.transactionData.currency && $scope.transactionData.currency.code){
                $http.get(environmentConfig.API + '/admin/accounts/?user='+ $scope.retrievedUserObj.identifier + '&currency=' + $scope.transactionData.currency.code, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        res.data.data.results.forEach(function (account) {
                            if(account.primary){
                                account.name = account.name + ' - (primary)';
                                $scope.transactionData.account = account;
                                $scope.accountSelected();
                            }
                        });
                        $scope.retrievedUserAccountsArray = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.accountSelected = function () {
            $scope.retrievedAccountTransactions = [];
            if($scope.transactionData.account.name){
                $http.get(environmentConfig.API + '/admin/transactions/?page=1&page_size=5&orderby=-created&account=' + $scope.transactionData.account.reference, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.retrievedAccountTransactions = res.data.data.results;
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
            } else if($scope.transactionData.tx_type == 'transfer'){
                api = environmentConfig.API + '/admin/transactions/transfer/';
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
