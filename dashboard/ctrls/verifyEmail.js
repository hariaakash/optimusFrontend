angular.module('optimusApp')
    .controller('verifyEmailCtrl', function ($scope, $rootScope, $state, $http, $stateParams) {
        $rootScope.checkAuth();
        $scope.data = {
            email: decodeURIComponent($stateParams.email),
            key: $stateParams.key
        };
        $scope.verifyEmail = () => {
            if ($scope.data.key && $scope.data.email) {
                $http({
                        method: 'POST',
                        url: $rootScope.apiUrl + 'users/verifyEmail',
                        data: $scope.data
                    })
                    .then((res) => {
                        if (res.data.status) {
                            $rootScope.toast('Success', res.data.msg, "success");
                            $state.go('login');
                        } else {
                            $rootScope.toast('Failed', res.data.msg, "error");
                        }
                    }, () => {
                        $rootScope.toast('Failed', "Some error occurred, try again.", "error");
                    });
            } else {
                $state.go('login');
            }
        };
    });