(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accessControl')
        .controller('AccessControlCtrl', AccessControlCtrl);

    /** @ngInject */
    function AccessControlCtrl($rootScope,$scope,serializeFiltersService,$http,environmentConfig,
                               localStorageManagement,errorHandler,$uibModal) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Access control | Rehive';
        $scope.accessControlRules = [];
        $scope.loadingAccessControl = false;

        $scope.pagination = {
            itemsPerPage: 25,
            pageNo: 1,
            maxSize: 5
        };

        vm.getAccessControlFiltersObj = function(){
            // $scope.filtersCount = 0;
            //
            // for(var x in $scope.filtersObj){
            //     if($scope.filtersObj.hasOwnProperty(x)){
            //         if($scope.filtersObj[x]){
            //             $scope.filtersCount = $scope.filtersCount + 1;
            //         }
            //     }
            // }

            var searchObj = {
                page: $scope.pagination.pageNo,
                page_size: $scope.pagination.itemsPerPage || 25
            };

            return serializeFiltersService.objectFilters(searchObj);
        };

        $scope.getAccessControlRules = function(){
            $scope.loadingAccessControl = true;
            $http.get(environmentConfig.API + '/admin/access-control-rules/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.loadingAccessControl = false;
                if (res.status === 200) {
                    $scope.accessControlRulesData =  res.data.data;
                    $scope.accessControlRules =  res.data.data.results;
                }
            }).catch(function (error) {
                $scope.loadingAccessControl = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };
        $scope.getAccessControlRules();

        $scope.openAddAccessControlModal = function (page, size) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddAccessControlModalCtrl',
                scope: $scope
            });

            vm.theModal.result.then(function(rule){
                if(rule){
                    $scope.getAccessControlRules();
                }
            }, function(){
            });
        };

        $scope.openEditAccessControlModal = function (page, size, rule) {
            vm.theEditModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditAccessControlModalCtrl',
                scope: $scope,
                resolve: {
                    rule: function () {
                        return rule;
                    }
                }
            });

            vm.theEditModal.result.then(function(rule){
                if(rule){
                    $scope.getAccessControlRules();
                }
            }, function(){
            });
        };

        $scope.openDeleteAccessControlModal = function (page, size, rule) {
            vm.theDeleteModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'DeleteAccessControlModalCtrl',
                scope: $scope,
                resolve: {
                    rule: function () {
                        return rule;
                    }
                }
            });

            vm.theDeleteModal.result.then(function(rule){
                if(rule){
                    $scope.getAccessControlRules();
                }
            }, function(){
            });
        };

    }
})();
