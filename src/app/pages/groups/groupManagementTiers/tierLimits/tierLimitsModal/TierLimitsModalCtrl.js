(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierLimits')
        .controller('TierLimitsModalCtrl', TierLimitsModalCtrl);

    function TierLimitsModalCtrl($scope,$uibModalInstance,tierLimit,selectedTier,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.tierLimit = tierLimit;
        $scope.selectedTier = selectedTier;
        $scope.deletingTierLimits = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteTierLimit = function () {
            $scope.deletingTierLimits = true;
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/tiers/' + $scope.selectedTier.id + '/limits/' + $scope.tierLimit.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingTierLimits = false;
                if (res.status === 200) {
                    toastr.success('Tier limit successfully deleted');
                    $uibModalInstance.close($scope.tierLimit);
                }
            }).catch(function (error) {
                $scope.deletingTierLimits = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
