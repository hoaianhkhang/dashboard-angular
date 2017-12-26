(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.details')
        .controller('UserDetailsCtrl', UserDetailsCtrl);

    /** @ngInject */
    function UserDetailsCtrl($scope,cookieManagement,$stateParams,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        vm.uuid = $stateParams.uuid;

        $scope.goToPermissionSettings = function () {
            $location.path('user/' + vm.uuid + '/permissions-settings');
        };

    }
})();