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
                            name: 'HomePage',
                            files: ['./ctrls/home.js']
                        })
                    }]
                }
            })
            .state("dashboard.manage", {
                url: "/manage/:containerId",
                templateUrl: "pages/manage.html",
                controller: "manageCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Server Manage',
                            files: ['./ctrls/manage.js', './css/terminal.css', './plugins/ansi_up/ansi_up.js']
                        })
                    }]
                }
            })
            .state("dashboard.fileManager", {
                url: "/fileManager/:containerId/",
                templateUrl: "pages/fileManager.html",
                controller: "fileManagerCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'File Manager',
                            files: ['./ctrls/fileManager.js']
                        })
                    }]
                }
            })
            .state("dashboard.databases", {
                url: "/databases",
                templateUrl: "pages/databases.html",
                controller: "databasesCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Databases',
                            files: ['./ctrls/databases.js', './plugins/angular-clipboard/angular-clipboard.min.js']
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
            .state("dashboard.api", {
                url: "/api",
                templateUrl: "pages/api.html",
                controller: "apiCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Api',
                            files: ['./ctrls/api.js', './plugins/angular-clipboard/angular-clipboard.min.js']
                        })
                    }]
                }
            })
            .state("register", {
                url: "/register",
                templateUrl: "pages/register.html",
                controller: "registerCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load({
                            name: 'Register',
                            files: ['./ctrls/register.js', './css/login-register.css']
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
            .state("verifyEmail", {
                url: "/verifyEmail?email&key",
                templateUrl: "pages/verifyEmail.html",
                controller: "verifyEmailCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load('./ctrls/verifyEmail.js');
                    }]
                }
            })
            .state("sendEmailVerification", {
                url: "/sendEmailVerification",
                templateUrl: "pages/sendEmailVerification.html",
                controller: "sendEmailVerificationCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load('./ctrls/sendEmailVerification.js');
                    }]
                }
            })
            .state("forgotPassword", {
                url: "/forgotPassword",
                templateUrl: "pages/forgotPassword.html",
                controller: "forgotPasswordCtrl",
                resolve: {
                    loadMyCtrl: ['$ocLazyLoad', ($ocLazyLoad) => {
                        return $ocLazyLoad.load('./ctrls/forgotPassword.js');
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
        $rootScope.discordUrl = 'https://discord.gg/c7EptFq';
        $rootScope.sftpUrl = 'sftp.optimuscp.io';
        $ocLazyLoad.load(['./plugins/toast/toast.min.js', './plugins/toast/toast.min.css']);
        $rootScope.copyrightYear = new Date().getFullYear();
        $rootScope.subDomain = '.gameservers.ooo';
        $rootScope.hostIp = '78.46.21.224';
        $rootScope.cloudflareDns1 = '.cdn.cloudflare.net';
        $rootScope.cloudflareDns2 = 'cloudflare-resolve-to.';
        $rootScope.checkAuth = (force) => {
            if (Cookies.get('authKey')) {
                $rootScope.authKey = Cookies.get('authKey');
                if (!$rootScope.signStatus || force) {
                    $http({
                            method: 'GET',
                            url: $rootScope.apiUrl + 'users',
                            params: {
                                authKey: $rootScope.authKey
                            }
                        })
                        .then((res) => {
                            if (res.data.status == true) {
                                $rootScope.homeData = res.data.data;
                                $rootScope.signStatus = true;
                                $rootScope.socket = io.connect($rootScope.apiUrl, {
                                    query: `authKey=${$rootScope.authKey}`,
                                    reconnection: true,
                                    reconnectionDelay: 1000,
                                    reconnectionDelayMax: 5000,
                                });
                                $rootScope.socketData = {
                                    containers: [],
                                    logout: false,
                                };
                                $rootScope.socket.on('connect', () => {
                                    if ($rootScope.socketData.logout) $rootScope.socketData.logout = false;
                                    console.log('Socket connection established');
                                    $rootScope.$apply();
                                });
                                $rootScope.socket.on('disconnect', () => {
                                    if (!$rootScope.socketData.logout) {
                                        $rootScope.toast('Error', 'Socket disconnected', 'error', 2000);
                                        $rootScope.$apply();
                                    }
                                    console.log('Socket disconnected');
                                });
                                if ($rootScope.homeData.conf.block) $state.go('dashboard.home');
                            } else {
                                $rootScope.logout();
                                $rootScope.toast('Error', res.data.msg, 'error');
                            }
                        }, () => {
                            $('#btnLoad').button('reset');
                            $rootScope.toast('Failed', "Some error occurred, try again.", "error");
                        });
                }
                var path = $location.path();
                if (path == '/login' || path == '/register' || path == '/verifyEmail')
                    $state.go('dashboard.home');
            } else {
                $rootScope.authKey = '';
                $rootScope.signStatus = false;
                var path = $location.path();
                if (path == '/home' || path == '')
                    $state.go('login');
            }
        };
        $rootScope.logout = (x) => {
            Cookies.remove('authKey');
            delete $rootScope.authKey;
            $rootScope.signStatus = false;
            if (x) $rootScope.toast('Success', 'Logged out.', "info");
            if ($rootScope.socket.connected) {
                $rootScope.socketData.logout = true;
                $rootScope.socket.disconnect();
            }
            $state.go('login');
        };
        $rootScope.openModal = (x) => {
            if ($rootScope.homeData.conf.block)
                $rootScope.toast('Failed', 'Your account is blocked, contact support.', 'error');
            else
                $('#' + x).modal('show');
        };
        $rootScope.closeModal = () => {
            $('div.modal-backdrop').remove();
        };
        $rootScope.toast = (heading, text, status, hideAfter = 10000) => {
            // info, warning, error, success
            if (hideAfter == 0) hideAfter = false;
            if (text == 'Session expired, login to continue.') {
                text = 'Session ended!!';
                $rootScope.logout(false);
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
        $rootScope.comingSoon = () => {
            $rootScope.toast('Alert', "This feature will be available soon.", "success");
        };
    });