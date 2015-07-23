(function () {
  // maybe make this to be a bower package later on
  angular.module('austack', ['austack.service'])
    .run(function (austack) {
      austack.hookEvents();
    });

  angular.module('austack.service', [])
    .provider('austack', function () {
      this.init = function (options) {
        if (!options) {
          throw new Error('You must set options when calling init');
        }
        this.domain = options.domain;
        this.clientId = options.clientId;
        this.loginState = options.loginState;
      };

      this.$get = function ($rootScope, $q, $injector, $window, $location, $ionicPlatform) {
        var auth = {
          isAuthenticated: false
        };

        auth.hookEvents = function (argument) {
          // hookEvents function that maybe do some hooked event job later
        };

        auth.signin = function (options, successCallback, errorCallback) {
          $ionicPlatform.ready(function () {
            options = options || {}; //placeHolder, do not use it yet

            var url = AUSTACK_DOMAIN;
            var target = '_blank';
            var options = 'location=yes';
            // maybe do not use the $window variable? that maybe not the inAppBrower
            var ref = window.open(url, target, options);

            ref.addEventListener('loadstart', function (event) {
              if (event.url == url) {
                return;
              }
              var urlWithPostFix = url + '#id_token=';
              var idToken = event.url.replace(urlWithPostFix, '');
              if (idToken) {
                console.log('get idToken', idToken);
                var result = {
                  idToken: idToken
                };
                successCallback(result);
                ref.close();
              } else {
                errorCallback('do not get idToken');
              }
            });
            //TODO: maybe do some clearup job such as removeEventListener if we get memorry leak
          });
        };

        auth.authenticate = function (profile, token) {

        };

        auth.refreshIdToken = function (refreshToken, callback) {
          var idToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA0NzE1MzA4ODIwMTQzMzMyMDE1IiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MzY1ODY1MTYsImlhdCI6MTQzNjU1MDUxNn0.GQUI29qgwP7pKAxI-YF6r-h4Kjnkn-1hPAbsI6wXpFY';
          // maybe do some http request?
          callback(idToken);
        };

        return auth;
      };

    });

}());