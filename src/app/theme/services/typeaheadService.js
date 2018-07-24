(function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('typeaheadService', typeaheadService);

    /** @ngInject */
    function typeaheadService(_,Rehive) {

        return {
            getUsersEmailTypeahead : function () {
                    return function (email) {
                        if(email.length > 0){
                            return Rehive.admin.users.get({filters: {
                                page_size: 10,
                                email__contains: email
                            }}).then(function (res) {
                                return _.pluck(res.results,'email');
                            });
                        }
                    };
                },
            getUsersMobileTypeahead : function () {
                return function (mobile) {
                    if(mobile.length > 0){
                        return Rehive.admin.users.get({filters: {
                            page_size: 10,
                            mobile_number__contains: mobile
                        }}).then(function (res) {
                            return _.pluck(res.results,'mobile_number');
                        });
                    }
                };
            },
            getGroupsTypeahead : function () {
                return function (groupName) {
                    if(groupName.length > 0){
                        var token = localStorageManagement.getValue('TOKEN');
                        return $http.get(environmentConfig.API + '/admin/groups/?page_size=10&name=' + groupName, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': token
                            }
                        }).then(function (res) {
                            return _.pluck(res.data.data.results,'name');
                        });
                    }
                };
            }
        };
    }

})();
