// austack config
angular.module('austack')
    .config(function austackConfig($stateProvider, austackProvider, jwtInterceptorProvider, $httpProvider) {
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'LoginCtrl'
            });
        // Configure Austack
        austackProvider.init({
            domain: AUSTACK_DOMAIN,
            clientId: AUSTACK_CLIENT_ID,
            loginState: 'login'
        });
        jwtInterceptorProvider.tokenGetter = function($window, jwtHelper, austack) {
            var idToken = $window.localStorage.getItem('token');
            var refreshToken = $window.localStorage.getItem('refreshToken');
            if (!idToken || !refreshToken) {
                return null;
            }
            if (jwtHelper.isTokenExpired(idToken)) {
                return austack.refreshIdToken(refreshToken, function(idToken) {
                    $window.localStorage.setItem('token', idToken);
                    return idToken;
                });
            } else {
                return idToken;
            }
        }

        $httpProvider.interceptors.push('jwtInterceptor');
    });