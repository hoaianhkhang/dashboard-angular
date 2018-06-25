(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('EditGroupTierFeeModalCtrl', EditGroupTierFeeModalCtrl);

    function EditGroupTierFeeModalCtrl($scope,$uibModalInstance,tierFee,currencyModifiers,selectedTier,toastr,_,
                                       Rehive,localStorageManagement,errorHandler,$stateParams,sharedResources) {

        var vm = this;
        $scope.selectedTier = selectedTier;
        $scope.tierFee = tierFee;
        vm.groupName = $stateParams.groupName;
        vm.token = localStorageManagement.getValue('token');
        $scope.editingTierFees = false;
        $scope.loadingSubtypes = false;
        $scope.editTierFee = {};
        $scope.txTypeOptions = ['Credit','Debit'];
        vm.updatedTierFee = {};

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTierFees = true;
                Rehive.admin.currencies.get({filters: {
                    enabled: true,
                    page_size: 250
                }}).then(function (res) {
                    $scope.currenciesOptions = res.results;
                    vm.getTierFee();
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
            return $scope.currenciesList.find(function (element) {
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

        vm.getTierFee = function () {
            $scope.editingTierFees = true;
            Rehive.admin.groups.tiers.fees.get(vm.groupName,$scope.selectedTier.id, {id: $scope.tierFee.id}).then(function (res) {
                $scope.editingTierFees = false;
                res.currency = vm.returnCurrencyObj(res.currency);
                $scope.editTierFee = res;
                $scope.editTierFee.value = currencyModifiers.convertFromCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
                $scope.editTierFee.tx_type == 'credit' ? $scope.editTierFee.tx_type = 'Credit' : $scope.editTierFee.tx_type = 'Debit';
                $scope.getSubtypesArray($scope.editTierFee,'editing');
                $scope.$apply();
            }, function (error) {
                $scope.editingTierFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.tierFeeChanged = function(field){
            vm.updatedTierFee[field] = $scope.editTierFee[field];
        };

        $scope.updateTierFee = function(){

            if(!$scope.editTierFee.subtype){
                vm.updatedTierFee.subtype = null;
            }

            if(vm.updatedTierFee.currency){
                vm.updatedTierFee.currency = vm.updatedTierFee.currency.code;
            }

            if($scope.editTierFee.value){
                if(currencyModifiers.validateCurrency($scope.editTierFee.value,$scope.editTierFee.currency.divisibility)){
                    vm.updatedTierFee.value = currencyModifiers.convertToCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
                    vm.updatedTierFee.currency = $scope.editTierFee.currency.code;
                } else {
                    toastr.error('Please input amount to ' + $scope.editTierFee.currency.divisibility + ' decimal places');
                    return;
                }
            } else {
                vm.updatedTierFee.value = 0;
            }

            if($scope.editTierFee.percentage == ""){
                vm.updatedTierFee.percentage = 0;
            }

            if(vm.token) {
                $scope.editingTierFees = true;
                vm.updatedTierFee.tx_type ? vm.updatedTierFee.tx_type = vm.updatedTierFee.tx_type.toLowerCase() : '';

                Rehive.admin.groups.tiers.fees.update(vm.groupName,$scope.selectedTier.id, $scope.editTierFee.id,vm.updatedTierFee).then(function (res) {
                    $scope.editingTierFees = false;
                    toastr.success('Fee updated successfully');
                    vm.updatedTierFee = {};
                    $uibModalInstance.close($scope.selectedTier.level);
                    $scope.$apply();
                }, function (error) {
                    $scope.editingTierFees = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
