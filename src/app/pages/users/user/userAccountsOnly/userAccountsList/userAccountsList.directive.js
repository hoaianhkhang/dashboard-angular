(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user.accounts')
        .directive('userAccountsList', userAccountsList);

    /** @ngInject */
    function userAccountsList() {
        return {
            restrict: 'E',
            controller: 'UserAccountsListCtrl',
            templateUrl: 'app/pages/users/user/userAccountsOnly/userAccountsList/userAccountsList.html'
        };
    }
})();
