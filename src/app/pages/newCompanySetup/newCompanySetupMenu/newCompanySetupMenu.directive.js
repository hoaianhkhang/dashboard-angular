(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup')
        .directive('newCompanySetupMenu', newCompanySetupMenu);

    /** @ngInject */
    function newCompanySetupMenu() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/newCompanySetup/newCompanySetupMenu/newCompanySetupMenu.html'
        };
    }
})();
