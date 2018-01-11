(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.accountConfigurations')
        .directive('editGroupAccountConfiguration', editGroupAccountConfiguration);

    /** @ngInject */
    function editGroupAccountConfiguration() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/settings/groupsManagement/group/groupAccountConfigurations/editGroupAccountConfiguration/editGroupAccountConfiguration.html'
        };
    }
})();