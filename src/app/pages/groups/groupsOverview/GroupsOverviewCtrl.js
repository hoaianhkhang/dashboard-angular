(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups')
        .controller('GroupsOverviewCtrl', GroupsOverviewCtrl);

    /** @ngInject */
    function GroupsOverviewCtrl($rootScope,$scope,$http,environmentConfig,cookieManagement,$uibModal,
                                errorHandler,$ngConfirm,toastr,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.dashboardTitle = 'Groups | Rehive';
        $scope.groups = [];

        $scope.closeOptionsBox = function () {
            $scope.optionsName = '';
        };

        $scope.showGroupsOptions = function (code) {
            $scope.optionsName = code;
        };

        $scope.goToGroupViews = function (path) {
            $location.path(path);
        };

        $scope.getGroups = function () {
            if(vm.token) {
                $scope.loadingGroups = true;

                if ($scope.groups.length > 0) {
                    $scope.groups.length = 0;
                }

                $http.get(environmentConfig.API + '/admin/groups/?page_size=250', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.groups = res.data.data.results;
                        $scope.groups.forEach(function(element,idx,array){
                            if(idx === array.length - 1){
                                vm.getGroupUsers(element,'last');
                                return false;
                            }
                            vm.getGroupUsers(element);
                        });

                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroups();

        vm.getGroupUsers = function (group,last) {
            if(vm.token) {
                $scope.loadingGroups = true;
                $http.get(environmentConfig.API + '/admin/users/?group=' + group.name, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.groups.forEach(function (element,index) {
                            if(element.name == group.name){
                                element.totalUsers = res.data.data.count;
                            }
                        });
                        if(last){
                            $scope.loadingGroups = false;
                        }
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateGroup = function(group,type){
            var updateObj = {};

            if(type == 'default'){
                group.public = true;
                updateObj.default = group.default;
                updateObj.public = true;
            } else {
                updateObj.public = group.public;
            }

            if(vm.token) {
                $http.patch(environmentConfig.API + '/admin/groups/' + group.name + '/',updateObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 200) {
                        if(type == 'default'){
                            $scope.getGroups();
                        }
                        toastr.success('Group successfully updated');
                    }
                }).catch(function (error) {
                    group[type] = !group[type];
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.deleteCompanyGroupPrompt = function(group) {
            $ngConfirm({
                title: 'Delete group',
                content: "Are you sure you want to delete <b>" + group.name + "</b> ?",
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "Cancel",
                        btnClass: 'btn-default dashboard-btn'
                    },
                    Add: {
                        text: "Delete",
                        btnClass: 'btn-danger dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            scope.deleteCompanyGroup(group);
                        }
                    }
                }
            });
        };

        $scope.deleteCompanyGroup = function (group) {
            if(vm.token) {
                $scope.loadingGroups = true;
                $http.delete(environmentConfig.API + '/admin/groups/' + group.name + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 200) {
                        toastr.success('Group successfully deleted');
                        $scope.getGroups();
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openAddGroupModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupsModalCtrl'
            });

            vm.theModal.result.then(function(group){
                if(group){
                    $scope.getGroups();
                }
            }, function(){
            });
        };


    }
})();
