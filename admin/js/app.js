angular.module("optimusApp", ['angular-loading-bar', 'ui.router', 'oc.lazyLoad'])
    .config(['cfpLoadingBarProvider', (cfpLoadingBarProvider) => {
        cfpLoadingBarProvider.spinnerTemplate = '<div class="preloader"><img class="icon" src="../img/logo.png" style="width: 64px; height: 64px;"></div>';
    }])
    .filter('range', () => {
        return (input, total) => {
            total = parseInt(total);
            for (var i = 0; i < total; i++)
                input.push(i);
            return input;
        };
    })
    .config(($stateProvider, $urlRouterProvider) => {
        $urlRouterProvider.otherwise('/login');
        $stateProvider
            .state("dashboard", {
                url: "",
                templateUrl: "pages/dashboard.html",
                abstract: true
            })
            .state("dashboard.home", {
                url: "/home",
                templateUrl: "pages/home.html",
                controller: "homeCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Home',
                            files: ['./ctrls/home.js', './plugins/pagination/dirPagination.js']
                        })
                    }]
                }
            })
            .state("dashboard.user", {
                url: "/user/:userId",
                templateUrl: "pages/user.html",
                controller: "userCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'User',
                            files: ['./ctrls/user.js']
                        })
                    }]
                }
            })
            .state("dashboard.userActivity", {
                url: "/userActivity/:userId",
                templateUrl: "pages/userActivity.html",
                controller: "userActivityCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'User Activity',
                            files: ['./ctrls/userActivity.js', './plugins/pagination/dirPagination.js']
                        })
                    }]
                }
            })
            .state("dashboard.account", {
                url: "/account",
                templateUrl: "pages/account.html",
                abstract: true
            })
            .state("dashboard.account.changePasswordAccount", {
                url: "/changePasswordAccount",
                templateUrl: "pages/changePasswordAccount.html",
                controller: "changePasswordAccountCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'changePasswordAccount',
                            files: ['./ctrls/changePasswordAccount.js']
                        })
                    }]
                }
            })
            .state("dashboard.account.activity", {
                url: "/activity",
                templateUrl: "pages/activity.html",
                controller: "activityCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Activity',
                            files: ['./ctrls/activity.js', './plugins/pagination/dirPagination.js']
                        })
                    }]
                }
            })
            .state("dashboard.staff", {
                url: "/staff",
                templateUrl: "pages/staff.html",
                controller: "staffCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Staff',
                            files: ['./ctrls/staff.js', './plugins/pagination/dirPagination.js']
                        })
                    }]
                }
            })
            .state("login", {
                url: "/login",
                templateUrl: "pages/login.html",
                controller: "loginCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Login',
                            files: ['./ctrls/login.js', './css/login-register.css']
                        })
                    }]
                }
            })
            .state("setPassword", {
                url: "/setPassword?email&key",
                templateUrl: "pages/setPassword.html",
                controller: "setPasswordCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load('./ctrls/setPassword.js');
                    }]
                }
            });
    });


// Global Controller
angular.module('optimusApp')
    .controller('globalCtrl', ($rootScope, $location, $http, $state, $ocLazyLoad) => {
        // $rootScope.apiUrl = 'http://localhost:8080/';
        $rootScope.apiUrl = 'https://webapi.optimuscp.io/';
        $ocLazyLoad.load(['./plugins/toast/toast.min.js', './plugins/toast/toast.min.css']);
        $rootScope.copyrightYear = new Date().getFullYear();
        $rootScope.subDomain = '.gameservers.ooo';
        $rootScope.checkAuth = (force) => {
            if (Cookies.get('adminKey')) {
                $rootScope.adminKey = Cookies.get('adminKey');
                if (!$rootScope.signStatus || force) {
                    $http({
                            method: 'GET',
                            url: $rootScope.apiUrl + 'admins',
                            params: {
                                adminKey: $rootScope.adminKey
                            }
                        })
                        .then((res) => {
                            if (res.data.status == true) {
                                $rootScope.homeData = res.data.data;
                            } else {
                                $rootScope.logout();
                                $rootScope.toast('Error', res.data.msg, 'error');
                            }
                        }, () => {
                            $('#btnLoad').button('reset');
                            $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                        });
                }
                var path = $location.path();
                if (path == '/login')
                    $state.go('dashboard.home');
                $rootScope.signStatus = true;
            } else {
                $rootScope.authKey = '';
                $rootScope.signStatus = false;
                var path = $location.path();
                if (path == '/home' || path == '')
                    $state.go('login');
            }
        };
        $rootScope.logout = () => {
            Cookies.remove('adminKey');
            $http({
                    method: 'GET',
                    url: $rootScope.apiUrl + 'admins/logout',
                    params: {
                        adminKey: $rootScope.adminKey
                    }
                })
                .then((res) => {
                    delete $rootScope.adminKey;
                    delete $rootScope.homeData;
                    $rootScope.signStatus = false;
                    $rootScope.toast('Success', 'Logged out !!', 'info');
                    $state.go('login');
                }, () => {
                    $state.go('login');
                    $rootScope.toast('Failed', 'Unable to establish network connection.', 'error');
                });
        };
        $rootScope.openModal = (x) => {
            if ($rootScope.homeData.conf.block)
                $rootScope.toast('Failed', 'Your account is blocked, contact support.', 'error');
            else
                $('#' + x).modal('show');
        };
        $rootScope.closeModal = (x) => {
            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
        };
        $rootScope.toast = (heading, text, status, hideAfter = 10000) => {
            // info, warning, error, success
            if (hideAfter == 0) hideAfter = false;
            if (text == 'Account not found !!') {
                text = 'Session ended!!';
                $rootScope.logout();
            }
            $.toast({
                heading: heading,
                text: text,
                position: 'bottom-right',
                loaderBg: '#ff6849',
                icon: status,
                hideAfter: hideAfter,
                stack: 1
            });
        };
    });
