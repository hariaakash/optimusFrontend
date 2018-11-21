angular.module('optimusApp')
    .controller('homeCtrl', function ($rootScope, $scope, $http, $state, $location, $interval) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.deployApp = () => {
            $scope.data = {
                authKey: $rootScope.authKey,
                name: $scope.deployAppForm.name,
                stack: $scope.deployAppForm.stack,
            };
            if ($scope.data.name.length >= 6) {
                if (/^[a-z-]+$/.test($scope.data.name)) {
                    $scope.sendRequest();
                } else {
                    $rootScope.toast('Failed', 'Domain should be lowercase and alphabetic.', 'error');
                }
            } else {
                $rootScope.toast('Failed', 'Domain name should atleast be of 6 characters.', 'error');
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
        $scope.openDeployAppModal = () => {
            if ($rootScope.homeData.containers.length < $rootScope.homeData.conf.limit.containers) {
                $rootScope.openModal('deployApp');
            } else {
                $rootScope.toast('Failed', 'Limit reached, contact support for increase.', 'error');
            }
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
                        $scope.getContainerStats();
                    } else {
                        $rootScope.homeData.containers = [];
                        $rootScope.toast('Error', res.data.msg, 'error');
                    }
                }, () => {
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $scope.getContainerStats = () => {
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
                        else delete container.stats;
                    }, () => {
                        delete container.stats;
                        $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                    });
            });
        };
        $interval(() => {
            if ($location.path().includes('/home'))
                $scope.getContainerStats();
        }, 60000);
        $scope.getContainers();
    });