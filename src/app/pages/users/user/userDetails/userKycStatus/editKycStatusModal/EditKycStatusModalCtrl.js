(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('EditKycStatusModalCtrl', EditKycStatusModalCtrl);

    function EditKycStatusModalCtrl($scope,$uibModalInstance,userStatus,toastr,uuid,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.userStatus = userStatus;
        $scope.uuid = uuid;
        $scope.updatingUserKycStatus = false;
        $scope.editUserKycStatus = {
            status: userStatus
        };
        $scope.kycStatusOptions = ['Pending', 'Incomplete', 'Declined', 'Obsolete', 'Verified'];
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.updateUserKycStatus = function(){
            if(vm.token) {
                $scope.updatingUserKycStatus = true;
                $http.patch(environmentConfig.API + '/admin/users/' + $scope.uuid + '/kyc/',{status: $scope.editUserKycStatus.status.toLowerCase()}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingUserKycStatus = false;
                    if (res.status === 200) {
                        toastr.success('Successfully updated the kyc status');
                        $scope.editUserKycStatus = {};
                        $uibModalInstance.close(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.updatingUserKycStatus = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
