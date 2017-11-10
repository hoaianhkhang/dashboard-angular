(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserAccount', addUserAccount);

    /** @ngInject */
    function addUserAccount() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccountsList/addUserAccount/addUserAccount.html'
        };
    }
})();
