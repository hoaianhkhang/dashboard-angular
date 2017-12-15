(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.credit')
        .controller('CreditCtrl', CreditCtrl);

    /** @ngInject */
    function CreditCtrl($scope,$http,environmentConfig,cookieManagement,toastr,_,
                        errorHandler,sharedResources,$location,$state,currencyModifiers,typeaheadService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.creditData = {
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

        sharedResources.getSubtypes().then(function (res) {
            res.data.data = res.data.data.filter(function (element) {
                return element.tx_type == 'credit';
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
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        if($state.params.email){
          $scope.creditData.user = $state.params.email;
        }

        if ($state.params.account) {
            $scope.creditData.account = $state.params.account;
        }

        $scope.onGoingTransaction = false;
        $scope.showAdvancedOption = false;
        $scope.showView = 'createCredit';

        if($location.path() === '/transactions/credit/pending'){
            $scope.showView = 'pendingCredit';
        }

        $scope.goToView = function(view){
            if($scope.creditData.amount){
                var validAmount = currencyModifiers.validateCurrency($scope.creditData.amount,$scope.creditData.currency.divisibility);
                if(validAmount){
                    $scope.showView = view;
                } else {
                    toastr.error('Please input amount to ' + $scope.creditData.currency.divisibility + ' decimal places');
                }
            } else{
                $scope.showView = view;
            }
        };

        $scope.displayAdvancedOption = function () {
            $scope.showAdvancedOption = true;
        };

        $scope.toggleCreditView = function(view) {
            $scope.showAdvancedOption = false;
            $scope.creditData = {
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

            if(view == 'credit'){
                $location.path('/transactions/credit');
                $scope.goToView('createCredit');
            } else{
                $scope.goToView('pendingCredit');
                $location.path('/transactions/credit/pending');
            }
        };

        $scope.createCreditTransaction = function () {

            var sendTransactionData = {
                user: $scope.creditData.user,
                amount: currencyModifiers.convertToCents($scope.creditData.amount,$scope.creditData.currency.divisibility),
                reference: $scope.creditData.reference,
                status: $scope.creditData.status,
                metadata: $scope.creditData.metadata,
                currency: $scope.creditData.currency.code,
                subtype: $scope.creditData.subtype,
                note: $scope.creditData.note,
                account: $scope.creditData.account
            };

            $scope.onGoingTransaction = true;
            // $http.post takes the params as follow post(url, data, {config})
            // https://docs.angularjs.org/api/ng/service/$http#post
            $http.post(environmentConfig.API + '/admin/transactions/credit/', sendTransactionData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.onGoingTransaction = false;
                if (res.status === 201) {
                    toastr.success('You have successfully credited your account');
                    $scope.goToView('completeCredit');
                }
            }).catch(function (error) {
                $scope.onGoingTransaction = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        }

    }
})();
