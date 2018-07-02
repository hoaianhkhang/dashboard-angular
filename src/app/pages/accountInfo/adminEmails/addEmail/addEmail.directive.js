(function () {
    'use strict';

    angular.module('BlurAdmin.pages.adminEmails')
        .directive('addEmail', addEmail);

    /** @ngInject */
    function addEmail() {
        return {
            restrict: 'E',
            controller: 'AdminEmailsCtrl',
            templateUrl: 'app/pages/accountInfo/adminEmails/addEmail/addEmail.html'
        };
    }
})();