(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCtrl', UserCtrl);

    /** @ngInject */
    function UserCtrl($scope,Rehive,localStorageManagement,$uibModal,_,toastr,
                      $rootScope,errorHandler,$stateParams,$location,$window,$filter) {

        var vm = this;
        vm.token = localStorageManagement.getValue('token');
        $rootScope.dashboardTitle = 'User | Rehive';
        $rootScope.shouldBeBlue = 'Users';
        vm.uuid = $stateParams.uuid;
        $scope.user = {};
        $scope.loadingUser = true;
        $scope.headerArray = [];
        $scope.profilePictureFile = {
            file: {}
        };
        vm.location = $location.path();
        vm.locationArray = vm.location.split('/');
        $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];

        $scope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            vm.locationArray = vm.location.split('/');
            $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
            vm.locationTracker(vm.location);
        });

        vm.locationTracker = function (location) {
            var baseLocation = '/user/' + vm.uuid;
            var remainingLocation = location.split(baseLocation).pop();
            var remainingLocationArray = remainingLocation.split('/');

            if(remainingLocationArray[1] == 'details'){
                $scope.trackedLocation = 'details';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'accounts'){
                $scope.trackedLocation = 'accounts';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'transactions'){
                $scope.trackedLocation = 'transactions';
                $scope.secondaryTrackedLocation = '';
            } else if (remainingLocationArray[1] == 'permissions'){
                $scope.trackedLocation = 'permissions';
                $scope.secondaryTrackedLocation = '';
            } else if(remainingLocationArray[1] == 'account'){
                $scope.locationIndicator = 'accounts';
                $scope.trackedLocation = 'account';
                $scope.secondaryTrackedLocation = '';
                if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'limits'){
                    $scope.secondaryTrackedLocation = 'limits';
                } else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'fees'){
                    $scope.secondaryTrackedLocation = 'fees';
                }else if(remainingLocationArray[(remainingLocationArray.length - 1)] == 'settings'){
                    $scope.secondaryTrackedLocation = 'settings';
                }
            }
        };
        vm.locationTracker(vm.location);

        $rootScope.$on('userGroupChanged',function (event,groupChanged) {
            if(groupChanged){
                vm.getUser();
            }
        });

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUser = true;
                Rehive.admin.users.get({identifier: vm.uuid}).then(function (res) {
                    $scope.loadingUser = false;
                    $scope.user = res;
                    vm.calculateHowLongUserHasBeenWithCompany($scope.user.created);
                    $window.sessionStorage.userData = JSON.stringify(res);
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUser = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };
        vm.getUser();

        $scope.copiedSuccessfully= function () {
            toastr.success('Identifier copied to clipboard');
        };

        vm.calculateHowLongUserHasBeenWithCompany = function (joinedDate) {
            var text = '',
                joiningDate = moment(joinedDate),
                dateNow = moment(Date.now()),
                preciseDiff = moment.preciseDiff(dateNow, joiningDate, true);

            if(preciseDiff.years){
                if(preciseDiff.years === 1){
                    text = preciseDiff.years + ' year';
                } else {
                    text = preciseDiff.years + ' years';
                }
            }

            if(preciseDiff.months){
                if(preciseDiff.years){
                    text = text + ' and ';
                }
                if(preciseDiff.months === 1){
                    text = preciseDiff.months + ' month';
                } else {
                    text = preciseDiff.months + ' months';
                }
            }

            if(preciseDiff.days){
                if(preciseDiff.years || preciseDiff.months){
                    text = text + ' and ';
                }
                if(preciseDiff.days === 1){
                    text = text + preciseDiff.days + ' day';
                } else {
                    text = text + preciseDiff.days + ' days';
                }
            }

            if(preciseDiff.hours){
                if(preciseDiff.years || preciseDiff.months || preciseDiff.days){
                    text = text + ' and ';
                }
                if(preciseDiff.hours === 1){
                    text = text + preciseDiff.hours + ' hour';
                } else {
                    text = text + preciseDiff.hours + ' hours';
                }
            }

            if(text === ''){
                text = 'less than one hour';
            }
            $scope.beenAUser = text;
        };

        $scope.getFileName = $filter('date')(Date.now(),'mediumDate') + ' ' + $filter('date')(Date.now(),'shortTime') + '-UserInfo.csv';

        $scope.getCSVArray = function () {
            var array = [],
                userData = JSON.parse($window.sessionStorage.userData),
                userEmails = JSON.parse($window.sessionStorage.userEmails),
                userMobiles = JSON.parse($window.sessionStorage.userMobiles),
                userBanks = JSON.parse($window.sessionStorage.userBanks),
                userAddresses = JSON.parse($window.sessionStorage.userAddresses);

            userData.age = ($filter('ageCalculator')(userData.birth_date)).toString();
            userData.nationality = $filter('isoCountry')(userData.nationality);
            userData.created = $filter('date')(userData.created,'MMM d y') + ' ' +$filter('date')(userData.created,'shortTime');
            userData.last_login = $filter('date')(userData.last_login,'MMM d y') + ' ' +$filter('date')(userData.last_login,'shortTime');

            var filteredUserData = _.pick(userData,'identifier','first_name','last_name','username','birth_date','age',
                'nationality','language','company', 'timezone','verified','created','last_login');

            var filteredUserEmails = _.pluck(userEmails,'email');
            var filteredUserMobiles = _.pluck(userMobiles,'number');

            for(var key in filteredUserData) {
                var obj = {};
                obj[key] = [key,userData[key]];
                array.push(obj);
            }

            array.push({email: ['email addresses',filteredUserEmails]});
            array.push({number: ['mobile numbers',filteredUserMobiles]});

            userAddresses.forEach(function (element) {
                var obj = {},subArray = ['address'];
                for(var k in _.omit(element,'status','user','id')){
                    subArray.push(element[k]);
                }

                obj[element.id] = subArray;
                array.push(obj);
            });

            userBanks.forEach(function (element) {
                var obj = {},subArray = ['bank account'];
                for(var k in _.omit(element,'status','id','user','code')){
                    subArray.push(element[k]);
                }

                obj[element.id] = subArray;
                array.push(obj);
            });

            return array;

        };

        $scope.toggleActivateUser = function(active){
            if(vm.token) {
                $scope.loadingUser = true;

                var formData = new FormData();

                formData.append('active', active);

                Rehive.admin.users.update(vm.uuid, formData).then(function (res) {
                    if(active){
                        toastr.success('Successfully activated the user');
                    } else {
                        toastr.success('Successfully deactivated the user');
                    }
                    vm.getUser();
                    $scope.$apply();
                }, function (error) {
                    $scope.loadingUser = false;
                    errorHandler.evaluateErrors(error);
                    errorHandler.handleErrors(error);
                    $scope.$apply();
                });
            }
        };

        $scope.openUserProfilePictureModal = function (page, size, user) {
            vm.theModal = $uibModal.open({
                animation: true,
                templateUrl: page,
                size: size,
                controller: 'UserProfilePictureModalCtrl',
                scope: $scope,
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            vm.theModal.result.then(function(user){
                if(user){
                    vm.getUser();
                }
            }, function(){
            });
        };

        $scope.goToBreadCrumbsView = function (path) {
            $location.path(path);
        };


    }
})();