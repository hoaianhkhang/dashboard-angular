(function () {
    'use strict';

    angular.module('BlurAdmin.pages.userDetails')
        .controller('UserBasicInfoCtrl', UserBasicInfoCtrl);

    /** @ngInject */
    function UserBasicInfoCtrl($scope,environmentConfig,$stateParams,$http,cookieManagement,errorHandler,toastr,$filter) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        vm.updatedUserBasicInfo = {};
        $scope.editUserBasicInfo = {};
        $scope.loadingUserBasicInfo = true;
        $scope.editingUserBasicInfo = false;
        $scope.birthDate = {
            year: '',
            month: '',
            day: ''
        };
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBasicInfo = false;
                    if (res.status === 200) {
                        if(res.data.data.birth_date){
                            var birthdayStringArray = res.data.data.birth_date.split('-');
                            $scope.birthDate = {
                                year: birthdayStringArray[0],
                                month: birthdayStringArray[1],
                                day: birthdayStringArray[2]
                            };
                        }
                        $scope.user = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

        $scope.toggleUserBasicInfoView = function (user) {
            if(user){
                vm.getUserBasicInfo(user);
            } else {
                $scope.editUserBasicInfo = {};
                vm.getUser();
            }
            $scope.editingUserBasicInfo = !$scope.editingUserBasicInfo;
        };

        vm.getUserBasicInfo = function(){
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBasicInfo = false;
                    if (res.status === 200) {
                        if(res.data.data.birth_date){
                            var birthdayStringArray = res.data.data.birth_date.split('-');
                            $scope.birthDate = {
                                year: birthdayStringArray[0],
                                month: birthdayStringArray[1],
                                day: birthdayStringArray[2]
                            };
                        }
                        $scope.editUserBasicInfo = res.data.data;
                        $scope.editUserBasicInfo.status = $filter('capitalizeWord')(res.data.data.status);
                    }
                }).catch(function (error) {
                    $scope.loadingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

        $scope.userBasicInfoChanged = function(field){
            vm.updatedUserBasicInfo[field] = $scope.editUserBasicInfo[field];
        };

        $scope.updateUserBasicInfo = function(){
            $scope.editingUserBasicInfo = !$scope.editingUserBasicInfo;
            if(vm.updatedUserBasicInfo.birth_date){
                vm.updatedUserBasicInfo.birth_date = $scope.birthDate.year + '-' + $scope.birthDate.month + '-' + $scope.birthDate.day;
            }

            vm.updatedUserBasicInfo.status ? vm.updatedUserBasicInfo.status = vm.updatedUserBasicInfo.status.toLowerCase() : '';
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                $http.patch(environmentConfig.API + '/admin/users/' + vm.uuid + '/',vm.updatedUserBasicInfo, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBasicInfo = false;
                    if (res.status === 200) {
                        toastr.success('Successfully updated the user info');
                        vm.getUser();
                    }
                }).catch(function (error) {
                    $scope.loadingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
