(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .directive('editUserAddressView', editUserAddressView);

    /** @ngInject */
    function editUserAddressView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/users/user/userDetails/userAddress/editUserAddress/editUserAddress.html'
        };
    }
})();
