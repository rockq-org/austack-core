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
        auth.refreshIdToken = function (refreshToken) {
          // return promise;
        };

        return auth;
      };

    });

}());