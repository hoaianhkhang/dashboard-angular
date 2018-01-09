(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.list')
        .directive('editTier', editTier);

    /** @ngInject */
    function editTier() {
        return {
            restrict: 'E',
            controller: 'TiersCtrl',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tiers/editTier/editTier.html'
        };
    }
})();
