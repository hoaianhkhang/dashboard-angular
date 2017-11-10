(function () {
    'use strict';

    angular.module('BlurAdmin.pages.permissions')
        .controller('PermissionsCtrl', PermissionsCtrl);

    /** @ngInject */
    function PermissionsCtrl($scope,$location,$stateParams) {

        var vm = this;
        vm.uuid = $stateParams.uuid;

        $scope.goToSetting = function(path){
            $location.path('user/' + vm.uuid + '/permissions-settings/' + path);
        };

        $scope.goBackToUser = function () {
            $location.path('user/' + vm.uuid + '/details');
        };

    }
})();
