(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .directive('columnsFilter', columnsFilter);

    /** @ngInject */
    function columnsFilter() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/users/columnsFilter/columnsFilter.html'
        };
    }
})();