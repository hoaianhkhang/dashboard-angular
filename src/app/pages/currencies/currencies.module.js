(function () {
  'use strict';

  angular.module('BlurAdmin.pages.currencies', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('currencies', {
          url: '/currencies',
          templateUrl: 'app/pages/currencies/currencies.html',
          controller: 'CurrenciesCtrl',
          title: 'Currencies',
          sidebarMeta: {
            order: 100
          }
        });
  }

})();
