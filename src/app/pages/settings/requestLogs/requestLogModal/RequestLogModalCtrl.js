(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs')
        .controller('RequestLogModalCtrl', RequestLogModalCtrl);

    /** @ngInject */
    function RequestLogModalCtrl($scope,environmentConfig,log,$http,$state,localStorageManagement,errorHandler,metadataTextService) {
        var vm = this;
        vm.log = log;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingRequestLog = true;

        $scope.getRequestLog = function () {
            $scope.loadingRequestLog = true;

            if(vm.token) {
                $http.get(environmentConfig.API + '/admin/requests/' + vm.log.id + '/', {
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
        $scope.getRequestLog();



    }
})();
