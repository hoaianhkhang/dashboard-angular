(function () {
    'use strict';

    angular.module('BlurAdmin.pages.settings.requestLogs')
        .directive('requestColumnsFilter', requestColumnsFilter);

    /** @ngInject */
    function requestColumnsFilter() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/settings/requestLogs/requestColumnsFilter/requestColumnsFilter.html'
        };
    }
})();