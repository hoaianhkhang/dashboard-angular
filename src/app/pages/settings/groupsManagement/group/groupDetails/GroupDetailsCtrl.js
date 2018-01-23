(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.details')
        .controller('GroupDetailsCtrl', GroupDetailsCtrl);

    /** @ngInject */
    function GroupDetailsCtrl($scope,environmentConfig,$http,$stateParams,cookieManagement,errorHandler,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroups = true;
        $scope.editGroupObj = {};
        vm.updatedGroup = {};

        $scope.groupChanged = function(field){
            if(field == 'name'){
                $scope.editGroupObj.name = $scope.editGroupObj.name.toLowerCase();
            }

            vm.updatedGroup[field] = $scope.editGroupObj[field];
        };

        $scope.editGroup = function (editGroupObj) {
            if(vm.token) {
                $scope.loadingGroups = true;
                $http.patch(environmentConfig.API + '/admin/groups/' + editGroupObj.prevName + '/',vm.updatedGroup, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 200) {
                        toastr.success('Group successfully edited');
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        vm.getGroup = function (group) {
            if(vm.token) {
                $scope.loadingGroups = true;
                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingGroups = false;
                    if (res.status === 200) {
                        $scope.editGroupObj = res.data.data;
                        $scope.editGroupObj.prevName = res.data.data.name;
                    }
                }).catch(function (error) {
                    $scope.loadingGroups = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getGroup();

    }
})();
