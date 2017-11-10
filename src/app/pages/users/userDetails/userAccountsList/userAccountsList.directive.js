(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userAccountsList', userAccountsList);

    /** @ngInject */
    function userAccountsList() {
        return {
            restrict: 'E',
            controller: 'UserAccountsListCtrl',
            templateUrl: 'app/pages/users/userDetails/userAccountsList/userAccountsList.html'
        };
    }
})();
