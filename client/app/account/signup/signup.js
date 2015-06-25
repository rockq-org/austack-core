(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.account.signup', [])
    .config(configSignupRoute);

  // inject configSignupRoute dependencies
  configSignupRoute.$inject = ['$stateProvider'];

  // route config function configuring the passed $stateProvider
  function configSignupRoute($stateProvider) {
    $stateProvider
      .state('account.signup', {
        url: '^/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'signup'
      });
  }

})();
