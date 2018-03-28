(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('AddAccountCurrencyLimitCtrl', AddAccountCurrencyLimitCtrl);

    function AddAccountCurrencyLimitCtrl($scope,$uibModalInstance,currencyCode,reference,sharedResources,$window,
                                         toastr,$http,environmentConfig,cookieManagement,currencyModifiers,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        $scope.addingAccountCurrencyLimits = false;
        $scope.loadingSubtypes = false;
        $scope.accountCurrencyLimitsParams = {
            tx_type: 'Credit',
            type: 'Maximum',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];
        $scope.typeOptions = ['Maximum','Maximum per day','Maximum per month','Minimum','Overdraft'];

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
        $scope.getSubtypesArray($scope.accountCurrencyLimitsParams);

        $scope.addAccountCurrencyLimit = function(accountCurrencyLimitsParams){
            if(accountCurrencyLimitsParams.value){
                if(currencyModifiers.validateCurrency(accountCurrencyLimitsParams.value,$scope.currencyObj.divisibility)){
                    accountCurrencyLimitsParams.value = currencyModifiers.convertToCents(accountCurrencyLimitsParams.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                accountCurrencyLimitsParams.value = 0;
            }
            if(vm.token) {
                $scope.addingAccountCurrencyLimits = true;
                accountCurrencyLimitsParams.tx_type = accountCurrencyLimitsParams.tx_type.toLowerCase();
                accountCurrencyLimitsParams.type = accountCurrencyLimitsParams.type == 'Maximum' ? 'max': accountCurrencyLimitsParams.type == 'Maximum per day' ? 'day_max':
                    accountCurrencyLimitsParams.type == 'Maximum per month' ? 'month_max': accountCurrencyLimitsParams.type == 'Minimum' ? 'min': 'overdraft';

                $http.post(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/',accountCurrencyLimitsParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.addingAccountCurrencyLimits = false;
                    if (res.status === 201) {
                        toastr.success('Limit added successfully.');
                        $scope.accountCurrencyLimitsParams = {
                            tx_type: 'Credit',
                            type: 'Maximum',
                            subtype: ''
                        };
                        $scope.getSubtypesArray($scope.accountCurrencyLimitsParams);
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.accountCurrencyLimitsParams = {
                        tx_type: 'Credit',
                        type: 'Maximum',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.accountCurrencyLimitsParams);
                    $scope.addingAccountCurrencyLimits = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
