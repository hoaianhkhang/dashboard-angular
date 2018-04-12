(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierLimits')
        .controller('EditGroupTierLimitsCtrl', EditGroupTierLimitsCtrl);

    function EditGroupTierLimitsCtrl($scope,$uibModalInstance,tierLimit,selectedTier,toastr,$stateParams,sharedResources,
                                     $http,environmentConfig,cookieManagement,errorHandler,currencyModifiers,_) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.tierLimit = tierLimit;
        $scope.selectedTier = selectedTier;
        $scope.editingTierLimits = false;
        vm.groupName = $stateParams.groupName;
        $scope.editTierLimit = {};
        $scope.txTypeOptions = ['Credit','Debit'];
        $scope.typeOptions = ['Maximum','Maximum per day','Maximum per month','Minimum','Overdraft'];
        $scope.loadingSubtypes = false;
        vm.updatedTierLimit = {};

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTierLimits = true;
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true&page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currenciesOptions = res.data.data.results;
                        vm.getTierLimit();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getCompanyCurrencies();

        vm.returnCurrencyObj = function (currencyCode) {
            return $scope.currenciesOptions.find(function (element) {
                return (element.code == currencyCode);
            });
        };

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

        vm.getTierLimit = function () {
            $scope.editingTierLimits = true;
            $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/limits/' + $scope.tierLimit.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingTierLimits = false;
                if (res.status === 200) {
                    res.data.data.currency = vm.returnCurrencyObj(res.data.data.currency);
                    $scope.editTierLimit = res.data.data;
                    $scope.editTierLimit.value = currencyModifiers.convertFromCents($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility);
                    $scope.editTierLimit.tx_type == 'credit' ? $scope.editTierLimit.tx_type = 'Credit' : $scope.editTierLimit.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editTierLimit,'editing');
                }
            }).catch(function (error) {
                $scope.editingTierLimits = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };


        $scope.tierLimitChanged = function(field){
            vm.updatedTierLimit[field] = $scope.editTierLimit[field];
        };

        $scope.updateTierLimit = function(){

            if(!$scope.editTierLimit.subtype){
                vm.updatedTierLimit.subtype = '';
            }

            if(vm.updatedTierLimit.currency){
                vm.updatedTierLimit.currency = vm.updatedTierLimit.currency.code;
            }

            if($scope.editTierLimit.value){
                if(currencyModifiers.validateCurrency($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility)){
                    vm.updatedTierLimit.value = currencyModifiers.convertToCents($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility);
                } else {
                    toastr.error('Please input amount to ' + $scope.editTierLimit.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedTierLimit.value = 0;
            }

            if(vm.token) {
                $scope.editingTierLimits = true;
                vm.updatedTierLimit.tx_type ? vm.updatedTierLimit.tx_type = vm.updatedTierLimit.tx_type.toLowerCase() : '';
                vm.updatedTierLimit.type ? vm.updatedTierLimit.type = vm.updatedTierLimit.type == 'Maximum' ? 'max': vm.updatedTierLimit.type == 'Maximum per day' ? 'day_max':
                    vm.updatedTierLimit.type == 'Maximum per month' ? 'month_max': vm.updatedTierLimit.type == 'Minimum' ? 'min': 'overdraft' : '';

                $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/limits/' + $scope.editTierLimit.id + '/',vm.updatedTierLimit,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingTierLimits = false;
                    if (res.status === 200) {
                        toastr.success('Limit updated successfully');
                        $uibModalInstance.close($scope.selectedTier.level);

                    }
                }).catch(function (error) {
                    $scope.editingTierLimits = false;
                    vm.updatedTierLimit = {};
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };


    }
})();
