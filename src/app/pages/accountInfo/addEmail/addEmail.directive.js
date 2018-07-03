(function () {
    'use strict';

    angular.module('BlurAdmin.pages.accountInfo')
        .directive('addEmail', addEmail);

    /** @ngInject */
    function addEmail() {
        return {
            restrict: 'E',
            controller: 'AccountInfoCtrl',
            templateUrl: 'app/pages/accountInfo/addEmail/addEmail.html'
        };
    }
})();