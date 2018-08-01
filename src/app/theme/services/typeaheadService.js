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
                        return Rehive.admin.groups.get({filters: {name: groupName,page_size: 10}}).then(function (res) {
                            return _.pluck(res.results,'name');
                        });
                    }
                };
            }
        };
    }

})();
