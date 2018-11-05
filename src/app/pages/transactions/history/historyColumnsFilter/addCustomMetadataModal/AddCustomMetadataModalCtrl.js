(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions.history')
        .controller('AddCustomMetadataModalCtrl', AddCustomMetadataModalCtrl);

    function AddCustomMetadataModalCtrl($rootScope,Rehive,$uibModalInstance,$scope,errorHandler,toastr,$timeout,
                                        metadataTextService,$location,$filter,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $scope.addingCustomMetadata = false;
        $scope.metadataOptions = [];
        $scope.metadataToAdd = [];

        $scope.metadataInputChanges = function (query) {
            return $filter('filter')($scope.metadataOptions,query);
        };

    }
})();
