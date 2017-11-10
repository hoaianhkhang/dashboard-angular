(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('addUserAddressView', addUserAddressView);

    /** @ngInject */
    function addUserAddressView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userAddress/addUserAddress/addUserAddress.html'
        };
    }
})();
