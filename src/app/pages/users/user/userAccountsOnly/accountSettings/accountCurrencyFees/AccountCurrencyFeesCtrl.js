(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accountSettings.accountCurrencyFees')
        .controller('AccountCurrencyFeesCtrl', AccountCurrencyFeesCtrl);

    /** @ngInject */
    function AccountCurrencyFeesCtrl($scope,$window,$stateParams,$http,$uibModal,environmentConfig,_,$rootScope,
                                     sharedResources,cookieManagement,errorHandler,currencyModifiers,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        vm.currencyCode = $stateParams.currencyCode;
        vm.currenciesList = JSON.parse($window.sessionStorage.currenciesList);
        vm.reference = $stateParams.reference;
        $scope.userData = JSON.parse($window.sessionStorage.userData);
        $scope.loadingAccountCurrencyFees = true;
        $scope.loadingSubtypes = false;
        $scope.editingAccountCurrencyFees = false;
        vm.updatedAccountCurrencyFee = {};
        $scope.accountCurrencyFeesParams = {
            tx_type: 'Credit',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];

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

        vm.getCurrencyObjFromCurrenciesList = function(){
            $scope.currencyObj = vm.currenciesList.find(function(element){
                return element.code == vm.currencyCode;
            });
        };
        vm.getCurrencyObjFromCurrenciesList();

        $scope.toggleAccountCurrencyFeeEditView = function(accountCurrencyFee){
            if(accountCurrencyFee) {
                vm.getAccountCurrencyFee(accountCurrencyFee);
            } else {
                $scope.editAccountCurrencyFee = {};
                $scope.getAccountCurrencyFees();
            }
            $scope.editingAccountCurrencyFees = !$scope.editingAccountCurrencyFees;
        };

        vm.getAccountCurrencyFee = function (accountCurrencyFee) {
            $scope.loadingAccountCurrencyFees = true;
            $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/' + accountCurrencyFee.id +'/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingAccountCurrencyFees = false;
                if (res.status === 200) {
                    $scope.editAccountCurrencyFee = res.data.data;
                    $scope.editAccountCurrencyFee.value = currencyModifiers.convertFromCents($scope.editAccountCurrencyFee.value,$scope.currencyObj.divisibility);
                    $scope.editAccountCurrencyFee.tx_type == 'credit' ? $scope.editAccountCurrencyFee.tx_type = 'Credit' : $scope.editAccountCurrencyFee.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editAccountCurrencyFee,'editing');
                }
            }).catch(function (error) {
                $scope.loadingAccountCurrencyFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.getAccountCurrencyFees = function(){
            if(vm.token) {
                $scope.loadingAccountCurrencyFees = true;
                $http.get(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyFees = false;
                    if (res.status === 200) {
                        $scope.accountCurrencyFeesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingAccountCurrencyFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAccountCurrencyFees();

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
            if(vm.token) {
                $scope.loadingAccountCurrencyFees = true;
                accountCurrencyFeesParams.tx_type = accountCurrencyFeesParams.tx_type.toLowerCase();
                $http.post(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/',accountCurrencyFeesParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyFees = false;
                    if (res.status === 201) {
                        toastr.success('Fee added successfully');
                        $scope.accountCurrencyFeesParams = {
                            tx_type: 'Credit',
                            subtype: ''
                        };
                        $scope.getSubtypesArray($scope.accountCurrencyFeesParams);
                        $scope.getAccountCurrencyFees();
                    }
                }).catch(function (error) {
                    $scope.accountCurrencyFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    $scope.getSubtypesArray($scope.accountCurrencyFeesParams);
                    $scope.loadingAccountCurrencyFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

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

            if(!vm.updatedAccountCurrencyFee.percentage){
                vm.updatedAccountCurrencyFee.percentage = 0;
            }

            if(vm.token) {
                $scope.loadingAccountCurrencyFees = true;
                $scope.editingAccountCurrencyFees = !$scope.editingAccountCurrencyFees;
                vm.updatedAccountCurrencyFee.tx_type ? vm.updatedAccountCurrencyFee.tx_type = vm.updatedAccountCurrencyFee.tx_type.toLowerCase() : '';

                $http.patch(environmentConfig.API + '/admin/accounts/' + vm.reference + '/currencies/' + vm.currencyCode + '/fees/' + $scope.editAccountCurrencyFee.id +'/',vm.updatedAccountCurrencyFee,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingAccountCurrencyFees = false;
                    if (res.status === 200) {
                        toastr.success('Fee updated successfully');
                        $scope.accountCurrencyFeesParams = {
                            tx_type: 'Credit',
                            subtype: ''
                        };
                        vm.updatedAccountCurrencyFee = {};
                        $scope.getAccountCurrencyFees();
                    }
                }).catch(function (error) {
                    $scope.accountCurrencyFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    vm.updatedAccountCurrencyFee = {};
                    $scope.getAccountCurrencyFees();
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findIndexOfAccountCurrencyFee = function(element){
            return this.id == element.id;
        };

        $scope.openAccountCurrencyFeesModal = function (page, size,accountCurrencyFee) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AccountCurrencyFeesModalCtrl',
                scope: $scope,
                resolve: {
                    accountCurrencyFee: function () {
                        return accountCurrencyFee;
                    },
                    currencyCode: function () {
                        return vm.currencyCode
                    },
                    reference: function () {
                        return vm.reference
                    }
                }
            });

            vm.theModal.result.then(function(accountCurrencyFee){
                var index = $scope.accountCurrencyFeesList.findIndex(vm.findIndexOfAccountCurrencyFee,accountCurrencyFee);
                $scope.accountCurrencyFeesList.splice(index, 1);
            }, function(){
            });
        };


    }
})();