(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('AddGroupTierModalCtrl', AddGroupTierModalCtrl);

    function AddGroupTierModalCtrl($scope,$stateParams,$uibModalInstance,Rehive,
                                   toastr,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.addingTiers = false;
        $scope.tierLevels = [1,2,3,4,5,6,7];
        $scope.newTier = {level: 1};

        $scope.addGroupTier = function(){
            if(vm.token) {
                $scope.addingTiers = true;
                $scope.newTier.name = $scope.newTier.level.toString();
                Rehive.admin.groups.tiers.create(vm.groupName,$scope.newTier).then(function (res) {
                    $scope.addingTiers = false;
                    $scope.newTier = {currency: $scope.currencyCode,level: 1};
                    toastr.success('You have successfully added a tier');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };


    }
})();
