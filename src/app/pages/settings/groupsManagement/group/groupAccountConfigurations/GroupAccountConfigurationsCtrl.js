(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.accountConfigurations')
        .controller('GroupAccountConfigurationsCtrl', GroupAccountConfigurationsCtrl);

    /** @ngInject */
    function GroupAccountConfigurationsCtrl($scope,environmentConfig,$http,$stateParams,$uibModal,
                                            cookieManagement,errorHandler,toastr,serializeFiltersService) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroupAccountConfigurations = false;
        $scope.editingGroupAccountConfiguration = false;
        $scope.editGroupAccountConfigurationObj = {};
        $scope.groupAccountConfigurationParams = {};
        $scope.groupAccountConfigurationsList = [];

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };

        $scope.toggleGroupAccountConfigurationEditView = function(accountConfiguration){
            $scope.editingGroupAccountConfiguration = !$scope.editingGroupAccountConfiguration;
            if(accountConfiguration) {
                vm.getAccountConfiguration(accountConfiguration);
            } else {
                $scope.editGroupAccountConfigurationObj = {};
                $scope.getGroupAccountConfigurations();
            }
        };

        vm.getAccountConfiguration = function (accountConfiguration) {
            $scope.loadingGroupAccountConfigurations = true;
            $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + accountConfiguration.name + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingGroupAccountConfigurations = false;
                if (res.status === 200) {
                    $scope.editGroupAccountConfigurationObj = res.data.data;
                    $scope.editGroupAccountConfigurationObj.prevName = res.data.data.name;
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        vm.getGroupAccountConfigurationsUrl = function(){

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage
            };

            return environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/?' + serializeFiltersService.serializeFilters(searchObj);
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

                var groupAccountConfigurationsUrl = vm.getGroupAccountConfigurationsUrl();

                $http.get(groupAccountConfigurationsUrl,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroupAccountConfigurations = false;
                    if (res.status === 200) {
                        $scope.groupAccountConfigurationsData = res.data.data;
                        $scope.groupAccountConfigurationsList = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroupAccountConfigurations();

        $scope.AddGroupAccountConfigurations = function(groupAccountConfigurationParams){
            if(vm.token) {
                $scope.loadingGroupAccountConfigurations = true;
                $http.post(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/',groupAccountConfigurationParams,{
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 201) {
                        $scope.groupAccountConfigurationParams = {};
                        toastr.success('Account configuration successfully added');
                        $scope.getGroupAccountConfigurations();
                    }
                }).catch(function (error) {
                    console.log(error);
                    $scope.loadingGroupAccountConfigurations = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.updateAccountConfiguration = function (editGroupAccountConfigurationObj) {
            $scope.loadingGroupAccountConfigurations = true;
            $scope.editingGroupAccountConfiguration = !$scope.editingGroupAccountConfiguration;
            $http.patch(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + editGroupAccountConfigurationObj.prevName + '/',editGroupAccountConfigurationObj, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingGroupAccountConfigurations = false;
                if (res.status === 200) {
                    $scope.editGroupAccountConfigurationObj = {};
                    toastr.success('Account configuration successfully updated');
                    $scope.getGroupAccountConfigurations();
                }
            }).catch(function (error) {
                $scope.loadingGroupAccountConfigurations = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };

        $scope.openGroupAccountConfigurationsModal = function (page, size,accountConfiguration) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'GroupAccountConfigurationsModalCtrl',
                scope: $scope,
                resolve: {
                    accountConfiguration: function () {
                        return accountConfiguration;
                    },
                    groupName:  function () {
                        return vm.groupName;
                    }
                }
            });

            vm.theModal.result.then(function(accountConfiguration){
                if(accountConfiguration){
                    $scope.getGroupAccountConfigurations('fromModalDelete');
                }
            }, function(){
            });
        };

    }
})();
