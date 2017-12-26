(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserProfilePictureModalCtrl', UserProfilePictureModalCtrl);

    function UserProfilePictureModalCtrl($scope,$uibModalInstance,user,toastr,environmentConfig,$stateParams,
                                         Upload,$timeout,cookieManagement,errorHandler) {

        var vm = this;
        $scope.user = user;
        $scope.profilePictureFile.file = $scope.user.profile;
        vm.uuid = $stateParams.uuid;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.uploadProfilePicture = function () {
            $scope.loadingProfilePic = true;
            Upload.upload({
                url: environmentConfig.API + '/admin/users/' + vm.uuid + '/',
                data: {
                    profile: $scope.profilePictureFile.file
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token},
                method: "PATCH"
            }).then(function (res) {
                if (res.status === 200) {
                    $timeout(function(){
                        $scope.loadingProfilePic = false;
                        toastr.success('User profile picture successfully changed');
                        $uibModalInstance.close($scope.user)
                    },0);
                }
            }).catch(function (error) {
                $scope.loadingProfilePic = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            })
        };



    }
})();
