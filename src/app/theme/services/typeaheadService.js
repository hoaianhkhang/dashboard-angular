(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('typeaheadService', typeaheadService);

    /** @ngInject */
    function typeaheadService($http,environmentConfig,_,localStorageManagement) {

        return {
            getUsersEmailTypeahead : function () {
                    return function (email) {
                        if(email.length > 0){
                            var token = localStorageManagement.getValue('TOKEN');
                            return $http.get(environmentConfig.API + '/admin/users/?page_size=10&email__contains=' + encodeURIComponent(email), {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token
                                }
                            }).then(function (res) {
                                return _.pluck(res.data.data.results,'email');
                            });
                        }
                    };
                },
            getUsersMobileTypeahead : function () {
                return function (mobile) {
                    if(mobile.length > 0){
                        var token = localStorageManagement.getValue('TOKEN');
                        return $http.get(environmentConfig.API + '/admin/users/?page_size=10&mobile_number__contains=' + encodeURIComponent(mobile), {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            return _.pluck(res.data.data.results,'mobile_number');
                        });
                    }
                };
            }
        };
    }

})();
