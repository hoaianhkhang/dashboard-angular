(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('TwilioModalCtrl', TwilioModalCtrl);

    /** @ngInject */
    function TwilioModalCtrl($scope,$http,environmentConfig,errorHandler,
                             $uibModalInstance,toastr,localStorageManagement,$ngConfirm,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.baseUrl = localStorageManagement.getValue('SERVICEURL');
        $scope.loadingTwilioCreds =  false;
        $scope.twilioCredsParams = {};

        $scope.addTwilioCredentials = function (twilioCredsParams) {
            $scope.loadingTwilioCreds =  true;
            if(vm.token) {
                var twilioCredsObj = {
                    credential_type: "twilio",
                    credentials: {
                        twilio_sid: twilioCredsParams.twilio_sid,
                        twilio_token: twilioCredsParams.twilio_token,
                        twilio_from_number: twilioCredsParams.twilio_from_number
                    }
                };

                $http.post(vm.baseUrl + 'admin/credentials/',twilioCredsObj, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        $scope.loadingTwilioCreds =  false;
                        toastr.success('Twilio credentials have been successfully added');
                        $uibModalInstance.close(true);
                    }
                }).catch(function (error) {
                    $scope.loadingTwilioCreds =  false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };

    }
})();
