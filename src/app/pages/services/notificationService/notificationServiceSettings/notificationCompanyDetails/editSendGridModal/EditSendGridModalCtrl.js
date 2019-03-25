(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('EditSendGridModalCtrl', EditSendGridModalCtrl);

    /** @ngInject */
    function EditSendGridModalCtrl($scope,$http,errorHandler,sendGridCreds,
                                   $uibModalInstance,toastr,localStorageManagement) {


        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[4];
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.editingSendGridCreds =  false;
        $scope.editSendGridCredsObj = sendGridCreds.credentials;
        vm.updatedSendGridCreds = {};

        $scope.updateSendGridCredentials = function () {
            $scope.editingSendGridCreds =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/credentials/' + sendGridCreds.id + '/',{ credentials: $scope.editSendGridCredsObj}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.editingSendGridCreds =  false;
                        toastr.success('Sendgrid credentials have been successfully updated');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingSendGridCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
