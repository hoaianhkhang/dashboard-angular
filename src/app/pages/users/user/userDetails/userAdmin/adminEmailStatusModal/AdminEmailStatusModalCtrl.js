(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('AdminEmailStatusModalCtrl', AdminEmailStatusModalCtrl);

    function AdminEmailStatusModalCtrl($scope,$uibModalInstance,nonPrimaryEmail,emailSituation,$stateParams,$http,environmentConfig,
                                $rootScope,localStorageManagement,errorHandler,$uibModal,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.emailSituation = emailSituation;
        $scope.nonPrimaryEmail = nonPrimaryEmail;
        $scope.loadingUserEmailsList = true;
        $scope.selectedEmail = {};
        $scope.userEmailsList = [];
        vm.companyIdentifier = localStorageManagement.getValue('companyIdentifier');

        vm.getUserEmails = function(){
            $scope.loadingUserEmailsList = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/emails/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingUserEmailsList = false;
                        if(res.data.data.results.length > 0){
                            $scope.userEmailsList = res.data.data.results;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingUserEmailsList = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserEmails();

        $scope.openAddEmailModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    emailsCount: function () {
                        return $scope.userEmailsList.length;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $rootScope.$broadcast('firstEmailAdded','first email added');
                    $uibModalInstance.close();
                }
            }, function(){
            });
        };

        // setting email to primary

        $scope.openEditUserEmailModalFromResendPasswordLink = function (page,size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    email: function () {
                        return email;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $window.location.reload();
                    $uibModalInstance.close();
                }
            }, function(){
            });
        };

    }
})();
