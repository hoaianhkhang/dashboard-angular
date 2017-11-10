(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('editUserAccount', editUserAccount);

    /** @ngInject */
    function editUserAccount() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccountsList/editUserAccount/editUserAccount.html'
        };
    }
})();
