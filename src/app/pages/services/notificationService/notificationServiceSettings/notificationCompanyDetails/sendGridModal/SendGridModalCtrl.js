(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('SendGridModalCtrl', SendGridModalCtrl);

    /** @ngInject */
    function SendGridModalCtrl($scope,$http,errorHandler,toastr,
                               $uibModalInstance,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingSendGridCreds =  false;
        $scope.sendGridCredsParams = {};

        $scope.addSendGridCredentials = function (sendGridCredsParams) {
            $scope.loadingSendGridCreds =  true;
            if(vm.token) {
                var sendGridCredsObj = {
                    credential_type: "sendgrid",
                    credentials: {
                        sendgrid_api_key: sendGridCredsParams.sendgrid_api_key,
                        sendgrid_from_email: sendGridCredsParams.sendgrid_from_email
                    }
                };

                $http.post(vm.baseUrl + 'admin/credentials/',sendGridCredsObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingSendGridCreds =  false;
                        toastr.success('Sendgrid credentials have been successfully added');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.loadingSendGridCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();