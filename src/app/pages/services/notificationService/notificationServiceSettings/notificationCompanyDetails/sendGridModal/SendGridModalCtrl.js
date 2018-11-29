(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.notificationService.notificationServiceSettings')
        .controller('SendGridModalCtrl', SendGridModalCtrl);

    /** @ngInject */
    function SendGridModalCtrl($scope,$http,environmentConfig,errorHandler,
                                 $uibModalInstance,toastr,localStorageManagement,$ngConfirm,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.sendGridDetails = {
            apiKey: '',
            fromEmail: ''
        };
        vm.updatedDendGridDetails = {};

        $scope.sendGridDetailsChanged = function (field) {
            vm.updatedDendGridDetails[field] = $scope.sendGridDetails[field];
        };



    }
})();
