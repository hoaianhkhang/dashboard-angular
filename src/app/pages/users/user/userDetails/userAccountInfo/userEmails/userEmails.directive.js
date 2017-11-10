(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userEmails', userEmails);

    /** @ngInject */
    function userEmails() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccountInfo/userEmails/userEmails.html'
        };
    }
})();
