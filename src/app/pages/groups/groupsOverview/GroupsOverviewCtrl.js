(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.overview')
        .controller('GroupsOverviewCtrl', GroupsOverviewCtrl);

    /** @ngInject */
    function GroupsOverviewCtrl($rootScope,$scope,localStorageManagement,$uibModal,
                                errorHandler,$ngConfirm,toastr,$location,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
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

        $scope.getGroups = function (dontShowLoadingImage) {
            if(vm.token) {

                if(!dontShowLoadingImage){
                    $scope.loadingGroups = true;
                }

                // if ($scope.groups.length > 0) {
                //     $scope.groups.length = 0;
                // }

                Rehive.admin.groups.get({filters: {page_size: 250}}).then(function (res) {
                    $scope.groups = res.results;
                    $scope.groups.forEach(function(element,idx,array){
                        if(idx === array.length - 1){
                            vm.getGroupUsers(element,'last');
                            return false;
                        }
                        vm.getGroupUsers(element);
                    });
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroups();

        vm.getGroupUsers = function (group,last) {
            if(vm.token) {
                Rehive.admin.users.overview.get({filters: {
                    group: group.name
                }}).then(function (res) {
                    $scope.groups.forEach(function (element,index) {
                        if(element.name == group.name){
                            element.totalUsers = res.total;
                            element.activeUsers = res.active;
                        }
                    });
                    if(last){
                        $scope.loadingGroups = false;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                Rehive.admin.groups.update(group.name,updateObj).then(function (res) {
                    $scope.loadingGroups = false;
                    if(type == 'default'){
                        $scope.getGroups('dontShowLoadingImage');
                    }
                    toastr.success('Group successfully updated');
                    $scope.$apply();
                }, function (error) {
                    group[type] = !group[type];
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
                Rehive.admin.groups.delete(group.name).then(function (res) {
                    $scope.loadingGroups = false;
                    toastr.success('Group successfully deleted');
                    $scope.getGroups();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
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
