angular.module('optimusApp')
    .controller('manageCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $interval) {
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
                            $scope.appData = res.data.data;
                            $scope.getStats();
                        } else {
                            $rootScope.toast('Failed', res.data.msg, 'error');
                            $state.go('dashboard.home');
                        }
                    }, () => {
                        $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                    });
            } else {
                $state.go('dashboard.home');
            }
        };
        $scope.getStats = () => {
            $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + 'containers/stats',
                    params: {
                        authKey: $rootScope.authKey,
                        containerId: $scope.containerId,
                    }
                })
                .then((res) => {
                    if (res.data.status == true) $scope.appData.stats = res.data.data.stats;
                    else delete $scope.appData.stats;
                }, () => {
                    delete $scope.appData.stats;
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
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
                    if (res.data.status == true) {
                        if (process == 'delete') {
                            $rootScope.closeModal();
                            $state.go('login');
                        } else {
                            $state.reload();
                        }
                        $rootScope.toast('Success', res.data.msg, 'success')
                    } else $rootScope.toast('Failed', `Unable to perform: ${process}`, 'error');
                }, () => {
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $interval(() => {
            $scope.getStats();
        }, 60000);
        $scope.getAppInfo();
    });