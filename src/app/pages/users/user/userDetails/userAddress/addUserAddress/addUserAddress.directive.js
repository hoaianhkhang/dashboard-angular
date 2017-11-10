(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('addUserAddressView', addUserAddressView);

    /** @ngInject */
    function addUserAddressView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAddress/addUserAddress/addUserAddress.html'
        };
    }
})();
