(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('editUserBankAccountView', editUserBankAccountView);

    /** @ngInject */
    function editUserBankAccountView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userBankAccounts/editUserBankAccount/editUserBankAccount.html'
        };
    }
})();
