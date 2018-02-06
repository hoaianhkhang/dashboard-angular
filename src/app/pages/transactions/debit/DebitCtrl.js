(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.debit')
        .controller('DebitCtrl', DebitCtrl);

    /** @ngInject */
    function DebitCtrl($scope, $http, environmentConfig,_,
                       cookieManagement, toastr, errorHandler,
                       $location, $state,sharedResources,currencyModifiers,typeaheadService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.debitData = {
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

        $scope.transactionStatus = ['Complete','Pending','Failed','Deleted'];
        $scope.onGoingTransaction = false;
        $scope.showAdvancedOption = false;
        $scope.showView = 'createDebit';
        sharedResources.getSubtypes().then(function (res) {
            res.data.data = res.data.data.filter(function (element) {
                return element.tx_type == 'debit';
            });
            $scope.subtypeOptions = _.pluck(res.data.data,'name');
            $scope.subtypeOptions.unshift('');
        });

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currencyOptions = res.data.data.results;
                        if ($state.params.currencyCode) {
                            $scope.debitData.currency = $scope.currencyOptions.find(function (element) {
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

        if ($location.path() === '/transactions/debit/pending') {
            $scope.showView = 'pendingDebit';
        }

        if ($state.params.email) {
            $scope.debitData.user = $state.params.email;
        }

        if ($state.params.account) {
            $scope.debitData.account = $state.params.account;
        }

        $scope.goToView = function (view) {
            if ($scope.debitData.amount) {
                var validAmount = currencyModifiers.validateCurrency($scope.debitData.amount, $scope.debitData.currency.divisibility);
                if (validAmount) {
                    $scope.showView = view;
                } else {
                    toastr.error('Please input amount to ' + $scope.debitData.currency.divisibility + ' decimal places');
                }
            } else {
                $scope.showView = view;
            }
        };

        $scope.displayAdvancedOption = function () {
            $scope.showAdvancedOption = true;
        };

        $scope.toggleDebitView = function (view) {
            $scope.showAdvancedOption = false;
            $scope.debitData = {
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

            if (view == 'debit') {
                $scope.goToView('createDebit');
                $location.path('/transactions/debit');
            } else {
                $scope.goToView('pendingDebit');
                $location.path('/transactions/debit/pending');
            }
        };

        $scope.createDebitTransaction = function () {

            var sendTransactionData = {
                user: $scope.debitData.user,
                amount: currencyModifiers.convertToCents($scope.debitData.amount, $scope.debitData.currency.divisibility),
                reference: $scope.debitData.reference,
                status: $scope.debitData.status,
                metadata: $scope.debitData.metadata ? JSON.parse($scope.debitData.metadata) : {},
                currency: $scope.debitData.currency.code,
                subtype: $scope.debitData.subtype,
                note: $scope.debitData.note,
                account: $scope.debitData.account
            };

            $scope.onGoingTransaction = true;
            $http.post(environmentConfig.API + '/admin/transactions/debit/', sendTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.onGoingTransaction = false;
                if (res.status === 201) {
                    toastr.success('You have successfully debited the account');
                    $scope.goToView('completeDebit');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

    }
})();
