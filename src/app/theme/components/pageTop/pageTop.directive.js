/**
 * @author v.lugovksy
 * created on 16.12.2015
 */

import pageTopCtrl from './PageTopCtrl';

module.exports = (function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html',
      controller: 'PageTopCtrl'
    };
  }

});

pageTopCtrl();