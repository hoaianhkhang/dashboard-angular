(function () {
    'use strict';

    angular.module('BlurAdmin.pages.webhooks')
        .directive('webhooksMenu', webhooksMenu);

    /** @ngInject */
    function webhooksMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app/pages/webhooks/webhooksMenu/webhooksMenu.html'
        };
    }
})();
