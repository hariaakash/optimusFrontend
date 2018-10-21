angular.module('optimusApp')
    .controller('sendEmailVerificationCtrl', function($scope, $state, $http, $rootScope) {
        $rootScope.checkAuth();
        $scope.sendEmailVerification = function() {
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'users/sendEmailVerification',
                    data: $scope.data
                })
                .then(function(res) {
                    if (res.data.status) {
                        $state.go('login');
                        $rootScope.toast('Success', res.data.msg, "success");
                    } else {
                        $rootScope.toast('Failed', res.data.msg, "error");
                    }
                }, function() {
                    $rootScope.toast('Failed', "Some error occurred, try again.", "error");
                });
        };
    });
