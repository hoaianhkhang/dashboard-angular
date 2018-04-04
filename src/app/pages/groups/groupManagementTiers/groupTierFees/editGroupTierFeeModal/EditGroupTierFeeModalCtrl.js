(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('EditGroupTierFeeModalCtrl', EditGroupTierFeeModalCtrl);

    function EditGroupTierFeeModalCtrl($scope,$uibModalInstance,tierFee,currencyModifiers,selectedTier,toastr,$http,_,
                                      environmentConfig,cookieManagement,errorHandler,$stateParams,sharedResources) {

        var vm = this;
        $scope.selectedTier = selectedTier;
        $scope.tierFee = tierFee;
        vm.groupName = $stateParams.groupName;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.editingTierFees = false;
        $scope.loadingSubtypes = false;
        $scope.editTierFee = {};
        $scope.txTypeOptions = ['Credit','Debit'];
        vm.updatedTierFee = {};

        vm.getCompanyCurrencies = function(){
            if(vm.token){
                $scope.editingTierFees = true;
                $http.get(environmentConfig.API + '/admin/currencies/?enabled=true', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.currenciesOptions = res.data.data.results;
                        vm.getTierFee();
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
                res.data.data = res.data.data.filter(function (element) {
                    return element.tx_type == (params.tx_type).toLowerCase();
                });
                $scope.subtypeOptions = _.pluck(res.data.data,'name');
                $scope.subtypeOptions.unshift('');
                $scope.loadingSubtypes = false;
            });
        };

        vm.getTierFee = function () {
            $scope.editingTierFees = true;
            $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/' + $scope.tierFee.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingTierFees = false;
                if (res.status === 200) {
                    res.data.data.currency = vm.returnCurrencyObj(res.data.data.currency);
                    $scope.editTierFee = res.data.data;
                    $scope.editTierFee.value = currencyModifiers.convertFromCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
                    $scope.editTierFee.tx_type == 'credit' ? $scope.editTierFee.tx_type = 'Credit' : $scope.editTierFee.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editTierFee,'editing');
                }
            }).catch(function (error) {
                $scope.editingTierFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.tierFeeChanged = function(field){
            vm.updatedTierFee[field] = $scope.editTierFee[field];
        };

        $scope.updateTierFee = function(){

            if(!$scope.editTierFee.subtype){
                vm.updatedTierFee.subtype = '';
            }

            if(vm.updatedTierFee.currency){
                vm.updatedTierFee.currency = vm.updatedTierFee.currency.code;
            }

            if($scope.editTierFee.value){
                if(currencyModifiers.validateCurrency($scope.editTierFee.value,$scope.editTierFee.currency.divisibility)){
                    vm.updatedTierFee.value = currencyModifiers.convertToCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
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

                $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/' + $scope.editTierFee.id + '/',vm.updatedTierFee,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.editingTierFees = false;
                    if (res.status === 200) {
                        toastr.success('Fee updated successfully');
                        vm.updatedTierFee = {};
                        $uibModalInstance.close($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.editingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
