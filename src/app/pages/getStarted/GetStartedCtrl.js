(function () {
    'use strict';

    angular.module('BlurAdmin.pages.getStarted')
        .controller('GetStartedCtrl', GetStartedCtrl);

    /** @ngInject */
    function GetStartedCtrl($rootScope,$scope,$location,localStorageManagement,
                            errorHandler,$state,_,serializeFiltersService,$uibModal,Rehive) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        $rootScope.dashboardTitle = 'Get started | Rehive';


    }
})();
