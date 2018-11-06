angular.module('optimusApp')
    .controller('homeCtrl', function ($rootScope, $scope, $http, $state) {
        $rootScope.checkAuth();
        if (!$rootScope.homeCurrentPage)
            $rootScope.homeCurrentPage = 1;
        $scope.pageSize = 10;
        $scope.blockUser = (x) => {
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'admins/blockUser',
                    data: {
                        adminKey: $rootScope.adminKey,
                        userId: x
                    }
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $scope.getUsersInfo();
                        $rootScope.toast('Success', res.data.msg, 'success');
                    } else {
                        $('#btnLoad').button('reset');
                        $rootScope.toast('Failed', res.data.msg, 'error');
                    }
                }, () => {
                    $rootScope.toast('Failed', 'Some error occurred, try again.', 'error');
                });
        };
        $scope.unBlockUser = (x) => {
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'admins/unblockUser',
                    data: {
                        adminKey: $rootScope.adminKey,
                        userId: x
                    }
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $scope.getUsersInfo();
                        $rootScope.toast('Success', res.data.msg, 'success');
                    } else {
                        $('#btnLoad').button('reset');
                        $rootScope.toast('Failed', res.data.msg, 'error');
                    }
                }, () => {
                    $rootScope.toast('Failed', 'Some error occurred, try again.', 'error');
                });
        };
        $scope.updatePage = (x) => {
            $rootScope.homeCurrentPage = x;
        };
        $scope.getUsersInfo = () => {
            $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + 'admins/users',
                    params: {
                        adminKey: $rootScope.adminKey,
                    }
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $scope.usersData = res.data.data;
                    } else {
                        $rootScope.toast('Failed', res.data.msg, 'error');
                    }
                }, () => {
                    $rootScope.toast('Failed', 'Some error occurred, try again.', 'error');
                });
        };
        $scope.getUsersInfo();
    });