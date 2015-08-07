(function () {
  // austack config
  angular.module('austack')
    .config(function austackConfig($stateProvider, austackProvider, jwtInterceptorProvider, $httpProvider) {
      $stateProvider
        .state(AUSTACK.loginStateName, AUSTACK.loginStateConfig);

      jwtInterceptorProvider.tokenGetter = function ($window, jwtHelper, austack) {
        var jwt = $window.localStorage.getItem(AUSTACK.tokenKey);
        var refreshToken = $window.localStorage.getItem(AUSTACK.refreshTokenKey);
        if (!jwt || !refreshToken) {
          return null;
        }
        if (jwtHelper.isTokenExpired(jwt)) {
          return austack.refreshjwt(refreshToken, function (jwt) {
            $window.localStorage.setItem('token', jwt);
            return jwt;
          });
        } else {
          return jwt;
        }
      }

      $httpProvider.interceptors.push('jwtInterceptor');
    });
}());