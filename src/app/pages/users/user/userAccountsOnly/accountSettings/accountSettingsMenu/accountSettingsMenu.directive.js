(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountSettings')
        .directive('accountSettingsMenu', accountSettingsMenu);

    /** @ngInject */
    function accountSettingsMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/user/userAccountsOnly/accountSettings/accountSettingsMenu/accountSettingsMenu.html'
        };
    }
})();
