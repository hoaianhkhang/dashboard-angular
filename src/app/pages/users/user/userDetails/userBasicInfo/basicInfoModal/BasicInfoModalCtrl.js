(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('BasicInfoModalCtrl', BasicInfoModalCtrl);

    function BasicInfoModalCtrl($scope,$uibModalInstance,user,toastr,$filter,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;

        $scope.user = user;
        $scope.updatingUserBasicInfo = false;
        vm.updatedUserBasicInfo = {};
        $scope.editUserBasicInfo = {};
        vm.token = cookieManagement.getCookie('TOKEN');

        vm.getUserBasicInfo = function(){
            if(vm.token) {
                $scope.updatingUserBasicInfo = true;
                $http.get(environmentConfig.API + '/admin/users/' + $scope.user.identifier + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingUserBasicInfo = false;
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
                    $scope.updatingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUserBasicInfo();

        $scope.userBasicInfoChanged = function(field){
            vm.updatedUserBasicInfo[field] = $scope.editUserBasicInfo[field];
        };

        $scope.updateUserBasicInfo = function(){
            $scope.editingUserBasicInfo = !$scope.editingUserBasicInfo;
            if($scope.editUserBasicInfo.birth_date){
                vm.updatedUserBasicInfo.birth_date = $scope.birthDate.year + '-' + $scope.birthDate.month + '-' + $scope.birthDate.day;
            }

            vm.updatedUserBasicInfo.status ? vm.updatedUserBasicInfo.status = vm.updatedUserBasicInfo.status.toLowerCase() : '';
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                $http.patch(environmentConfig.API + '/admin/users/' + $scope.user.identifier + '/',vm.updatedUserBasicInfo, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserBasicInfo = false;
                    if (res.status === 200) {
                        toastr.success('Successfully updated the user info');
                        $scope.editUserBasicInfo = {};
                        $uibModalInstance.close($scope.user);
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
