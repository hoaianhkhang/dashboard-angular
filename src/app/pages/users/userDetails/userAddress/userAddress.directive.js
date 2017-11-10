(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userAddress', userAddress);

    /** @ngInject */
    function userAddress() {
        return {
            restrict: 'E',
            controller: 'UserAddressCtrl',
            templateUrl: 'app/pages/users/userDetails/userAddress/userAddress.html'
        };
    }
})();
