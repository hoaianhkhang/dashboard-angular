(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupManagementTiers.list')
        .controller('DeleteGroupTierModalCtrl', DeleteGroupTierModalCtrl);

    function DeleteGroupTierModalCtrl($scope,$stateParams,$uibModalInstance,Rehive,$ngConfirm,
                                      toastr,tier,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        $scope.tier = tier;
        $scope.deletingTiers = false;

        $scope.archiveTier = function(tier){
            if(vm.token) {
                $scope.deletingTiers = true;
                Rehive.admin.groups.tiers.update(vm.groupName,tier.id, { archived: true }).then(function (res) {
                    toastr.success('You have successfully archived the tier');
                    $uibModalInstance.close(true);
                    $scope.$apply();
                }, function (error) {
                    $scope.deletingTiers = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteGroupTierConfirm = function (tier) {
            if(!$scope.tier.archived){
                toastr.error('Cannot delete an unarchived object');
                return;
            }

            $ngConfirm({
                title: 'Delete tier',
                contentUrl: 'app/pages/groups/groupManagementTiers/groupTiers/deleteGroupTierModal/deleteGroupTierPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            $scope.deleteGroupTier(tier);
                        }
                    }
                }
            });
        };

        $scope.deleteGroupTier = function (tier) {
            $scope.deletingTiers = true;
            Rehive.admin.groups.tiers.delete(vm.groupName,tier.id).then(function (res) {
                toastr.success('Tier successfully deleted');
                $uibModalInstance.close(true);
                $scope.$apply();
            }, function (error) {
                $scope.deletingTiers = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };


    }
})();
