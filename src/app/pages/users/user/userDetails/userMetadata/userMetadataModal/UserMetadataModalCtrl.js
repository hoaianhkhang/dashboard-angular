(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserMetadataModalCtrl', UserMetadataModalCtrl);

    function UserMetadataModalCtrl($scope,$uibModalInstance,user,toastr,$http,environmentConfig,
                                   localStorageManagement,errorHandler) {

        var vm = this;
        vm.user = user;
        $scope.formatted = {};
        $scope.formatted.metadata = JSON.stringify(vm.user.metadata);
        $scope.updatingUserMetadata = false;
        vm.token = localStorageManagement.getValue('TOKEN');

        vm.isJson = function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        };

        $scope.updateUserMetadata = function(){
            if(vm.token) {
                $scope.updatingUserMetadata = true;

                var metaData;
                if($scope.formatted.metadata){
                    if(vm.isJson($scope.formatted.metadata)){
                        metaData =  JSON.parse($scope.formatted.metadata);
                    } else {
                        toastr.error('Incorrect metadata format');
                        $scope.updatingUserMetadata = false;
                        return false;
                    }
                } else {
                    metaData = {};
                }

                $http.patch(environmentConfig.API + '/admin/users/' + vm.user.identifier + '/',{metadata: metaData}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.updatingUserMetadata = false;
                    if (res.status === 200) {
                        toastr.success('Metadata updated successfully');
                        $scope.formatted = {};
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.updatingUserMetadata = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };



    }
})();
