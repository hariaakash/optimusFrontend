angular.module('optimusApp')
    .controller('loginCtrl', function($scope, $rootScope, $http, $state) {
        $rootScope.checkAuth();
        $scope.loginUser = function() {
            $('#btnLoad').button('loading');
            $http({
                method: 'POST',
                url: $rootScope.apiUrl + 'users/login',
                data: $scope.user
            }).then(function(res) {
                if (res.data.status == true) {
                    var authKey = res.data.authKey;
                    Cookies.set('authKey', authKey);
                    $rootScope.checkAuth(true);
                    $rootScope.toast('Success', res.data.msg, 'success');
                } else {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Failed', res.data.msg, 'error');
                }
            }, function(res) {
                $('#btnLoad').button('reset');
                $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
            });
        };
    });
