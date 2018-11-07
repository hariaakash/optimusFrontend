angular.module('optimusApp')
    .controller('staffCtrl', function ($rootScope, $scope, $http, $state) {
        $rootScope.checkAuth();
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.addStaff = function (x) {
            $('#btnLoad').button('loading');
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'admins/create',
                    data: {
                        adminKey: $rootScope.adminKey,
                        email: x.email,
                    }
                })
                .then(function (res) {
                    if (res.data.status == true) {
                        $rootScope.closeModal();
                        $state.reload();
                        $rootScope.toast('Success', res.data.msg, "success");
                    } else {
                        $('#btnLoad').button('reset');
                        $rootScope.toast('Error', res.data.msg, "error");
                    }
                }, function (res) {
                    $rootScope.toast('Failed', "Some error occurred, try again.", "error");
                });
        };
        $scope.getStaffs = function () {
            $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + 'admins/staffs',
                    params: {
                        adminKey: $rootScope.adminKey
                    }
                })
                .then(function (res) {
                    if (res.data.status == true) {
                        $rootScope.staffsData = res.data.data;
                    } else {
                        $rootScope.toast('Error', res.data.msg, "error");
                        $state.go('dashboard.home');
                    }
                }, function (res) {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Failed', "Some error occurred, try again.", "error");
                });
        };
        $scope.openLog = function (x) {
            $scope.logsData = x;
            $('#viewLog').modal('show');
        };
        $scope.getStaffs();
    });