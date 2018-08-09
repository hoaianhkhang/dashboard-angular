(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('AddAccountCurrencyFeeCtrl', AddAccountCurrencyFeeCtrl);

    function AddAccountCurrencyFeeCtrl($scope,$uibModalInstance,currencyCode,reference,sharedResources,$window,
                                       Rehive,_,toastr,localStorageManagement,currencyModifiers,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.currencyCode = currencyCode;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        vm.reference = reference;
        $scope.loadingSubtypes = false;
        $scope.currencyObj = {};
        $scope.accountCurrencyFeesParams = {
            tx_type: 'Credit',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];

        vm.getCurrencyObjFromCurrenciesList = function(){
            $scope.currencyObj = vm.currenciesList.find(function(element){
                return element.code == vm.currencyCode;
            });
        };
        vm.getCurrencyObjFromCurrenciesList();

        $scope.getSubtypesArray = function(params,editing){
            $scope.loadingSubtypes = true;
            if(!editing){
                params.subtype = '';
            } else if(!params.subtype && editing){
                params.subtype = '';
            }
            sharedResources.getSubtypes().then(function (res) {
                res = res.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
                $scope.$apply();
            });
        };
        $scope.getSubtypesArray($scope.accountCurrencyFeesParams);

        $scope.addAccountCurrencyFee = function(accountCurrencyFeesParams){
            if(accountCurrencyFeesParams.value) {
                if (currencyModifiers.validateCurrency(accountCurrencyFeesParams.value, $scope.currencyObj.divisibility)) {
                    accountCurrencyFeesParams.value = currencyModifiers.convertToCents(accountCurrencyFeesParams.value, $scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            }

            if(!accountCurrencyFeesParams.percentage){
                accountCurrencyFeesParams.percentage = 0;
            }

            if(accountCurrencyFeesParams.percentage > 100 || accountCurrencyFeesParams.percentage < 0){
                toastr.error('Please input percentage value between 0 to 100');
                return;
            }

            if(vm.token) {
                $scope.addingAccountCurrencyLimits = true;
                accountCurrencyFeesParams.tx_type = accountCurrencyFeesParams.tx_type.toLowerCase();
                Rehive.admin.accounts.currencies.fees.create(vm.reference,vm.currencyCode,accountCurrencyFeesParams).then(function (res) {
                    $scope.addingAccountCurrencyLimits = false;
                    toastr.success('Fee added successfully');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingAccountCurrencyLimits = false;
                    $scope.accountCurrencyFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
