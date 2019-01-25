(function () {
    'use strict';

    angular.module('BlurAdmin.pages.developers.tokens')
        .controller('ShowTokenModalCtrl', ShowTokenModalCtrl);

    function ShowTokenModalCtrl($scope,token,toastr) {
        $scope.token = token;

        $scope.copiedSuccessfully= function () {
            toastr.success('Token copied successfully');
        };

    }
})();
