angular.module('optimusApp')
    .controller('oauthCtrl', function ($scope, $rootScope, $state, $http, $stateParams) {
        $rootScope.checkAuth();
        $scope.socialAuth = (data) => {
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'users/oauth',
                    data,
                })
                .then((res) => {
                    if (res.data.status == true) {
                        Cookies.set('authKey', res.data.authKey);
                        $rootScope.checkAuth(true);
                        $rootScope.toast('Success', res.data.msg, 'success');
                    } else {
                        $state.go('login');
                        $rootScope.toast('Failed', res.data.msg, 'error');
                    }
                }, () => {
                    $state.go('login');
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        if ($stateParams.code && $stateParams.state) {
            switch ($stateParams.state) {
                case 'google':
                    $scope.socialAuth({
                        social: 'google',
                        code: $stateParams.code,
                    });
                    break;
                case 'github':
                    $scope.socialAuth({
                        social: 'github',
                        code: $stateParams.code,
                    });
                    break;
                default:
                    $rootScope.toast('Failed', 'Accessed without permissions.', 'error');
                    $state.go('login');
            }
        } else {
            $rootScope.toast('Failed', 'Accessed without permissions.', 'error');
            $state.go('login');
        }
    });