(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .controller('UserBasicInfoCtrl', UserBasicInfoCtrl);

    /** @ngInject */
    function UserBasicInfoCtrl($scope,environmentConfig,$stateParams,$http,cookieManagement,$uibModal,errorHandler,toastr,$filter) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
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
