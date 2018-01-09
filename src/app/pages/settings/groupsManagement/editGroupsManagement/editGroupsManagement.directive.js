(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.groupsManagement')
        .directive('editGroupsManagement', editGroupsManagement);

    /** @ngInject */
    function editGroupsManagement() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/editGroupsManagement/editGroupsManagement.html'
        };
    }
})();
