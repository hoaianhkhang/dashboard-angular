module.exports = (function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('_', _);

    /** @ngInject */
    function _() {
        return require('underscore');
    }

});