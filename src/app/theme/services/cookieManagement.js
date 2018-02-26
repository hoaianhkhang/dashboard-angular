module.exports = (function () {
    'use strict';

    angular.module('BlurAdmin.theme')
        .service('cookieManagement', cookieManagement);

    /** @ngInject */
    function cookieManagement($cookies) {

        return {
            getCookie: function (cookieName) {
                return  $cookies.get(cookieName);
            },
            setCookie: function (cookieName, cookieValue) {
                $cookies.put(cookieName, cookieValue);
            },
            deleteCookie: function (cookieName) {
                $cookies.remove(cookieName,{expires: Date.now(),path: '/'});
            }
        }
    }

});