(function () {
  angular.module('austack.service', [])
    .provider('austack', function () {
      this.$get = AustackService;

      AustackService.$inject = ['$rootScope', '$q', '$injector', '$window', '$location', '$ionicPlatform', '$http'];

      function AustackService($rootScope, $q, $injector, $window, $location, $ionicPlatform, $http) {
        var initData = {
          isAuthenticated: false,
          gettingUserInfo: false,
          userInfoUrl: AUSTACK.userInfoUrl,
          profile: null,
          idToken: null
        };

        var auth = {
          data: initData
        };

        auth.get = get;
        auth.set = set;
        auth.signin = signin;
        auth.signout = signout;
        auth.refreshJwt = refreshJwt;
        auth.getUserInfo = getUserInfo;

        return auth;

        function get(key) {
          console.log('get', key, auth.data[key]);
          if (auth.data[key]) {
            return auth.data[key];
          }

          return null;
        }

        function set(key, value) {
          auth.data[key] = value;

          return auth.data[key];
        }

        function signin(options, successCallback, errorCallback) {
          $ionicPlatform.ready(function () {
            options = options || {}; //placeHolder, do not use it yet

            var url = AUSTACK.loginUrl;
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
          });
        }

        function signout() {
          auth.data = initData;
        }

        function refreshJwt(refreshToken, callback) {
          var jwt = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3NhbXBsZXMuYXV0aDAuY29tLyIsInN1YiI6Imdvb2dsZS1vYXV0aDJ8MTA0NzE1MzA4ODIwMTQzMzMyMDE1IiwiYXVkIjoiQlVJSlNXOXg2MHNJSEJ3OEtkOUVtQ2JqOGVESUZ4REMiLCJleHAiOjE0MzY1ODY1MTYsImlhdCI6MTQzNjU1MDUxNn0.GQUI29qgwP7pKAxI-YF6r-h4Kjnkn-1hPAbsI6wXpFY';
          // maybe do some http request?
          callback(jwt);
        }

        function getUserInfo(token) {
          if (auth.get('gettingUserInfo')) {
            return;
          }
          console.log('gettingUserInfo', token);
          var req = {
            method: 'GET',
            url: auth.get('userInfoUrl'),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          };

          auth.set('gettingUserInfo', true);
          $http(req)
            .success(function (data, status) {
              console.log('success get userInfo', status);
              console.dir(data);
              auth.set('gettingUserInfo', false);
            })
            .error(function (data, status) {
              console.log('error get userInfo', data, status);
              console.dir(arguments);
              auth.set('gettingUserInfo', false);
            });
        }

      };
    });

}());