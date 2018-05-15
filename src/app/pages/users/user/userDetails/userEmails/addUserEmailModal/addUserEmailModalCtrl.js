(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserEmailModalCtrl', AddUserEmailModalCtrl);

    function AddUserEmailModalCtrl($scope,$stateParams,$uibModalInstance,emailsCount,
                                   toastr,$http,environmentConfig,localStorageManagement,errorHandler) {

        var vm = this;
        vm.uuid = $stateParams.uuid;
        vm.emailsCount = emailsCount;
        $scope.newUserEmail = {primary: false, verified: false};
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingUserEmails = false;

        if(vm.emailsCount === 0){
            $scope.newUserEmail.primary = true;
        }

        $scope.changingPrimaryStatus = function () {
            if(vm.emailsCount === 0){
                $scope.newUserEmail.primary = true;
                toastr.info('Initial email must be primary.');
            }
        };

        $scope.createUserEmail = function (newUserEmail) {
            $scope.loadingUserEmails = true;
            newUserEmail.user = vm.uuid;
            $http.post(environmentConfig.API + '/admin/users/emails/',newUserEmail, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.loadingUserEmails = true;
                    $scope.newUserEmail = {primary: false, verified: false};
                    toastr.success('Email successfully created');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.newUserEmail = {primary: false, verified: false};
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
