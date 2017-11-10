(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.details')
        .directive('userDocuments', userDocuments);

    /** @ngInject */
    function userDocuments() {
        return {
            restrict: 'E',
            controller: 'UserDocumentsCtrl',
            templateUrl: 'app/pages/users/userDetails/userDocuments/userDocuments.html'
        };
    }
})();
