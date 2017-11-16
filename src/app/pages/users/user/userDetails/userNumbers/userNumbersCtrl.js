(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserNumbersCtrl', UserNumbersCtrl);

    /** @ngInject */
    function UserNumbersCtrl($scope,environmentConfig,$stateParams,$http,$window,$ngConfirm,
                            cookieManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserNumbers = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                        vm.getUserNumbers();
                    }
                }).catch(function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

        vm.getUserNumbers = function(){
            $scope.loadingUserNumbers = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/mobiles/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingUserNumbers = false;
                        $scope.mobilesList = res.data.data.results;
                        $window.sessionStorage.userNumbers = JSON.stringify(res.data.data.results);
                    }
                }).catch(function (error) {
                    $scope.loadingUserNumbers = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateUserNumber = function (number) {
            $scope.loadingUserNumbers = true;
            $http.patch(environmentConfig.API + '/admin/users/mobiles/' + number.id + '/', {primary: true}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Primary number successfully changed');
                    vm.getUserNumbers();
                }
            }).catch(function (error) {
                $scope.loadingUserNumbers = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.deleteUserNumberConfirm = function (number) {
            $ngConfirm({
                title: 'Delete number',
                content: "Are you sure you want to delete <b>" + number.number + "</b> ?",
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
                            $scope.deleteUserNumber(number);
                        }
                    }
                }
            });
        };

        $scope.deleteUserNumber = function (number) {
            $scope.loadingUserNumbers = true;
            $http.delete(environmentConfig.API + '/admin/users/mobiles/' + number.id + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    toastr.success('Number successfully deleted');
                    vm.getUserNumbers();
                }
            }).catch(function (error) {
                $scope.loadingUserNumbers = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openAddUserNumberModal = function (page,size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserNumberModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(number){
                if(number){
                    vm.getUserNumbers();
                }
            }, function(){
            });
        };

        $scope.openEditUserNumberModal = function (page,size,number) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserNumberModalCtrl',
                scope: $scope,
                resolve: {
                    number: function () {
                        return number;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(number){
                if(number){
                    vm.getUserNumbers();
                }
            }, function(){
            });
        };

        $scope.openVerifyUserMobileModal = function (page,size,number) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'VerifyUserNumberModalCtrl',
                scope: $scope,
                resolve: {
                    number: function () {
                        return number;
                    },
                    user: function () {
                        return $scope.user;
                    }
                }
            });

            vm.theModal.result.then(function(number){
                if(number){
                    vm.getUserNumbers();
                }
            }, function(){
            });
        };

    }
})();
