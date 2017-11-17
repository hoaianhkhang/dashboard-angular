(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserVerifyEmailModalCtrl', UserVerifyEmailModalCtrl);

    function UserVerifyEmailModalCtrl($scope,$uibModalInstance,email,user,toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.email = email;
        $scope.user = user;
        vm.token = cookieManagement.getCookie('TOKEN');
        $scope.verifyingEmail = false;
        vm.company = {};

        vm.getCompanyDetails = function () {
            $http.get(environmentConfig.API + '/company/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    vm.company =  res.data.data;
                }
            }).catch(function (error) {
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        vm.getCompanyDetails();

        $scope.verifyEmail = function () {
            $scope.verifyingEmail = true;
            $http.patch(environmentConfig.API + '/admin/users/emails/' + email.id + '/', {verified: true}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.verifyingEmail = false;
                if (res.status === 200) {
                    toastr.success('Email successfully verified');
                    $uibModalInstance.close($scope.email);
                }
            }).catch(function (error) {
                $scope.verifyingEmail = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.resendEmailVerification = function () {
            $scope.verifyingEmail = true;
            $http.post(environmentConfig.API + '/auth/email/verify/resend/', {email: email.email,company: vm.company.identifier}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (res) {
                $scope.verifyingEmail = false;
                if (res.status === 200) {
                    toastr.success('Email verification resent successfully');
                    $uibModalInstance.close();
                }
            }).catch(function (error) {
                $scope.verifyingEmail = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

    }
})();
