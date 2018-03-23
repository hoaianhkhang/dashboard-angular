(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyLimits')
        .controller('EditAccountCurrencyLimitCtrl', EditAccountCurrencyLimitCtrl);

    function EditAccountCurrencyLimitCtrl($scope,$uibModalInstance,currencyCode,reference,accountCurrencyLimit,sharedResources,$window,
                                         toastr,$http,environmentConfig,cookieManagement,currencyModifiers,errorHandler) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        $scope.editingAccountCurrencyLimits = false;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        vm.updatedAccountCurrencyLimit = {};
        vm.accountCurrencyLimit = accountCurrencyLimit;
        $scope.editAccountCurrencyLimit = {};
        $scope.loadingSubtypes = false;
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

        vm.getAccountCurrencyLimit = function (accountCurrencyLimit) {
            $scope.editingAccountCurrencyLimits = true;
            $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/' + accountCurrencyLimit.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingAccountCurrencyLimits = false;
                if (res.status === 200) {
                    $scope.editAccountCurrencyLimit = res.data.data;
                    $scope.editAccountCurrencyLimit.value = currencyModifiers.convertFromCents($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility);
                    $scope.editAccountCurrencyLimit.tx_type == 'credit' ? $scope.editAccountCurrencyLimit.tx_type = 'Credit' : $scope.editAccountCurrencyLimit.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editAccountCurrencyLimit,'editing');
                }
            }).catch(function (error) {
                $scope.editingAccountCurrencyLimits = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getAccountCurrencyLimit(vm.accountCurrencyLimit);

        $scope.accountCurrencyLimitChanged = function(field){
            vm.updatedAccountCurrencyLimit[field] = $scope.editAccountCurrencyLimit[field];
        };

        $scope.updateAccountCurrencyLimit = function(){

            if(!$scope.editAccountCurrencyLimit.subtype){
                vm.updatedAccountCurrencyLimit.subtype = '';
            }

            if($scope.editAccountCurrencyLimit.value){
                if(currencyModifiers.validateCurrency($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility)){
                    vm.updatedAccountCurrencyLimit.value = currencyModifiers.convertToCents($scope.editAccountCurrencyLimit.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedAccountCurrencyLimit.value = 0;
            }

            if(vm.token) {
                $scope.editingAccountCurrencyLimits = true;
                vm.updatedAccountCurrencyLimit.tx_type ? vm.updatedAccountCurrencyLimit.tx_type = vm.updatedAccountCurrencyLimit.tx_type.toLowerCase() : '';
                vm.updatedAccountCurrencyLimit.type ? vm.updatedAccountCurrencyLimit.type = vm.updatedAccountCurrencyLimit.type == 'Maximum' ? 'max': vm.updatedAccountCurrencyLimit.type == 'Maximum per day' ? 'day_max':
                    vm.updatedAccountCurrencyLimit.type == 'Maximum per month' ? 'month_max': vm.updatedAccountCurrencyLimit.type == 'Minimum' ? 'min': 'overdraft' : '';

                $http.patch(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/limits/' + $scope.editAccountCurrencyLimit.id +'/',vm.updatedAccountCurrencyLimit,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingAccountCurrencyLimits = false;
                    if (res.status === 200) {
                        toastr.success('Limit updated successfully');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingAccountCurrencyLimits = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
