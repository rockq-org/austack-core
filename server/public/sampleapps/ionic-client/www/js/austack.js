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
        this.loginUrl = options.loginUrl;
        this.loginState = options.loginState;
        this.clientId = options.clientId;
        this.domain = options.domain;
      };

      this.$get = function ($rootScope, $q, $injector, $window, $location) {
        var auth = {
          isAuthenticated: false
        };

        auth.hookEvents = function (argument) {
          // hookEvents function that maybe do some hooked event job later
        };

        auth.signin = function (options, successCallback, errorCallback) {
          options = options || {};

          //1. do the login job
          //2. detect result
          //3.1 success: call successCallback
          //3.2 error: call errorCallback
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