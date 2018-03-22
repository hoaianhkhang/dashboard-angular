(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.details')
        .controller('UserDetailsCtrl', UserDetailsCtrl);

    /** @ngInject */
    function UserDetailsCtrl($scope,$rootScope,cookieManagement,$stateParams,$location) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;

        $scope.goToPermissionSettings = function () {
            $location.path('user/' + vm.uuid + '/permissions-settings');
        };

    }
})();