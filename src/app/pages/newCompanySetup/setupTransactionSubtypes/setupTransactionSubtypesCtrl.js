(function () {
    'use strict';

    angular.module('BlurAdmin.pages.newCompanySetup.setupTransactionSubtypes')
        .controller("SetupTransactionSubtypesCtrl", SetupTransactionSubtypesCtrl);

    function SetupTransactionSubtypesCtrl($rootScope,$scope,toastr,$ngConfirm,$filter,
                                          Rehive,$location,errorHandler,localStorageManagement) {

        var vm = this;
        vm.token = localStorageManagement.getValue("token");
        $scope.subtypes = [];
        $scope.subtype= {
            tx_type: 'credit'
        };
        $rootScope.$pageFinishedLoading = true;
        $rootScope.activeSetupRoute = 3;
        localStorageManagement.setValue('activeSetupRoute',3);
        $scope.editingSubtypes = false;
        $scope.loadingSetupSubtypes= true;

        $scope.goToNextView=function () {
            $location.path('/currencies');
        };
        $scope.goToPrevView=function () {
            $location.path('company/setup/accounts');
        };

        $scope.setupSubtypesNameChanged = function (subtype) {
            if(subtype.name){
                subtype.name = subtype.name.toLowerCase();
                subtype.label = $filter('capitalizeWord')(subtype.name).replace(/_/g, " ").replace(/-/g, " ");
            } else {
                subtype.label = '';
            }
        };

        vm.getSubtypes = function(){
            if(vm.token){
                $scope.loadingSetupSubtypes= true;
                Rehive.admin.subtypes.get().then(function (res) {
                    $scope.subtypes = res;
                    if($scope.subtypes.length==0){
                        $rootScope.setupSubtypes = 0;
                        localStorageManagement.setValue('setupSubtypes',0);
                    }
                    else {
                        $rootScope.setupSubtypes = 1;
                        localStorageManagement.setValue('setupSubtypes',1);
                    }
                    $scope.loadingSetupSubtypes= false;
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingSetupSubtypes= false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            } else {
                $rootScope.gotToken = false;
                $rootScope.securityConfigured = true;
                $rootScope.pageTopObj = {};
                localStorageManagement.deleteValue('TOKEN');
                localStorageManagement.deleteValue('token');
                Rehive.removeToken();
                toastr.error('Your session has expired, please log in again');
                $location.path('/login');
            }
        };
        vm.getSubtypes();
        
        $scope.addSubtype = function (subtype) {
            $scope.loadingSetupSubtypes= true;
            Rehive.admin.subtypes.create(subtype).then(function (res)
            {
                $scope.subtype= {
                    tx_type: 'credit'
                };
                vm.getSubtypes();
                $scope.$apply();
            }, function (error) {
                $scope.loadingSetupSubtypes= false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.updateSubtype = function (subtype) {
            $scope.loadingSetupSubtypes= true;
            var newSubtype = {
                tx_type: subtype.tx_type,
                label: subtype.label
            };
            if(subtype.prevName!==subtype.name){
                newSubtype.name = subtype.name;
            }

            Rehive.admin.subtypes.update(subtype.id, newSubtype).then(function (res) {
                $scope.subtype= {
                    tx_type: 'credit'
                };
                $scope.editingSubtypes = false;
                $scope.loadingSetupSubtypes= false;
                $scope.$apply();
            }, function (error) {
                $scope.loadingSetupSubtypes= false;
                $rootScope.$pageFinishedLoading = true;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.deleteSubtypeConfirm = function (id) {
            $ngConfirm({
                title: 'Delete subtype',
                content: 'Are you sure you want to delete this subtype?',
                animationBounce: 1,
                animationSpeed: 100,
                scope: $scope,
                buttons: {
                    close: {
                        text: "No",
                        btnClass: 'btn-default pull-left dashboard-btn'
                    },
                    ok: {
                        text: "Yes",
                        btnClass: 'btn-primary dashboard-btn',
                        keys: ['enter'], // will trigger when enter is pressed
                        action: function(scope){
                            $scope.deleteSelectedItem(id);
                        }
                    }
                }
            });
        };

        $scope.deleteSelectedItem = function (id) {
            $scope.loadingSetupSubtypes= true;
            Rehive.admin.subtypes.delete(id).then(function (res) {
                vm.getSubtypes();
                $scope.$apply();
            }, function (error) {
                $scope.loadingSetupSubtypes= false;
                errorHandler.evaluateErrors(error);
                errorHandler.handleErrors(error);
                $scope.$apply();
            });
        };

        $scope.editSubtypeObj = function(subtype) {
            $scope.subtype = subtype;
            $scope.editingSubtypes = true;
            $scope.subtype.prevName = subtype.name;
        };
    }
})();
