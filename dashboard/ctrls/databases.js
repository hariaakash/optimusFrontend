angular.module('optimusApp')
    .controller('databasesCtrl', function ($rootScope, $scope, $http, $state) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.deployDB = () => {
            $scope.data = {
                authKey: $rootScope.authKey,
                name: $scope.deployDBForm.name,
                dbType: $scope.deployDBForm.dbType,
            };
            if ($scope.data.name.length >= 4 && $scope.data.name.length <= 20) {
                if (/^[\w\-\s]+$/.test($scope.data.name)) {
                    $scope.sendRequest('create', $scope.data);
                } else {
                    $rootScope.toast('Failed', 'Name can be alphanumeric and can contain hyphen, underscore and spaces.', 'error');
                }
            } else {
                $rootScope.toast('Failed', 'Length of name should be between 4 and 20.', 'error');
            }
        };
        $scope.sendRequest = (uri, data) => {
            $('#btnLoad').button('loading');
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'databases/' + uri,
                    data: data
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $rootScope.closeModal();
                        $state.reload();
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
        $scope.openDeployDBModal = () => {
            if ($rootScope.homeData.databases.length < $rootScope.homeData.conf.limit.databases) {
                $rootScope.openModal('deployDB');
            } else {
                $rootScope.toast('Failed', 'Limit reached, contact support for increase.', 'error');
            }
        };
        $scope.openDeleteDBModal = (x) => {
            $scope.delDB = x;
            $rootScope.openModal('delDB');
        };
        $scope.delDBAct = () => {
            $scope.data = {
                authKey: $rootScope.authKey,
                databaseId: $scope.delDB._id,
            };
            $scope.sendRequest('delete', $scope.data);
        };
        $scope.resetPassword = (x) => {
            $scope.data = {
                authKey: $rootScope.authKey,
                databaseId: x,
            };
            $scope.sendRequest('reset', $scope.data);
        };
        $scope.copySuccess = () => {
            $rootScope.toast('Success', 'DB password copied to clipboard.', 'info');
        };
        $scope.getDatabases = () => {
            $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + 'users/databases',
                    params: {
                        authKey: $rootScope.authKey
                    }
                })
                .then((res) => {
                    if (res.data.status == true) {
                        $rootScope.homeData.databases = res.data.data;
                    } else {
                        $rootScope.homeData.databases = [];
                        $rootScope.toast('Error', res.data.msg, 'error');
                    }
                }, () => {
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $scope.$watch('signStatus', (data) => {
            if (data) {
                $scope.getDatabases();
            }
        });
    });