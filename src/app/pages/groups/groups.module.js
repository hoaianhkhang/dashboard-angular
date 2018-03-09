(function () {
    'use strict';

    angular.module('BlurAdmin.pages.groups', [
        'BlurAdmin.pages.groups.overview',
        'BlurAdmin.pages.groups.groupUsers',
        'BlurAdmin.pages.groups.editGroup',
        'BlurAdmin.pages.groups.groupAccountConfigurations',
        'BlurAdmin.pages.groups.groupManagementTiers',
        'BlurAdmin.pages.groups.groupTransactionSettings'
    ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('groups', {
                url: '/groups',
                template: "<ui-view autoscroll='true' autoscroll-body-top></ui-view>",
                controller: function ($scope,_,$state) {
                    $scope.$on('$locationChangeStart', function (event,newUrl) {
                         var newUrlArray = newUrl.split('/'),
                             newUrlLastElement = _.last(newUrlArray);
                         if(newUrlLastElement == 'groups'){
                             $state.go('groups.overview');
                         }
                    });
                },
                title: "Groups",
                sidebarMeta: {
                    order: 600
                }
            });
    }

})();
