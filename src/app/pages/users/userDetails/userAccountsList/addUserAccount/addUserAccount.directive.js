(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('addUserAccount', addUserAccount);

    /** @ngInject */
    function addUserAccount() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userAccountsList/addUserAccount/addUserAccount.html'
        };
    }
})();
