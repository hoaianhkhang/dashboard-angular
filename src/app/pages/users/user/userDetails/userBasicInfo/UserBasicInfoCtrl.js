(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserBasicInfoCtrl', UserBasicInfoCtrl);

    /** @ngInject */
    function UserBasicInfoCtrl($scope,Rehive,$stateParams,localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserBasicInfo = true;
        $scope.birthDate = {
            year: '',
            month: '',
            day: ''
        };
        $scope.statusOptions = ['Pending', 'Incomplete', 'Declined', 'Verified'];

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserBasicInfo = true;
                Rehive.admin.users.get({id: vm.uuid}).then(function (res) {
                    $scope.loadingUserBasicInfo = false;
                    if(res.birth_date){
                        var birthdayStringArray = res.birth_date.split('-');
                        $scope.birthDate = {
                            year: birthdayStringArray[0],
                            month: birthdayStringArray[1],
                            day: birthdayStringArray[2]
                        };
                    }
                    $scope.user = res;
                    if($scope.user.groups[0].name === "service"){
                        $scope.user.groups[0].name = "extension";
                        var firstName = "", arr = $scope.user.first_name.split(' ');
                        var len = arr.length;
                        arr[len-1] = "Extension";
                        for(var i = 0; i < len; ++i){
                            firstName += arr[i];
                            if(i !== len-1){firstName += " ";}
                        }
                        $scope.user.first_name = firstName;
                    }
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserBasicInfo = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.openUserBasicInfoModal = function (page, size, user) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'BasicInfoModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return user;
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
