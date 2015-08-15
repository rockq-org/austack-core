(function () {
  'use strict';

  // register the route config on the application
  angular
    .module('austackApp.account')
    .config(configResetRoute);

  // inject configResetRoute dependencies
  configResetRoute.$inject = ['$stateProvider'];

  // route config function configuring the passed $stateProvider
  function configResetRoute($stateProvider) {
    $stateProvider
      .state('account.reset', {
        url: '/reset',
        templateUrl: 'app/account/reset/reset.html',
        controller: 'ResetController',
        controllerAs: 'reset'
      });
  }

})();
