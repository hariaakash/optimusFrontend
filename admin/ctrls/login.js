angular.module('optimusApp')
    .controller('loginCtrl', function ($scope, $rootScope, $http) {
        $rootScope.checkAuth();
        $scope.loginUser = () => {
            $('#btnLoad').button('loading');
            $http({
                method: 'POST',
                url: $rootScope.apiUrl + 'admins/login',
                data: $scope.user
            }).then((res) => {
                if (res.data.status == true) {
                    $rootScope.adminKey = res.data.adminKey;
                    Cookies.set('adminKey', $rootScope.adminKey);
                    $rootScope.checkAuth(true);
                    $rootScope.toast('Success', res.data.msg, 'success');
                } else {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Error', res.data.msg, 'error');
                }
            }, () => {
                $('#btnLoad').button('reset');
                $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
            });
        };
    });