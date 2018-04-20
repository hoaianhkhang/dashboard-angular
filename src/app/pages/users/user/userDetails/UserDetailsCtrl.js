(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.details')
        .controller('UserDetailsCtrl', UserDetailsCtrl);

    /** @ngInject */
    function UserDetailsCtrl($scope,$rootScope,$stateParams,$location) {

        var vm = this;
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;

        $scope.goToPermissionSettings = function () {
            $location.path('user/' + vm.uuid + '/permissions-settings');
        };

    }
})();