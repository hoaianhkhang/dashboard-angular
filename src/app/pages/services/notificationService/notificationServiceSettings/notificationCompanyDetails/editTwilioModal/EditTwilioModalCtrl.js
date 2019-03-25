(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('EditTwilioModalCtrl', EditTwilioModalCtrl);

    /** @ngInject */
    function EditTwilioModalCtrl($scope,$http,errorHandler,twilioCreds,
                                $uibModalInstance,toastr,localStorageManagement) {

        var vm = this, extensionsList = JSON.parse(localStorageManagement.getValue('extensionsList'));
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = extensionsList[4];
        // vm.baseUrl = "https://notification.services.rehive.io/api/";
        $scope.editingTwilioCreds =  false;
        $scope.editTwilioCredsObj = twilioCreds.credentials;
        vm.updatedTwilioCreds = {};

        $scope.updateTwilioCredentials = function () {
            $scope.editingTwilioCreds =  true;
            if(vm.token) {
                $http.patch(vm.baseUrl + 'admin/credentials/' + twilioCreds.id + '/',{ credentials : $scope.editTwilioCredsObj}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.editingTwilioCreds =  false;
                        toastr.success('Twilio credentials have been successfully updated');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.editingTwilioCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
