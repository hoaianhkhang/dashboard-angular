(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierFees')
        .controller('GroupTierFeesCtrl', GroupTierFeesCtrl);

    /** @ngInject */
    function GroupTierFeesCtrl($scope,$stateParams,cookieManagement,$http,environmentConfig,_,$window,
                          sharedResources,$timeout,errorHandler,toastr,$uibModal,currencyModifiers) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.currenciesList = JSON.parse($window.sessionStorage.currenciesList || '[]');
        $scope.activeTabIndex = 0;
        $scope.loadingTierFees = true;
        $scope.loadingSubtypes = false;
        vm.updatedTierFee = {};
        $scope.tierFeesParams = {
            tx_type: 'Credit',
            subtype: ''
        };
        $scope.txTypeOptions = ['Credit','Debit'];

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
        $scope.getSubtypesArray($scope.tierFeesParams);

        vm.getTierFee = function (tierFee) {
            $scope.loadingTierFees = true;
            $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/' + tierFee.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingTierFees = false;
                if (res.status === 200) {
                    res.data.data.currency = vm.returnCurrencyObj(res.data.data.currency);
                    $scope.editTierFee = res.data.data;
                    $scope.editTierFee.value = currencyModifiers.convertFromCents($scope.editTierFee.value,$scope.editTierFee.currency.divisibility);
                    $scope.editTierFee.tx_type == 'credit' ? $scope.editTierFee.tx_type = 'Credit' : $scope.editTierFee.tx_type = 'Debit';
                    $scope.getSubtypesArray($scope.editTierFee,'editing');
                }
            }).catch(function (error) {
                $scope.loadingTierFees = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierFees = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        vm.unsortedTierLevelsArray = _.pluck(res.data.data ,'level');
                        vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                            return a - b;
                        });
                        $scope.tierLevelsForFees = vm.sortedTierLevelsArray;
                        $scope.allTiers = res.data.data.sort(function(a, b) {
                            return parseFloat(a.level) - parseFloat(b.level);
                        });
                        if(tierLevel){
                            $scope.selectTier(tierLevel);
                        } else {
                            $timeout(function(){
                                $scope.activeTabIndex = 0;
                            });
                            $scope.selectTier($scope.tierLevelsForFees[0]);
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getAllTiers();

        vm.findIndexOfTier = function(element){
            return this == element.level;
        };

        $scope.selectTier = function(tierLevel){
            var index = $scope.allTiers.findIndex(vm.findIndexOfTier,tierLevel);
            $scope.selectedTier = $scope.allTiers[index];
            if($scope.selectedTier){
                $scope.getTierFees();
            }
        };

        $scope.getTierFees = function(){
            if(vm.token) {
                $scope.loadingTierFees = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/',{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        res.data.data.forEach(function (element) {
                            element.currency = vm.returnCurrencyObj(element.currency);
                        });

                        $scope.tiersFeesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingTierFees = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
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
                $scope.loadingTierFees = true;
                vm.updatedTierFee.tx_type ? vm.updatedTierFee.tx_type = vm.updatedTierFee.tx_type.toLowerCase() : '';

                $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/' + $scope.editTierFee.id + '/',vm.updatedTierFee,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingTierFees = false;
                    if (res.status === 200) {
                        toastr.success('Fee updated successfully');
                        $scope.tierFeesParams = {
                            tx_type: 'Credit',
                            subtype: ''
                        };
                        vm.updatedTierFee = {};
                        $scope.getAllTiers($scope.selectedTier.level);
                    }
                }).catch(function (error) {
                    $scope.tierFeesParams = {
                        tx_type: 'Credit',
                        subtype: ''
                    };
                    vm.updatedTierFee = {};
                    $scope.getAllTiers($scope.selectedTier.level);
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.findIndexOfTierFee = function(element){
            return this.id == element.id;
        };

        $scope.openTierFeesModal = function (page, size,tierFee) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'TierFeesModalCtrl',
                scope: $scope,
                resolve: {
                    tierFee: function () {
                        return tierFee;
                    },
                    selectedTier: function () {
                        return $scope.selectedTier;
                    }
                }
            });

            vm.theModal.result.then(function(tierFee){
                var index = $scope.tiersFeesList.findIndex(vm.findIndexOfTierFee,tierFee);
                $scope.tiersFeesList.splice(index, 1);
            }, function(){
            });
        };

        // $scope.deleteTierFee = function () {
        //     $scope.deletingTierFees = true;
        //     $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/fees/' + $scope.tierFee.id + '/', {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': vm.token
        //         }
        //     }).then(function (res) {
        //         $scope.deletingTierFees = false;
        //         if (res.status === 200) {
        //             toastr.success('Tier fee successfully deleted');
        //             $scope.getAllTiers($scope.selectedTier.level);
        //         }
        //     }).catch(function (error) {
        //         $scope.deletingTierFees = false;
        //         errorHandler.evaluateErrors(error.data);
        //         errorHandler.handleErrors(error);
        //     });
        // };

    }
})();
