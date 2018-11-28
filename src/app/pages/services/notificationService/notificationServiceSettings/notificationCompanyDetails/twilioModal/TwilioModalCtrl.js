(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('TwilioModalCtrl', TwilioModalCtrl);

    /** @ngInject */
    function TwilioModalCtrl($scope,$http,environmentConfig,errorHandler,
                                 $uibModalInstance,toastr,localStorageManagement,$ngConfirm,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');



    }
})();
