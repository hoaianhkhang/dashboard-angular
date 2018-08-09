(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups.groupAccountConfigurations')
        .controller('GroupAccountConfigurationsCtrl', GroupAccountConfigurationsCtrl);

    /** @ngInject */
    function GroupAccountConfigurationsCtrl($scope,localStorageManagement,serializeFiltersService,
                                            Rehive,$stateParams,$location,errorHandler,toastr,$uibModal,$ngConfirm) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.groupName = $stateParams.groupName;
        vm.updatedGroup = {};
        $scope.loadingGroup = true;
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        $scope.groupAccountConfigurationsList = [];

        $scope.goToGroupView = function (path) {
            $location.path(path);
        };

        $scope.getGroup = function () {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.groups.get({name: vm.groupName}).then(function (res) {
                    $scope.editGroupObj = res;
                    $scope.editGroupObj.prevName = res.name;
                    vm.getGroupUsers($scope.editGroupObj);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroup();

        vm.getGroupUsers = function (group) {
            if(vm.token) {
                $scope.loadingGroup = true;
                Rehive.admin.users.overview.get({filters: {
                    group: group.name
                }}).then(function (res) {
                    $scope.totalUsersCount = res.total;
                    $scope.deactiveUsersCount = res.archived;
                    $scope.loadingGroup = false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.groupAccountConfigurationNameToLowercase = function () {
            if($scope.groupAccountConfigurationParams.name){
                $scope.groupAccountConfigurationParams.name = $scope.groupAccountConfigurationParams.name.toLowerCase();
            }
        };

        vm.getGroupAccountConfigurationsFilterObj = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getGroupAccountConfigurations = function(fromModalDelete){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;

                if ($scope.groupAccountConfigurationsList.length > 0) {
                    $scope.groupAccountConfigurationsList.length = 0;
                }

                if(fromModalDelete){
                    $scope.pagination.pageNo = 1;
                }

                var groupAccountConfigurationsFilterObj = vm.getGroupAccountConfigurationsFilterObj();

                Rehive.admin.groups.accountConfigurations.get(vm.groupName,{filters: groupAccountConfigurationsFilterObj}).then(function (res)
                {
                    $scope.loadingGroupAccountConfigurations = false;
                    $scope.groupAccountConfigurationsData = res;
                    $scope.groupAccountConfigurationsList = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getGroupAccountConfigurations();
        
        $scope.updateAccountConfig = function (accountConfig,type) {
            var updateObj = {};
            if(type == 'default'){
                updateObj.default = accountConfig.default;
            } else {
                $scope.loadingGroupAccountConfigurations = true;
                updateObj.primary = accountConfig.primary;
                if(accountConfig.primary){
                    updateObj.default = accountConfig.primary;
                }

            }

            Rehive.admin.groups.accountConfigurations.update(vm.groupName,accountConfig.name,updateObj).then(function (res) {
                toastr.success('Account configuration updated successfully');
                if(type == 'primary'){
                    $scope.getGroupAccountConfigurations();
                }
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.openAddAccountConfigurationsModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddGroupAccountConfigModalCtrl'
            });

            vm.theModal.result.then(function(account){
                if(account){
                    $scope.getGroupAccountConfigurations();
                }
            }, function(){
            });
        };

        $scope.openManageAccountConfigurationsModal = function (page, size,groupAccountConfiguration) {
            vm.theManageModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'ManageGroupAccountConfigModalCtrl',
                resolve:{
                    accountConfig: function () {
                        return groupAccountConfiguration;
                    }
                }
            });

            vm.theManageModal.result.then(function(account){
                if(account){
                    $scope.getGroupAccountConfigurations();
                }
            }, function(){
            });
        };

        $scope.deleteAccountConfigConfirm = function (accountConfiguration) {
            $ngConfirm({
                title: 'Delete account configuration',
                content: 'Are you sure you want to remove this account configuration?',
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
                            $scope.deleteAccountConfig(accountConfiguration);
                        }
                    }
                }
            });
        };

        $scope.deleteAccountConfig = function (accountConfiguration) {
            $scope.loadingGroupAccountConfigurations = true;
            Rehive.admin.groups.accountConfigurations.delete(vm.groupName,accountConfiguration.name).then(function (res) {
                toastr.success('Account configuration successfully deleted');
                $scope.getGroupAccountConfigurations();
                $scope.$apply();
            }, function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };



    }
})();
