(function () {
    'use strict';

    angular.module('BlurAdmin.pages.services.rewardsService.rewardsServiceRequests')
        .directive('rewardsServiceRequestsFilters', rewardsServiceRequestsFilters);

    /** @ngInject */
    function rewardsServiceRequestsFilters() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/services/rewardsService/rewardsServiceRequests/rewardsServiceRequestsFilters/rewardsServiceRequestsFilters.html'
        };
    }
})();