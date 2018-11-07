angular.module('optimusApp')
    .controller('setPasswordCtrl', function ($scope, $rootScope, $state, $http, $stateParams) {
        $rootScope.checkAuth();
        $scope.data = {
            email: $stateParams.email,
            key: $stateParams.key
        };
        $scope.changePassword = function () {
            $scope.data.password = $scope.pass1;
            if ($scope.data.key && $scope.data.email) {
                $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + 'admins/setPassword',
                        data: $scope.data
                    })
                    .then(function (res) {
                        if (res.data.status) {
                            $state.go('login');
                            $rootScope.toast('Success', res.data.msg, 'success', 0);
                        } else {
                            $rootScope.toast('Failed', res.data.msg, 'error');
                        }
                    }, function () {
                        $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                    });
            } else {
                $state.go('login');
            }
        };
    });