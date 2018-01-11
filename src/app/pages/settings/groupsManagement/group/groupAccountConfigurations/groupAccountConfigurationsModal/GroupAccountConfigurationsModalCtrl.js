(function () {
    'use strict';

    angular.module('BlurAdmin.pages.group.accountConfigurations')
        .controller('GroupAccountConfigurationsModalCtrl', GroupAccountConfigurationsModalCtrl);

    function GroupAccountConfigurationsModalCtrl($scope,$uibModalInstance,accountConfiguration,groupName,
                                                 toastr,$http,environmentConfig,cookieManagement,errorHandler) {

        var vm = this;
        vm.groupName = groupName;
        $scope.accountConfiguration = accountConfiguration;
        $scope.deletingAccountConfiguration = false;
        vm.token = cookieManagement.getCookie('TOKEN');

        $scope.deleteAccountConfiguration = function () {
            $scope.deletingAccountConfiguration = true;
            $http.delete(environmentConfig.API + '/admin/groups/' + vm.groupName + '/account-configurations/' + accountConfiguration.name + '/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': vm.token
                }
            }).then(function (res) {
                $scope.deletingAccountConfiguration = false;
                if (res.status === 200) {
                    toastr.success('Account configuration successfully deleted');
                    $uibModalInstance.close($scope.accountConfiguration);
                }
            }).catch(function (error) {
                $scope.deletingAccountConfiguration = false;
                errorHandler.evaluateErrors(error.data);
                errorHandler.handleErrors(error);
            });
        };



    }
})();
