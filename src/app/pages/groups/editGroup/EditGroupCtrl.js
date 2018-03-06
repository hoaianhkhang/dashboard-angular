(function () {
    'use strict';

    angular.module('BlurAdmin.pages.editGroup')
        .controller('EditGroupCtrl', EditGroupCtrl);

    /** @ngInject */
    function EditGroupCtrl($scope,$http,environmentConfig,cookieManagement,$stateParams,$uibModal,errorHandler,$ngConfirm,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.groupName = $stateParams.groupName;
        $scope.loadingGroup = true;

        $scope.getGroup = function () {
            if(vm.token) {
                $scope.loadingGroup = true;

                $http.get(environmentConfig.API + '/admin/groups/' + vm.groupName + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.groupObj = res.data.data.results;
                        console.log($scope.groupObj)
                    }
                }).catch(function (error) {
                    $scope.loadingGroup = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getGroup();



    }
})();
