(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('editUserAddressView', editUserAddressView);

    /** @ngInject */
    function editUserAddressView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/userDetails/userAddress/editUserAddress/editUserAddress.html'
        };
    }
})();
