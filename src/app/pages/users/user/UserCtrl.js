(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users.user')
        .controller('UserCtrl', UserCtrl);

    /** @ngInject */
    function UserCtrl($scope,environmentConfig,$http,cookieManagement,$uibModal,_,toastr,
                      $rootScope,errorHandler,$stateParams,$location,$window,$filter) {

        var vm = this;
        vm.token = cookieManagement.getCookie('TOKEN');
        $rootScope.dashboardTitle = 'Rehive | User';
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

        $rootScope.$on('$locationChangeStart', function (event,newUrl) {
            vm.location = $location.path();
            vm.locationArray = vm.location.split('/');
            $scope.locationIndicator = vm.locationArray[vm.locationArray.length - 1];
        });

        vm.getUser = function(){
            if(vm.token) {
                $scope.loadingUser = true;
                $http.get(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    $scope.loadingUser = false;
                    if (res.status === 200) {
                        $scope.user = res.data.data;
                        vm.calculateHowLongUserHasBeenWithCompany($scope.user.date_joined);
                        $window.sessionStorage.userData = JSON.stringify(res.data.data);
                    }
                }).catch(function (error) {
                    $scope.loadingUser = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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
            userData.date_joined = $filter('date')(userData.date_joined,'MMM d y') + ' ' +$filter('date')(userData.date_joined,'shortTime');
            userData.last_login = $filter('date')(userData.last_login,'MMM d y') + ' ' +$filter('date')(userData.last_login,'shortTime');

            var filteredUserData = _.pick(userData,'identifier','first_name','last_name','username','birth_date','age',
                'nationality','language','company', 'timezone','verified','date_joined','last_login');

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
                $http.patch(environmentConfig.API + '/admin/users/' + vm.uuid + '/', {active: active}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': vm.token
                    }
                }).then(function (res) {
                    if (res.status === 200) {
                        if(active){
                            toastr.success('Successfully activated the user');
                        } else {
                            toastr.success('Successfully deactivated the user');
                        }
                        vm.getUser();
                    }
                }).catch(function (error) {
                    $scope.loadingUser = false;
                    errorHandler.evaluateErrors(error.data);
                    errorHandler.handleErrors(error);
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


    }
})();