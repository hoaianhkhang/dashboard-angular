(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('EditAccountCurrencyFeeCtrl', EditAccountCurrencyFeeCtrl);

    function EditAccountCurrencyFeeCtrl($scope,$uibModalInstance,currencyCode,reference,accountCurrencyFee,sharedResources,$window,
                                          toastr,$http,environmentConfig,localStorageManagement,currencyModifiers,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.currencyCode = currencyCode;
        vm.reference = reference;
        vm.accountCurrencyFee = accountCurrencyFee;
        $scope.editAccountCurrencyFee = {};
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        vm.updatedAccountCurrencyFee = {};
        $scope.editingAccountCurrencyFees = false;
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

        vm.getAccountCurrencyFee = function (accountCurrencyFee) {
            $scope.editingAccountCurrencyFees = true;
            $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/' + accountCurrencyFee.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingAccountCurrencyFees = false;
                if (res.status === 200) {
                    $scope.editAccountCurrencyFee = res.data.data;
                    $scope.editAccountCurrencyFee.value = currencyModifiers.convertFromCents($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility);
                    $scope.editAccountCurrencyFee.tx_type == 'credit' ? $scope.editAccountCurrencyFee.tx_type = 'Credit' : $scope.editAccountCurrencyFee.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editAccountCurrencyFee,'editing');
                }
            }).catch(function (error) {
                $scope.editingAccountCurrencyFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getAccountCurrencyFee(vm.accountCurrencyFee);

        $scope.accountCurrencyFeeChanged = function(field){
            vm.updatedAccountCurrencyFee[field] = $scope.editAccountCurrencyFee[field];
        };

        $scope.updateAccountCurrencyFee = function(){

            if(!$scope.editAccountCurrencyFee.subtype){
                vm.updatedAccountCurrencyFee.subtype = '';
            }

            if($scope.editAccountCurrencyFee.value){
                if(currencyModifiers.validateCurrency($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility)){
                    vm.updatedAccountCurrencyFee.value = currencyModifiers.convertToCents($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.currencyObj.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedAccountCurrencyFee.value = 0;
            }

            if(vm.updatedAccountCurrencyFee.percentage == ''){
                vm.updatedAccountCurrencyFee.percentage = 0;
            }

            if(vm.updatedAccountCurrencyFee.percentage > 100 || vm.updatedAccountCurrencyFee.percentage < 0){
                toastr.error('Please input percentage value between 0 to 100');
                return;
            }

            if(vm.token) {
                $scope.editingAccountCurrencyFees = true;
                vm.updatedAccountCurrencyFee.tx_type ? vm.updatedAccountCurrencyFee.tx_type = vm.updatedAccountCurrencyFee.tx_type.toLowerCase() : '';

                $http.patch(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/' + $scope.editAccountCurrencyFee.id +'/',vm.updatedAccountCurrencyFee,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingAccountCurrencyFees = false;
                    if (res.status === 200) {
                        toastr.success('Fee updated successfully');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingAccountCurrencyFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
