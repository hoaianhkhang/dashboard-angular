(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
        .directive('addTokenView', addTokenView);

    /** @ngInject */
    function addTokenView() {
        return {
            restrict: 'E',
            require: '^parent',
            templateUrl: 'app/pages/developers/tokens/addToken/addToken.html'
        };
    }
})();
