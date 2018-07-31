(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserAddressModalCtrl', AddUserAddressModalCtrl);

    function AddUserAddressModalCtrl($scope,Rehive,$uibModalInstance,toastr,$stateParams,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userAddressParams = {country: 'US', status: 'Pending'};
        vm.uuid = $stateParams.uuid;
        $scope.kycStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('token');
        $scope.addingUserAddress = false;

        $scope.addUserAddress = function(userAddressParams){
            if(vm.token) {
                $scope.addingUserAddress = true;
                userAddressParams.user = vm.uuid;
                userAddressParams.status = userAddressParams.status.toLowerCase();
                Rehive.admin.users.addresses.create(userAddressParams).then(function (res) {
                    $scope.userAddressParams = {country: 'US', status: 'pending'};
                    toastr.success('Successfully added user address');
                    $scope.addingUserAddress = false;
                    $uibModalInstance.close(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.addingUserAddress = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

    }
})();
