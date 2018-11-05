(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('AddCustomMetadataModalCtrl', AddCustomMetadataModalCtrl);

    function AddCustomMetadataModalCtrl($rootScope,Rehive,$uibModalInstance,$scope,errorHandler,toastr,$timeout,$anchorScroll,
                                        metadataTextService,$location,localStorageManagement,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingCustomMetadata = false;

    }
})();
