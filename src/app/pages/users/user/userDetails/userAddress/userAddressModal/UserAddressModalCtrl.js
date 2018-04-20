(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAddressModalCtrl', UserAddressModalCtrl);

    function UserAddressModalCtrl($scope,$uibModalInstance,address,toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.userAddress = address;
        $scope.deletingUserAddress = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.deleteUserAddress = function () {
            $scope.deletingUserAddress = true;
            $http.delete(environmentConfig.API + '/admin/users/addresses/' + $scope.userAddress.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingUserAddress = false;
                if (res.status === 200) {
                    toastr.success('Address successfully deleted');
                    $uibModalInstance.close($scope.userAddress);
                }
            }).catch(function (error) {
                $scope.deletingUserAddress = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
