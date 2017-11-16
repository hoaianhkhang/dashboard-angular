(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('userNumbers', userNumbers);

    /** @ngInject */
    function userNumbers() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAccountInfo/userNumbers/userNumbers.html'
        };
    }
})();
