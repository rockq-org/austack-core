(function () {
  // maybe make this to be a bower package later on
  angular.module('austack', ['austack.service'])
    .run(function (austack) {
      austack.hookEvents();
    });

  angular.module('austack.service', [])
    .provider('austack', function () {
      var self = this;
      this.init = function (options) {
        if (!options) {
          throw new Error('You must set options when calling init');
        }
        this.domain = options.domain;
        this.clientId = options.clientId;
        this.loginState = options.loginState;
      };

      this.$get = function ($rootScope, $q, $injector, $window, $location, $ionicPlatform, $http) {
        var auth = {
          isAuthenticated: false,
          gettingUserInfo: false,
          userInfoUrl: 'http://localhost:3000/me'
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
                self.isAuthenticated = true;
                successCallback(result);
                ref.close();
              } else {
                errorCallback('do not get idToken');
              }
            });
            //TODO: maybe do some clearup job such as removeEventListener if we get memorry leak
          });
        };

        auth.getUserInfo = function (token) {
          if (auth.gettingUserInfo) {
            return;
          }
          console.log('gettingUserInfo', token);
          var req = {
            method: 'GET',
            url: auth.userInfoUrl,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          };

          auth.gettingUserInfo = true;
          $http(req)
            .success(function (data, status) {
              console.log('success get userInfo', data, status);
              auth.gettingUserInfo = false;
            })
            .error(function (data, status) {
              console.log('error get userInfo', data, status);
              console.dir(arguments);
              auth.gettingUserInfo = false;
            });
        };

        auth.signout = function () {
          auth.isAuthenticated = false;
          auth.profile = null;
          auth.idToken = null;
          auth.state = null;
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