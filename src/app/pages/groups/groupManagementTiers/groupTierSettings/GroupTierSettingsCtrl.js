(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.groupTierSettings')
        .controller('GroupTierSettingsCtrl', GroupTierSettingsCtrl);

    /** @ngInject */
    function GroupTierSettingsCtrl($scope,$stateParams,Rehive,_,localStorageManagement,errorHandler,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = ($stateParams.groupName == 'extension') ? 'service' : $stateParams.groupName;
        $scope.activeTabIndex = 0;
        $scope.tierLevelsForSettings = [];
        $scope.tierSettingsObj = {};
        $scope.loadingTierSettings = true;

        $scope.getAllTiers = function(tierLevel){
            if(vm.token) {
                $scope.loadingTierSettings = true;
                Rehive.admin.groups.tiers.get(vm.groupName).then(function (res) {
                    $scope.loadingTierSettings = false;
                    vm.unsortedTierLevelsArray = _.pluck(res ,'level');
                    vm.sortedTierLevelsArray = vm.unsortedTierLevelsArray.sort(function(a, b) {
                        return a - b;
                    });
                    $scope.tierLevelsForSettings = vm.sortedTierLevelsArray;
                    $scope.allTiers = res.sort(function(a, b) {
                        return parseFloat(a.level) - parseFloat(b.level);
                    });
                    if(tierLevel){
                        $scope.selectTier(tierLevel);
                    } else {
                        $timeout(function(){
                            $scope.activeTabIndex = 0;
                        });
                        $scope.selectTier($scope.tierLevelsForSettings[0]);
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                vm.getTierSettings();
            }
        };

        vm.getTierSettings = function () {
            if(vm.token) {
                $scope.loadingTierSettings = true;
                Rehive.admin.groups.tiers.settings.get(vm.groupName,$scope.selectedTier.id).then(function (res) {
                    $scope.loadingTierSettings = false;
                    $scope.tierSettingsObj = res;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingTierSettings = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.toggleTierSettings = function (tierSetting,type) {

            var updatedSetting = {};
            updatedSetting[type] = !tierSetting;

            if(vm.token) {
                Rehive.admin.groups.tiers.settings.update(vm.groupName,$scope.selectedTier.id,updatedSetting).then(function (res) {
                    $scope.tierSettingsObj = {};
                    $scope.tierSettingsObj = res;
                    $scope.$apply();
                }, function (error) {
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
