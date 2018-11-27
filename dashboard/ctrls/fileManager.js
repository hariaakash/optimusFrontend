angular.module('optimusApp')
    .controller('fileManagerCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $sce, $location, $interval) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.containerId = $stateParams.containerId;
        $scope.getAppInfo = function () {
            if ($scope.containerId) {
                $http({
                        method: 'GET',
                        url: $rootScope.apiUrl + 'containers/',
                        params: {
                            authKey: $rootScope.authKey,
                            containerId: $scope.containerId
                        }
                    })
                    .then(function (res) {
                        if (res.data.status == true) {
                            $scope.appData = res.data.data;
                            // $scope.getStats();
                            $scope.url = $sce.trustAsResourceUrl(`https://sftp.optimuscp.io/?containerId=${$scope.containerId}&authKey=${$rootScope.authKey}`);
                        } else {
                            $rootScope.toast('Failed', res.data.msg, 'error');
                            $state.go('dashboard.home');
                        }
                    }, function (res) {
                        $rootScope.toast('Failed', 'Some error occurred, try again.', 'error');
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
                    },
                    ignoreLoadingBar: true
                })
                .then((res) => {
                    if (res.data.status == true) $scope.appData.stats = res.data.data.stats;
                    else delete $scope.appData.stats;
                }, () => {
                    delete $scope.appData.stats;
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        // $interval(() => {
        //     if ($location.path().includes('/fileManager'))
        //         $scope.getStats();
        // }, 60000);
        $scope.getAppInfo();
    });