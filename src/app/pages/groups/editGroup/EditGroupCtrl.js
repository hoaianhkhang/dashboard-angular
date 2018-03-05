(function () {
    'use strict';

    angular.module('BlurAdmin.pages.editGroup')
        .controller('EditGroupCtrl', EditGroupCtrl);

    /** @ngInject */
    function EditGroupCtrl($scope,$http,environmentConfig,cookieManagement,$uibModal,errorHandler,$ngConfirm,toastr) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');



    }
})();
