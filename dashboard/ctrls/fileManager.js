angular.module('optimusApp')
    .controller('fileManagerCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $sce) {
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
        $scope.getAppInfo();
    });