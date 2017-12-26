(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserSwitchesCtrl', UserSwitchesCtrl);

    /** @ngInject */
    function UserSwitchesCtrl($scope,environmentConfig,$stateParams,$http,_,
                              sharedResources,cookieManagement,errorHandler,toastr,$uibModal) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserSwitches = true;

        vm.getUserSwitches = function(){
            if(vm.token) {
                $scope.loadingUserSwitches = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserSwitches = false;
                    if (res.status === 200) {
                        $scope.userSwitchesList = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserSwitches = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserSwitches();

        $scope.enableSwitch = function (switches) {
            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/users/' + vm.uuid + '/switches/' + switches.id + '/', {enabled: !switches.enabled}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(!switches.enabled){
                            switches.enabled = !switches.enabled;
                            toastr.success('Switch enabled');
                        } else {
                            switches.enabled = !switches.enabled;
                            toastr.success('Switch disabled');
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddUserSwitchesModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'CreateUserSwitchModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(userSwitches){
                if(userSwitches){
                    vm.getUserSwitches();
                }
            }, function(){
            });
        };

        $scope.openEditUserSwitchesModal = function (page, size,userSwitches) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditUserSwitchModalCtrl',
                scope: $scope,
                resolve: {
                    userSwitches: function () {
                        return userSwitches;
                    }
                }
            });

            vm.theModal.result.then(function(userSwitches){
                if(userSwitches){
                    vm.getUserSwitches();
                }
            }, function(){
            });
        };

        vm.findIndexOfUserSwitches = function (element) {
            return this.id == element.id;
        };

        $scope.openUserSwitchesModal = function (page, size,userSwitches) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserSwitchModalCtrl',
                scope: $scope,
                resolve: {
                    userSwitches: function () {
                        return userSwitches;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(userSwitches){
                if(userSwitches){
                    var index = $scope.userSwitchesList.findIndex(vm.findIndexOfUserSwitches,userSwitches);
                    $scope.userSwitchesList.splice(index, 1);
                    vm.getUserSwitches();
                }
            }, function(){
            });
        };


    }
})();
