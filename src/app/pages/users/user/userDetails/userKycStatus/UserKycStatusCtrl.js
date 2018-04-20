(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserKycStatusCtrl', UserKycStatusCtrl);

    /** @ngInject */
    function UserKycStatusCtrl($scope,environmentConfig,$stateParams,$http,localStorageManagement,$uibModal,errorHandler,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserKycStatus = true;

        vm.getUserStatus = function(){
            if(vm.token) {
                $scope.loadingUserKycStatus = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/kyc/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserKycStatus = false;
                    if (res.status === 200) {
                        $scope.userStatus = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserKycStatus = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserStatus();

        vm.getUser = function(){
            $scope.loadingUserKycStatus = true;
            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                        vm.getUserStatus();
                    }
                }).catch(function (error) {
                    $scope.loadingUserKycStatus = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.openEditUserKycStatusModal = function (page, size, userStatus) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'EditKycStatusModalCtrl',
                scope: $scope,
                resolve: {
                    userStatus: function () {
                        return $filter('capitalizeWord')(userStatus.status);
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

    }
})();
