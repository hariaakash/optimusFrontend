angular.module('optimusApp')
    .controller('manageCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $sce) {
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
                            $scope.appData.logs = [];
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
        $scope.exec = (process) => {
            $('#btnLoad').button('loading');
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
                        $('#btnLoad').button('reset');
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
            if (~domain.indexOf('http') || ~domain.indexOf('www')) {
                $rootScope.toast('Failed', 'Domain should not contain http or https or www.', 'error');
            } else {
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
            }
        };
        $scope.getAppInfo();
        $rootScope.$watch('socket.connected', (data) => {
            if (data) {
                $scope.ansi_up = new AnsiUp;
                console.log(`Start stats & logs for: ${$scope.containerId}`);
                if (!$rootScope.socket.reconnection)
                    $rootScope.socket.emit('containerStats', {
                        containerId: $scope.containerId,
                        status: 'start'
                    });
                $rootScope.socket.on('containerStats', (data) => {
                    Object.assign({}, $scope.appData.stats, data);
                });
                if (!$rootScope.socket.reconnection)
                    $rootScope.socket.emit('containerLogs', {
                        containerId: $scope.containerId,
                        status: 'start'
                    });
                let i = 0;
                $rootScope.socket.on('containerLogs', (data) => {
                    $scope.appData.logs.push({
                        id: i,
                        log: $sce.trustAsHtml($scope.ansi_up.ansi_to_html(data)),
                    });
                    $scope.box = document.getElementById('terminal');
                    $scope.box.scrollTop = $scope.box.scrollHeight + 100;
                    $scope.$apply();
                    i += 1;
                });
            }
        });
        $scope.$on('$destroy', () => {
            delete $scope.appData;
            if ($rootScope.socket.connected) {
                console.log(`Stop stats & logs for: ${$scope.containerId}`);
                $rootScope.socket.emit('containerStats', {
                    containerId: $scope.containerId,
                    status: 'stop'
                });
                $rootScope.socket.emit('containerLogs', {
                    containerId: $scope.containerId,
                    status: 'stop'
                });
            }
        });
    });