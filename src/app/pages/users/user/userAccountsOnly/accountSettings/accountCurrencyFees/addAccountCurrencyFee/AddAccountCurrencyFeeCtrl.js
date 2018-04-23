(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('AddAccountCurrencyFeeCtrl', AddAccountCurrencyFeeCtrl);

    function AddAccountCurrencyFeeCtrl($scope,$uibModalInstance,currencyCode,reference,sharedResources,$window,
                                         toastr,$http,environmentConfig,localStorageManagement,currencyModifiers,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
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
                res.data.data = res.data.data.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res.data.data,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
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
                $http.post(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/',accountCurrencyFeesParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingAccountCurrencyLimits = false;
                    if (res.status === 201) {
                        toastr.success('Fee added successfully');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.addingAccountCurrencyLimits = false;
                    $scope.accountCurrencyFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
