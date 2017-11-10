(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .controller('UserActivityCtrl', UserActivityCtrl);

    /** @ngInject */
    function UserActivityCtrl($scope,environmentConfig,$stateParams,$http,cookieManagement,errorHandler,$state) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserActivity = true;

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserActivity = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserActivity = false;
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                    }
                }).catch(function (error) {
                    $scope.loadingUserActivity = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

        $scope.goToTransactions = function(identifier){
            $state.go('transactions.history',{"identifier": identifier});
        }
    }
})();
