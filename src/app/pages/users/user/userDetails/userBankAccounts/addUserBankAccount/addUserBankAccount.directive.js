(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserBankAccountView', addUserBankAccountView);

    /** @ngInject */
    function addUserBankAccountView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userBankAccounts/addUserBankAccount/addUserBankAccount.html'
        };
    }
})();
