(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groupTransactionSettings', [])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groupTransactionSettings', {
                url: '/groups/:groupName/transaction-settings',
                controller: 'GroupTransactionSettingsCtrl',
                templateUrl: 'app/pages/groups/groupTransactionSettings/groupTransactionSettings.html',
                title: "Group transaction settings"
            });
    }

})();
