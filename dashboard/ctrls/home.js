angular.module('optimusApp')
    .controller('homeCtrl', function ($rootScope, $scope, $http, $state) {
        $rootScope.checkAuth();
        $rootScope.profile = true;
        $scope.deployApp = function () {
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
        $scope.sendRequest = function () {
            $('#btnLoad').button('loading');
            $http({
                    method: 'POST',
                    url: $rootScope.apiUrl + 'containers/create',
                    data: $scope.data
                })
                .then(function (res) {
                    if (res.data.status == true) {
                        $rootScope.closeModal();
                        $state.reload();
                        $rootScope.checkAuth(true);
                        $rootScope.toast('Success', res.data.msg, "success");
                    } else {
                        $('#btnLoad').button('reset');
                        $rootScope.toast('Failed', res.data.msg, "error");
                    }
                }, function (res) {
                    $('#btnLoad').button('reset');
                    $rootScope.toast('Failed', "Some error occurred, try again.", "error");
                });
        };
    });