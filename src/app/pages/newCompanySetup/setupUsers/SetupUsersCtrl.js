(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupUsers')
        .controller("SetupUsersCtrl", SetupUsersCtrl);

    function SetupUsersCtrl($rootScope,$scope,$http,toastr,cookieManagement,currenciesList,
        environmentConfig,$location,errorHandler,localStorageManagement) {
        var vm=this;
        vm.token=cookieManagement.getCookie("TOKEN");
        $scope.addedGroups = [];
        $scope.user = {};
        $rootScope.$pageFinishedLoading=true;
        $rootScope.activeSetupRoute = 0;
        localStorageManagement.setValue('activeSetupRoute',0);
        $scope.editingUser = false;

        $scope.goToNextView = function () {
            $rootScope.userFullyVerified = true;
            $location.path('company/setup/currency-setup');
        };


        vm.getGroups = function(){
            if(vm.token){
                $http.get(environmentConfig.API + '/admin/groups/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.addedGroups = res.data.data.results;
                        if($scope.addedGroups.length == 2){
                            $rootScope.setupUsers = 0;
                            localStorageManagement.setValue('setupUsers',0);
                        }
                        else {
                            $rootScope.setupUsers = 1;
                            localStorageManagement.setValue('setupUsers',1);
                        }
                    }
                }).catch(function (error) {
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroups();
        
        $scope.addUserGroupCompanySetup = function (group) {
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
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.updateUserGroupCompanySetup = function (group) {
            $http.patch(environmentConfig.API + '/admin/groups/' + group.prevName + "/",group, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                if (res.status === 200) {
                    $scope.user={};
                    $scope.editingUser = false;
                }
            }).catch(function (error) {
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

        $scope.deleteGroup = function (name) {
            if(vm.token) {
                $scope.deletingGroups = true;
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
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
    }
})();
