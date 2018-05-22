(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs')
        .directive('requestLogsFilters', requestLogsFilters);

    /** @ngInject */
    function requestLogsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/settings/requestLogs/requestLogsFilters/requestLogsFilters.html'
        };
    }
})();