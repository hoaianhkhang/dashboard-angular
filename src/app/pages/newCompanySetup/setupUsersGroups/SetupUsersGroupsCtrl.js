(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsersGroups')
        .controller("SetupUsersGroupsCtrl", SetupUsersGroupsCtrl);

    function SetupUsersGroupsCtrl($rootScope,$scope,$http,toastr,$ngConfirm,$filter,
                                    environmentConfig,$location,errorHandler,localStorageManagement) {
        var vm = this;
        vm.token = localStorageManagement.getValue("TOKEN");
        $scope.addedGroups = [];
        $scope.user = {};
        $rootScope.$pageFinishedLoading=true;
        $rootScope.activeSetupRoute = 0;
        localStorageManagement.setValue('activeSetupRoute',0);
        $scope.editingUser = false;
        $scope.loadingUsersGroups = true;
        $scope.rehiveSystemGroups = [{name: 'admin'},{name: 'service'}];

        $scope.goToNextView = function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/currency-setup');
        };

        $scope.groupNameChanged = function (user) {
            if(user.name){
                user.name = user.name.toLowerCase();
                user.label = $filter('capitalizeWord')(user.name).replace(/_/g, " ").replace(/-/g, " ");
            } else {
                user.label = '';
            }
        };

        vm.getGroups = function(){
            if(vm.token){
                $scope.loadingUsersGroups = true;
                $scope.addedGroups = [];
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        res.data.data.results.forEach(function (group) {
                            if(group.name != 'admin' && group.name != 'service'){
                                $scope.addedGroups.push(group);
                            }
                        });

                        if($scope.addedGroups.length == 2){
                            $rootScope.setupUsers = 0;
                            localStorageManagement.setValue('setupUsers',0);
                        }
                        else {
                            $rootScope.setupUsers = 1;
                            localStorageManagement.setValue('setupUsers',1);
                        }
                        $scope.loadingUsersGroups = false;
                    }
                }).catch(function (error) {
                    $scope.loadingUsersGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                $rootScope.userFullyVerified = false;
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getGroups();
        
        $scope.addUserGroupCompanySetup = function (group) {
            $scope.loadingUsersGroups = true;
            $http.post(environmentConfig.API + '/admin/groups/',group, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 201) {
                    $scope.user={};
                    vm.getGroups();
                }
            }).catch(function (error) {
                $scope.loadingUsersGroups = false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.updateUserGroupCompanySetup = function (group) {
            $scope.loadingUsersGroups = true;
            $http.patch(environmentConfig.API + '/admin/groups/' + group.prevName + "/",group, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.user={};
                    $scope.editingUser = false;
                    $scope.loadingUsersGroups = false;
                }
            }).catch(function (error) {
                $scope.loadingUsersGroups = false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.editUser = function(group) {
            $scope.user = group;
            $scope.user.prevName = group.name;
            $scope.editingUser = true;
        };

        $scope.deleteGroupConfirm = function (name) {
            $ngConfirm({
                title: 'Delete group',
                content: 'Are you sure you want to delete this group?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteGroup(name);
                        }
                    }
                }
            });
        };

        $scope.deleteGroup = function (name) {
            if(vm.token) {
                $scope.loadingUsersGroups = true;
                $http.delete(environmentConfig.API + '/admin/groups/' + name + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        vm.getGroups();
                    }
                }).catch(function (error) {
                    $scope.loadingUsersGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
