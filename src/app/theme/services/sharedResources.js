module.exports = (function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('sharedResources', sharedResources);

    /** @ngInject */
    function sharedResources($http,environmentConfig,_,cookieManagement) {

        return {
            getSubtypes : function () {
                var token = cookieManagement.getCookie('TOKEN');
                return $http.get(environmentConfig.API + '/admin/subtypes/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });
            }
        }
    }

});
