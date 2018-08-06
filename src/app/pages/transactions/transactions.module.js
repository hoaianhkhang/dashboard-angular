(function () {
    'use strict';

    angular.module('BlurAdmin.pages.transactions', [
            'BlurAdmin.pages.transactions.history',
            'BlurAdmin.pages.transactions.subtypes'
        ])
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider,$urlRouterProvider) {
        $stateProvider
            .state('transactions', {
                url: '/transactions',
                template : '<div ui-view="transactionsViews"></div>',
                controller: function ($scope,_,$state,$location) {

                    var vm = this;
                    vm.location = $location.path();
                    vm.locationArray = vm.location.split('/');
                    $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
                    if($scope.locationIndicator == 'transactions'){
                        $state.go('transactions.history');
                    }
                    $scope.$on('$locationChangeStart', function (event,newUrl) {
                        var newUrlArray = newUrl.split('/'),
                            newUrlLastElement = _.last(newUrlArray);
                        if(newUrlLastElement == 'transactions'){
                            $state.go('transactions.history');
                        }
                    });
                },
                title: 'Transactions',
                sidebarMeta: {
                    order: 200
                }
            });
        $urlRouterProvider.when("/transactions", "/transactions/setup");
    }

})();