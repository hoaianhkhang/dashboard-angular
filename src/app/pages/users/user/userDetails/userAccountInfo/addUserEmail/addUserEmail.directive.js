(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserEmail', addUserEmail);

    /** @ngInject */
    function addUserEmail() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccountInfo/addUserEmail/addUserEmail.html'
        };
    }
})();
