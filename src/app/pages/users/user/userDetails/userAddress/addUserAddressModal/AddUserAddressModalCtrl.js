(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserAddressModalCtrl', AddUserAddressModalCtrl);

    function AddUserAddressModalCtrl($scope,$uibModalInstance,toastr,$stateParams,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userAddressParams = {country: 'US', status: 'Pending'};
        vm.uuid = $stateParams.uuid;
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.addUserAddress = function(userAddressParams){
            if(vm.token) {
                userAddressParams.user = vm.uuid;
                userAddressParams.status = userAddressParams.status.toLowerCase();
                $http.post(environmentConfig.API + '/admin/users/addresses/',userAddressParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.userAddressParams = {country: 'US', status: 'pending'};
                        toastr.success('Successfully added user address!');
                        $uibModalInstance.close(res.data);
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
