(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('DashboardTasksModalCtrl', DashboardTasksModalCtrl);

    /** @ngInject */
    function DashboardTasksModalCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,errorHandler,$location,toastr) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');

        $scope.dashboardTasks = {
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    "id": 21,
                    "type": "transaction",
                    "query": null,
                    "status": "complete",
                    "progress": 100,
                    "count": 105,
                    "page_size": 10000,
                    "created": 1528207581854,
                    "updated": 1528207586296
                },
                {
                    "id": 20,
                    "type": "transaction",
                    "query": null,
                    "status": "complete",
                    "progress": 100,
                    "count": 6,
                    "page_size": 10000,
                    "created": 1528205760711,
                    "updated": 1528205761075
                }
            ]
        };


    }
})();
