(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserDocumentsCtrl', UserDocumentsCtrl);

    /** @ngInject */
    function UserDocumentsCtrl($scope,environmentConfig,$uibModal,$stateParams,$http,localStorageManagement,errorHandler,$window) {

        var vm = this;
        vm.token = localStorageManagement.getValue('TOKEN');
        vm.uuid = $stateParams.uuid;
        $scope.loadingUserDocuments = true;

        vm.getUserDocuments = function(){
            if(vm.token) {
                $scope.loadingUserDocuments = true;
                $http.get(environmentConfig.API + '/admin/users/documents/?user=' + vm.uuid, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUserDocuments = false;
                    if (res.status === 200) {
                      $scope.userDocuments = res.data.data.results;
                    }
                }).catch(function (error) {
                    $scope.loadingUserDocuments = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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

            vm.theModal.result.then(function(document){
                if(document){
                    vm.getUserDocuments();
                }
                $window.location.reload();
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
