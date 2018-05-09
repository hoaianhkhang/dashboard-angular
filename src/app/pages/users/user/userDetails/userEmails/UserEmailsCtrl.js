(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserEmailsCtrl', UserEmailsCtrl);

    /** @ngInject */
    function UserEmailsCtrl($rootScope,$scope,environmentConfig,$stateParams,$http,$window,$ngConfirm,
                            localStorageManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.emailsList = [];
        vm.uuid = $stateParams.uuid;
        $scope.optionsId = '';

        $scope.closeEmailOptionsBox = function () {
            $scope.optionsId = '';
        };

        $scope.showEmailOptionsBox = function (email) {
            $scope.optionsId = email.id;
        };

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserEmails = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                        vm.getUserEmails();
                    }
                }).catch(function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

        vm.getUserEmails = function(){
            $scope.loadingUserEmails = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/emails/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingUserEmails = false;
                        $scope.emailsList = res.data.data.results;
                        $window.sessionStorage.userEmails = JSON.stringify(res.data.data.results);
                    }
                }).catch(function (error) {
                    $scope.loadingUserEmails = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateUserEmail = function (email) {
            $scope.loadingUserEmails = true;
            $http.patch(environmentConfig.API + '/admin/users/emails/' + email.id + '/', {primary: true}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.optionsId = '';
                    toastr.success('Primary email successfully changed');
                    vm.getUserEmails();
                }
            }).catch(function (error) {
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.deleteUserEmailConfirm = function (email) {
            $ngConfirm({
                title: 'Delete email',
                content: "Are you sure you want to delete <b>" + email.email + "</b> ?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteUserEmail(email);
                        }
                    }
                }
            });
        };

        $scope.deleteUserEmail = function (email) {
            $scope.loadingUserEmails = true;
            $http.delete(environmentConfig.API + '/admin/users/emails/' + email.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Email successfully deleted');
                    vm.getUserEmails();
                }
            }).catch(function (error) {
                $scope.loadingUserEmails = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openAddUserEmailModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    emailsCount: function () {
                        return $scope.emailsList.length;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $scope.optionsId = '';
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $rootScope.$on('firstEmailAdded',function (event,firstEmailAdded) {
            if(firstEmailAdded){
                $scope.optionsId = '';
                vm.getUserEmails();
            }
        });

        $scope.openEditUserEmailModal = function (page,size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserEmailModalCtrl',
                scope: $scope,
                resolve: {
                    email: function () {
                        return email;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $scope.optionsId = '';
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

        $scope.openUserVerifyEmailModal = function (page,size,email) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserVerifyEmailModalCtrl',
                scope: $scope,
                resolve: {
                    email: function () {
                        return email;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(email){
                if(email){
                    $scope.optionsId = '';
                    vm.getUserEmails();
                }
            }, function(){
            });
        };

    }
})();
