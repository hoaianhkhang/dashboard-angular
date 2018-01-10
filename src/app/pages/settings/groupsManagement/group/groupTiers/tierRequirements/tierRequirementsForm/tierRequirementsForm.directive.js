(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTiers.tierRequirements')
        .directive('tierRequirementsForm', tierRequirementsForm);

    /** @ngInject */
    function tierRequirementsForm() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupTiers/tierRequirements/tierRequirementsForm/tierRequirementsForm.html'
        };
    }
})();
