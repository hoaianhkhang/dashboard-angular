(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userBasicInfo', userBasicInfo);

    /** @ngInject */
    function userBasicInfo() {
        return {
            restrict: 'E',
            controller: 'UserBasicInfoCtrl',
            templateUrl: 'app/pages/users/userDetails/userBasicInfo/userBasicInfo.html'
        };
    }
})();
