(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserAdminCtrl', UserAdminCtrl);

    /** @ngInject */
    function UserAdminCtrl($rootScope,$scope,environmentConfig,toastr,$stateParams,$http,localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');
        $scope.loadingUserAdmin = false;

        $scope.resendPasswordResetLink = function () {
            $http.post(environmentConfig.API + '/auth/password/reset/', {user: vm.uuid,company: vm.companyIdentifier}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Password reset email sent successfully');
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openResendVerifyEmailModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserAdminModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

    }
})();
