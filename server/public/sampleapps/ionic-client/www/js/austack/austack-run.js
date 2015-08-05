 // austack run
 angular.module('austack')
     .run(function austackRun($rootScope, austack, $window, $location, jwtHelper) {
         $rootScope.$on('$locationChangeStart', function() {
             if (austack.isAuthenticated) {
                 return;
             }
             var token = $window.localStorage.getItem('token');
             if (!token || jwtHelper.isTokenExpired(token)) {
                 $location.path('/login');
             } else {
                 // post to dave's backend to get userInfo
                 austack.getUserInfo(token);
             }
         });
         austack.hookEvents();
     });