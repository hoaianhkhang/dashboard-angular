(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group')
        .directive('groupMenu', groupMenu);

    /** @ngInject */
    function groupMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupMenu/groupMenu.html'
        };
    }
})();
