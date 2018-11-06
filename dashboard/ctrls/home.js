angular.module('optimusApp')
    .controller('homeCtrl', function ($rootScope, $scope, $http, $state, $interval) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.deployApp = () => {
            $scope.data = {
                authKey: $rootScope.authKey,
                nameCustom: $scope.deployAppForm.nameCustom,
                name: $scope.deployAppForm.name,
                stack: $scope.deployAppForm.stack,
                git: $scope.deployAppForm.git,
                deployKeys: $scope.deployAppForm.deployKeys,
            };
            if ($scope.data.git.indexOf('git@') !== -1) {
                if ($scope.data.nameCustom) {
                    if (/[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/.test($scope.data.name)) {
                        $scope.sendRequest();
                    } else {
                        $rootScope.toast('Failed', 'Domain not valid', 'error');
                    }
                } else {
                    if ($scope.data.name.length >= 6) {
                        if (/^[a-z-]+$/.test($scope.data.name)) {
                            $scope.sendRequest();
                        } else {
                            $rootScope.toast('Failed', 'Domain should be lowercase and alphabetic.', 'error');
                        }
                    } else {
                        $rootScope.toast('Failed', 'Custom domain should atleast be of 6 characters.', 'error');
                    }
                }
            } else {
                $rootScope.toast('Failed', 'Invalid git url.', 'error');
            }
        };
        $scope.sendRequest = () => {
            $('#btnLoad').button('loading');
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'containers/create',
                    data: $scope.data
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $rootScope.closeModal();
                        $state.reload();
                        $rootScope.checkAuth(true);
                        $rootScope.toast('Success', res.data.msg, "success");
                    } else {
                        $('#btnLoad').button('reset');
                        $rootScope.toast('Failed', res.data.msg, "error");
                    }
                }, (res) => {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $scope.getContainers = () => {
            $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + 'users/containers',
                    params: {
                        authKey: $rootScope.authKey
                    }
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $rootScope.homeData.containers = res.data.data;
                    } else {
                        $rootScope.homeData.containers = [];
                        $rootScope.toast('Error', res.data.msg, 'error');
                    }
                }, () => {
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $interval(() => {
            $rootScope.homeData.containers.forEach((container) => {
                $http({
                        method: 'GET',
                        url: $rootScope.apiUrl + 'containers/stats',
                        params: {
                            authKey: $rootScope.authKey,
                            containerId: container._id,
                        }
                    })
                    .then((res) => {
                        if (res.data.status == true) container.stats = res.data.data.stats;
                    }, () => {
                        $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                    });
            });
        }, 30000);
        $scope.getContainers();
    });