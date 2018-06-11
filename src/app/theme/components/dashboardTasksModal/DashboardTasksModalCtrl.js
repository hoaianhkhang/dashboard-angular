(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .controller('DashboardTasksModalCtrl', DashboardTasksModalCtrl);

    /** @ngInject */
    function DashboardTasksModalCtrl($rootScope,$scope,$http,environmentConfig,localStorageManagement,
                                     serializeFiltersService,errorHandler,$window,$timeout) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $scope.loadingTransactionSets = false;
        $scope.inProgressSets = false;
        $scope.dashboardTasksLists = [];

        $scope.pagination = {
            itemsPerPage: 10,
            pageNo: 1,
            maxSize: 5
        };



        // $scope.$on('exportSetCreate', function(event, obj){
        //     if(obj.status == 'created'){
        //         $scope.getTransactionSetsList();
        //     }
        // });



    }
})();
