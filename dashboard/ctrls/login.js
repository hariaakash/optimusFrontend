angular.module('optimusApp')
    .controller('loginCtrl', function ($scope, $rootScope, $http, $state) {
        $rootScope.checkAuth();
        $scope.social = {
            google: {
                url: 'https://accounts.google.com/o/oauth2/v2/auth',
                client_id: '666163516742-b89cg46pnk6o8p75b9btgp7o03gvv081.apps.googleusercontent.com',
                response_type: 'code',
                scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
                redirect_uri: 'https://optimuscp.io/oauth.html',
                access_type: 'offline',
                state: 'google',
                params: () => {
                    let params = [];
                    params.push(`client_id=${$scope.social.google.client_id}`);
                    params.push(`response_type=${$scope.social.google.response_type}`);
                    params.push(`scope=${$scope.social.google.scope}`);
                    params.push(`redirect_uri=${$scope.social.google.redirect_uri}`);
                    params.push(`access_type=${$scope.social.google.access_type}`);
                    params.push(`state=${$scope.social.google.state}`);
                    return params.join('&');
                },
                link: () => {
                    return `${$scope.social.google.url}?${$scope.social.google.params()}`;
                },
            },
            github: {
                url: 'https://github.com/login/oauth/authorize',
                client_id: '129800c9747092aabe46',
                scope: 'user:email,repo,write:repo_hook',
                redirect_uri: 'https://optimuscp.io/oauth.html?state=github',
                params: () => {
                    let params = [];
                    params.push(`client_id=${$scope.social.github.client_id}`);
                    params.push(`scope=${$scope.social.github.scope}`);
                    params.push(`redirect_uri=${$scope.social.github.redirect_uri}`);
                    return params.join('&');
                },
                link: () => {
                    return `${$scope.social.github.url}?${$scope.social.github.params()}`;
                },
            },
        };
        $scope.loginUser = () => {
            $('#btnLoad').button('loading');
            $http({
                method: 'POST',
                url: $rootScope.apiUrl + 'users/login',
                data: $scope.user
            }).then((res) => {
                if (res.data.status == true) {
                    Cookies.set('authKey', res.data.authKey);
                    $rootScope.checkAuth(true);
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
    });