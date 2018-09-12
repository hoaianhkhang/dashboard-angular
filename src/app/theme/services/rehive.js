(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .factory('Rehive', Rehive);

    /** @ngInject */
    function Rehive($window,environmentConfig) {
        var config = {};
        if(environmentConfig.API.indexOf('staging') >= 0){
            config = {
                apiVersion: 3,
                storageMethod: 'local',
                network: 'staging'
            };
        } else {
            config = {
                apiVersion: 3,
                storageMethod: 'local'
            };
        }
        var rehive = new $window.Rehive(config);
        return rehive;
    }

})();