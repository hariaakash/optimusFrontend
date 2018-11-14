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
            $('#btnLoad').button('reset');
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
                            delete $scope.delAppForm.action;
                            delete $scope.appData;
                            $rootScope.closeModal();
                            $state.go('dashboard.home');
                            $rootScope.toast('Success', res.data.msg, 'success');
                        } else if (process == 'sftp') {
                            $scope.appData.sftp = res.data.data;
                            $rootScope.openModal('sftp');
                        } else {
                            $rootScope.closeModal();
                            $state.reload();
                            $rootScope.toast('Success', res.data.msg, 'success');
                        }
                    } else {
                        $rootScope.toast('Failed', `Unable to perform: ${process}`, 'error');
                        $('#btnLoad').button('reset');
                    }
                }, () => {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $scope.setDns = (domain) => {
            $('#btnLoad').button('loading');
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'containers/setDns',
                    data: {
                        authKey: $rootScope.authKey,
                        containerId: $scope.containerId,
                        domain,
                    }
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $rootScope.closeModal();
                        $state.reload();
                        $rootScope.toast('Success', res.data.msg, 'success');
                    } else {
                        $('#btnLoad').button('reset');
                        $rootScope.toast('Failed', res.data.msg, 'error');
                    }
                }, () => {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $interval(() => {
            $scope.getStats();
        }, 60000);
        $scope.getAppInfo();
    });