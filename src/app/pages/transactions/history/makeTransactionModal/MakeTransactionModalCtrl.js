(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('MakeTransactionModalCtrl', MakeTransactionModalCtrl);

    function MakeTransactionModalCtrl($uibModalInstance,$http,$scope,errorHandler,toastr,environmentConfig,
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
            account: ""
        };
        $scope.showAdvancedOption = false;
        $scope.retrievedUserObj = {};
        $scope.retrievedUserAccountsArray = [];
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

        sharedResources.getSubtypes().then(function (res) {
            res.data.data = res.data.data.filter(function (element) {
                return element.tx_type == 'credit';
            });
            $scope.subtypeOptions = _.pluck(res.data.data,'name');
            $scope.subtypeOptions.unshift('');
        });

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
            if($scope.retrievedUserObj.identifier && $scope.transactionData.currency && $scope.transactionData.currency.code){
                $http.get(environmentConfig.API + '/admin/accounts/?user='+ $scope.retrievedUserObj.identifier + '&currency=' + $scope.transactionData.currency.code, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.retrievedUserAccountsArray = res.data.data.results;
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.createTransaction = function () {

            var api;

            var sendTransactionData = {
                user: $scope.transactionData.user,
                amount: currencyModifiers.convertToCents($scope.transactionData.amount,$scope.transactionData.currency.divisibility),
                reference: $scope.transactionData.reference,
                status: $scope.transactionData.status,
                metadata: $scope.transactionData.metadata ? JSON.parse($scope.transactionData.metadata) : {},
                currency: $scope.transactionData.currency.code,
                subtype: $scope.transactionData.subtype,
                note: $scope.transactionData.note,
                account: $scope.transactionData.account
            };

            if($scope.transactionData.tx_type == 'credit'){
                api = environmentConfig.API + '/admin/transactions/credit/';
            } else if($scope.transactionData.tx_type == 'debit'){
                api = environmentConfig.API + '/admin/transactions/debit/';
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
                    toastr.success('You have successfully credited your account');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
