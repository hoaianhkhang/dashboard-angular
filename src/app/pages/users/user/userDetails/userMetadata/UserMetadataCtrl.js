(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserMetadataCtrl', UserMetadataCtrl);

    /** @ngInject */
    function UserMetadataCtrl($scope,environmentConfig,$stateParams,$http,metadataTextService,
                              localStorageManagement,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.formatted = {};
        $scope.formatted.metadata = {};
        $scope.loadingUserMetadata = true;

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUserMetadata = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserMetadata = false;
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                        $scope.formatted.metadata = metadataTextService.convertToText($scope.user.metadata);
                    }
                }).catch(function (error) {
                    $scope.loadingUserMetadata = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        vm.getUser();

        $scope.openUserMetadataModal = function (page, size, user) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserMetadataModalCtrl',
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
