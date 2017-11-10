(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('editUserAccount', editUserAccount);

    /** @ngInject */
    function editUserAccount() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userAccountsList/editUserAccount/editUserAccount.html'
        };
    }
})();
