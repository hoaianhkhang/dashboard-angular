(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('addUserBankAccountView', addUserBankAccountView);

    /** @ngInject */
    function addUserBankAccountView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userBankAccounts/addUserBankAccount/addUserBankAccount.html'
        };
    }
})();
