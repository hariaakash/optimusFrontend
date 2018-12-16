angular.module('optimusApp')
    .controller('manageCtrl', function ($rootScope, $scope, $http, $stateParams, $state, $sce, $timeout) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.containerId = $stateParams.containerId;
        $scope.appData = {
            logs: [],
            stats: [],
        };
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
                            Object.assign($scope.appData, res.data.data);
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
                    if (res.data.status == true) {
                        $scope.appData.stats[0] = res.data.data.stats;
                        $scope.appData.stats[0].rom += 'B';
                    }
                }, () => {
                    delete $scope.appData.stats;
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $scope.exec = (process, data) => {
            $('#btnLoad').button('loading');
            data = Object.assign({}, data, {
                authKey: $rootScope.authKey,
                containerId: $scope.containerId,
            });
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'containers/' + process,
                    data,
                })
                .then((res) => {
                    if (res.data.status == true) {
                        if (process == 'delete') {
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
                        $rootScope.toast('Failed', res.data.msg, 'error');
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
                $scope.exec('setDns', {
                    domain,
                });
            }
        };
        $scope.setGit = (repo, key) => {
            if (repo.indexOf('git@') !== -1) {
                $scope.exec('setGit', {
                    repo,
                    key,
                });
            } else {
                $rootScope.toast('Failed', 'Invalid git url.', 'error');
            }
        };
        $scope.getAppInfo();
        $scope.listener = $rootScope.$watch('socket.connected', (data) => {
            if (data) {
                if (!$rootScope.socketData.containers.includes($scope.containerId)) {
                    console.log(`Start stats & logs for: ${$scope.containerId}`);
                    $rootScope.socketData.containers.push($scope.containerId);
                    $scope.ansi_up = new AnsiUp;
                    $rootScope.socket.emit('containerStats', {
                        containerId: $scope.containerId,
                        status: 'start'
                    });
                    $rootScope.socket.on('containerStats', (data) => {
                        $scope.appData.stats.push(data);
                    });
                    $rootScope.socket.emit('containerLogs', {
                        containerId: $scope.containerId,
                        status: 'start'
                    });
                    $rootScope.socket.on('containerLogs', (data) => {
                        $scope.appData.logs.push($sce.trustAsHtml($scope.ansi_up.ansi_to_html(data)));
                        $scope.box = document.getElementById('terminal');
                        $scope.box.scrollTop = $scope.box.scrollHeight;
                        $scope.$apply();
                    });
                } else {
                    $rootScope.closeModal();
                    $state.reload();
                }
            }
        });
        $scope.$on('$destroy', () => {
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
            $scope.listener();
            $rootScope.socketData.containers = $rootScope.socketData.containers.filter(x => {
                return x != $scope.containerId;
            });
        });
    });