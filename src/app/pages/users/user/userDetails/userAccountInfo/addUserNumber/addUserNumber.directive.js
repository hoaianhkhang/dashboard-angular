(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserNumber', addUserNumber);

    /** @ngInject */
    function addUserNumber() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccountInfo/addUserNumber/addUserNumber.html'
        };
    }
})();
