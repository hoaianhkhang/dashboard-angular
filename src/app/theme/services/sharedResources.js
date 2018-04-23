(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('sharedResources', sharedResources);

    /** @ngInject */
    function sharedResources($http,environmentConfig,_,localStorageManagement) {

        return {
            getSubtypes : function () {
                var token = localStorageManagement.getValue('TOKEN');
                return $http.get(environmentConfig.API + '/admin/subtypes/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': token
                    }
                });
            }
        }
    }

})();
