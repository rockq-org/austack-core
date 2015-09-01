(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.account')
    .config(configSignupRoute);

  // inject configSignupRoute dependencies
  configSignupRoute.$inject = ['$stateProvider'];

  // route config function configuring the passed $stateProvider
  function configSignupRoute($stateProvider) {
    var signupState = {
      name: 'account.signup',
      url: '/signup',
      authenticate: false,
      // role: 'anonymous',
      templateUrl: 'app/account/signup/signup.html',
      controller: 'SignupController',
      controllerAs: 'signup',
      ncyBreadcrumb: {
        skip: true
      }
    };

    $stateProvider.state(signupState);
  }

})();
