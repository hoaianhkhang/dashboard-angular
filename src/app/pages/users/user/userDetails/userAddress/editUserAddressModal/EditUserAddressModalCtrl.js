(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditUserAddressModalCtrl', EditUserAddressModalCtrl);

    function EditUserAddressModalCtrl($scope,$uibModalInstance,address,toastr,$stateParams,$filter,
                                      $http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        $scope.userAddress = address;
        vm.updatedUserAddress = {};
        $scope.editUserAddress = {};
        $scope.editingUserAddress = true;
        $scope.kycStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getAddress = function () {
            $scope.editingUserAddress = true;
            $http.get(environmentConfig.API + '/admin/users/addresses/' + $scope.userAddress.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.editingUserAddress = false;
                if (res.status === 200) {
                    $scope.editUserAddress = res.data.data;
                    $scope.editUserAddress.status = $filter('capitalizeWord')(res.data.data.status);
                }
            }).catch(function (error) {
                $scope.editingUserAddress = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getAddress();

        $scope.userAddressChanged =  function (field) {
            vm.updatedUserAddress[field] = $scope.editUserAddress[field];
        };

        $scope.updateUserAddress = function(){
            $scope.editingUserAddress = true;
            if(vm.token) {
                vm.updatedUserAddress.status ? vm.updatedUserAddress.status = vm.updatedUserAddress.status.toLowerCase() : '';
                $http.patch(environmentConfig.API + '/admin/users/addresses/' + $scope.editUserAddress.id + '/',vm.updatedUserAddress,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.editingUserAddress = false;
                        vm.updatedUserAddress = {};
                        $scope.editUserAddress = {};
                        toastr.success('Successfully updated user address');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    $scope.editingUserAddress = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
