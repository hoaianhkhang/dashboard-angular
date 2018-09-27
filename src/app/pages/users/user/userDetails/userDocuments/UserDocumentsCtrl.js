(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserDocumentsCtrl', UserDocumentsCtrl);

    /** @ngInject */
    function UserDocumentsCtrl($scope,Rehive,$uibModal,$stateParams,localStorageManagement,errorHandler,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserDocuments = true;

        vm.getUserDocuments = function(){
            if(vm.token) {
                $scope.loadingUserDocuments = true;
                Rehive.admin.users.documents.get({filters: {user: vm.uuid}}).then(function (res) {
                    $scope.loadingUserDocuments = false;
                    $scope.userDocuments = res.results;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUserDocuments = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUserDocuments();

        $scope.openUserDocumentModal = function (page, document) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                controller: 'UserDocumentModalCtrl',
                windowClass: 'document-modal-window',
                scope: $scope,
                resolve: {
                    document: function () {
                        return document;
                    },
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theModal.result.then(function(successObj){
                if(successObj.success){
                    vm.getUserDocuments();
                }
                if(!successObj.dontReload){
                    $window.location.reload();
                }
            }, function(){
            });
        };

        $scope.openAddUserDocumentModal = function (page, size) {
            vm.theAddModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'AddUserDocumentModalCtrl',
                scope: $scope,
                resolve: {
                    uuid: function () {
                        return vm.uuid;
                    }
                }
            });

            vm.theAddModal.result.then(function(){
                vm.getUserDocuments();
            }, function(){
            });
        };



    }
})();
