(function () {

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

      this.$get = function ($rootScope, $q, $injector, $window, $location, authUtils) {
        var auth = {
          isAuthenticated: false
        };

        auth.signin = function (options, successCallback, errorCallback) {
          options = options || {};

          var signinMethod = getInnerLibraryMethod('signin', libName);
          var successFn = !successCallback ? null : function (profile, idToken, accessToken, state, refreshToken) {
            onSigninOk(idToken, accessToken, state, refreshToken, profile).then(function (profile) {
              if (successCallback) {
                successCallback(profile, idToken, accessToken, state, refreshToken);
              }
            });
          };

          var errorFn = !errorCallback ? null : function (err) {
            callHandler('loginFailure', {
              error: err
            });
            if (errorCallback) {
              errorCallback(err);
            }
          };

          var signinCall = authUtils.callbackify(signinMethod, successFn, errorFn, innerAuth0libraryConfiguration[libName || config.lib].library());

          signinCall(options);
        };
        return auth;
      };

    });

}());