(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userAccountsList', userAccountsList);

    /** @ngInject */
    function userAccountsList() {
        return {
            restrict: 'E',
            controller: 'UserAccountsListCtrl',
            templateUrl: 'app/pages/users/user/userDetails/userAccountsList/userAccountsList.html'
        };
    }
})();
