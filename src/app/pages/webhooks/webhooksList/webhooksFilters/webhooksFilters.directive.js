(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks.list')
        .directive('webhooksFilters', webhooksFilters);

    /** @ngInject */
    function webhooksFilters() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/webhooks/webhooksList/webhooksFilters/webhooksFilters.html'
        };
    }
})();