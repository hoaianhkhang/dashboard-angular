(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('EditSendGridModalCtrl', EditSendGridModalCtrl);

    /** @ngInject */
    function EditSendGridModalCtrl($scope,$http,errorHandler,sendGridCreds,
                                 $uibModalInstance,toastr,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.editingSendGridCreds =  false;
        $scope.editSendGridCredsObj = sendGridCreds.credentials;
        vm.updatedSendGridCreds = {};

        $scope.sendGridCredsChanged = function (field) {
            vm.updatedSendGridCreds[field] = $scope.editSendGridCredsObj[field];
        };

        $scope.updateSendGridCredentials = function () {
            $scope.editingSendGridCreds =  true;
            if(vm.token) {

                $http.patch(vm.baseUrl + 'admin/credentials/' + sendGridCreds.id + '/',vm.updatedSendGridCreds, {
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
