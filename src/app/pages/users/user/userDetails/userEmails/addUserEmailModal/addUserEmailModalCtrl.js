(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AddUserEmailModalCtrl', AddUserEmailModalCtrl);

    function AddUserEmailModalCtrl($scope,$stateParams,$uibModalInstance,user,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        vm.uuid = $stateParams.uuid;
        $scope.newUserEmail = {primary: 'False', verified: 'False'};
        $scope.booleanOptions = ['False','True'];
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.loadingUserEmails = false;


        $scope.createUserEmail = function (newUserEmail) {
            $scope.loadingUserEmails = true;
            newUserEmail.user = vm.uuid;
            newUserEmail.primary = newUserEmail.primary == 'True' ? true:false;
            newUserEmail.verified = newUserEmail.verified == 'True' ? true:false;
            $http.post(environmentConfig.API + '/admin/users/emails/',newUserEmail, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.loadingUserEmails = true;
                    $scope.newUserEmail = {primary: 'False', verified: 'False'};
                    toastr.success('Email successfully created');
                    $uibModalInstance.close(res.data);
                }
            }).catch(function (error) {
                $scope.newUserEmail = {primary: 'False', verified: 'False'};
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
