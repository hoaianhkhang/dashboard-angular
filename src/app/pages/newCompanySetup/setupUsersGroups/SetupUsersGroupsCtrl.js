(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsersGroups')
        .controller("SetupUsersGroupsCtrl", SetupUsersGroupsCtrl);

    function SetupUsersGroupsCtrl($rootScope,$scope,toastr,$ngConfirm,$filter,Rehive,
                                    $location,errorHandler,localStorageManagement,$timeout) {
        var vm = this;
        vm.token = localStorageManagement.getValue("token");
        $scope.addedGroups = [];
        $scope.user = {};
        $rootScope.$pageFinishedLoading=true;
        $rootScope.activeSetupRoute = 1;
        localStorageManagement.setValue('activeSetupRoute',1);
        $scope.editingUser = false;
        $scope.loadingUsersGroups = true;
        $scope.rehiveSystemGroups = [{name: 'admin'},{name: 'service'}];

        $scope.goToNextView = function () {
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
                Rehive.admin.groups.get().then(function (res) {
                    res.results.forEach(function (group) {
                        if(group.name != 'admin' && group.name != 'service'){
                            $scope.addedGroups.push(group);
                        }
                    });

                    if($scope.addedGroups.length == 0){
                        $rootScope.setupUsers = 0;
                        localStorageManagement.setValue('setupUsers',0);
                    }
                    else {
                        $rootScope.setupUsers = 1;
                        localStorageManagement.setValue('setupUsers',1);
                    }
                    $scope.loadingUsersGroups = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUsersGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
                Rehive.removeToken();
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getGroups();
        
        $scope.addUserGroupCompanySetup = function (group) {
            $scope.loadingUsersGroups = true;
            Rehive.admin.groups.create(group).then(function (res) {
                $scope.user={};
                vm.getGroups();
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsersGroups = false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.updateUserGroupCompanySetup = function (group) {
            $scope.loadingUsersGroups = true;
            Rehive.admin.groups.update(group.prevName,group).then(function (res) {
                $scope.user={};
                $scope.editingUser = false;
                $scope.loadingUsersGroups = false;
                $scope.$apply();
            }, function (error) {
                $scope.loadingUsersGroups = false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.editUser = function(group) {
            $scope.user = group;
            $scope.user.prevName = group.name;
            $scope.editingUser = true;
        };

        $scope.deleteGroupConfirm = function (group) {
            $ngConfirm({
                title: 'Delete group',
                contentUrl: 'app/pages/newCompanySetup/setupUsersGroups/deleteUsersGroupPrompt.html',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                onScopeReady: function(){
                    $scope.groupName = group.name;
                },
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete permanently",
                        btnClass: 'btn-danger',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            if(scope.deleteText != 'DELETE'){
                                toastr.error('DELETE text did not match');
                                return;
                            }
                            scope.archiveGroup(group);
                        }
                    }
                }
            });
        };

        $scope.archiveGroup = function (group) {
            if(group.archived){
                $scope.deleteCurrency(group);
            } else {
                $scope.loadingUsersGroups = true;
                Rehive.admin.groups.update(group.name, {archived : true}).then(function (res) {
                    $timeout(function () {
                        $scope.deleteGroup(group);
                    },1000);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUsersGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.deleteGroup = function (group) {
            if(vm.token) {
                $scope.loadingUsersGroups = true;
                Rehive.admin.groups.delete(group.name).then(function (res) {
                    vm.getGroups();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUsersGroups = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
    }
})();
