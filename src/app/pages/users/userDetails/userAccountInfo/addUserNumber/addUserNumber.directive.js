(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('addUserNumber', addUserNumber);

    /** @ngInject */
    function addUserNumber() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userAccountInfo/addUserNumber/addUserNumber.html'
        };
    }
})();
