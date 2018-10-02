(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.productsService.createProduct')
        .controller('AddProductCtrl', AddProductCtrl);

    /** @ngInject */
    function AddProductCtrl($scope,$rootScope,$http,localStorageManagement,serializeFiltersService,$uibModal,errorHandler) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.serviceUrl = localStorageManagement.getValue('SERVICEURL');



    }
})();
