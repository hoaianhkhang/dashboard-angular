(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierLimits')
        .directive('editTierLimits', editTierLimits);

    /** @ngInject */
    function editTierLimits() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierLimits/editTierLimits/editTierLimits.html'
        };
    }
})();
