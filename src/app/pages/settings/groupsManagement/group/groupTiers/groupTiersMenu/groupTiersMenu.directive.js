(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers')
        .directive('groupTiersMenu', groupTiersMenu);

    /** @ngInject */
    function groupTiersMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/groupTiersMenu/groupTiersMenu.html'
        };
    }
})();
