(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accessControl')
        .controller('AccessControlCtrl', AccessControlCtrl);

    /** @ngInject */
    function AccessControlCtrl($rootScope,$scope,$location,$http,environmentConfig,localStorageManagement,
                               errorHandler,$uibModal,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Services | Access control';

    }
})();
