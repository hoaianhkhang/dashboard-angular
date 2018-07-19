(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceCampaigns')
        .controller('RewardUserModalCtrl', RewardUserModalCtrl);

    function RewardUserModalCtrl($scope,campaign,environmentConfig,$uibModalInstance,typeaheadService,
                                 toastr,$http,localStorageManagement,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');
        vm.campaign = campaign;
        $scope.rewardUserObj = {};
        $scope.rewardingUser = false;

        $scope.getUsersEmailTypeahead = typeaheadService.getUsersEmailTypeahead();

        $scope.findUserObj = function (user) {
            $http.get(environmentConfig.API + '/admin/users/?user=' + encodeURIComponent(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    if(res.data.data.results.length == 1){
                        vm.rewardUserFunc(res.data.data.results[0]);
                    }
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.rewardUserFunc = function (user) {
            $scope.rewardingUser = true;
            $http.post(vm.serviceUrl + 'admin/rewards/' + vm.campaign.identifier + '/', {user: user.identifier}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.rewardingUser = false;
                if (res.status === 201) {
                    toastr.success('User has been rewarded successfully');
                    $uibModalInstance.close(true);
                }
            }).catch(function (error) {
                $scope.rewardingUser = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };




    }
})();