(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLog')
        .controller('RequestLogCtrl', RequestLogCtrl);

    /** @ngInject */
    function RequestLogCtrl($scope,Rehive,$state,localStorageManagement,errorHandler,metadataTextService) {
        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.requestLogId = $state.params.logId;
        $scope.loadingRequestLog = true;

        $scope.getRequestLog = function () {
            $scope.loadingRequestLog = true;

            if(vm.token) {
                Rehive.admin.requests.get({id: vm.requestLogId}).then(function (res) {
                    $scope.loadingRequestLog = false;
                    $scope.requestLog = res;
                    $scope.params = metadataTextService.convertToText(res.params);
                    $scope.headers = metadataTextService.convertToText(res.headers);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingRequestLog = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        $scope.getRequestLog();



    }
})();
