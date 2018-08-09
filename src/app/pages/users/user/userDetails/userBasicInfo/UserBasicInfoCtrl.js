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
                Rehive.admin.users.get({identifier: vm.uuid}).then(function (res) {
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
