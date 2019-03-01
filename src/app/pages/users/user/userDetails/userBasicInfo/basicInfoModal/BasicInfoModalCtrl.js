(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('BasicInfoModalCtrl', BasicInfoModalCtrl);

    function BasicInfoModalCtrl($scope,Rehive,$uibModalInstance,user,toastr,$filter,
                                $window,localStorageManagement,errorHandler) {

        var vm = this;

        $scope.user = user;
        $scope.updatingUserBasicInfo = false;
        vm.updatedUserBasicInfo = {};
        $scope.editUserBasicInfo = {};
        vm.token = localStorageManagement.getValue('token');

        vm.getUserBasicInfo = function(){
            if(vm.token) {
                $scope.updatingUserBasicInfo = true;
                Rehive.admin.users.get({id: $scope.user.id}).then(function (res) {
                    $scope.updatingUserBasicInfo = false;
                    if(res.birth_date){
                        var birthdayStringArray = res.birth_date.split('-');
                        $scope.birthDate = {
                            year: birthdayStringArray[0],
                            month: birthdayStringArray[1],
                            day: birthdayStringArray[2]
                        };
                    }
                    $scope.editUserBasicInfo = res;
                    if($scope.editUserBasicInfo.groups[0].name === "service"){
                        $scope.editUserBasicInfo.groups[0].name = "extension";
                        var firstName = "", arr = $scope.editUserBasicInfo.first_name.split(' ');
                        var len = arr.length;
                        arr[len-1] = "Extension";
                        for(var i = 0; i < len; ++i){
                            firstName += arr[i];
                            if(i !== len-1){firstName += " ";}
                        }
                        $scope.editUserBasicInfo.first_name = firstName;
                    }
                    $scope.editUserBasicInfo.status = $filter('capitalizeWord')(res.status);
                    $scope.$apply();
                }, function (error) {
                    $scope.updatingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserBasicInfo();

        $scope.userBasicInfoChanged = function(field){
            vm.updatedUserBasicInfo[field] = $scope.editUserBasicInfo[field];
        };

        $scope.updateUserBasicInfo = function(){
            $scope.editingUserBasicInfo = !$scope.editingUserBasicInfo;
            if($scope.birthDate.year && $scope.birthDate.month && $scope.birthDate.day){
                vm.updatedUserBasicInfo.birth_date = $scope.birthDate.year + '-' + $scope.birthDate.month + '-' + $scope.birthDate.day;
            }

            vm.updatedUserBasicInfo.status ? vm.updatedUserBasicInfo.status = vm.updatedUserBasicInfo.status.toLowerCase() : '';
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                var formData = new FormData();

                for (var key in vm.updatedUserBasicInfo) {
                    if (vm.updatedUserBasicInfo[key]) {
                        formData.append(key, vm.updatedUserBasicInfo[key]);
                    }
                }

                Rehive.admin.users.update($scope.user.id, formData).then(function (res) {
                    $scope.loadingUserBasicInfo = false;
                    toastr.success('Successfully updated the user info');
                    $scope.editUserBasicInfo = {};
                    if(vm.updatedUserBasicInfo.hasOwnProperty('first_name') || vm.updatedUserBasicInfo.hasOwnProperty('last_name')){
                        $window.location.reload();
                        $scope.$apply();
                    } else {
                        $uibModalInstance.close($scope.user);
                        $scope.$apply();
                    }
                }, function (error) {
                    $scope.loadingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };



    }
})();
