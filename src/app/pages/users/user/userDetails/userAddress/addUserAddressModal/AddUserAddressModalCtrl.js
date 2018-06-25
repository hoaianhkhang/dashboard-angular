(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserAddressModalCtrl', AddUserAddressModalCtrl);

    function AddUserAddressModalCtrl($scope,Rehive,$uibModalInstance,toastr,$stateParams,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userAddressParams = {country: 'US', status: 'Pending'};
        vm.uuid = $stateParams.uuid;
        $scope.kycStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.addUserAddress = function(userAddressParams){
            if(vm.token) {
                userAddressParams.user = vm.uuid;
                userAddressParams.status = userAddressParams.status.toLowerCase();
                Rehive.admin.users.addresses.create(userAddressParams).then(function (res) {
                    $scope.userAddressParams = {country: 'US', status: 'pending'};
                    toastr.success('Successfully added user address');
                    $uibModalInstance.close(res);
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
