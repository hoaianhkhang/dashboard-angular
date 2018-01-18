(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierFees')
        .directive('editTierFees', editTierFees);

    /** @ngInject */
    function editTierFees() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierFees/editTierFees/editTierFees.html'
        };
    }
})();