 (function() {
     // austack run
     angular.module('austack')
         .run(function austackRun($rootScope, austack, $window, $location, jwtHelper) {
             $rootScope.$on('$locationChangeStart', function() {
                 console.log(austack.get('isAuthenticated'));
                 if (austack.get('isAuthenticated') === true) {
                     return;
                 }

                 var token = $window.localStorage.getItem(AUSTACK.tokenKey);
                 if (!token || jwtHelper.isTokenExpired(token)) {
                     $location.path(AUSTACK.loginStateConfig.url);
                 } else {
                     // post to dave's backend to get userInfo
                     austack.getUserInfo(token);
                 }
             });
         });
 }());