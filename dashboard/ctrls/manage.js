angular.module('optimusApp')
    .controller('manageCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $window, $interval) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.containerId = $stateParams.containerId;
        $scope.getAppInfo = () => {
            if ($scope.containerId) {
                $http({
                        method: 'GET',
                        url: $rootScope.apiUrl + 'containers/',
                        params: {
                            authKey: $rootScope.authKey,
                            containerId: $scope.containerId
                        }
                    })
                    .then((res) => {
                        if (res.data.status == true) {
                            $rootScope.appData = res.data.data;
                        } else {
                            $rootScope.toast('Failed', res.data.msg, 'error');
                            $state.go('dashboard.home');
                        }
                    }, () => {
                        $rootScope.toast('Failed', 'Some error occurred, try again.', 'error');
                    });
            } else {
                $state.go('dashboard.home');
            }
        };
        $scope.exec = (process) => {
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'containers/' + process,
                    data: {
                        authKey: $rootScope.authKey,
                        containerId: $scope.containerId,
                    }
                })
                .then((res) => {
                    if (res.data.status == true) $rootScope.appData.stats = res.data.data.stats;
                    else delete $rootScope.appData.stats;
                }, () => {
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        if ($scope.containerId)
            $interval(() => {
                $http({
                        method: 'GET',
                        url: $rootScope.apiUrl + 'containers/stats',
                        params: {
                            authKey: $rootScope.authKey,
                            containerId: $scope.containerId,
                        }
                    })
                    .then((res) => {
                        if (res.data.status == true) $rootScope.appData.stats = res.data.data.stats;
                        else delete $rootScope.appData.stats;
                    }, () => {
                        $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                    });
            }, 10000);
        $scope.getAppInfo();
    });