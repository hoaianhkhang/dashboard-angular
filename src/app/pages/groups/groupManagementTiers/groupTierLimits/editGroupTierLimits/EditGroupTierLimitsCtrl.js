(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierLimits')
        .controller('EditGroupTierLimitsCtrl', EditGroupTierLimitsCtrl);

    function EditGroupTierLimitsCtrl($scope,$uibModalInstance,tierLimit,selectedTier,toastr,$stateParams,sharedResources,
                                     Rehive,localStorageManagement,errorHandler,currencyModifiers,_) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.tierLimit = tierLimit;
        $scope.selectedTier = selectedTier;
        $scope.editingTierLimits = false;
        vm.groupName = $stateParams.groupName;
        $scope.editTierLimit = {};
        $scope.typeOptions = ['Maximum per transaction','Maximum per day','Maximum per month','Minimum','Overdraft'];
        $scope.loadingSubtypes = false;
        vm.updatedTierLimit = {};

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTierLimits = true;
                Rehive.admin.currencies.get({filters: {
                    archived: false,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    vm.getTierLimit();
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                res = res.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
                $scope.$apply();
            });
        };

        vm.getTierLimit = function () {
            $scope.editingTierLimits = true;
            Rehive.admin.groups.tiers.limits.get(vm.groupName,$scope.selectedTier.id, {id: $scope.tierLimit.id}).then(function (res) {
                $scope.editingTierLimits = false;
                res.currency = vm.returnCurrencyObj(res.currency);
                $scope.editTierLimit = res;
                $scope.editTierLimit.value = currencyModifiers.convertFromCents($scope.editTierLimit.value,$scope.editTierLimit.currency.divisibility);
                $scope.getSubtypesArray($scope.editTierLimit,'editing');
                $scope.$apply();
            }, function (error) {
                $scope.editingTierLimits = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
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
                vm.updatedTierLimit.type ? vm.updatedTierLimit.type = vm.updatedTierLimit.type == 'Maximum per transaction' ? 'max': vm.updatedTierLimit.type == 'Maximum per day' ? 'day_max':
                    vm.updatedTierLimit.type == 'Maximum per month' ? 'month_max': vm.updatedTierLimit.type == 'Minimum' ? 'min': 'overdraft' : '';

                Rehive.admin.groups.tiers.limits.update(vm.groupName,$scope.selectedTier.id, $scope.editTierLimit.id,vm.updatedTierLimit).then(function (res) {
                    $scope.editingTierLimits = false;
                    toastr.success('Limit updated successfully');
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingTierLimits = false;
                    vm.updatedTierLimit = {};
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
