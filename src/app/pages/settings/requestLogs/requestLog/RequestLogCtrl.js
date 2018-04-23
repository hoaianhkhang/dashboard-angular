(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLog')
        .controller('RequestLogCtrl', RequestLogCtrl);

    /** @ngInject */
    function RequestLogCtrl($scope,environmentConfig,$http,$state,localStorageManagement,errorHandler,metadataTextService) {
        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.requestLogId = $state.params.logId;
        $scope.loadingRequestLog = true;

        $scope.getRequestLogs = function () {
            $scope.loadingRequestLog = true;

            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/requests/' + vm.requestLogId + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingRequestLog = false;
                    if (res.status === 200) {
                        $scope.requestLog = res.data.data;
                        $scope.params = metadataTextService.convertToText(res.data.data.params);
                        $scope.headers = metadataTextService.convertToText(res.data.data.headers);
                    }
                }).catch(function (error) {
                    $scope.loadingRequestLog = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
                });
            }
        };
        $scope.getRequestLogs();



    }
})();
