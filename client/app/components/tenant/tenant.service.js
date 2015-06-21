(function () {
  'use strict';

  angular
    .module('austackApp.tenant', [
      'ngResource',
      'ngCookies',
      'austackApp.auth.interceptor',
      'austackApp.auth.user'
    ])
    .service('Tenant', Tenant);

  /* @ngInject */
  function Tenant($http, $cookieStore, $cookies, $location, $q, $templateCache, _, User, userRoles) {
    this.func = func;

    ////////////////

    function func() {}
  }
})();